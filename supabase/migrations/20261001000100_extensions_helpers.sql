-- LEVEL schema 0100: extensions and shared helper functions.
-- Conventions used by every later migration:
--   * uuid primary keys (gen_random_uuid()), created_at/updated_at timestamptz + public.set_updated_at() trigger;
--   * enum-like columns are text + CHECK (evolvable without type migrations);
--   * localized content is jsonb {"uz": "...", "ru": "...", "en": "..."} guarded by public.is_i18n();
--   * every function pins search_path = '' and uses schema-qualified names.

-- gen_random_uuid() is core since Postgres 13, so pgcrypto is not needed.
-- citext goes into Supabase's "extensions" schema (never the API-exposed public schema; Supabase's security advisor
-- flags extension_in_public). Plain local Postgres has no such schema, so it lands in the default creation schema.
-- Column types reference it unqualified: the migration role's search_path ("$user", public, extensions on Supabase)
-- resolves it in both environments.
do $$
begin
  if exists (select 1 from pg_namespace where nspname = 'extensions') then
    execute 'create extension if not exists citext with schema extensions';
  else
    execute 'create extension if not exists citext';
  end if;
end
$$;

-- updated_at maintenance -------------------------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

comment on function public.set_updated_at() is 'BEFORE UPDATE trigger: stamps updated_at = now().';

-- i18n jsonb checks ------------------------------------------------------------------------------------------------
-- A localized text is a JSON object whose values are all strings: {"uz": "...", "ru": "...", "en": "..."}.
-- STRICT: NULL in -> NULL out, so CHECK (public.is_i18n(col)) accepts NULL for optional columns.
create or replace function public.is_i18n(p_value jsonb)
returns boolean
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select jsonb_typeof(p_value) = 'object'
     and not exists (
       select 1 from jsonb_each(p_value) as e(k, v)
        where jsonb_typeof(e.v) <> 'string' or e.k !~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$'
     )
$$;

comment on function public.is_i18n(jsonb) is
  'True when the value is a JSON object mapping locale codes to strings (vacuously true for {}). NULL -> NULL.';

-- Required localized text: valid i18n object with at least one non-blank value.
create or replace function public.is_i18n_nonempty(p_value jsonb)
returns boolean
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select public.is_i18n(p_value)
     and exists (select 1 from jsonb_each_text(p_value) as e(k, v) where btrim(e.v) <> '')
$$;

comment on function public.is_i18n_nonempty(jsonb) is
  'True when the value is a valid i18n object with at least one non-blank translation. NULL -> NULL.';

-- Publishable content: non-blank text in every launch locale (uz, ru, en). Used when content goes live (e.g. a
-- question cannot become active without all three), so the fallback chain is a safety net, not a content strategy.
create or replace function public.has_required_locales(p_value jsonb)
returns boolean
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select public.is_i18n(p_value)
     and coalesce(btrim(p_value ->> 'uz'), '') <> ''
     and coalesce(btrim(p_value ->> 'ru'), '') <> ''
     and coalesce(btrim(p_value ->> 'en'), '') <> ''
$$;

comment on function public.has_required_locales(jsonb) is
  'True when the i18n object has non-blank uz, ru and en values (required before content is activated).';
