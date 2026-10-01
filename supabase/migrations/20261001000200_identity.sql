-- LEVEL schema 0200: identity (users, profiles, sessions) and locale reference tables.

-- Reference: currencies, languages, countries ----------------------------------------------------------------------
create table public.currencies (
  code        char(3) primary key check (code ~ '^[A-Z]{3}$'),
  minor_units smallint not null check (minor_units between 0 and 4),
  symbol      text not null check (length(symbol) between 1 and 8),
  name        jsonb not null default '{}'::jsonb check (public.is_i18n(name)),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.currencies is 'Currencies with their minor-unit exponent (UZS 2 = tiyin, XTR 0 = Telegram Stars).';
create trigger set_updated_at before update on public.currencies
  for each row execute function public.set_updated_at();

create table public.languages (
  code          text primary key check (code ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
  name          text not null check (length(name) between 1 and 64),
  native_name   text not null check (length(native_name) between 1 and 64),
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  fallback_code text references public.languages (code) on update cascade on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint languages_fallback_not_self check (fallback_code is distinct from code)
);
comment on table public.languages is 'UI/content locales (unlimited by design) with a per-language fallback chain.';
create index languages_fallback_code_idx on public.languages (fallback_code);
create trigger set_updated_at before update on public.languages
  for each row execute function public.set_updated_at();

create table public.countries (
  code             text primary key check (code ~ '^[A-Z]{2}$'),
  name             jsonb not null check (public.is_i18n_nonempty(name)),
  default_currency char(3) not null references public.currencies (code) on update cascade,
  default_locale   text not null references public.languages (code) on update cascade,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
comment on table public.countries is 'Countries the product is localized/priced for (default currency and locale).';
create index countries_default_currency_idx on public.countries (default_currency);
create index countries_default_locale_idx on public.countries (default_locale);
create trigger set_updated_at before update on public.countries
  for each row execute function public.set_updated_at();

-- Users ------------------------------------------------------------------------------------------------------------
create table public.users (
  id                  uuid primary key default gen_random_uuid(),
  is_anonymous        boolean not null default true,
  role                text not null default 'user' check (role in ('user', 'admin')),
  locale              text not null default 'uz' references public.languages (code) on update cascade,
  -- ISO 3166-1 alpha-2 from geo/Telegram; intentionally not an FK so unknown countries never block sign-up.
  country_code        text check (country_code ~ '^[A-Z]{2}$'),
  telegram_user_id    bigint unique check (telegram_user_id > 0),
  auth_user_id        uuid unique,
  phone_e164          text unique check (phone_e164 ~ '^\+[1-9][0-9]{6,14}$'),
  email               citext unique check (length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  merged_into_user_id uuid references public.users (id) on delete set null,
  referred_by_code_id uuid, -- FK to referral_codes added in 0700
  first_touch         jsonb not null default '{}'::jsonb check (jsonb_typeof(first_touch) = 'object'),
  last_seen_at        timestamptz,
  deleted_at          timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint users_not_merged_into_self check (merged_into_user_id is distinct from id)
);
comment on table public.users is 'Accounts: anonymous-first (no login wall), optionally linked to Telegram / Supabase Auth; role admin|user.';
create index users_merged_into_user_id_idx on public.users (merged_into_user_id) where merged_into_user_id is not null;
create index users_locale_idx on public.users (locale);
create index users_created_at_idx on public.users (created_at);
create trigger set_updated_at before update on public.users
  for each row execute function public.set_updated_at();

create table public.profiles (
  user_id              uuid primary key references public.users (id) on delete cascade,
  display_name         text check (length(display_name) between 1 and 64),
  first_name           text check (length(first_name) between 1 and 64),
  username             text check (length(username) between 1 and 64), -- Telegram username (server-managed)
  show_name_on_share   boolean not null default false,
  time_per_day_minutes integer check (time_per_day_minutes between 5 and 480),
  budget               text check (budget in ('free', 'low', 'medium', 'high')),
  location             text check (length(location) <= 120),
  goal_type            text check (goal_type in (
                         'start', 'find_job', 'professional', 'increase_income', 'lead', 'expert', 'first_job',
                         'manager', 'build_business', 'scale_business', 'change_career')),
  timezone             text check (length(timezone) <= 64),
  notifications_opt_in boolean not null default false,
  marketing_opt_in     boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
comment on table public.profiles is 'User-editable profile and planning preferences (1:1 with users).';
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create table public.auth_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users (id) on delete cascade,
  channel      text not null check (channel in ('web', 'telegram', 'mobile')),
  expires_at   timestamptz not null,
  revoked_at   timestamptz,
  last_used_at timestamptz,
  ua_hash      text check (length(ua_hash) <= 128),
  ip_hash      text check (length(ip_hash) <= 128),
  device_hash  text check (length(device_hash) <= 128), -- HMAC(HASH_SALT, device cookie)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint auth_sessions_expiry_after_creation check (expires_at > created_at)
);
comment on table public.auth_sessions is 'Server-issued session records backing the level_session JWT (sid claim); revocable.';
create index auth_sessions_user_id_idx on public.auth_sessions (user_id, created_at desc);
create trigger set_updated_at before update on public.auth_sessions
  for each row execute function public.set_updated_at();
