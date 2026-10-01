-- LEVEL schema 0400: assessment templates, versioned item bank, sessions, answers, results and scores.

create table public.assessment_templates (
  id                    uuid primary key default gen_random_uuid(),
  profession_id         uuid not null references public.professions (id) on delete cascade,
  specialization_id     uuid,
  slug                  text not null check (slug ~ '^[a-z][a-z0-9_-]{1,63}$'),
  version               integer not null default 1 check (version > 0),
  status                text not null default 'draft' check (status in ('draft', 'active', 'retired')),
  scoring_model_version text not null default 'irt2pl-eap-hier-v1' check (length(scoring_model_version) <= 64),
  config                jsonb not null default '{}'::jsonb check (jsonb_typeof(config) = 'object'),
  context_questions     jsonb not null default '[]'::jsonb check (jsonb_typeof(context_questions) = 'array'),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (profession_id, slug, version),
  foreign key (specialization_id, profession_id) references public.specializations (id, profession_id) on delete cascade
);
comment on table public.assessment_templates is 'Versioned assessment blueprints per profession/specialization (config + context questions).';
create index assessment_templates_specialization_id_idx on public.assessment_templates (specialization_id, profession_id)
  where specialization_id is not null;
create trigger set_updated_at before update on public.assessment_templates
  for each row execute function public.set_updated_at();

-- Item bank. Rows are immutable once answered: edits create a new version (same question_key, version + 1) and move
-- is_current. Exactly one current version per question_key.
create table public.assessment_questions (
  id                 uuid primary key default gen_random_uuid(),
  question_key       text not null check (question_key ~ '^[a-z0-9_]+(\.[a-z0-9_]+)*$' and length(question_key) <= 160),
  version            integer not null default 1 check (version > 0),
  is_current         boolean not null default true,
  profession_id      uuid not null references public.professions (id) on delete cascade,
  specialization_ids uuid[] not null default '{}' check (array_position(specialization_ids, null) is null),
  skill_id           uuid not null,
  type               text not null check (type in ('knowledge', 'judgment', 'scenario', 'decision', 'self_report', 'open')),
  target_level       smallint not null check (target_level between 1 and 9),
  difficulty         numeric(6, 3) not null check (difficulty between -6 and 6),          -- IRT b
  discrimination     numeric(6, 3) not null default 1 check (discrimination > 0 and discrimination <= 4), -- IRT a
  guessing           numeric(5, 4) not null default 0 check (guessing >= 0 and guessing < 1), -- IRT c
  weight             numeric(5, 3) not null default 1 check (weight > 0 and weight <= 5),
  prompt             jsonb not null check (public.is_i18n_nonempty(prompt)),
  scenario           jsonb check (public.is_i18n(scenario)),
  media              jsonb check (jsonb_typeof(media) = 'object'),
  explanation        jsonb check (public.is_i18n(explanation)),
  scoring_rule       text not null check (scoring_rule in ('single_best', 'partial_credit', 'likert', 'open_ai')),
  status             text not null default 'draft' check (status in ('draft', 'active', 'flagged', 'retired')),
  source             text not null default 'seed' check (source in ('seed', 'admin', 'ai_reviewed')),
  tags               text[] not null default '{}',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (question_key, version),
  -- Target of assessment_answers (question_id, question_version): an answer always records the served version.
  unique (id, version),
  foreign key (skill_id, profession_id) references public.skills (id, profession_id) on delete cascade,
  constraint assessment_questions_open_rule check ((type = 'open') = (scoring_rule = 'open_ai'))
);
comment on table public.assessment_questions is 'Versioned IRT item bank (2PL+c); rows immutable once answered, edits create new versions.';
comment on column public.assessment_questions.specialization_ids is
  'Specializations the item applies to (empty = all). Deliberate deviation from the brief''s single nullable '
  'specialization_id: one item can serve several specializations. Elements must be specializations of the same '
  'profession (trigger assessment_questions_specializations_valid).';
create unique index assessment_questions_one_current_key on public.assessment_questions (question_key) where is_current;
create index assessment_questions_bank_idx on public.assessment_questions (profession_id, skill_id, target_level)
  where is_current and status = 'active';
