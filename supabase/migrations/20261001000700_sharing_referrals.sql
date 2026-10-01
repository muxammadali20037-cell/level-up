-- LEVEL schema 0700: share cards, share events, referral codes, referrals and referral rewards.

create table public.share_cards (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users (id) on delete cascade,
  result_id      uuid not null,
  slug           text not null unique check (slug ~ '^[A-Za-z0-9_-]{6,32}$'),
  show_name      boolean not null default false,
  show_strongest boolean not null default true,
  show_next      boolean not null default true,
  display_name   text check (length(display_name) between 1 and 64),
  -- Only fields that are safe to render publicly (built server-side from the user's explicit choices).
  public_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(public_payload) = 'object'),
  view_count     integer not null default 0 check (view_count >= 0),
  revoked_at     timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- A card is always the result owner's; a merge re-points the result and the card follows.
  foreign key (result_id, user_id) references public.assessment_results (id, user_id)
    on update cascade on delete cascade deferrable initially deferred,
  constraint share_cards_name_consent check (show_name or display_name is null)
);
comment on table public.share_cards is 'Public share cards (/s/slug) rendered only from public_payload; name hidden unless opted in.';
create index share_cards_user_idx on public.share_cards (user_id, created_at desc);
create index share_cards_result_user_idx on public.share_cards (result_id, user_id);
create trigger set_updated_at before update on public.share_cards
  for each row execute function public.set_updated_at();

create table public.share_events (
  id            uuid primary key default gen_random_uuid(),
  share_card_id uuid not null references public.share_cards (id) on delete cascade,
  user_id       uuid references public.users (id) on delete set null, -- actor (owner or viewer), when known
  event         text not null check (event in ('created', 'share_clicked', 'share_completed', 'viewed', 'downloaded')),
  channel       text check (channel ~ '^[a-z][a-z0-9_]{0,31}$'),
  created_at    timestamptz not null default now()
);
comment on table public.share_events is 'Funnel events of a share card (created/clicked/completed/viewed/downloaded).';
create index share_events_card_idx on public.share_events (share_card_id, created_at);
create index share_events_user_id_idx on public.share_events (user_id) where user_id is not null;

create table public.referral_codes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references public.users (id) on delete cascade,
  code       text not null unique check (code ~ '^[A-Z2-9]{6,10}$'),
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.referral_codes is 'One short referral code per user (/r/CODE and Telegram startapp=CODE).';
create trigger set_updated_at before update on public.referral_codes
  for each row execute function public.set_updated_at();

create table public.referrals (
  id               uuid primary key default gen_random_uuid(),
  -- NO ACTION: referral history (and the rewards granted from it) outlives a code; codes are deactivated, not deleted.
  referral_code_id uuid not null references public.referral_codes (id),
  referrer_user_id uuid not null references public.users (id) on delete cascade,
  referred_user_id uuid not null unique references public.users (id) on delete cascade,
  status           text not null default 'invited' check (status in ('invited', 'started', 'completed', 'paid')),
  is_valid         boolean not null default true,
  invalid_reason   text check (invalid_reason in (
                     'self_referral', 'same_telegram_id', 'same_device', 'merged_identity', 'merged_duplicate',
                     'refunded', 'fraud_suspected', 'other')),
  invited_at       timestamptz not null default now(),
  started_at       timestamptz,
  completed_at     timestamptz,
  paid_at          timestamptz,
  first_payment_id uuid references public.payments (id) on delete set null,
  ip_hash          text check (length(ip_hash) <= 128),
  device_hash      text check (length(device_hash) <= 128),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint referrals_not_self check (referrer_user_id <> referred_user_id),
  constraint referrals_invalid_reason check (is_valid = (invalid_reason is null)),
  constraint referrals_started_at check (status not in ('started', 'completed', 'paid') or started_at is not null),
  constraint referrals_completed_at check (status not in ('completed', 'paid') or completed_at is not null),
  constraint referrals_paid_at check (status <> 'paid' or paid_at is not null)
);
comment on table public.referrals is 'First-touch referral attribution (invited->started->completed->paid) with validity flags.';
create index referrals_referrer_idx on public.referrals (referrer_user_id, status);
create index referrals_referral_code_id_idx on public.referrals (referral_code_id);
create index referrals_first_payment_id_idx on public.referrals (first_payment_id) where first_payment_id is not null;
create trigger set_updated_at before update on public.referrals
  for each row execute function public.set_updated_at();

