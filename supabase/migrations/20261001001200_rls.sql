-- LEVEL schema 1200: Row Level Security and API-role privileges (defense in depth; the server is the primary gate).
--
-- Model:
--   * The server talks to Postgres as the table owner (bypasses RLS). Supabase API roles anon/authenticated only ever
--     get what is granted + policed below; service_role keeps BYPASSRLS.
--   * RLS is enabled on EVERY public table. Tables without a policy are deny-all for API roles.
--   * Table privileges for anon/authenticated are revoked wholesale (Supabase grants ALL by default, including
--     TRUNCATE which bypasses RLS) and re-granted narrowly: SELECT where a policy exists, column-level UPDATE on the
--     caller's own profile. No INSERT/DELETE anywhere.

-- 1. Enable RLS everywhere --------------------------------------------------------------------------------------------
do $$
declare
  t record;
begin
  for t in
    select c.relname
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind in ('r', 'p')
  loop
    execute format('alter table public.%I enable row level security', t.relname);
  end loop;
end
$$;

-- 2. Privileges: deny by default --------------------------------------------------------------------------------------
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
-- Future tables/sequences/functions created by the migration role start closed too (grant explicitly when a policy or
-- an RPC is added). Functions: Postgres grants EXECUTE to PUBLIC through a GLOBAL default that a per-schema revoke
-- cannot remove, so it is revoked globally for this role; Supabase's per-schema grants to the API roles are revoked
-- for public. Without this, every future SECURITY DEFINER helper would be callable by anon via PostgREST /rpc.
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from anon, authenticated;

-- Public catalog (anon + authenticated, rows filtered by policies below).
grant select on
  public.languages, public.countries, public.currencies,
  public.profession_categories, public.professions, public.specializations, public.skills,
  public.skill_prerequisites, public.levels, public.level_requirements,
  public.products, public.prices, public.learning_resources, public.sources
  to anon, authenticated;

-- Own rows (authenticated only).
grant select on
  public.users, public.profiles, public.payments, public.share_cards, public.referral_codes,
  public.goals, public.roadmaps, public.roadmap_items, public.action_results, public.user_skills,
  public.skill_history, public.level_history, public.entitlements, public.subscriptions, public.notifications,
  public.verification_attempts, public.assessment_results, public.skill_scores, public.level_scores,
  public.organizations, public.organization_members
  to authenticated;

-- Sessions: everything except the adaptive engine internals (ability_state would leak the level before unlock;
-- rng_seed would make item selection predictable).
grant select (
  id, user_id, profession_id, specialization_id, template_id, template_version, status, context, locale, channel,
  pending_question_id, served_question_ids, experiment_variants, retest_of_session_id, team_assessment_id,
  started_at, completed_at, last_activity_at, created_at, updated_at
) on public.assessment_sessions to authenticated;

-- Referrals: the referrer sees statuses, never the referred user's fingerprints or payment.
grant select (
  id, referral_code_id, referrer_user_id, referred_user_id, status, is_valid, invalid_reason,
  invited_at, started_at, completed_at, paid_at, created_at, updated_at
) on public.referrals to authenticated;

-- Profiles: own row, non-privileged columns only (username/timestamps/user_id are server-managed).
revoke update on public.profiles from authenticated;
grant update (
  display_name, first_name, show_name_on_share, time_per_day_minutes, budget, location, goal_type, timezone,
  notifications_opt_in, marketing_opt_in
) on public.profiles to authenticated;

-- 3. Policy helpers -----------------------------------------------------------------------------------------------------
create or replace function public.current_user_id()
returns uuid
language sql
stable
set search_path = ''
as $$
  select auth.uid()
$$;
comment on function public.current_user_id() is 'JWT subject (auth.uid()) of the calling API request; NULL for anon/server.';

-- SECURITY DEFINER: result_unlocks is not readable by API roles, so policies consult it through this function.
-- Scoped to the caller's OWN results, so it is not an oracle for whether someone else paid (result ids travel in
-- share links). Server code reads result_unlocks directly.
create or replace function public.is_result_unlocked(p_result_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.result_unlocks u
      join public.assessment_results r on r.id = u.result_id
     where u.result_id = p_result_id and u.unlock_type in ('full', 'deep') and r.user_id = auth.uid()
  )
$$;
comment on function public.is_result_unlocked(uuid) is
  'True when the CALLER''s own result has a full/deep unlock (used by result RLS policies); false for others'' results.';

create or replace function public.is_org_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members m
     where m.organization_id = p_organization_id and m.user_id = auth.uid()
  ) or exists (
    select 1 from public.organizations o
     where o.id = p_organization_id and o.owner_user_id = auth.uid()
  )
$$;
comment on function public.is_org_member(uuid) is 'True when the caller (auth.uid()) belongs to / owns the organization.';

create or replace function public.is_org_admin(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members m
     where m.organization_id = p_organization_id and m.user_id = auth.uid() and m.role in ('owner', 'admin')
  ) or exists (
    select 1 from public.organizations o
     where o.id = p_organization_id and o.owner_user_id = auth.uid()
  )