create index assessment_questions_skill_id_idx on public.assessment_questions (skill_id, profession_id);
create trigger set_updated_at before update on public.assessment_questions
  for each row execute function public.set_updated_at();

create table public.question_options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.assessment_questions (id) on delete cascade,
  option_key  text not null check (option_key ~ '^[a-z0-9_]{1,16}$'),
  label       jsonb not null check (public.is_i18n_nonempty(label)),
  score       numeric(4, 3) not null check (score >= 0 and score <= 1),
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (question_id, option_key)
);
comment on table public.question_options is 'Answer options with credit 0..1 (answer key; never readable by clients).';
create trigger set_updated_at before update on public.question_options
  for each row execute function public.set_updated_at();

create table public.assessment_sessions (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.users (id) on delete cascade,
  profession_id        uuid not null references public.professions (id) on delete restrict,
  specialization_id    uuid,
  template_id          uuid references public.assessment_templates (id) on delete restrict,
  template_version     integer check (template_version > 0),
  status               text not null default 'in_progress'
                         check (status in ('in_progress', 'completed', 'abandoned', 'expired')),
  context              jsonb not null default '{}'::jsonb check (jsonb_typeof(context) = 'object'),
  locale               text not null default 'uz' check (locale ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
  channel              text not null default 'web' check (channel in ('web', 'telegram', 'mobile')),
  rng_seed             bigint not null default (floor(random() * 2147483647))::bigint,
  ability_state        jsonb not null default '{}'::jsonb check (jsonb_typeof(ability_state) = 'object'),
  pending_question_id  uuid references public.assessment_questions (id) on delete restrict,
  served_question_ids  uuid[] not null default '{}',
  experiment_variants  jsonb not null default '{}'::jsonb check (jsonb_typeof(experiment_variants) = 'object'),
  retest_of_session_id uuid references public.assessment_sessions (id) on delete set null,
  started_at           timestamptz not null default now(),
  completed_at         timestamptz,
  last_activity_at     timestamptz not null default now(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  foreign key (specialization_id, profession_id) references public.specializations (id, profession_id) on delete restrict,
  constraint assessment_sessions_completed_at check (status <> 'completed' or completed_at is not null),
  -- Target of assessment_results (session_id, user_id): a merge re-points the session and the result follows.
  unique (id, user_id)
);
comment on table public.assessment_sessions is 'One adaptive test run: context, adaptive ability state, served items, lifecycle status.';
create index assessment_sessions_user_idx on public.assessment_sessions (user_id, profession_id, started_at desc);
create index assessment_sessions_profession_idx on public.assessment_sessions (profession_id, started_at);
create index assessment_sessions_specialization_idx on public.assessment_sessions (specialization_id, profession_id)
  where specialization_id is not null;
create index assessment_sessions_template_id_idx on public.assessment_sessions (template_id) where template_id is not null;
create index assessment_sessions_pending_question_idx on public.assessment_sessions (pending_question_id)
  where pending_question_id is not null;
create index assessment_sessions_retest_of_idx on public.assessment_sessions (retest_of_session_id)
  where retest_of_session_id is not null;
create index assessment_sessions_in_progress_idx on public.assessment_sessions (last_activity_at)
  where status = 'in_progress';
create trigger set_updated_at before update on public.assessment_sessions
  for each row execute function public.set_updated_at();

create table public.assessment_answers (
  id                   uuid primary key default gen_random_uuid(),
  session_id           uuid not null references public.assessment_sessions (id) on delete cascade,
  question_id          uuid not null,
  question_version     integer not null check (question_version > 0),
  sequence             smallint not null check (sequence between 1 and 100),
  selected_option_keys text[] not null default '{}',
  response             jsonb,
  credit               numeric(4, 3) check (credit >= 0 and credit <= 1),
  served_at            timestamptz not null default now(),
  answered_at          timestamptz,
  response_ms          integer check (response_ms >= 0),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (session_id, question_id),
  unique (session_id, sequence),
  -- The recorded version must be the version of the referenced question row.
  foreign key (question_id, question_version) references public.assessment_questions (id, version) on delete restrict,
  constraint assessment_answers_answered_after_served check (answered_at is null or answered_at >= served_at)
);
comment on table public.assessment_answers is 'Served items and responses per session (server-side timing, credit 0..1).';
create index assessment_answers_question_idx on public.assessment_answers (question_id, question_version);
create trigger set_updated_at before update on public.assessment_answers
  for each row execute function public.set_updated_at();

create table public.assessment_results (
  id                    uuid primary key default gen_random_uuid(),
  session_id            uuid not null unique,
  user_id               uuid not null references public.users (id) on delete cascade,
  profession_id         uuid not null references public.professions (id) on delete restrict,
  specialization_id     uuid,
  assessment_version    text not null check (length(assessment_version) <= 64),
  scoring_model_version text not null check (length(scoring_model_version) <= 64),
  -- Non-empty array of {question_id, question_key, version} (not a map: the app's postgres.js camelCase transform
  -- rewrites object KEYS on read, which would mangle a map keyed by question_key).
  question_versions     jsonb not null check (
                          case when jsonb_typeof(question_versions) = 'array'
                               then jsonb_array_length(question_versions) > 0 else false end),
  composite_score       numeric(5, 2) not null check (composite_score >= 0 and composite_score <= 100),
  composite_se          numeric(6, 3) not null check (composite_se >= 0),
  theta                 numeric(6, 3) not null check (theta between -6 and 6),
  assessed_level        smallint not null check (assessed_level between 1 and 9),
  level_id              uuid not null references public.levels (id) on delete restrict,
  confidence            text not null check (confidence in ('high', 'medium', 'low')),
  confidence_reasons    jsonb not null default '[]'::jsonb check (jsonb_typeof(confidence_reasons) = 'array'),
  bottleneck_skill_id   uuid,
  next_level            smallint check (next_level between 1 and 9),
  teaser                jsonb not null default '{}'::jsonb check (jsonb_typeof(teaser) = 'object'),
  report                jsonb not null default '{}'::jsonb check (jsonb_typeof(report) = 'object'),
  ai_report             jsonb check (jsonb_typeof(ai_report) = 'object'),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  foreign key (specialization_id, profession_id) references public.specializations (id, profession_id) on delete restrict,
  -- The result's owner is always the session's owner. ON UPDATE CASCADE: a Telegram merge re-points the session and
  -- the result follows (deferred, so the merge may also re-point results first). Deleting a session that has a result
  -- is refused (NO ACTION): paid results and their unlocks are fulfilment records, never collateral of a cleanup.
  foreign key (session_id, user_id) references public.assessment_sessions (id, user_id)
    on update cascade deferrable initially deferred,
  -- The bottleneck is a skill of the result's profession.
  foreign key (bottleneck_skill_id, profession_id) references public.skills (id, profession_id) on delete restrict,
  -- Target of result_unlocks / share_cards (result_id, user_id).
  unique (id, user_id),
  constraint assessment_results_next_level check (next_level is null or next_level > assessed_level)
);
comment on table public.assessment_results is 'Scored outcome of a completed session (versions, composite, level, teaser, deterministic report).';
create index assessment_results_user_idx on public.assessment_results (user_id, created_at desc);
create index assessment_results_session_user_idx on public.assessment_results (session_id, user_id);
create index assessment_results_profession_idx on public.assessment_results (profession_id, created_at);
create index assessment_results_specialization_idx on public.assessment_results (specialization_id, profession_id)
  where specialization_id is not null;
create index assessment_results_level_id_idx on public.assessment_results (level_id);
create index assessment_results_bottleneck_idx on public.assessment_results (bottleneck_skill_id, profession_id)
  where bottleneck_skill_id is not null;
create trigger set_updated_at before update on public.assessment_results
  for each row execute function public.set_updated_at();

create table public.skill_scores (
  id         uuid primary key default gen_random_uuid(),
  result_id  uuid not null references public.assessment_results (id) on delete cascade,
  skill_id   uuid not null references public.skills (id) on delete restrict,
  score      numeric(5, 2) not null check (score >= 0 and score <= 100),
  theta      numeric(6, 3) check (theta between -6 and 6),
  se         numeric(6, 3) check (se >= 0),
  n_items    smallint not null default 0 check (n_items >= 0),
  measured   boolean not null default true,
  confidence text check (confidence in ('high', 'medium', 'low')),
  created_at timestamptz not null default now(),
  unique (result_id, skill_id)
);
comment on table public.skill_scores is 'Per-skill scores (0..100) of a result; measured=false when no item covered the skill.';
create index skill_scores_skill_id_idx on public.skill_scores (skill_id);

create table public.level_scores (
  id           uuid primary key default gen_random_uuid(),
  result_id    uuid not null references public.assessment_results (id) on delete cascade,
  level_number smallint not null check (level_number between 1 and 9),
  met          boolean not null,
  missing      jsonb not null default '[]'::jsonb check (jsonb_typeof(missing) = 'array'),
  created_at   timestamptz not null default now(),
  unique (result_id, level_number)
);
comment on table public.level_scores is 'Per-level requirement evaluation of a result (met flag + missing requirements).';

-- Immutability of answered items ------------------------------------------------------------------------------------
-- Content/psychometric columns of an assessment_questions row cannot change once any answer references it; only
-- lifecycle columns (is_current, status, tags) may. Admins create a new version instead.
create or replace function public.assessment_questions_guard_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (old.question_key, old.version, old.profession_id, old.specialization_ids, old.skill_id, old.type,
      old.target_level, old.difficulty, old.discrimination, old.guessing, old.weight, old.prompt, old.scenario,
      old.media, old.explanation, old.scoring_rule)
     is distinct from
     (new.question_key, new.version, new.profession_id, new.specialization_ids, new.skill_id, new.type,
      new.target_level, new.difficulty, new.discrimination, new.guessing, new.weight, new.prompt, new.scenario,
      new.media, new.explanation, new.scoring_rule)
     and exists (select 1 from public.assessment_answers a where a.question_id = old.id)
  then
    raise exception 'assessment question % v% has answers and is immutable; create a new version',
      old.question_key, old.version
      using errcode = 'check_violation', constraint = 'assessment_questions_immutable_once_answered';
  end if;
  return new;
end
$$;

create trigger assessment_questions_guard_immutable
  before update on public.assessment_questions
  for each row execute function public.assessment_questions_guard_immutable();

create or replace function public.question_options_guard_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.assessment_answers a
     where a.question_id = case when tg_op = 'INSERT' then new.question_id else old.question_id end
        or (tg_op = 'UPDATE' and a.question_id = new.question_id)
  ) then
    raise exception 'options of an answered assessment question are immutable; create a new question version'
      using errcode = 'check_violation', constraint = 'question_options_immutable_once_answered';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end
$$;

create trigger question_options_guard_immutable
  before insert or update or delete on public.question_options
  for each row execute function public.question_options_guard_immutable();

-- Activation gate: an active question needs non-blank uz/ru/en in its prompt and in every option label.
create or replace function public.assessment_questions_require_locales()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'active' then
    if not public.has_required_locales(new.prompt)
       or (new.scenario is not null and not public.has_required_locales(new.scenario))
       or exists (
         select 1 from public.question_options o
          where o.question_id = new.id and not public.has_required_locales(o.label)
       )
    then
      raise exception 'assessment question % v% cannot be active without uz/ru/en prompt, scenario and option labels',
        new.question_key, new.version
        using errcode = 'check_violation', constraint = 'assessment_questions_active_requires_locales';
    end if;
  end if;
  return new;
end
$$;

create trigger assessment_questions_require_locales
  before insert or update of status, prompt, scenario on public.assessment_questions
  for each row execute function public.assessment_questions_require_locales();

create or replace function public.question_options_require_locales()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not public.has_required_locales(new.label)
     and exists (select 1 from public.assessment_questions q where q.id = new.question_id and q.status = 'active')
  then
    raise exception 'options of an active question need uz/ru/en labels (question %)', new.question_id
      using errcode = 'check_violation', constraint = 'question_options_active_requires_locales';
  end if;
  return new;
end
$$;

create trigger question_options_require_locales
  before insert or update of label, question_id on public.question_options
  for each row execute function public.question_options_require_locales();

-- Item bank integrity -------------------------------------------------------------------------------------------------
-- specialization_ids may only name specializations of the question's own profession (array elements cannot carry FKs).
create or replace function public.assessment_questions_specializations_valid()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1
      from unnest(new.specialization_ids) as x (id)
     where not exists (
       select 1 from public.specializations sp where sp.id = x.id and sp.profession_id = new.profession_id
     )
  ) then
    raise exception 'assessment question % v%: specialization_ids must be specializations of profession %',
      new.question_key, new.version, new.profession_id
      using errcode = 'check_violation', constraint = 'assessment_questions_specializations_valid';
  end if;
  return new;
