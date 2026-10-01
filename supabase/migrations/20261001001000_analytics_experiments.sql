-- LEVEL schema 1000: product analytics events and server-side experiments.

create table public.analytics_events (
  id                    bigint generated always as identity primary key,
  name                  text not null check (name ~ '^[a-z][a-z0-9_]{1,63}$'),
  user_id               uuid references public.users (id) on delete set null,
  assessment_session_id uuid references public.assessment_sessions (id) on delete set null,
  occurred_at           timestamptz not null default now(),
  received_at           timestamptz not null default now(),
  channel               text check (channel in ('web', 'telegram', 'mobile', 'server')),
  locale                text check (locale ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
  country_code          text check (country_code ~ '^[A-Z]{2}$'),
  profession_id         uuid, -- denormalized for funnels; intentionally not an FK (analytics outlives catalog edits)
  referral_code         text check (length(referral_code) <= 16),
  experiment_variants   jsonb not null default '{}'::jsonb check (jsonb_typeof(experiment_variants) = 'object'),
  properties            jsonb not null default '{}'::jsonb
                          check (jsonb_typeof(properties) = 'object' and pg_column_size(properties) <= 8192)
);
comment on table public.analytics_events is 'Append-only product events (whitelisted names) for funnels, retention and experiments.';
create index analytics_events_name_idx on public.analytics_events (name, occurred_at);
create index analytics_events_user_idx on public.analytics_events (user_id, occurred_at);
create index analytics_events_session_idx on public.analytics_events (assessment_session_id);

create table public.experiments (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique check (key ~ '^[a-z][a-z0-9_]{1,63}$'),
  description text check (length(description) <= 2000),
  status      text not null default 'draft' check (status in ('draft', 'running', 'stopped')),
  -- [{"key": "control", "weight": 50}, {"key": "b", "weight": 50}]
  variants    jsonb not null default '[]'::jsonb check (jsonb_typeof(variants) = 'array'),
  targeting   jsonb not null default '{}'::jsonb check (jsonb_typeof(targeting) = 'object'),
  started_at  timestamptz,
  stopped_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.experiments is 'Server-side A/B experiments with weighted variants and targeting.';
create trigger set_updated_at before update on public.experiments
  for each row execute function public.set_updated_at();

create table public.experiment_assignments (
  experiment_id uuid not null references public.experiments (id) on delete cascade,
  user_id       uuid not null references public.users (id) on delete cascade,
  variant       text not null check (length(variant) between 1 and 64),
  assigned_at   timestamptz not null default now(),
  primary key (experiment_id, user_id)
);
comment on table public.experiment_assignments is 'Sticky experiment variant per user (hash-based, recorded on first exposure).';
create index experiment_assignments_user_id_idx on public.experiment_assignments (user_id);
