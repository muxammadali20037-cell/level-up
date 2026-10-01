-- LEVEL schema 0500: practical verification tasks and attempts (VERIFIED level is separate from ASSESSED).

create table public.verification_tasks (
  id            uuid primary key default gen_random_uuid(),
  profession_id uuid not null references public.professions (id) on delete cascade,
  slug          text not null check (slug ~ '^[a-z][a-z0-9_]{1,63}$'),
  skill_ids     uuid[] not null default '{}' check (array_position(skill_ids, null) is null),
  level_number  smallint not null check (level_number between 1 and 9),
  type          text not null check (type in ('coding', 'simulation', 'case', 'portfolio', 'exercise')),
  title         jsonb not null check (public.is_i18n_nonempty(title)),
  brief         jsonb not null check (public.is_i18n_nonempty(brief)),
  rubric        jsonb not null default '[]'::jsonb check (jsonb_typeof(rubric) = 'array'),
  status        text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (profession_id, slug)
);
comment on table public.verification_tasks is 'Practical tasks (coding/simulation/case/portfolio/exercise) with rubrics that verify a level.';
create index verification_tasks_skill_ids_idx on public.verification_tasks using gin (skill_ids);
create trigger set_updated_at before update on public.verification_tasks
  for each row execute function public.set_updated_at();

create table public.verification_attempts (
  id             uuid primary key default gen_random_uuid(),
  task_id        uuid not null references public.verification_tasks (id) on delete restrict,
  user_id        uuid not null references public.users (id) on delete cascade,
  status         text not null default 'started' check (status in ('started', 'submitted', 'scored', 'failed', 'expired')),
  submission     jsonb check (jsonb_typeof(submission) = 'object'),
  transcript     jsonb check (jsonb_typeof(transcript) in ('object', 'array')),
  rubric_scores  jsonb check (jsonb_typeof(rubric_scores) in ('object', 'array')),
  score          numeric(5, 2) check (score >= 0 and score <= 100),
  scored_by      text check (scored_by in ('rule', 'ai', 'human', 'hybrid')),
  verified_level smallint check (verified_level between 1 and 9),
  started_at     timestamptz not null default now(),
  submitted_at   timestamptz,
  scored_at      timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint verification_attempts_scored check (status <> 'scored' or (score is not null and scored_by is not null))
);
comment on table public.verification_attempts is 'A user''s attempt at a verification task: submission, rubric scores, verified level.';
create index verification_attempts_user_idx on public.verification_attempts (user_id, started_at desc);
create index verification_attempts_task_id_idx on public.verification_attempts (task_id);
create trigger set_updated_at before update on public.verification_attempts
  for each row execute function public.set_updated_at();