end
$$;

create trigger assessment_questions_specializations_valid
  before insert or update of specialization_ids, profession_id on public.assessment_questions
  for each row execute function public.assessment_questions_specializations_valid();

-- An active closed-ended question has 2..5 options (brief §6). Checked at COMMIT (deferred constraint triggers), so a
-- question and its options can be written in any order inside one transaction.
create or replace function public.assessment_question_check_options(p_question_id uuid)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_question record;
  v_options  integer;
begin
  select q.question_key, q.version, q.type, q.status into v_question
    from public.assessment_questions q where q.id = p_question_id;
  if not found or v_question.status <> 'active' or v_question.type = 'open' then
    return;
  end if;
  select count(*) into v_options from public.question_options o where o.question_id = p_question_id;
  if v_options not between 2 and 5 then
    raise exception 'active assessment question % v% needs 2-5 options (has %)',
      v_question.question_key, v_question.version, v_options
      using errcode = 'check_violation', constraint = 'assessment_questions_active_requires_options';
  end if;
end
$$;

create or replace function public.assessment_questions_require_options()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform public.assessment_question_check_options(new.id);
  return null;
end
$$;

create constraint trigger assessment_questions_require_options
  after insert or update of status, type on public.assessment_questions
  deferrable initially deferred
  for each row execute function public.assessment_questions_require_options();

