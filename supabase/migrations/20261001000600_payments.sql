-- LEVEL schema 0600: products, prices, payments (state machine + idempotency), provider records, unlocks,
-- entitlements and subscriptions. Payment status and unlocks are only ever written by the server.

create table public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique
                check (slug in ('full_report', 'deep_report', 'growth_os_monthly', 'verification_attempt')),
  name        jsonb not null check (public.is_i18n_nonempty(name)),
  description jsonb not null default '{}'::jsonb check (public.is_i18n(description)),
  kind        text not null check (kind in ('one_time', 'subscription')),
  entitlement text not null
                check (entitlement in ('result_unlock', 'deep_analysis', 'verification_attempt', 'retest', 'growth_os')),
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.products is 'Sellable products and the entitlement each grants (result unlock, deep analysis, Growth OS, ...).';
create trigger set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- Price rows are append-only in spirit: change a price by deactivating the row and inserting a new one, so historical
-- payments keep pointing at the amount they were charged.
create table public.prices (
  id                 uuid primary key default gen_random_uuid(),
  product_id         uuid not null references public.products (id) on delete restrict,
  currency           char(3) not null references public.currencies (code) on update cascade,
  country_code       text check (country_code ~ '^[A-Z]{2}$'), -- NULL = any country
  amount_minor       bigint not null check (amount_minor > 0),
  is_active          boolean not null default true,
  experiment_variant text check (length(experiment_variant) <= 64), -- NULL = control/default
  valid_from         timestamptz,
  valid_to           timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint prices_valid_window check (valid_to is null or valid_from is null or valid_to > valid_from),
  constraint prices_natural_key unique nulls not distinct (product_id, currency, country_code, experiment_variant, valid_from)
);
comment on table public.prices is 'Server-side price list per product/currency/country/experiment variant (amounts in minor units).';
create index prices_currency_idx on public.prices (currency);
create trigger set_updated_at before update on public.prices
  for each row execute function public.set_updated_at();

create table public.payment_provider_configs (
  id              uuid primary key default gen_random_uuid(),
  provider        text not null check (provider in ('click', 'payme', 'telegram_stars', 'stripe', 'mock')),
  country_code    text not null check (country_code ~ '^[A-Z]{2}$'),
  is_active       boolean not null default false,
  -- Where the provider is offered and which currencies it can charge (price resolution intersects these).
  channels        text[] not null default '{}' check (channels <@ array['web', 'telegram', 'mobile']::text[]),
  currencies      text[] not null default '{}'
                    check (array_position(currencies, null) is null
                           and array_to_string(currencies, ',') ~ '^([A-Z]{3}(,[A-Z]{3})*)?$'),
  fee_percent     numeric(6, 3) not null default 0 check (fee_percent >= 0 and fee_percent < 100),
  fee_fixed_minor bigint not null default 0 check (fee_fixed_minor >= 0),
  fee_currency    char(3) references public.currencies (code) on update cascade,
  -- Non-secret settings only. Credentials live in env vars; obvious secret keys are rejected outright.
  settings        jsonb not null default '{}'::jsonb check (
                    jsonb_typeof(settings) = 'object'
                    and not (settings ?| array['secret', 'secret_key', 'key', 'password', 'token', 'api_key', 'private_key'])),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (provider, country_code),
  constraint payment_provider_configs_fixed_fee_currency check (fee_fixed_minor = 0 or fee_currency is not null)
);
comment on table public.payment_provider_configs is 'Per-country provider availability, channels and contracted fees for unit economics (no secrets).';
create index payment_provider_configs_fee_currency_idx on public.payment_provider_configs (fee_currency)
  where fee_currency is not null;
create trigger set_updated_at before update on public.payment_provider_configs
  for each row execute function public.set_updated_at();