create table public.referral_reward_rules (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique check (key ~ '^[a-z][a-z0-9_]{1,63}$'),
  metric      text not null check (metric in ('completed', 'paid')),
  threshold   integer not null check (threshold > 0),
  entitlement text not null check (entitlement in ('deep_analysis', 'verification_attempt', 'retest', 'growth_os')),
  quantity    integer not null default 1 check (quantity > 0),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.referral_reward_rules is 'Reward rules, e.g. 3 valid paid referrals -> 1 deep analysis.';
create trigger set_updated_at before update on public.referral_reward_rules
  for each row execute function public.set_updated_at();

create table public.referral_reward_grants (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users (id) on delete cascade,
  rule_id        uuid not null references public.referral_reward_rules (id) on delete restrict,
  entitlement_id uuid references public.entitlements (id) on delete set null,
  granted_at     timestamptz not null default now(),
  unique (user_id, rule_id)
);
comment on table public.referral_reward_grants is 'Idempotent record that a referral reward rule was granted to a user (once per rule).';
create index referral_reward_grants_rule_id_idx on public.referral_reward_grants (rule_id);
create index referral_reward_grants_entitlement_id_idx on public.referral_reward_grants (entitlement_id)
  where entitlement_id is not null;

-- First-touch attribution on the referred user.
alter table public.users
  add constraint users_referred_by_code_id_fkey
  foreign key (referred_by_code_id) references public.referral_codes (id) on delete set null;
create index users_referred_by_code_id_idx on public.users (referred_by_code_id) where referred_by_code_id is not null;

-- Canonical owner of a user id: follows users.merged_into_user_id (merge chains are at most 5 deep, 01 §3.5).
create or replace function public.canonical_user_id(p_user_id uuid)
returns uuid
language sql
stable
set search_path = ''
as $$
  with recursive chain (id, depth) as (
    select p_user_id, 0
    union all
    select u.merged_into_user_id, c.depth + 1
      from chain c
      join public.users u on u.id = c.id
     where u.merged_into_user_id is not null and c.depth < 5
  )
  select id from chain order by depth desc limit 1
$$;
comment on function public.canonical_user_id(uuid) is 'Follows merged_into_user_id (max depth 5) to the surviving user id.';

-- The referrer is the code's owner, or the user that owner was merged into (01 §3.5 keeps an anon code row on merge
-- and re-points referrer_user_id to the surviving user). This is what makes referrals_not_self a real self-referral
-- guard. Checked at COMMIT so a merge may re-point codes and referrals in any order.
create or replace function public.referrals_referrer_owns_code()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_referral public.referrals%rowtype;
  v_owner    uuid;
begin
  select * into v_referral from public.referrals r where r.id = new.id;
  if not found then
    return null;
  end if;
  select c.user_id into v_owner from public.referral_codes c where c.id = v_referral.referral_code_id;
  if v_owner is distinct from v_referral.referrer_user_id
     and public.canonical_user_id(v_owner) is distinct from v_referral.referrer_user_id then
    raise exception 'referral %: referrer % does not own referral code %',
      v_referral.id, v_referral.referrer_user_id, v_referral.referral_code_id
      using errcode = 'check_violation', constraint = 'referrals_referrer_owns_code';
  end if;
  return null;
end
$$;

create constraint trigger referrals_referrer_owns_code
  after insert or update of referral_code_id, referrer_user_id on public.referrals
  deferrable initially deferred
  for each row execute function public.referrals_referrer_owns_code();

-- A user can never be attributed to their own referral code.
create or replace function public.users_referred_by_not_own_code()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.referred_by_code_id is not null and exists (
       select 1 from public.referral_codes c where c.id = new.referred_by_code_id and c.user_id = new.id
     ) then
    raise exception 'user % cannot be referred by their own referral code', new.id
      using errcode = 'check_violation', constraint = 'users_referred_by_not_own_code';
  end if;
  return new;
end
$$;

create trigger users_referred_by_not_own_code
  before insert or update of referred_by_code_id on public.users
  for each row execute function public.users_referred_by_not_own_code();