$$;
comment on function public.is_org_admin(uuid) is 'True when the caller (auth.uid()) is an owner/admin of the organization.';

-- 4. Policies -----------------------------------------------------------------------------------------------------------
-- 4a. Public catalog: active/visible rows only.
create policy languages_public_read on public.languages
  for select to anon, authenticated using (is_active);
create policy countries_public_read on public.countries
  for select to anon, authenticated using (is_active);
create policy currencies_public_read on public.currencies
  for select to anon, authenticated using (is_active);
create policy profession_categories_public_read on public.profession_categories
  for select to anon, authenticated using (is_active);
create policy professions_public_read on public.professions
  for select to anon, authenticated using (status = 'active');
create policy specializations_public_read on public.specializations
  for select to anon, authenticated using (
    status = 'active'
    and exists (select 1 from public.professions p where p.id = specializations.profession_id and p.status = 'active')
  );
create policy skills_public_read on public.skills
  for select to anon, authenticated using (
    status = 'active'
    and exists (select 1 from public.professions p where p.id = skills.profession_id and p.status = 'active')
  );
create policy skill_prerequisites_public_read on public.skill_prerequisites
  for select to anon, authenticated using (
    exists (
      select 1
        from public.skills s
        join public.skills d on d.id = skill_prerequisites.depends_on_skill_id
        join public.professions p on p.id = s.profession_id
       where s.id = skill_prerequisites.skill_id
         and s.status = 'active' and d.status = 'active' and p.status = 'active'
    )
  );
create policy levels_public_read on public.levels
  for select to anon, authenticated using (
    profession_id is null
    or exists (select 1 from public.professions p where p.id = levels.profession_id and p.status = 'active')
  );
create policy level_requirements_public_read on public.level_requirements
  for select to anon, authenticated using (
    exists (select 1 from public.levels l where l.id = level_requirements.level_id)
    and (
      level_requirements.profession_id is null
      or exists (select 1 from public.professions p where p.id = level_requirements.profession_id and p.status = 'active')
    )
  );
create policy products_public_read on public.products
  for select to anon, authenticated using (is_active);
create policy prices_public_read on public.prices
  for select to anon, authenticated using (
    is_active and exists (select 1 from public.products p where p.id = prices.product_id and p.is_active)
  );
create policy learning_resources_public_read on public.learning_resources
  for select to anon, authenticated using (verification_status = 'verified');
create policy sources_public_read on public.sources
  for select to anon, authenticated using (verification_status = 'verified');

-- 4b. Own rows (auth.uid() = owner).
create policy users_own_read on public.users
  for select to authenticated using (id = (select public.current_user_id()));
create policy profiles_own_read on public.profiles
  for select to authenticated using (user_id = (select public.current_user_id()));
create policy profiles_own_update on public.profiles
  for update to authenticated
  using (user_id = (select public.current_user_id()))
  with check (user_id = (select public.current_user_id()));
create policy assessment_sessions_own_read on public.assessment_sessions
  for select to authenticated using (user_id = (select public.current_user_id()));
create policy payments_own_read on public.payments
  for select to authenticated using (user_id = (select public.current_user_id()));
create policy share_cards_own_read on public.share_cards
  for select to authenticated using (user_id = (select public.current_user_id()));
create policy referral_codes_own_read on public.referral_codes
  for select to authenticated using (user_id = (select public.current_user_id()));
create policy goals_own_read on public.goals
  for select to authenticated using (user_id = (select public.current_user_id()));
-- A roadmap's from_level is the assessed level: hidden while its result is locked.
create policy roadmaps_own_read on public.roadmaps
  for select to authenticated using (
    user_id = (select public.current_user_id())
    and (result_id is null or public.is_result_unlocked(result_id))
  );
create policy roadmap_items_own_read on public.roadmap_items
  for select to authenticated using (
    exists (
      select 1 from public.roadmaps r
       where r.id = roadmap_items.roadmap_id and r.user_id = (select public.current_user_id())
    )
  );
create policy action_results_own_read on public.action_results
  for select to authenticated using (user_id = (select public.current_user_id()));
-- Growth projections are written on result.finalized (before payment), so assessed rows are paywalled exactly like
-- the result they come from (fail closed: an assessed row without a source result is never visible). VERIFIED rows
-- come from verification attempts and are always visible to their owner.
create policy user_skills_own_read on public.user_skills
  for select to authenticated using (
    user_id = (select public.current_user_id())
    and (assessed_score is null or (last_result_id is not null and public.is_result_unlocked(last_result_id)))
  );
create policy skill_history_own_read on public.skill_history
  for select to authenticated using (
    user_id = (select public.current_user_id())
    and (kind = 'verified' or (source_id is not null and public.is_result_unlocked(source_id)))
  );