create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users (id) on delete restrict,
  product_id          uuid not null references public.products (id) on delete restrict,
  price_id            uuid not null references public.prices (id) on delete restrict,
  target_type         text not null default 'none'
                        check (target_type in ('assessment_result', 'verification_task', 'subscription', 'none')),
  target_id           uuid,
  amount_minor        bigint not null check (amount_minor > 0),
  currency            char(3) not null references public.currencies (code),
  provider            text not null check (provider in ('click', 'payme', 'telegram_stars', 'stripe', 'mock')),
  status              text not null default 'created' check (status in ('created', 'pending', 'paid', 'failed', 'refunded')),
  idempotency_key     text not null check (length(idempotency_key) between 8 and 200),
  provider_payment_id text check (length(provider_payment_id) <= 200),
  provider_fee_minor  bigint check (provider_fee_minor >= 0),
  failure_reason      text check (length(failure_reason) <= 500),
  paid_at             timestamptz,
  failed_at           timestamptz,
  refunded_at         timestamptz,
  expires_at          timestamptz,
  -- Set when a second provider captured money for a target that already has a PAID payment (e.g. a Telegram Stars
  -- successful_payment racing a Click checkout). Such a payment is recorded as paid -> refunded, is excluded from
  -- payments_one_paid_per_target and can never unlock anything.
  duplicate_of_payment_id uuid references public.payments (id),
  meta                jsonb not null default '{}'::jsonb check (jsonb_typeof(meta) = 'object'),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, idempotency_key),
  constraint payments_target_consistent check ((target_type = 'none') = (target_id is null)),
  constraint payments_duplicate_not_self check (duplicate_of_payment_id is distinct from id),
  constraint payments_paid_at check (status not in ('paid', 'refunded') or paid_at is not null),
  constraint payments_failed_at check (status <> 'failed' or failed_at is not null),
  constraint payments_refunded_at check (status <> 'refunded' or refunded_at is not null)
);
comment on table public.payments is 'Payment state machine (created->pending->paid|failed, paid->refunded); amounts always from prices.';
-- At most one PAID payment per purchase target (recorded duplicate captures excluded), and one OPEN payment per
-- target and provider (reused on retry). NULLS NOT DISTINCT: target-less purchases (target_type 'none') get one open
-- payment per (user, product, provider) too. The PAID index keeps NULLs distinct so consumables can be re-bought.
create unique index payments_one_paid_per_target on public.payments (user_id, product_id, target_id)
  where status = 'paid' and duplicate_of_payment_id is null;
create unique index payments_one_open_per_target_provider on public.payments (user_id, product_id, target_id, provider)
  nulls not distinct
  where status in ('created', 'pending');
create unique index payments_provider_payment_id_key on public.payments (provider, provider_payment_id)
  where provider_payment_id is not null;
create index payments_user_idx on public.payments (user_id, created_at desc);
create index payments_product_idx on public.payments (product_id, created_at);
create index payments_price_id_idx on public.payments (price_id);
create index payments_target_idx on public.payments (target_id) where target_id is not null;
create index payments_open_idx on public.payments (created_at) where status in ('created', 'pending');
create index payments_currency_idx on public.payments (currency);
create index payments_duplicate_of_idx on public.payments (duplicate_of_payment_id) where duplicate_of_payment_id is not null;
create trigger set_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- Purchase target kinds each product entitlement can be bought for.
create or replace function public.payment_target_types(p_entitlement text)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case p_entitlement
           when 'result_unlock' then array['assessment_result']
           when 'deep_analysis' then array['assessment_result']
           when 'verification_attempt' then array['verification_task', 'none']
           when 'growth_os' then array['subscription', 'none']
           when 'retest' then array['none']
           else array[]::text[]
         end
$$;
comment on function public.payment_target_types(text) is 'Allowed payments.target_type values per products.entitlement.';

-- A payment is born created (or pending) for an ACTIVE product at an ACTIVE, currently valid price, with
-- amount/currency/product copied from that price (never trust a client amount) and a target kind that fits the
-- product. Target existence/ownership is checked at commit by payments_verify.
create or replace function public.payments_guard_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_price   public.prices%rowtype;
  v_product public.products%rowtype;