create or replace function public.question_options_require_count()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then
    perform public.assessment_question_check_options(old.question_id);
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    perform public.assessment_question_check_options(new.question_id);
  end if;
  return null;
end
$$;

create constraint trigger question_options_require_count
  after insert or update of question_id or delete on public.question_options
  deferrable initially deferred
  for each row execute function public.question_options_require_count();

-- Answers ------------------------------------------------------------------------------------------------------------
-- An answer belongs to a question of the session's profession, and a completed session's answers are the audit record
-- of its result: no inserts, edits or deletes once the session is completed (a user hard-delete still cascades,
-- because the session row is already gone when its answers are removed).
create or replace function public.assessment_answers_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_session_id uuid := case when tg_op = 'DELETE' then old.session_id else new.session_id end;
begin
  if exists (select 1 from public.assessment_sessions s where s.id = v_session_id and s.status = 'completed')
     or (tg_op = 'UPDATE' and exists (
           select 1 from public.assessment_sessions s where s.id = old.session_id and s.status = 'completed'))
  then
    raise exception 'answers of completed assessment session % are immutable', v_session_id
      using errcode = 'check_violation', constraint = 'assessment_answers_immutable_once_completed';
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  if exists (
    select 1
      from public.assessment_sessions s
      join public.assessment_questions q on q.id = new.question_id
     where s.id = new.session_id and q.profession_id <> s.profession_id
  ) then
    raise exception 'question % does not belong to the profession of session %', new.question_id, new.session_id
      using errcode = 'check_violation', constraint = 'assessment_answers_same_profession';
  end if;
  return new;
