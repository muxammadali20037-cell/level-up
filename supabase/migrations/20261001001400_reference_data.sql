-- LEVEL schema 1400: reference data required by every environment (locales, currencies, products, prices,
-- provider configs, referral rules, settings). Idempotent: every insert is ON CONFLICT DO NOTHING.
-- Uzbek copy uses U+02BB (ʻ) for oʻ/gʻ and U+02BC (ʼ) for tutuq belgisi — never an ASCII apostrophe.

-- Languages (en first: it is the fallback target of the others).
insert into public.languages (code, name, native_name, is_active, sort_order, fallback_code) values
  ('en', 'English', 'English', true, 3, null),
  ('uz', 'Uzbek', 'Oʻzbekcha', true, 1, 'en'),
  ('ru', 'Russian', 'Русский', true, 2, 'en')
on conflict (code) do nothing;

insert into public.currencies (code, minor_units, symbol, name) values
  ('UZS', 2, 'soʻm', '{"uz": "Oʻzbek soʻmi", "ru": "Узбекский сум", "en": "Uzbekistani som"}'),
  ('USD', 2, '$', '{"uz": "AQSh dollari", "ru": "Доллар США", "en": "US dollar"}'),
  ('XTR', 0, '⭐', '{"uz": "Telegram Stars", "ru": "Telegram Stars", "en": "Telegram Stars"}'),
  ('RUB', 2, '₽', '{"uz": "Rossiya rubli", "ru": "Российский рубль", "en": "Russian ruble"}'),
  ('KZT', 2, '₸', '{"uz": "Qozogʻiston tengesi", "ru": "Казахстанский тенге", "en": "Kazakhstani tenge"}')
on conflict (code) do nothing;

insert into public.countries (code, name, default_currency, default_locale, is_active) values
  ('UZ', '{"uz": "Oʻzbekiston", "ru": "Узбекистан", "en": "Uzbekistan"}', 'UZS', 'uz', true)
on conflict (code) do nothing;

-- Products -----------------------------------------------------------------------------------------------------------
-- MVP sells only full_report; deep_report, Growth OS and verification are configured but inactive until launched.
insert into public.products (slug, name, description, kind, entitlement, is_active, sort_order) values
  ('full_report',
   '{"uz": "Toʻliq natija", "ru": "Полный результат", "en": "Full result"}',
   '{"uz": "LEVEL darajangiz, koʻnikmalar tahlili, asosiy toʻsiq va keyingi qadamlar.", "ru": "Ваш LEVEL, разбор навыков, главное ограничение и следующие шаги.", "en": "Your LEVEL, skill breakdown, main bottleneck and next steps."}',
   'one_time', 'result_unlock', true, 1),
  ('deep_report',
   '{"uz": "Chuqur tahlil", "ru": "Глубокий анализ", "en": "Deep analysis"}',
   '{"uz": "Batafsil shaxsiy hisobot va 30 kunlik yoʻl xaritasi.", "ru": "Подробный персональный отчёт и дорожная карта на 30 дней.", "en": "Detailed personal report and a 30-day roadmap."}',
   'one_time', 'deep_analysis', false, 2),
  ('growth_os_monthly',
   '{"uz": "Growth OS — oylik obuna", "ru": "Growth OS — ежемесячная подписка", "en": "Growth OS — monthly subscription"}',
   '{"uz": "Har kungi harakatlar, yoʻl xaritasi va oʻsishni kuzatish.", "ru": "Ежедневные действия, дорожная карта и отслеживание роста.", "en": "Daily actions, roadmap and growth tracking."}',
   'subscription', 'growth_os', false, 3),
  ('verification_attempt',
   '{"uz": "Amaliy tekshiruv", "ru": "Практическая проверка", "en": "Verification attempt"}',
   '{"uz": "Darajangizni real amaliy topshiriq orqali tasdiqlang.", "ru": "Подтвердите уровень реальным практическим заданием.", "en": "Confirm your level with a real practical task."}',
   'one_time', 'verification_attempt', false, 4)
on conflict (slug) do nothing;

-- Prices (amount_minor in minor units: UZS has 2 decimals, so 1,000 soʻm = 100000). country_code NULL = any country.
insert into public.prices (product_id, currency, country_code, amount_minor, is_active, experiment_variant, valid_from)
select p.id, v.currency, null, v.amount_minor, v.is_active, null, null
  from (values
    ('full_report',          'UZS', 100000::bigint,  true),  --  1,000 soʻm
    ('deep_report',          'UZS', 1490000::bigint, true),  -- 14,900 soʻm
    ('growth_os_monthly',    'UZS', 2990000::bigint, true),  -- 29,900 soʻm
    ('verification_attempt', 'UZS', 990000::bigint,  true),  --  9,900 soʻm
    ('full_report',          'XTR', 5::bigint,       false)  -- Telegram Stars: placeholder, admin must set + activate
  ) as v (slug, currency, amount_minor, is_active)
  join public.products p on p.slug = v.slug
on conflict on constraint prices_natural_key do nothing;

-- Payment providers (Uzbekistan). Fees are NOT invented: 0 until the contracted rate is entered by an admin.
-- Channels: web -> Click/Payme; telegram (Mini App digital goods) -> Telegram Stars; mobile -> none until store billing.
-- Credentials live in env vars; the mock provider is additionally gated by PAYMENTS_MOCK_ENABLED (off in production).
insert into public.payment_provider_configs
  (provider, country_code, is_active, channels, currencies, fee_percent, fee_fixed_minor, settings)
values
  ('click',          'UZ', true, '{web}',          '{UZS}',     0, 0, '{"note": "set contracted fee"}'),
  ('payme',          'UZ', true, '{web}',          '{UZS}',     0, 0, '{"note": "set contracted fee"}'),
  ('telegram_stars', 'UZ', true, '{telegram}',     '{XTR}',     0, 0, '{"note": "set contracted fee"}'),
  ('mock',           'UZ', true, '{web,telegram}', '{UZS,XTR}', 0, 0, '{"note": "set contracted fee"}')
on conflict (provider, country_code) do nothing;

-- Referral reward rules ------------------------------------------------------------------------------------------------
insert into public.referral_reward_rules (key, metric, threshold, entitlement, quantity, is_active) values
  ('three_paid_deep_analysis',     'paid',      3, 'deep_analysis',        1, true),
  ('three_completed_verification', 'completed', 3, 'verification_attempt', 1, true)
on conflict (key) do nothing;

-- App settings (JSON null = not configured yet; the app must treat it as "unknown", never guess).
insert into public.app_settings (key, value, description) values
  ('benchmark_min_sample', '1000',
   'Minimum real sample size before any percentile/benchmark is shown.'),
  ('benchmark_window_days', '90',
   'Rolling window (days) used to compute benchmarks.'),
  ('default_retest_cooldown_days', '14',
   'Days between retests of the same profession unless the user has a retest entitlement.'),
  ('infra_cost_per_assessment_minor', '{"amount_minor": null, "currency": "UZS"}',
   'Estimated infrastructure cost per assessment for unit economics (null until measured).'),
  ('ai_monthly_budget_usd', 'null',
   'Monthly AI spend cap in USD (null = not configured; AI features degrade to deterministic fallbacks).'),
  ('share_base_url', 'null',
   'Public base URL for share links (null = use APP_URL).')
on conflict (key) do nothing;
