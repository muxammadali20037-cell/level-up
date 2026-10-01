-- LEVEL schema 0300: catalog taxonomy (categories -> professions -> specializations, skills, skill graph, levels).

create table public.profession_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z][a-z0-9_]{1,63}$'),
  name        jsonb not null check (public.is_i18n_nonempty(name)),
  description jsonb not null default '{}'::jsonb check (public.is_i18n(description)),
  icon        text check (length(icon) <= 64),
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  is_mvp      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.profession_categories is 'Top-level grouping of professions shown on the landing/catalog screens.';
create trigger set_updated_at before update on public.profession_categories
  for each row execute function public.set_updated_at();

create table public.professions (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.profession_categories (id) on delete restrict,
  slug         text not null unique check (slug ~ '^[a-z][a-z0-9_]{1,63}$'),
  name         jsonb not null check (public.is_i18n_nonempty(name)),
  description  jsonb not null default '{}'::jsonb check (public.is_i18n(description)),
  status       text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  is_regulated boolean not null default false,
  disclaimer   jsonb check (public.is_i18n(disclaimer)),
  -- {min_questions, max_questions, target_questions, target_se, retest_cooldown_days, experience_caps, ...}
  config       jsonb not null default '{}'::jsonb check (jsonb_typeof(config) = 'object'),
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- Regulated domains (medical/legal/financial/aviation) must carry an explicit disclaimer before going live.
  constraint professions_regulated_disclaimer check (not is_regulated or status <> 'active' or disclaimer is not null)
);
comment on table public.professions is 'Assessable professions; config holds adaptive-test parameters and experience caps.';
create index professions_category_id_idx on public.professions (category_id, sort_order);
create trigger set_updated_at before update on public.professions
  for each row execute function public.set_updated_at();

create table public.specializations (
  id            uuid primary key default gen_random_uuid(),
  profession_id uuid not null references public.professions (id) on delete cascade,
  slug          text not null check (slug ~ '^[a-z][a-z0-9_]{1,63}$'),
  name          jsonb not null check (public.is_i18n_nonempty(name)),
  description   jsonb not null default '{}'::jsonb check (public.is_i18n(description)),
  status        text not null default 'active' check (status in ('draft', 'active', 'archived')),
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (profession_id, slug),
  -- Target for composite FKs that guarantee (specialization, profession) consistency.
  unique (id, profession_id)
);
comment on table public.specializations is 'Optional sub-tracks of a profession that re-weight skill importance.';
create trigger set_updated_at before update on public.specializations
  for each row execute function public.set_updated_at();

create table public.skills (
  id               uuid primary key default gen_random_uuid(),
  profession_id    uuid not null references public.professions (id) on delete cascade,
  slug             text not null check (slug ~ '^[a-z][a-z0-9_]{1,63}$'),
  global_skill_key text check (global_skill_key ~ '^[a-z][a-z0-9_]{1,63}$'),
  name             jsonb not null check (public.is_i18n_nonempty(name)),
  description      jsonb not null default '{}'::jsonb check (public.is_i18n(description)),
  kind             text not null check (kind in ('hard', 'soft', 'meta')),
  importance       numeric(6, 4) not null check (importance > 0 and importance <= 1),
  sort_order       integer not null default 0,
  status           text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (profession_id, slug),
  unique (id, profession_id)
);
comment on table public.skills is 'Profession-scoped skills with importance weights; global_skill_key maps skills across professions.';
create index skills_global_skill_key_idx on public.skills (global_skill_key) where global_skill_key is not null;
create trigger set_updated_at before update on public.skills
  for each row execute function public.set_updated_at();

create table public.specialization_skill_weights (
  specialization_id uuid not null references public.specializations (id) on delete cascade,
  skill_id          uuid not null references public.skills (id) on delete cascade,
  weight            numeric(6, 4) not null check (weight >= 0 and weight <= 3),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  primary key (specialization_id, skill_id)
);
comment on table public.specialization_skill_weights is 'Per-specialization skill importance multipliers (missing row = 1).';
create index specialization_skill_weights_skill_id_idx on public.specialization_skill_weights (skill_id);
create trigger set_updated_at before update on public.specialization_skill_weights
  for each row execute function public.set_updated_at();

-- Skill dependency graph. Edge direction: depends_on_skill_id ("from") -> skill_id ("to").
--   prerequisite: learn "from" before "to"; limits: weak "from" caps the value of strong "to"; enables: soft link.
create table public.skill_prerequisites (
  skill_id            uuid not null references public.skills (id) on delete cascade,
  depends_on_skill_id uuid not null references public.skills (id) on delete cascade,
  relation            text not null check (relation in ('prerequisite', 'limits', 'enables')),
  strength            numeric(4, 3) not null default 1 check (strength >= 0 and strength <= 1),
  rationale           jsonb check (public.is_i18n(rationale)),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  primary key (skill_id, depends_on_skill_id, relation),
  constraint skill_prerequisites_not_self check (skill_id <> depends_on_skill_id)
);
comment on table public.skill_prerequisites is 'Directed skill graph per profession (to=skill_id, from=depends_on_skill_id) used by the bottleneck engine.';
create index skill_prerequisites_depends_on_skill_id_idx on public.skill_prerequisites (depends_on_skill_id);
create trigger set_updated_at before update on public.skill_prerequisites
  for each row execute function public.set_updated_at();