begin
  if new.status not in ('created', 'pending') then
    raise exception 'a payment starts as created or pending, not %', new.status
      using errcode = 'check_violation', constraint = 'payments_initial_status';
  end if;
  if new.duplicate_of_payment_id is not null then
    raise exception 'duplicate_of_payment_id is only set when a duplicate capture is recorded'
      using errcode = 'check_violation', constraint = 'payments_duplicate_capture';
  end if;
  select * into v_price from public.prices p where p.id = new.price_id;
  if not found then
    return new; -- the FK reports the missing price
  end if;
  if v_price.product_id <> new.product_id or v_price.currency <> new.currency
     or v_price.amount_minor <> new.amount_minor then
    raise exception 'payment amount/currency/product must match price %', new.price_id
      using errcode = 'check_violation', constraint = 'payments_match_price';
  end if;
  if not v_price.is_active
     or (v_price.valid_from is not null and now() < v_price.valid_from)
     or (v_price.valid_to is not null and now() >= v_price.valid_to) then
    raise exception 'price % is not active or not currently valid', new.price_id
      using errcode = 'check_violation', constraint = 'payments_price_active';
  end if;
  select * into v_product from public.products pr where pr.id = new.product_id;
  if not v_product.is_active then
    raise exception 'product % is not active', v_product.slug
      using errcode = 'check_violation', constraint = 'payments_product_active';
  end if;
  if not (new.target_type = any (public.payment_target_types(v_product.entitlement))) then
    raise exception 'product % cannot be bought for target type %', v_product.slug, new.target_type
      using errcode = 'check_violation', constraint = 'payments_target_type';
  end if;
  return new;
end
$$;

create trigger payments_guard_insert
  before insert on public.payments
  for each row execute function public.payments_guard_insert();

-- Legal transitions: created -> pending|paid|failed; pending -> paid|failed; paid -> refunded.
-- failed and refunded are terminal. Same-status updates are allowed (idempotent webhook handling).
-- The charged amount, currency, product and price never change after creation; neither do the target, provider and
-- idempotency key. provider_payment_id is write-once. user_id changes only through a merge (payments_verify).
-- A captured duplicate (second provider capture for an already PAID target) is recorded by setting
-- duplicate_of_payment_id on its created|pending -> paid transition, and is then refunded (paid -> refunded).
create or replace function public.payments_guard_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.amount_minor <> old.amount_minor or new.currency <> old.currency
     or new.product_id <> old.product_id or new.price_id <> old.price_id then
    raise exception 'payment % amount/currency/product/price are immutable', old.id
      using errcode = 'check_violation', constraint = 'payments_amount_immutable';
  end if;
  if (new.target_type, new.target_id, new.provider, new.idempotency_key)
     is distinct from (old.target_type, old.target_id, old.provider, old.idempotency_key) then
    raise exception 'payment % target/provider/idempotency key are immutable', old.id
      using errcode = 'check_violation', constraint = 'payments_identity_immutable';
  end if;
  if old.provider_payment_id is not null and new.provider_payment_id is distinct from old.provider_payment_id then
    raise exception 'payment % provider_payment_id is write-once', old.id
      using errcode = 'check_violation', constraint = 'payments_provider_payment_id_immutable';
  end if;
  if new.duplicate_of_payment_id is distinct from old.duplicate_of_payment_id then
    if old.duplicate_of_payment_id is not null or old.status not in ('created', 'pending') or new.status <> 'paid'
       or not exists (
         select 1 from public.payments o
          where o.id = new.duplicate_of_payment_id and o.duplicate_of_payment_id is null
            and o.user_id = new.user_id and o.product_id = new.product_id and o.target_id = new.target_id
            and o.status in ('paid', 'refunded')
       )
    then
      raise exception 'payment %: duplicate_of_payment_id is set once, on the capture of a duplicate of a captured '
                      'payment for the same user, product and target', old.id
        using errcode = 'check_violation', constraint = 'payments_duplicate_capture';
    end if;
  end if;
  if new.status is distinct from old.status then
    if not (
         (old.status = 'created' and new.status in ('pending', 'paid', 'failed'))
      or (old.status = 'pending' and new.status in ('paid', 'failed'))
      or (old.status = 'paid' and new.status = 'refunded')
    ) then
      raise exception 'illegal payment status transition % -> % (payment %)', old.status, new.status, old.id
        using errcode = 'check_violation', constraint = 'payments_status_transition';
    end if;
    if new.status = 'paid' and new.paid_at is null then new.paid_at := now(); end if;
    if new.status = 'failed' and new.failed_at is null then new.failed_at := now(); end if;
    if new.status = 'refunded' and new.refunded_at is null then new.refunded_at := now(); end if;
  end if;
  return new;
