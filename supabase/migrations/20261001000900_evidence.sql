-- LEVEL schema 0900: evidence layer — sources, claims, evidence links, learning resources, benchmarks.
-- Nothing here may be fabricated: rows are only published to clients once verification_status = 'verified'.

create table public.sources (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique check (slug ~ '^[a-z][a-z0-9_]{1,63}$'),
  type                text not null check (type in (
                        'official', 'academic', 'professional_body', 'university', 'documentation', 'company_report',
                        'industry_research', 'book', 'expert')),
  title               text not null check (length(title) between 1 and 500),
  authors             text[] not null default '{}',
  publisher           text check (length(publisher) <= 300),
  year                smallint check (year between 1400 and 2100),
  url                 text check (url ~ '^https?://' and length(url) <= 2000),
  identifier          text check (length(identifier) <= 200), -- ISBN / DOI / standard number
  reliability         text not null default 'medium' check (reliability in ('high', 'medium', 'low')),
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'verified', 'rejected')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.sources is 'Real, checkable sources (official, academic, books, documentation) backing claims and recommendations.';
create trigger set_updated_at before update on public.sources
  for each row execute function public.set_updated_at();

create table public.claims (
  id            uuid primary key default gen_random_uuid(),
  statement     jsonb not null check (public.is_i18n_nonempty(statement)),
  profession_id uuid references public.professions (id) on delete cascade,
  skill_id      uuid references public.skills (id) on delete cascade,
  confidence    text not null default 'low' check (confidence in ('high', 'medium', 'low')),
  limitation    jsonb check (public.is_i18n(limitation)),
  status        text not null default 'draft' check (status in ('draft', 'active', 'retracted')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.claims is 'Statements used in explanations ("why this"), each with confidence and limitations.';
create index claims_profession_id_idx on public.claims (profession_id) where profession_id is not null;
create index claims_skill_id_idx on public.claims (skill_id) where skill_id is not null;
create trigger set_updated_at before update on public.claims
  for each row execute function public.set_updated_at();

create table public.evidence (
  id         uuid primary key default gen_random_uuid(),
  claim_id   uuid not null references public.claims (id) on delete cascade,
  source_id  uuid not null references public.sources (id) on delete restrict,
  excerpt    text check (length(excerpt) <= 2000),
  locator    text check (length(locator) <= 200), -- page / section / timestamp
  strength   text not null default 'moderate' check (strength in ('strong', 'moderate', 'weak')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.evidence is 'Links a claim to a source with excerpt/locator and evidence strength.';
create index evidence_claim_id_idx on public.evidence (claim_id);
create index evidence_source_id_idx on public.evidence (source_id);
create trigger set_updated_at before update on public.evidence
  for each row execute function public.set_updated_at();

create table public.learning_resources (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique check (slug ~ '^[a-z][a-z0-9_]{1,63}$'),
  title               text not null check (length(title) between 1 and 500),
  author              text check (length(author) <= 300),
  type                text not null check (type in ('book', 'course', 'article', 'documentation', 'video', 'tool')),
  url                 text check (url ~ '^https?://' and length(url) <= 2000),
  languages           text[] not null default '{}',
  cost                text not null default 'free' check (cost in ('free', 'paid', 'freemium')),
  depth               text not null default 'fast' check (depth in ('fast', 'deep')),
  skill_ids           uuid[] not null default '{}' check (array_position(skill_ids, null) is null),
  min_level           smallint check (min_level between 1 and 9),
  max_level           smallint check (max_level between 1 and 9),
  source_id           uuid references public.sources (id) on delete set null,
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'verified', 'rejected')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint learning_resources_level_range check (min_level is null or max_level is null or min_level <= max_level)
);
comment on table public.learning_resources is 'Real learning resources (books/courses/docs) mapped to skills and level ranges.';
create index learning_resources_skill_ids_idx on public.learning_resources using gin (skill_ids);
create index learning_resources_source_id_idx on public.learning_resources (source_id) where source_id is not null;
create trigger set_updated_at before update on public.learning_resources
  for each row execute function public.set_updated_at();

create table public.benchmarks (
  id                uuid primary key default gen_random_uuid(),
  profession_id     uuid not null references public.professions (id) on delete cascade,
  specialization_id uuid references public.specializations (id) on delete cascade,
  metric            text not null check (metric ~ '^[a-z][a-z0-9_]{1,63}$'),
  window_days       integer not null check (window_days > 0),
  sample_size       integer not null check (sample_size >= 0),
  -- {"p10": .., "p25": .., "p50": .., "p75": .., "p90": ..}; shown only when sample_size >= benchmark_min_sample.
  percentiles       jsonb not null default '{}'::jsonb check (jsonb_typeof(percentiles) = 'object'),
  computed_at       timestamptz not null default now(),
  created_at        timestamptz not null default now()
);
comment on table public.benchmarks is 'Percentile snapshots computed from real results (sample size + window always recorded).';
create index benchmarks_lookup_idx on public.benchmarks (profession_id, metric, computed_at desc);
create index benchmarks_specialization_id_idx on public.benchmarks (specialization_id) where specialization_id is not null;
