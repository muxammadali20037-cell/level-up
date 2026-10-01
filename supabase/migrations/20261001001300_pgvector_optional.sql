-- LEVEL schema 1300: optional semantic-search storage (pgvector). Supabase ships pgvector; plain local Postgres may
-- not, in which case this migration is a no-op and nothing in the core product depends on it.
do $$
declare
  v_schema text;
begin
  if not exists (select 1 from pg_available_extensions where name = 'vector') then
    raise notice 'pgvector is not available: skipping embedding columns and content_embeddings';
    return;
  end if;

  -- Supabase keeps extensions in the "extensions" schema; plain Postgres uses the default creation schema.
  if exists (select 1 from pg_namespace where nspname = 'extensions') then
    execute 'create extension if not exists vector with schema extensions';
  else
    execute 'create extension if not exists vector';
  end if;
  select n.nspname into v_schema
    from pg_extension e
    join pg_namespace n on n.oid = e.extnamespace
   where e.extname = 'vector';

  execute format('alter table public.learning_resources add column if not exists embedding %I.vector(1536)', v_schema);

  execute format($ddl$
    create table if not exists public.content_embeddings (
      entity_type  text not null check (entity_type in (
                     'learning_resource', 'assessment_question', 'action', 'skill', 'claim', 'profession')),
      entity_id    uuid not null,
      model        text not null check (length(model) between 1 and 100),
      content_hash text check (length(content_hash) <= 128),
      embedding    %I.vector(1536) not null,
      created_at   timestamptz not null default now(),
      updated_at   timestamptz not null default now(),
      primary key (entity_type, entity_id, model)
    )$ddl$, v_schema);

  execute 'comment on table public.content_embeddings is '
       || quote_literal('Vector embeddings (1536-d) of catalog/content entities for semantic search; server-only.');
  execute 'alter table public.content_embeddings enable row level security';
  execute 'revoke all on public.content_embeddings from anon, authenticated';
  execute 'drop trigger if exists set_updated_at on public.content_embeddings';
  execute 'create trigger set_updated_at before update on public.content_embeddings '
       || 'for each row execute function public.set_updated_at()';
end
$$;