-- Both ends of an edge (and a specialization weight) must belong to the same profession.
create or replace function public.skill_prerequisites_same_profession()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_to_profession   uuid;
  v_from_profession uuid;
begin
  select s.profession_id into v_to_profession from public.skills s where s.id = new.skill_id;
  select s.profession_id into v_from_profession from public.skills s where s.id = new.depends_on_skill_id;
  if v_to_profession is distinct from v_from_profession then
    raise exception 'skill_prerequisites: skills % and % belong to different professions',
      new.depends_on_skill_id, new.skill_id
      using errcode = 'check_violation', constraint = 'skill_prerequisites_same_profession';
  end if;
  return new;
end
$$;

create trigger skill_prerequisites_same_profession
  before insert or update of skill_id, depends_on_skill_id on public.skill_prerequisites
  for each row execute function public.skill_prerequisites_same_profession();

create or replace function public.specialization_skill_weights_same_profession()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
      from public.specializations sp
      join public.skills sk on sk.profession_id = sp.profession_id
     where sp.id = new.specialization_id and sk.id = new.skill_id
  ) then
    raise exception 'specialization_skill_weights: specialization % and skill % belong to different professions',
      new.specialization_id, new.skill_id
      using errcode = 'check_violation', constraint = 'specialization_skill_weights_same_profession';
  end if;
  return new;
end
$$;

create trigger specialization_skill_weights_same_profession
  before insert or update of specialization_id, skill_id on public.specialization_skill_weights
  for each row execute function public.specialization_skill_weights_same_profession();

-- Moving a skill to another profession would silently break the invariants above.
create or replace function public.skills_profession_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.profession_id is distinct from old.profession_id then
    raise exception 'skills.profession_id is immutable (skill %)', old.id
      using errcode = 'check_violation', constraint = 'skills_profession_immutable';
  end if;
  return new;
end
$$;

create trigger skills_profession_immutable
  before update of profession_id on public.skills
  for each row execute function public.skills_profession_immutable();

-- Levels -----------------------------------------------------------------------------------------------------------
create table public.levels (
  id                    uuid primary key default gen_random_uuid(),
  profession_id         uuid references public.professions (id) on delete cascade, -- NULL = default scheme
  number                smallint not null check (number between 1 and 9),
  slug                  text not null check (slug ~ '^[a-z][a-z0-9_]{1,63}$'),
  name                  jsonb not null check (public.is_i18n_nonempty(name)),
  short_description     jsonb not null default '{}'::jsonb check (public.is_i18n(short_description)),
  meaning               jsonb not null default '{}'::jsonb check (public.is_i18n(meaning)),
  min_composite         numeric(5, 2) not null check (min_composite >= 0 and min_composite <= 100),
  requires_verification boolean not null default false,
  color                 text check (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
comment on table public.levels is 'Level schemes 1..9 (profession_id NULL = default scheme; per-profession rows override it).';
create unique index levels_profession_number_key on public.levels (profession_id, number) where profession_id is not null;
create unique index levels_default_number_key on public.levels (number) where profession_id is null;
create trigger set_updated_at before update on public.levels
  for each row execute function public.set_updated_at();

create table public.level_requirements (
  id               uuid primary key default gen_random_uuid(),
  level_id         uuid not null references public.levels (id) on delete cascade,
  -- Scopes a requirement attached to a default-scheme level to one profession (NULL = every profession).
  profession_id    uuid references public.professions (id) on delete cascade,
  requirement_type text not null check (requirement_type in (
                     'composite_min', 'skill_min', 'verified_scenario', 'practical_action', 'experience_min')),
  skill_id         uuid references public.skills (id) on delete cascade,
  threshold        numeric(8, 2),
  gates_assessed   boolean not null default true,
  description      jsonb not null default '{}'::jsonb check (public.is_i18n(description)),
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint level_requirements_skill_min_has_skill check (requirement_type <> 'skill_min' or skill_id is not null),
  constraint level_requirements_threshold_required
    check (requirement_type not in ('composite_min', 'skill_min') or threshold is not null)
);
comment on table public.level_requirements is 'Requirements to hold a level (composite/skill minimums, verified scenarios, actions, experience).';
create index level_requirements_level_id_idx on public.level_requirements (level_id, sort_order);
create index level_requirements_profession_id_idx on public.level_requirements (profession_id) where profession_id is not null;
create index level_requirements_skill_id_idx on public.level_requirements (skill_id) where skill_id is not null;
create trigger set_updated_at before update on public.level_requirements
  for each row execute function public.set_updated_at();