end
$$;

create trigger payments_guard_update
  before update on public.payments
  for each row execute function public.payments_guard_update();

-- Cross-table payment invariants, checked at COMMIT so a merge or a refund may touch rows in any order:
--   * the target exists and (results/subscriptions) belongs to the payer;
--   * user_id only moves from a user that was merged into the new owner (users.merged_into_user_id);
--   * a payment-sourced unlock only ever references a PAID payment (a refund deletes it in the same transaction).
create or replace function public.payments_verify()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_payment public.payments%rowtype;
begin
  select * into v_payment from public.payments p where p.id = new.id;
  if not found then
    return null;
  end if;
  if tg_op = 'UPDATE' and new.user_id is distinct from old.user_id and not exists (
       select 1 from public.users u where u.id = old.user_id and u.merged_into_user_id = new.user_id
     ) then
    raise exception 'payment % can only move from user % to a user it was merged into', new.id, old.user_id
      using errcode = 'check_violation', constraint = 'payments_user_merge_only';
  end if;
  if (v_payment.target_type = 'assessment_result' and not exists (
        select 1 from public.assessment_results r where r.id = v_payment.target_id and r.user_id = v_payment.user_id))
     or (v_payment.target_type = 'subscription' and not exists (
        select 1 from public.subscriptions s where s.id = v_payment.target_id and s.user_id = v_payment.user_id))
     or (v_payment.target_type = 'verification_task' and not exists (
        select 1 from public.verification_tasks t where t.id = v_payment.target_id))
  then
    raise exception 'payment %: % % does not exist or does not belong to the payer',
      new.id, v_payment.target_type, v_payment.target_id
      using errcode = 'check_violation', constraint = 'payments_target_valid';
  end if;
  if v_payment.status <> 'paid' and exists (
       select 1 from public.result_unlocks u where u.payment_id = v_payment.id and u.source = 'payment'
     ) then
    raise exception 'payment % is %, but a payment-sourced unlock still references it', new.id, v_payment.status
      using errcode = 'check_violation', constraint = 'result_unlocks_payment_paid';
  end if;
  return null;
end
$$;

create constraint trigger payments_verify
  after insert or update of user_id, target_type, target_id, status on public.payments
  deferrable initially deferred
  for each row execute function public.payments_verify();

-- A price that payments reference keeps its product/currency/amount (deactivate it and insert a new row instead);
-- is_active and the validity window stay editable.
create or replace function public.prices_guard_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.product_id, new.currency, new.amount_minor) is distinct from (old.product_id, old.currency, old.amount_minor)
     and exists (select 1 from public.payments p where p.price_id = old.id)
  then
    raise exception 'price % is used by payments: product/currency/amount are immutable', old.id
      using errcode = 'check_violation', constraint = 'prices_immutable_once_used';
  end if;
  return new;
end
$$;

create trigger prices_guard_update
  before update on public.prices
  for each row execute function public.prices_guard_update();

create table public.provider_transactions (
  id              uuid primary key default gen_random_uuid(),
  payment_id      uuid not null references public.payments (id) on delete restrict,
  provider        text not null check (provider in ('click', 'payme', 'telegram_stars', 'stripe', 'mock')),
  provider_txn_id text not null check (length(provider_txn_id) between 1 and 200),
  state           integer not null,
  amount_minor    bigint not null check (amount_minor > 0),
  create_time     bigint,
  perform_time    bigint,
  cancel_time     bigint,
  reason          integer,
  raw             jsonb not null default '{}'::jsonb check (jsonb_typeof(raw) = 'object'),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (provider, provider_txn_id)
);
comment on table public.provider_transactions is 'Provider-side transaction records (Payme/Click state, timestamps in ms) for reconciliation.';
create index provider_transactions_payment_id_idx on public.provider_transactions (payment_id);
create index provider_transactions_create_time_idx on public.provider_transactions (provider, create_time);
create trigger set_updated_at before update on public.provider_transactions
  for each row execute function public.set_updated_at();

