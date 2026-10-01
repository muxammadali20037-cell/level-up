-- LEVEL schema 1100: notifications, organizations/teams, audit log, rate limiting, AI usage/cache, app settings.

create table public.notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users (id) on delete cascade,
  channel       text not null check (channel in ('telegram', 'web_push', 'email')),
  type          text not null check (type ~ '^[a-z][a-z0-9_]{1,63}$'),
  payload       jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  status        text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'cancelled')),
  attempts      integer not null default 0 check (attempts >= 0),
  scheduled_for timestamptz not null default now(),
  sent_at       timestamptz,
  error         text check (length(error) <= 2000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.notifications is 'Outbound notification queue (Telegram / web push / email) with delivery status.';
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_due_idx on public.notifications (scheduled_for) where status = 'queued';
create trigger set_updated_at before update on public.notifications
  for each row execute function public.set_updated_at();

-- Organizations / teams ----------------------------------------------------------------------------------------------
create table public.organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (length(name) between 1 and 200),
  slug          text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
  type          text not null check (type in ('company', 'university', 'team', 'community')),
  owner_user_id uuid not null references public.users (id) on delete restrict,
  settings      jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.organizations is 'B2B organizations (companies, universities, teams, communities) running team assessments.';
create index organizations_owner_user_id_idx on public.organizations (owner_user_id);
create trigger set_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();

create table public.organization_members (
  organization_id       uuid not null references public.organizations (id) on delete cascade,
  user_id               uuid not null references public.users (id) on delete cascade,
  role                  text not null default 'member' check (role in ('owner', 'admin', 'member')),
  consent_share_results boolean not null default false,
  consent_at            timestamptz,
  joined_at             timestamptz not null default now(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  primary key (organization_id, user_id),
  constraint organization_members_consent_at check (not consent_share_results or consent_at is not null)
);
comment on table public.organization_members is 'Organization membership with role and explicit consent to share results with the org.';
create index organization_members_user_id_idx on public.organization_members (user_id);
create trigger set_updated_at before update on public.organization_members
  for each row execute function public.set_updated_at();

create table public.team_assessments (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references public.organizations (id) on delete cascade,
  profession_id      uuid not null references public.professions (id) on delete restrict,
  specialization_id  uuid,
  title              text not null check (length(title) between 1 and 200),
  invite_code        text not null unique check (invite_code ~ '^[A-Z2-9]{6,12}$'),
  status             text not null default 'draft' check (status in ('draft', 'open', 'closed', 'archived')),
  results_visibility text not null default 'aggregate_only'
                       check (results_visibility in ('aggregate_only', 'individual_with_consent')),
  -- Privacy floor: aggregates are never computed for groups smaller than this (and never below 3).
  min_group_size     integer not null default 5 check (min_group_size >= 3),
  opens_at           timestamptz,
  closes_at          timestamptz,
  -- Aggregate frozen ONCE when the campaign is closed (team_assessments_freeze_aggregate). Releasing a single
  -- snapshot is what makes the aggregate resistant to differencing (live numbers before/after one more result would
  -- reveal that person's scores). Read through public.team_assessment_aggregate() only.
  aggregate_snapshot jsonb check (jsonb_typeof(aggregate_snapshot) = 'object'),
  aggregate_frozen_at timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  foreign key (specialization_id, profession_id) references public.specializations (id, profession_id) on delete restrict,
  constraint team_assessments_window check (closes_at is null or opens_at is null or closes_at > opens_at),
  constraint team_assessments_snapshot_frozen check ((aggregate_snapshot is null) = (aggregate_frozen_at is null))
);
comment on table public.team_assessments is 'Organization-run assessment campaigns (invite code, privacy floor, visibility mode).';
create index team_assessments_organization_id_idx on public.team_assessments (organization_id);
create index team_assessments_profession_id_idx on public.team_assessments (profession_id);
create index team_assessments_specialization_idx on public.team_assessments (specialization_id, profession_id)
  where specialization_id is not null;
create trigger set_updated_at before update on public.team_assessments
  for each row execute function public.set_updated_at();

-- Sessions started from a team invite are tagged so aggregates can be computed per campaign.
alter table public.assessment_sessions
  add column team_assessment_id uuid references public.team_assessments (id) on delete set null;
create index assessment_sessions_team_assessment_idx on public.assessment_sessions (team_assessment_id)
  where team_assessment_id is not null;

-- Privacy-safe aggregate of a campaign: latest result of each CONSENTING member, k = min_group_size.
--   * fewer than k participants          -> {"suppressed": true} (nothing is ever released for this campaign);
--   * level_distribution                 -> only levels held by >= k participants (small cells suppressed);
--   * skill_averages                     -> only skills scored for >= k participants (e.g. a skill added mid-campaign).
-- Server-only helper (no API grants); called by the freeze trigger below.
create or replace function public.team_assessment_compute_aggregate(p_team_assessment_id uuid)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  v_ta     public.team_assessments%rowtype;
  v_result jsonb;
begin
  select * into v_ta from public.team_assessments t where t.id = p_team_assessment_id;
  if not found then
    return null;
  end if;
  with consenting as (
    select m.user_id
      from public.organization_members m
     where m.organization_id = v_ta.organization_id and m.consent_share_results
  ),
  latest as (
    select distinct on (r.user_id) r.id, r.user_id, r.composite_score, r.assessed_level
      from public.assessment_results r
      join public.assessment_sessions s on s.id = r.session_id
      join consenting c on c.user_id = r.user_id
     where s.team_assessment_id = v_ta.id
     order by r.user_id, r.created_at desc
  ),
  totals as (
    select count(*)::integer as n, round(avg(l.composite_score), 2) as avg_score from latest l
  ),
  level_counts as (
    select coalesce(jsonb_object_agg(x.assessed_level::text, x.cnt order by x.assessed_level), '{}'::jsonb) as dist
      from (select l.assessed_level, count(*)::integer as cnt from latest l group by l.assessed_level) x
     where x.cnt >= v_ta.min_group_size
  ),
  skill_avgs as (
    select coalesce(
             jsonb_agg(
               jsonb_build_object('skill_id', sk.id, 'slug', sk.slug, 'avg_score', round(a.avg_score, 2), 'n', a.n)
               order by sk.sort_order, sk.slug),
             '[]'::jsonb) as arr
      from (
        select ss.skill_id, avg(ss.score) as avg_score, count(*)::integer as n
          from public.skill_scores ss
          join latest l on l.id = ss.result_id
         group by ss.skill_id
      ) a
      join public.skills sk on sk.id = a.skill_id
     where a.n >= v_ta.min_group_size
  )
  select case
           when t.n < v_ta.min_group_size then jsonb_build_object('suppressed', true)
           else jsonb_build_object(
                  'participant_count', t.n,
                  'avg_composite', t.avg_score,
                  'level_distribution', lc.dist,
                  'skill_averages', sa.arr)
         end
    into v_result
    from totals t
   cross join level_counts lc
   cross join skill_avgs sa;
  return v_result;
end
$$;
comment on function public.team_assessment_compute_aggregate(uuid) is
  'Server-only: k-anonymous aggregate (k = min_group_size) of consenting members'' latest results for a campaign.';

-- Closing a campaign (status -> closed|archived) freezes its aggregate exactly once. A frozen campaign can never be
-- reopened and its snapshot never changes, so no second release exists to difference against.
create or replace function public.team_assessments_freeze_aggregate()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.aggregate_frozen_at is not null then
    if new.status not in ('closed', 'archived')
       or (new.aggregate_snapshot, new.aggregate_frozen_at, new.min_group_size, new.organization_id)
          is distinct from (old.aggregate_snapshot, old.aggregate_frozen_at, old.min_group_size, old.organization_id)
    then
      raise exception 'team assessment % is closed: its aggregate is frozen and it cannot be reopened', old.id
        using errcode = 'check_violation', constraint = 'team_assessments_frozen';
    end if;
    return new;
  end if;
  if new.aggregate_snapshot is not null or new.aggregate_frozen_at is not null then
    raise exception 'team assessment %: the aggregate snapshot is computed by the database on close', old.id
      using errcode = 'check_violation', constraint = 'team_assessments_frozen';
  end if;
  if new.status in ('closed', 'archived') then
    -- The snapshot is computed from the stored row, so the privacy floor cannot change in the closing statement.
    if (new.min_group_size, new.organization_id) is distinct from (old.min_group_size, old.organization_id) then
      raise exception 'team assessment %: change min_group_size/organization before closing, not while closing', old.id
        using errcode = 'check_violation', constraint = 'team_assessments_frozen';
    end if;
    new.aggregate_snapshot := public.team_assessment_compute_aggregate(old.id);
    new.aggregate_frozen_at := now();
  end if;
  return new;
end
$$;

create trigger team_assessments_freeze_aggregate
  before update on public.team_assessments
  for each row execute function public.team_assessments_freeze_aggregate();

-- A campaign is created open/draft; it is closed (and frozen) only through an UPDATE.
create or replace function public.team_assessments_guard_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status in ('closed', 'archived') or new.aggregate_snapshot is not null or new.aggregate_frozen_at is not null then
    raise exception 'a team assessment is created as draft or open'
      using errcode = 'check_violation', constraint = 'team_assessments_frozen';
  end if;
  return new;
end
$$;

create trigger team_assessments_guard_insert
  before insert on public.team_assessments
  for each row execute function public.team_assessments_guard_insert();

-- Audit log ---------------------------------------------------------------------------------------------------------
create table public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users (id) on delete set null,
  actor_type    text not null check (actor_type in ('user', 'admin', 'system', 'provider')),
  action        text not null check (length(action) between 1 and 100),
  entity_type   text not null check (length(entity_type) between 1 and 64),
  entity_id     text check (length(entity_id) <= 200),
  before        jsonb,
  after         jsonb,
  ip_hash       text check (length(ip_hash) <= 128),
  created_at    timestamptz not null default now()
);
comment on table public.audit_logs is 'Append-only audit trail of privileged/financial actions (admin edits, payments, unlocks).';
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at);
create index audit_logs_actor_idx on public.audit_logs (actor_user_id, created_at) where actor_user_id is not null;
create index audit_logs_created_at_idx on public.audit_logs (created_at);

-- Rows are immutable and are never deleted or truncated. The only permitted update is anonymizing the actor once the
-- user row is gone (ON DELETE SET NULL of the user). Retention jobs (and test cleanup) may delete rows only inside a
-- transaction that sets level.allow_audit_purge = 'on' (set_config(..., true)).
create or replace function public.audit_logs_append_only()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    if old.actor_user_id is not null and new.actor_user_id is null
       and not exists (select 1 from public.users u where u.id = old.actor_user_id)
       and (new.id, new.actor_type, new.action, new.entity_type, new.entity_id, new.before, new.after, new.ip_hash,
            new.created_at)
           is not distinct from
           (old.id, old.actor_type, old.action, old.entity_type, old.entity_id, old.before, old.after, old.ip_hash,
            old.created_at)
    then
      return new;
    end if;
  elsif coalesce(current_setting('level.allow_audit_purge', true), '') = 'on' then
    return case when tg_op = 'DELETE' then old else null end;
  end if;
  raise exception 'audit_logs rows are append-only'
    using errcode = 'check_violation', constraint = 'audit_logs_append_only';
end
$$;

create trigger audit_logs_append_only
  before update or delete on public.audit_logs
  for each row execute function public.audit_logs_append_only();
create trigger audit_logs_no_truncate
  before truncate on public.audit_logs
  for each statement execute function public.audit_logs_append_only();

-- Rate limiting (fixed window) ---------------------------------------------------------------------------------------
create table public.rate_limits (
  key          text not null check (length(key) between 1 and 200),
  window_start timestamptz not null,
  count        integer not null default 0 check (count >= 0),
  primary key (key, window_start)
);
comment on table public.rate_limits is 'Fixed-window rate-limit counters keyed by action + hashed subject (pruned by a job).';
create index rate_limits_window_start_idx on public.rate_limits (window_start);

-- Atomically counts one hit in the current fixed window and reports whether it is within the limit.
-- Old windows are never deleted here (a periodic job prunes rows by window_start).
create or replace function public.rate_limit_hit(p_key text, p_window_seconds integer, p_limit integer)
returns table (allowed boolean, current integer)
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_window_start timestamptz;
  v_count        integer;
begin
  if p_key is null or p_window_seconds is null or p_window_seconds <= 0 or p_limit is null or p_limit < 0 then
    raise exception 'rate_limit_hit: invalid arguments' using errcode = 'invalid_parameter_value';
  end if;
  v_window_start := to_timestamp(floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds);
  insert into public.rate_limits as r (key, window_start, count)
  values (p_key, v_window_start, 1)
  on conflict (key, window_start) do update set count = r.count + 1
  returning r.count into v_count;
  allowed := v_count <= p_limit;
  current := v_count;
  return next;
end
$$;

comment on function public.rate_limit_hit(text, integer, integer) is
  'Fixed-window rate limiter: increments (key, current window) atomically; returns allowed + current count.';

-- AI usage / cache ---------------------------------------------------------------------------------------------------
create table public.ai_usage (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.users (id) on delete set null,
  purpose         text not null check (purpose ~ '^[a-z][a-z0-9_]{1,63}$'),
  provider        text not null check (length(provider) between 1 and 32),
  model           text not null check (length(model) between 1 and 100),
  input_tokens    integer not null default 0 check (input_tokens >= 0),
  output_tokens   integer not null default 0 check (output_tokens >= 0),
  cost_usd_micros bigint not null default 0 check (cost_usd_micros >= 0),
  cache_hit       boolean not null default false,
  latency_ms      integer check (latency_ms >= 0),
  success         boolean not null default true,
  ref_type        text check (length(ref_type) <= 64),
  ref_id          text check (length(ref_id) <= 200),
  created_at      timestamptz not null default now()
);
comment on table public.ai_usage is 'Every AI call with tokens, cost (USD micros), latency and cache hit, for budgets and unit economics.';
create index ai_usage_created_at_idx on public.ai_usage (created_at);
create index ai_usage_user_idx on public.ai_usage (user_id, created_at) where user_id is not null;
create index ai_usage_ref_idx on public.ai_usage (ref_type, ref_id) where ref_type is not null;

create table public.ai_cache (
  key        text primary key check (length(key) between 1 and 200),
  value      jsonb not null,
  model      text check (length(model) <= 100),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);
comment on table public.ai_cache is 'Content-addressed cache of AI outputs (key = hash of purpose+model+inputs).';
create index ai_cache_expires_at_idx on public.ai_cache (expires_at) where expires_at is not null;

-- App settings -------------------------------------------------------------------------------------------------------
create table public.app_settings (
  key         text primary key check (key ~ '^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$' and length(key) <= 100),
  value       jsonb not null, -- may be JSON null ("not configured")
  description text check (length(description) <= 500),
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.users (id) on delete set null
);
comment on table public.app_settings is 'Runtime-tunable settings (benchmark thresholds, cooldowns, cost estimates, budgets).';
create index app_settings_updated_by_idx on public.app_settings (updated_by) where updated_by is not null;
create trigger set_updated_at before update on public.app_settings
  for each row execute function public.set_updated_at();