end
$$;

create trigger assessment_answers_guard
  before insert or update or delete on public.assessment_answers
  for each row execute function public.assessment_answers_guard();

-- Results ------------------------------------------------------------------------------------------------------------
-- A result copies profession/specialization from its session, and its level row is level number assessed_level of the
-- profession's own scheme, or of the default scheme when the profession does not override that number.
create or replace function public.assessment_results_consistency()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_session public.assessment_sessions%rowtype;
  v_level   public.levels%rowtype;
begin
  select * into v_session from public.assessment_sessions s where s.id = new.session_id;
  if found and (v_session.profession_id <> new.profession_id
                or v_session.specialization_id is distinct from new.specialization_id) then
    raise exception 'assessment result: profession/specialization must match session %', new.session_id
      using errcode = 'check_violation', constraint = 'assessment_results_match_session';
  end if;
  select * into v_level from public.levels l where l.id = new.level_id;
  if found and (
       v_level.number <> new.assessed_level
       or (v_level.profession_id is not null and v_level.profession_id <> new.profession_id)
       or (v_level.profession_id is null and exists (
             select 1 from public.levels o where o.profession_id = new.profession_id and o.number = new.assessed_level))
     ) then
    raise exception 'assessment result: level % is not level % of profession % (or of the default scheme)',
      new.level_id, new.assessed_level, new.profession_id
      using errcode = 'check_violation', constraint = 'assessment_results_level_scheme';
  end if;
  return new;