-- A provider transaction belongs to its payment's provider and carries exactly the stored amount (a mismatching
-- callback is rejected and recorded in payment_events, never here).
create or replace function public.provider_transactions_match_payment()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.payments p
     where p.id = new.payment_id and (p.provider <> new.provider or p.amount_minor <> new.amount_minor)
  ) then
    raise exception 'provider transaction % must match provider and amount of payment %', new.provider_txn_id, new.payment_id
      using errcode = 'check_violation', constraint = 'provider_transactions_match_payment';
  end if;
  return new;
end
$$;

create trigger provider_transactions_match_payment
  before insert or update of payment_id, provider, amount_minor on public.provider_transactions
  for each row execute function public.provider_transactions_match_payment();

create table public.payment_events (
  id                uuid primary key default gen_random_uuid(),
  payment_id        uuid references public.payments (id) on delete set null,
  provider          text not null check (provider in ('click', 'payme', 'telegram_stars', 'stripe', 'mock')),
  event_type        text not null check (length(event_type) between 1 and 64),
  provider_event_id text not null check (length(provider_event_id) between 1 and 200),
  payload           jsonb not null default '{}'::jsonb,
  signature_valid   boolean not null default false,
  outcome           text check (outcome in ('applied', 'duplicate', 'rejected', 'error')),
  error             text check (length(error) <= 2000),
  received_at       timestamptz not null default now(),
  processed_at      timestamptz,
  unique (provider, event_type, provider_event_id)
);
comment on table public.payment_events is 'Every provider callback, stored once per provider event id (replay-safe audit trail).';
create index payment_events_payment_id_idx on public.payment_events (payment_id, received_at) where payment_id is not null;
create index payment_events_received_at_idx on public.payment_events (received_at);

create table public.entitlements (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users (id) on delete cascade,
  entitlement text not null check (entitlement in ('deep_analysis', 'verification_attempt', 'retest', 'growth_os')),
  quantity    integer not null default 1 check (quantity > 0),
  used        integer not null default 0 check (used >= 0),
  source      text not null check (source in ('payment', 'referral_reward', 'subscription', 'admin', 'promo')),
  source_ref  text check (length(source_ref) <= 200),
  payment_id  uuid references public.payments (id),
  expires_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint entitlements_used_le_quantity check (used <= quantity),
  constraint entitlements_payment_source check ((source = 'payment') = (payment_id is not null))
);
comment on table public.entitlements is 'Consumable/time-bound rights granted by payments, referral rewards, subscriptions or admins.';
create index entitlements_user_idx on public.entitlements (user_id, entitlement);
-- A payment mints each entitlement at most once (webhook replays cannot grant twice).
create unique index entitlements_payment_entitlement_key on public.entitlements (payment_id, entitlement)
  where payment_id is not null;
create trigger set_updated_at before update on public.entitlements
  for each row execute function public.set_updated_at();