create policy level_history_own_read on public.level_history
  for select to authenticated using (
    user_id = (select public.current_user_id())
    and (kind = 'verified' or (source_id is not null and public.is_result_unlocked(source_id)))
  );
create policy entitlements_own_read on public.entitlements
  for select to authenticated using (user_id = (select public.current_user_id()));
create policy subscriptions_own_read on public.subscriptions
  for select to authenticated using (user_id = (select public.current_user_id()));
create policy notifications_own_read on public.notifications
  for select to authenticated using (user_id = (select public.current_user_id()));
create policy verification_attempts_own_read on public.verification_attempts
  for select to authenticated using (user_id = (select public.current_user_id()));

-- 4c. Results: own AND unlocked. The free teaser is served by the server only; RLS never leaks the level pre-payment.
create policy assessment_results_own_unlocked_read on public.assessment_results
  for select to authenticated using (
    user_id = (select public.current_user_id()) and public.is_result_unlocked(id)
  );
create policy skill_scores_own_unlocked_read on public.skill_scores
  for select to authenticated using (
    exists (
      select 1 from public.assessment_results r
       where r.id = skill_scores.result_id and r.user_id = (select public.current_user_id())
    )
    and public.is_result_unlocked(result_id)
  );
create policy level_scores_own_unlocked_read on public.level_scores
  for select to authenticated using (
    exists (
      select 1 from public.assessment_results r
       where r.id = level_scores.result_id and r.user_id = (select public.current_user_id())
    )
    and public.is_result_unlocked(result_id)
  );

-- 4d. Referrals: the referrer sees their own referral rows.
create policy referrals_referrer_read on public.referrals
  for select to authenticated using (referrer_user_id = (select public.current_user_id()));

-- 4e. Organizations: members see their org; members see their own membership, owners/admins see the roster.
create policy organizations_member_read on public.organizations
  for select to authenticated using (public.is_org_member(id));
create policy organization_members_read on public.organization_members
  for select to authenticated using (
    user_id = (select public.current_user_id()) or public.is_org_admin(organization_id)
  );

-- 5. Team aggregates (SECURITY DEFINER) ---------------------------------------------------------------------------------
-- Returns the campaign's FROZEN aggregate (computed once on close by team_assessments_freeze_aggregate, k-anonymous with
-- k = min_group_size, consenting members only). Nothing is released while a campaign is open, so an owner cannot
-- difference live numbers before/after one more member's result.
--   * caller not owner/admin (or unknown assessment) -> raises insufficient_privilege (42501);
--   * campaign not closed yet, or group below k      -> returns no rows.
create or replace function public.team_assessment_aggregate(p_team_assessment_id uuid)
returns table (
  participant_count  integer,
  avg_composite      numeric,
  level_distribution jsonb,
  skill_averages     jsonb,
  frozen_at          timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_ta  public.team_assessments%rowtype;
begin
  select * into v_ta from public.team_assessments t where t.id = p_team_assessment_id;
  if not found or v_uid is null or not (
       exists (
         select 1 from public.organization_members m
          where m.organization_id = v_ta.organization_id and m.user_id = v_uid and m.role in ('owner', 'admin')
       )
       or exists (
         select 1 from public.organizations o where o.id = v_ta.organization_id and o.owner_user_id = v_uid
       )
     )
  then
    raise exception 'team assessment aggregate: access denied' using errcode = 'insufficient_privilege';
  end if;

  if v_ta.aggregate_snapshot is null
     or coalesce((v_ta.aggregate_snapshot ->> 'suppressed')::boolean, false)
     or (v_ta.aggregate_snapshot ->> 'participant_count')::integer < v_ta.min_group_size
  then
    return;
  end if;
  participant_count  := (v_ta.aggregate_snapshot ->> 'participant_count')::integer;
  avg_composite      := (v_ta.aggregate_snapshot ->> 'avg_composite')::numeric;
  level_distribution := v_ta.aggregate_snapshot -> 'level_distribution';
  skill_averages     := v_ta.aggregate_snapshot -> 'skill_averages';
  frozen_at          := v_ta.aggregate_frozen_at;
  return next;
end
$$;
comment on function public.team_assessment_aggregate(uuid) is
  'Org owner/admin only: the frozen, k-anonymous aggregate of a closed team assessment (no rows before close or below k).';

-- 6. Function privileges --------------------------------------------------------------------------------------------------
-- Functions are executable by PUBLIC by default: close every function this schema owns (extension members keep their
-- own grants), then grant exactly what the API roles need (policy helpers + the team aggregate RPC).
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as sig
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', f.sig);
  end loop;
end
$$;
grant execute on function public.is_result_unlocked(uuid) to authenticated, service_role;
grant execute on function public.is_org_member(uuid) to authenticated, service_role;
grant execute on function public.is_org_admin(uuid) to authenticated, service_role;
grant execute on function public.team_assessment_aggregate(uuid) to authenticated, service_role;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;
grant execute on function public.current_user_id() to anon, authenticated, service_role;