end
$$;

create trigger assessment_results_consistency
  before insert or update of session_id, profession_id, specialization_id, level_id, assessed_level
  on public.assessment_results
  for each row execute function public.assessment_results_consistency();

-- Scoring is the audit record of a result: only the rendered payloads (teaser, report, ai_report) and the owner
-- (re-pointed by a merge through the session FK) may change. A re-score is a new session and a new result.
create or replace function public.assessment_results_guard_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (old.session_id, old.profession_id, old.specialization_id, old.assessment_version, old.scoring_model_version,
      old.question_versions, old.composite_score, old.composite_se, old.theta, old.assessed_level, old.level_id,
      old.confidence, old.confidence_reasons, old.bottleneck_skill_id, old.next_level, old.created_at)
     is distinct from
     (new.session_id, new.profession_id, new.specialization_id, new.assessment_version, new.scoring_model_version,
      new.question_versions, new.composite_score, new.composite_se, new.theta, new.assessed_level, new.level_id,
      new.confidence, new.confidence_reasons, new.bottleneck_skill_id, new.next_level, new.created_at)
  then
    raise exception 'assessment result % is immutable (only teaser/report/ai_report may change)', old.id
      using errcode = 'check_violation', constraint = 'assessment_results_immutable';
  end if;
  return new;
end
$$;

create trigger assessment_results_guard_immutable
  before update on public.assessment_results
  for each row execute function public.assessment_results_guard_immutable();

-- Skill scores belong to skills of the result's profession; skill/level scores never change after scoring.
create or replace function public.skill_scores_same_profession()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1
      from public.assessment_results r
      join public.skills sk on sk.id = new.skill_id
     where r.id = new.result_id and sk.profession_id <> r.profession_id
  ) then
    raise exception 'skill % does not belong to the profession of result %', new.skill_id, new.result_id
      using errcode = 'check_violation', constraint = 'skill_scores_same_profession';
  end if;
  return new;
end
$$;

create trigger skill_scores_same_profession
  before insert on public.skill_scores
  for each row execute function public.skill_scores_same_profession();

create or replace function public.forbid_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception '% rows are immutable', tg_table_name
    using errcode = 'check_violation', constraint = tg_table_name || '_immutable';
end
$$;
comment on function public.forbid_update() is 'BEFORE UPDATE trigger for append-only tables: every update raises <table>_immutable.';

create trigger skill_scores_immutable
  before update on public.skill_scores
  for each row execute function public.forbid_update();
create trigger level_scores_immutable
  before update on public.level_scores
  for each row execute function public.forbid_update();

-- Perceived-accuracy feedback on a full result (one per user and result; last write wins). Admin-only reading.
create table public.result_feedback (
  id         uuid primary key default gen_random_uuid(),
  result_id  uuid not null references public.assessment_results (id) on delete cascade,
  user_id    uuid not null references public.users (id) on delete cascade,
  rating     text not null check (rating in ('accurate', 'partly', 'inaccurate')),
  comment    text check (length(comment) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (result_id, user_id)
);
comment on table public.result_feedback is 'User rating of how accurate their result felt (accurate/partly/inaccurate) + optional comment.';
create index result_feedback_user_id_idx on public.result_feedback (user_id);
create trigger set_updated_at before update on public.result_feedback
  for each row execute function public.set_updated_at();