create table public.result_unlocks (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users (id) on delete cascade,
  result_id      uuid not null,
  unlock_type    text not null check (unlock_type in ('full', 'deep')),
  source         text not null check (source in ('payment', 'referral_reward', 'subscription', 'admin', 'promo')),
  payment_id     uuid references public.payments (id) on delete restrict,
  entitlement_id uuid references public.entitlements (id) on delete set null,
  created_at     timestamptz not null default now(),
  unique (result_id, unlock_type),
  -- The unlock belongs to the result's owner; a merge re-points the result and the unlock follows. Deleting an
  -- unlocked result is refused (NO ACTION): it is the fulfilment record of a payment.
  foreign key (result_id, user_id) references public.assessment_results (id, user_id)
    on update cascade deferrable initially deferred,
  constraint result_unlocks_payment_source check ((source = 'payment') = (payment_id is not null))
);
comment on table public.result_unlocks is 'Idempotent unlock records of a result (full/deep); written in the same transaction as PAID.';
create index result_unlocks_user_id_idx on public.result_unlocks (user_id);
create index result_unlocks_result_user_idx on public.result_unlocks (result_id, user_id);
-- One payment unlocks exactly one (result, unlock type).
create unique index result_unlocks_payment_id_key on public.result_unlocks (payment_id) where payment_id is not null;
create index result_unlocks_entitlement_id_idx on public.result_unlocks (entitlement_id) where entitlement_id is not null;

-- Payment-sourced unlocks are only ever backed by a PAID (non-duplicate) payment of the result owner, for this result
-- and a product whose entitlement matches the unlock type (result_unlock -> full, deep_analysis -> deep). The unlock
-- of a still-PAID payment cannot be removed (only together with its refund). Checked at COMMIT.
create or replace function public.result_unlocks_verify()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_unlock      public.result_unlocks%rowtype;
  v_payment     public.payments%rowtype;
  v_entitlement text;
  v_expected    text;
begin
  if tg_op = 'DELETE' then
    if old.source = 'payment'
       and exists (select 1 from public.payments p where p.id = old.payment_id and p.status = 'paid')
       and not exists (select 1 from public.result_unlocks u where u.payment_id = old.payment_id)
    then
      raise exception 'the unlock of PAID payment % can only be deleted together with its refund', old.payment_id
        using errcode = 'check_violation', constraint = 'result_unlocks_paid_requires_unlock';
    end if;
    return null;
  end if;
  select * into v_unlock from public.result_unlocks u where u.id = new.id;
  if not found or v_unlock.source <> 'payment' then
    return null;
  end if;
  select * into v_payment from public.payments p where p.id = v_unlock.payment_id;
  select pr.entitlement into v_entitlement from public.products pr where pr.id = v_payment.product_id;
  v_expected := case v_unlock.unlock_type when 'full' then 'result_unlock' when 'deep' then 'deep_analysis' end;
  if v_payment.status is distinct from 'paid'
     or v_payment.duplicate_of_payment_id is not null
     or v_payment.target_type is distinct from 'assessment_result'
     or v_payment.target_id is distinct from v_unlock.result_id
     or v_payment.user_id is distinct from v_unlock.user_id
     or v_entitlement is distinct from v_expected
  then
    raise exception 'unlock % of result % must reference a PAID payment of its owner for this result and unlock type',
      v_unlock.id, v_unlock.result_id
      using errcode = 'check_violation', constraint = 'result_unlocks_payment_valid';
  end if;
  return null;
end
$$;

create constraint trigger result_unlocks_verify
  after insert or update or delete on public.result_unlocks
  deferrable initially deferred
  for each row execute function public.result_unlocks_verify();

create table public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references public.users (id) on delete cascade,
  product_id               uuid not null references public.products (id) on delete restrict,
  status                   text not null default 'active' check (status in ('active', 'past_due', 'cancelled', 'expired')),
  provider                 text not null check (provider in ('click', 'payme', 'telegram_stars', 'stripe', 'mock')),
  provider_subscription_id text check (length(provider_subscription_id) <= 200),
  current_period_start     timestamptz not null,
  current_period_end       timestamptz not null,
  cancel_at_period_end     boolean not null default false,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  constraint subscriptions_period check (current_period_end > current_period_start)
);
comment on table public.subscriptions is 'Recurring product subscriptions (Growth OS) and their current billing period.';
create unique index subscriptions_one_live_per_product on public.subscriptions (user_id, product_id)
  where status in ('active', 'past_due');
create unique index subscriptions_provider_id_key on public.subscriptions (provider, provider_subscription_id)
  where provider_subscription_id is not null;
create index subscriptions_user_idx on public.subscriptions (user_id, status);
create index subscriptions_product_id_idx on public.subscriptions (product_id);
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();
