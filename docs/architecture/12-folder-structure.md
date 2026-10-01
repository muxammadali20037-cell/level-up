# 12 — Repository Folder Structure

> Exact layout for the LEVEL repository (`/home/user/level-up`). Every folder has one purpose; files are small and
> named for what they do. Layering, module boundaries and dependency rules are defined in `01-architecture.md` §3–4;
> this document is where they become paths. **Decision:** markers flag choices the brief does not make.

Conventions used below: `(Pn)` = phase that creates the path (see `13-build-phases.md`); `…` = more files of the same kind.

---

## 1. Top level

```text
level-up/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # PR: install → typecheck → lint → check:arch → i18n:check → content:validate → unit → integration → e2e → openapi drift
│       └── deploy.yml                # main: migrate staging → deploy staging → smoke e2e → manual approval → migrate prod → deploy prod
├── .env.example                      # every variable from 01 §12.1 with dummy values; never real secrets
├── .gitignore                        # .env*, .next, coverage, test-results, playwright-report
├── .nvmrc                            # 22  (Decision: Node 22 LTS)
├── CLAUDE.md                         # rules for coding agents: brief pointers, layering, file-size limits, commands
├── README.md                         # setup in 5 commands, script reference, links into docs/
├── package.json                      # scripts (§9), engines.node ">=22.12 <23", packageManager "pnpm@10" (Decision)
├── pnpm-lock.yaml
├── tsconfig.json                     # strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, paths "@/*" → "src/*"
├── next.config.ts                    # next-intl plugin, security headers + CSP (frame-ancestors web.telegram.org), outputFileTracingIncludes for assets/fonts
├── eslint.config.mjs                 # ESLint 9 flat: eslint-config-next 16 + typescript-eslint; per-layer no-restricted-imports; max-lines rules (§8)
├── postcss.config.mjs                # @tailwindcss/postcss
├── vitest.config.ts                  # projects "unit" and "integration"; alias "server-only" → tests/stubs/server-only.ts
├── playwright.config.ts              # chromium from /opt/pw-browsers; projects mobile-360 (360×640), mobile-390 (390×844), desktop
├── vercel.json                       # regions ["fra1"], crons, per-route maxDuration
├── assets/
│   └── fonts/                        # Inter .woff (latin + cyrillic subsets, 400/700) for next/og; Satori cannot read woff2
├── content/                          # seed content as reviewed JSON (§5)
├── docs/
│   └── architecture/                 # 00–13 design documents (this folder)
├── public/
│   └── brand/                        # logo.svg, logo-mark.svg, favicon sources (no user content ever)
├── scripts/                          # tsx CLIs: db, content, i18n, arch checks, api, telegram, sim, ops (§6)
├── src/                              # application code (§2–4)
├── supabase/                         # config + SQL migrations (single source of truth for schema) (§7)
└── tests/                            # unit, integration, e2e, fixtures (§8)
```

---

## 2. `src/app` — routes

```text
src/
├── proxy.ts                          # Next 16 proxy (renamed middleware): request id, next-intl locale routing, /s/{slug} rewrite → /{locale}/s/{slug}
├── instrumentation.ts                # server start hook: validate env, register event subscriptions (src/server/bootstrap.ts)
└── app/
    ├── layout.tsx                    # pass-through root layout (needed for root not-found / global-error)
    ├── global-error.tsx              # last-resort error page with its own <html>
    ├── not-found.tsx                 # 404 for non-locale paths
    ├── globals.css                   # Tailwind 4 @import, design tokens as CSS variables, Telegram theme variable mapping
    ├── robots.ts                     # disallow /admin, /api, /tma
    ├── sitemap.ts                    # landing + profession pages per active locale
    ├── manifest.ts                   # PWA manifest (name, icons, theme color)
    ├── icon.svg                      # favicon
    ├── tma/
    │   └── page.tsx                  # S00 Telegram Mini App bootstrap (02 D25): initData → POST /api/v1/auth/telegram → GET /api/v1/me → route by activeAssessment / hasResults
    ├── r/
    │   └── [code]/
    │       └── route.ts              # referral link: recordVisit (rate-limited), set level_ref first-touch + level_did cookies, 302 → card's profession page (?c=slug) or /{locale}
    ├── admin/                        # English-only operator UI, outside [locale], noindex; server-side role check in layout (P1 login, P7 rest)
    │   ├── layout.tsx                # admin shell + guard
    │   ├── login/page.tsx            # ADMIN_PASSWORD login form
    │   ├── page.tsx                  # dashboard: funnel, conversion, share rate, K, D7/D30, level-up rate, flags
    │   ├── questions/page.tsx        # item analytics table, flag filters
    │   ├── questions/[questionKey]/page.tsx  # item detail: versions, stats, flag/retire actions
    │   ├── experiments/page.tsx      # experiments list, status changes, variant metrics
    │   ├── payments/page.tsx         # payment search, stuck payments, refunds, unit economics per payment
    │   ├── settings/page.tsx         # app_settings editor (zod-validated, audited)
    │   └── content/page.tsx          # content.version, coverage report, last seed run
    ├── [locale]/
    │   ├── layout.tsx                # <html lang dir>, NextIntlClientProvider, TelegramProvider, app shell
    │   ├── page.tsx                  # landing + category picker (RSC, revalidate 300)
    │   ├── loading.tsx               # skeleton
    │   ├── error.tsx                 # localized, non-shaming error with next step
    │   ├── not-found.tsx             # localized 404
    │   ├── professions/
    │   │   ├── page.tsx              # professions by category (RSC)
    │   │   └── [professionSlug]/
    │   │       └── page.tsx          # profession intro, specialization choice, regulated-domain disclaimer, start CTA (RSC)
    │   ├── assess/
    │   │   ├── [professionSlug]/
    │   │   │   └── page.tsx          # context questions, one per screen (client) → POST /assessments/sessions
    │   │   └── session/
    │   │       └── [sessionId]/
    │   │           └── page.tsx      # test runner, one question per screen, progress "n / 12" (client)
    │   ├── results/
    │   │   ├── page.tsx              # plain list of my results (client)
    │   │   └── [resultId]/
    │   │       ├── page.tsx          # S08 teaser or S10 full report, decided by the server (`access`) (client)
    │   │       └── share/
    │   │           └── page.tsx      # S11 share builder: name toggle (default off), preview = card image; locked mode omits level (client)
    │   ├── pay/
    │   │   └── return/
    │   │       └── [paymentId]/
    │   │           └── page.tsx      # S09 provider return URL: ignores query params, polls GET /payments/{id} → result (client)
    │   ├── s/
    │   │   └── [slug]/
    │   │       └── page.tsx          # S12 public share page; generateMetadata → og:image = card image URL; revoked → 410 (RSC, revalidate 300)
    │   ├── me/
    │   │   └── page.tsx              # S13/S14/S18 tabs: invite (referral link + counters), account (linking, language, deletion) (client)
    │   ├── legal/
    │   │   └── [doc]/
    │   │       └── page.tsx          # terms, privacy, "educational assessment, not certification" (RSC)
    │   ├── home/page.tsx             # (P8) S15 Growth OS home: today action, roadmap progress, badges, retest sheet (S16)
    │   ├── roadmap/[roadmapId]/page.tsx   # (P8) 30-day roadmap detail with item status
    │   └── history/page.tsx          # (P8) S17 level/skill timeline
    └── api/
        └── v1/                       # JSON API, every handler ≤ 80 lines, built with defineRoute()
            ├── health/route.ts                               # GET liveness + db ping
            ├── config/route.ts                               # GET public config: locales, flags, min app versions, Telegram links
            ├── session/route.ts                              # POST bootstrap/refresh anonymous session, DELETE logout
            ├── auth/
            │   ├── telegram/route.ts                         # POST initData sign-in, merge, start_param (referral code | lk_ link token)
            │   ├── link/route.ts                             # (P8) POST link phone via Supabase access token
            │   └── link-tokens/
            │       ├── route.ts                              # (P8) POST create web → Telegram link token (10 min, single use)
            │       └── [id]/route.ts                         # (P8) GET status (polled by the web page)
            ├── me/
            │   ├── route.ts                                  # GET profile + activeAssessment + hasResults, PATCH locale/firstName/timezone
            │   └── deletion/route.ts                         # (P8) POST data deletion request (02 D27)
            ├── catalog/
            │   ├── categories/route.ts                       # GET
            │   └── professions/
            │       ├── route.ts                              # GET list (?category=)
            │       └── [slug]/
            │           ├── route.ts                          # GET profession aggregate (public fields only)
            │           └── context-questions/route.ts        # GET context questions for template
            ├── assessments/
            │   └── sessions/
            │       ├── route.ts                              # POST start or resume
            │       └── [sessionId]/
            │           ├── route.ts                          # GET session view (resume)
            │           ├── answers/route.ts                  # POST answer → next question or completed
            │           └── complete/route.ts                 # POST idempotent finalize
            ├── results/
            │   ├── route.ts                                  # GET my results
            │   └── [resultId]/
            │       ├── route.ts                              # GET access teaser | full (+ current price quote, narrative status)
            │       └── feedback/route.ts                     # POST accuracy feedback (F22)
            ├── payments/
            │   ├── route.ts                                  # POST create (Idempotency-Key required)
            │   ├── options/route.ts                          # GET providers × prices + openPayment for a target, or already_unlocked
            │   ├── [paymentId]/route.ts                      # GET status
            │   ├── mock/[paymentId]/route.ts                 # POST complete/fail (non-production only)
            │   └── webhooks/
            │       ├── click/
            │       │   ├── prepare/route.ts                  # POST Click Prepare (MD5 sign check)
            │       │   └── complete/route.ts                 # POST Click Complete
            │       └── payme/route.ts                        # POST Payme JSON-RPC (Basic auth)
            ├── telegram/
            │   └── webhook/route.ts                          # POST bot updates: pre_checkout_query, successful_payment, /start
            ├── share-cards/
            │   ├── route.ts                                  # POST create
            │   └── [slug]/
            │       ├── route.ts                              # GET public payload, DELETE revoke (owner)
            │       ├── events/route.ts                       # POST share_clicked | share_completed | downloaded
            │       ├── telegram-message/route.ts             # POST prepared inline message id for WebApp.shareMessage
            │       └── image/
            │           └── [format]/route.ts                 # GET PNG: story | square | telegram | og (?v=payloadHash)
            ├── referrals/
            │   └── me/route.ts                               # GET code, links, counts, reward progress
            ├── events/route.ts                               # POST whitelisted client events (batch ≤ 20)
            ├── growth/home/route.ts                          # (P8) GET home view
            ├── history/route.ts                              # (P8) GET timeline (?cursor=)
            ├── retests/eligibility/route.ts                  # (P8) GET ?professionSlug= → { eligibleAt, hasEntitlement }
            ├── roadmaps/
            │   ├── route.ts                                  # (P8) POST { resultId, goal } → activate proposed / create active roadmap
            │   └── [roadmapId]/
            │       ├── route.ts                              # (P8) GET
            │       └── items/[itemId]/route.ts               # (P8) PATCH status done | skipped | partial
            ├── verification/                                 # (P8) scaffold behind features.verification = false
            │   ├── tasks/route.ts                            # (P8) GET
            │   └── attempts/
            │       ├── route.ts                              # (P8) POST start
            │       └── [attemptId]/
            │           ├── route.ts                          # (P8) GET
            │           └── submit/route.ts                   # (P8) POST
            ├── admin/
            │   ├── login/route.ts                            # POST (rate-limited, constant-time)
            │   ├── metrics/route.ts                          # (P7) GET dashboard data
            │   ├── questions/route.ts                        # (P7) GET item analytics
            │   ├── questions/[questionKey]/route.ts          # (P7) PATCH flag | retire
            │   ├── experiments/route.ts                      # (P7) GET, POST
            │   ├── experiments/[key]/route.ts                # (P7) PATCH status
            │   ├── settings/route.ts                         # (P7) GET, PATCH (audited)
            │   ├── payments/[paymentId]/refund/route.ts      # (P5) POST
            │   └── results/[resultId]/unlock/route.ts        # (P4) POST manual unlock (audited)
            └── cron/
                └── [job]/route.ts                            # GET Vercel Cron entry; Bearer CRON_SECRET; dispatches to src/server/jobs
```

Route conventions: dynamic `params` are `Promise<…>` in Next 16 and are awaited; handlers export only HTTP-method
functions created by `defineRoute`; no SQL or business rules in `src/app`.

---

## 3. Shared code: `src/lib`, `src/server`, `src/components`, `src/i18n`

```text
src/
├── lib/                              # KERNEL — imports no module; no business rules
│   ├── config/
│   │   ├── env.ts                    # zod-validated process.env (server-only); production guards (no mock payments)
│   │   ├── public-env.ts             # NEXT_PUBLIC_* only, safe for client
│   │   ├── settings.ts               # typed app_settings reader with 60 s memo
│   │   └── settings-defaults.ts      # typed defaults per key (01 §12.2)
│   ├── db/
│   │   ├── client.ts                 # postgres.js singleton (prepare:false, max DATABASE_POOL_MAX)
│   │   ├── tx.ts                     # withTx(): begin + retry on 40001/40P01
│   │   └── types.ts                  # Sql, Tx aliases, row helpers
│   ├── http/
│   │   ├── errors.ts                 # AppError, error-code catalog → HTTP status
│   │   ├── envelope.ts               # ok(), created(), fail() JSON helpers
│   │   ├── request-meta.ts           # ip/ua/country/channel extraction + salted hashing
│   │   ├── csrf.ts                   # Origin/Host allowlist check
│   │   └── idempotency.ts            # Idempotency-Key parsing/validation
│   ├── crypto/
│   │   ├── hmac.ts                   # HMAC-SHA256/MD5 helpers (Web Crypto / node:crypto)
│   │   ├── hash.ts                   # salted hashes for ip/ua/device
│   │   ├── random.ts                 # secure random ids, 63-bit seeds
│   │   ├── base32.ts                 # RFC 4648 base32: referral codes (8 chars A–Z2–7), share slugs (10 lowercase)
│   │   └── timing-safe.ts            # constant-time compare
│   ├── i18n/
│   │   ├── localized-text.ts         # jsonb {uz,ru,en} resolver: requested → fallback_code → en → uz
│   │   ├── negotiate.ts              # locale negotiation chain (01 §16)
│   │   └── direction.ts              # RTL list → dir attribute
│   ├── money/
│   │   ├── money.ts                  # Money type, minor-unit math, provider unit conversion helpers
│   │   └── format.ts                 # formatMoney(money, locale) using message templates
│   ├── events/
│   │   ├── catalog.ts                # DomainEvent union (assessment.started, result.finalized, payment.paid, …)
│   │   └── bus.ts                    # subscribe()/publish(); used post-commit inside after()
│   ├── rate-limit/
│   │   └── fixed-window.ts           # rate_limits upsert, fail-open/closed per key
│   ├── audit/
│   │   └── audit-log.ts              # write audit_logs (actor, action, before/after, ip_hash)
│   ├── observability/
│   │   ├── logger.ts                 # JSON logs with redaction
│   │   ├── redact.ts                 # key-based redaction list
│   │   └── request-id.ts             # UUIDv7 generation/propagation
│   ├── telegram/
│   │   ├── init-data.ts              # pure initData parse + HMAC verification + auth_date check
│   │   └── bot-api.ts                # minimal typed Bot API client (createInvoiceLink, answerPreCheckoutQuery, sendMessage, setWebhook)
│   ├── cache/
│   │   └── lru.ts                    # per-instance TTL LRU
│   ├── time/
│   │   └── clock.ts                  # injectable clock (tests freeze time)
│   ├── api-client/                   # isomorphic typed client for /api/v1 (web + TMA now, React Native later)
│   │   ├── client.ts                 # fetch wrapper: Bearer/cookie, Idempotency-Key, envelope parsing, retries for GET
│   │   └── endpoints.ts              # typed endpoint functions built from module contracts
│   └── utils/
│       ├── cn.ts                     # clsx + tailwind-merge
│       ├── assert.ts                 # invariant()
│       └── canonical-json.ts         # stable stringify (cache keys, payload hashes)
├── server/                           # COMPOSITION ROOT — may call several modules
│   ├── api/
│   │   ├── define-route.ts           # auth mode, CSRF, rate limit, zod, idempotency, error mapping, logging
│   │   ├── request-context.ts        # builds RequestContext from cookie/Bearer + headers
│   │   ├── session-cookie.ts         # set/clear level_session, level_did, level_ref
│   │   └── webhook.ts                # raw-body reader + provider response helpers
│   ├── bootstrap.ts                  # once per instance: subscriptions, lifecycle participants, purchase-target resolvers
│   ├── subscriptions.ts              # event → handler map (01 §3.5)
│   ├── lifecycle-participants.ts     # module participants for user merge + deletion (one transaction)
│   ├── rsc/
│   │   └── public-context.ts         # locale/country context for public Server Components
│   └── jobs/                         # cron jobs (each ≤ 150 lines)
│       ├── expire-payments.ts
│       ├── expire-sessions.ts
│       ├── reconcile.ts              # repair projections/referral statuses from facts
│       ├── ops-checks.ts             # alert thresholds → Telegram admin chat
│       ├── integrity.ts              # nightly integrity counters (02 §3.3)
│       ├── question-stats.ts         # (P7) item analytics + flags
│       ├── compute-benchmarks.ts     # (P7) benchmarks with sample_size gating
│       ├── dispatch-notifications.ts # (post-launch; no reminders in MVP)
│       └── prune.ts                  # rate_limits, ai_cache, expired link tokens cleanup
├── components/
│   ├── ui/                           # hand-written shadcn-style primitives (cva + clsx + tailwind-merge + radix-ui + lucide-react); no shadcn CLI
│   │   ├── button.tsx                # variants: primary, secondary, ghost; sizes with ≥ 48 px touch height
│   │   ├── option-button.tsx         # full-width answer option (radio semantics, keyboard + screen reader)
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── sheet.tsx                 # bottom sheet (radix Dialog)
│   │   ├── dialog.tsx
│   │   ├── toast.tsx                 # radix Toast
│   │   ├── skeleton.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── switch.tsx                # e.g. "show my name" toggle (default off)
│   │   ├── tabs.tsx
│   │   ├── separator.tsx
│   │   └── spinner.tsx
│   ├── layout/
│   │   ├── app-shell.tsx             # max-width mobile column, safe-area padding
│   │   ├── top-bar.tsx               # back, title, locale switch (hidden inside TMA; uses Telegram BackButton)
│   │   ├── sticky-cta.tsx            # bottom CTA that stays above the keyboard
│   │   └── locale-switcher.tsx
│   └── telegram/
│       ├── telegram-provider.tsx     # loads telegram-web-app.js only when launch params are detected (02 D28); ready()/expand(), theme → CSS vars
│       ├── use-telegram.ts           # hook: isTma, initData, user, platform
│       └── back-button.tsx           # binds Telegram BackButton to router
├── i18n/
│   ├── routing.ts                    # defineRouting: locales from locales.generated.ts, defaultLocale "uz", localePrefix "always"
│   ├── locales.generated.ts          # generated by scripts/i18n/sync-locales.ts — do not edit
│   ├── request.ts                    # getRequestConfig: deep-merge uz ← en ← requested namespaces
│   ├── navigation.ts                 # createNavigation (Link, redirect, useRouter)
│   └── messages/
│       ├── uz/                       # default locale (Uzbek Latin, ʻ U+02BB and ʼ U+02BC only)
│       │   ├── common.json           # buttons, nav, generic labels
│       │   ├── landing.json
│       │   ├── catalog.json
│       │   ├── assessment.json
│       │   ├── result.json           # e.g. "teaser.title": "Natijangiz tayyor"
│       │   ├── payment.json          # e.g. "cta.unlock": "{price}ga toʻliq natijani ochish"
│       │   ├── share.json            # e.g. "card.question": "Sen qaysi LEVELdasan?"
│       │   ├── referral.json
│       │   ├── growth.json
│       │   ├── errors.json           # e.g. "INTERNAL": "Xatolik yuz berdi. Qayta urinib koʻring."
│       │   ├── money.json            # e.g. "UZS": "{amount} soʻm"
│       │   └── legal.json
│       ├── ru/                       # same namespaces
│       └── en/                       # same namespaces; type source for next-intl
└── types/
    └── next-intl.d.ts                # AppConfig augmentation: Locale + Messages typed from messages/en
```

---

## 4. `src/modules` — domain modules

Every module follows the same skeleton. Only `index.ts`, `contracts.ts` and `ui/*` are importable from outside the module
(checked by `scripts/arch/check-module-deps.ts` against `src/modules/module-graph.ts`).

```text
src/modules/
├── module-graph.ts                   # allowed dependency map (01 §3.4) — the arch check reads this
└── <module>/
    ├── index.ts                      # 'server-only'; wires and exports the public service API
    ├── contracts.ts                  # zod schemas + DTO types + enums (isomorphic, no I/O)
    ├── domain/                       # pure TS: types, rules, algorithms; no I/O, no clock, no randomness
    ├── application/                  # one use case per file; factories with injected deps
    ├── infrastructure/               # *-repo.ts (postgres.js tagged SQL), provider adapters
    └── ui/                           # optional module-specific React components
```

Full module layout:

```text
src/modules/
├── identity/
│   ├── index.ts · contracts.ts
│   ├── domain/        session-claims.ts · merge-rules.ts · channel.ts · locale-pick.ts
│   ├── application/   ensure-anonymous.ts · resolve-session.ts · sign-in-telegram.ts · start-param.ts · merge-users.ts · link-tokens.ts · link-phone.ts · request-deletion.ts · update-profile.ts · admin-login.ts
│   ├── infrastructure/ users-repo.ts · profiles-repo.ts · auth-sessions-repo.ts · link-tokens-repo.ts · session-jwt.ts (jose) · supabase-token-verifier.ts
│   └── ui/            profile-form.tsx · link-account-sheet.tsx
├── catalog/
│   ├── index.ts · contracts.ts
│   ├── domain/        profession-aggregate.ts · level-scheme.ts (default vs profession override) · skill-graph.ts
│   ├── application/   get-profession.ts · list-professions.ts · reference-data.ts
│   ├── infrastructure/ professions-repo.ts · skills-repo.ts · levels-repo.ts · reference-repo.ts · catalog-cache.ts
│   └── ui/            category-grid.tsx · profession-card.tsx · disclaimer-note.tsx
├── assessments/
│   ├── index.ts · contracts.ts
│   ├── domain/        session-state.ts · constraints.ts (≤2 self_report, ≥2 scenario-like) · context-prior.ts (experience → μ0, caps) · question-dto.ts (strips scores) · speeding.ts · retest-window.ts
│   ├── application/   start-session.ts · submit-answer.ts · get-session-view.ts · load-for-scoring.ts · mark-completed.ts · retest-eligibility.ts · expire-idle-sessions.ts · question-admin.ts
│   ├── infrastructure/ templates-repo.ts · questions-repo.ts · sessions-repo.ts · answers-repo.ts · bank-cache.ts
│   └── ui/            context-step.tsx · question-screen.tsx · scenario-block.tsx · progress-header.tsx · resume-banner.tsx
├── scoring/                          # PURE module: domain only
│   ├── index.ts · contracts.ts
│   └── domain/
│       ├── model-version.ts          # SCORING_MODEL_VERSION = "irt2pl-eap-hier-v1"
│       ├── irt.ts                    # P(θ), weighted fractional log-likelihood, Fisher information
│       ├── grid.ts                   # θ grid [−4, 4] step 0.05 (161 points), normal prior
│       ├── eap-general.ts            # θ_g, SE_g
│       ├── eap-skill.ts              # hierarchical θ_s with N(θ_g, 0.8²)
│       ├── score-mapping.ts          # θ → 0..100, composite, composite_se
│       ├── levels.ts                 # assessed level: thresholds, gates, verification cap, experience caps, range
│       ├── confidence.ts             # HIGH / MEDIUM / LOW + reasons, downgrades
│       └── cat/
│           ├── prng.ts               # splitmix64(seed + sequence)
│           ├── coverage.ts           # coverage-phase skill order
│           ├── precision.ts          # importance × posterior SD, max-information item
│           ├── randomesque.ts        # seeded pick among top 3
│           ├── select-next.ts        # orchestrates phases + constraints
│           └── stop-rule.ts          # n ≥ 7 ∧ coverage ∧ SE_g ≤ 0.45, or n = 15
├── results/
│   ├── index.ts · contracts.ts
│   ├── domain/        bands.ts · bottleneck.ts (leverage) · next-level.ts · teaser.ts · report-builder.ts · narrative-template.ts · share-facts.ts
│   ├── application/   finalize-session.ts · get-result-view.ts · list-results.ts · submit-feedback.ts · generate-narrative.ts · narrative-prompt.ts · aggregates.ts
│   ├── infrastructure/ results-repo.ts · skill-scores-repo.ts · level-scores-repo.ts · feedback-repo.ts
│   └── ui/            teaser-view.tsx · locked-section.tsx · level-hero.tsx · confidence-note.tsx · skill-bars.tsx · bottleneck-card.tsx · next-level-card.tsx · actions-list.tsx · do-not-list.tsx · plan-7-day.tsx · roadmap-30-day.tsx
├── pricing/
│   ├── index.ts · contracts.ts
│   ├── domain/        price-selection.ts (specificity ordering)
│   ├── application/   quote.ts
│   └── infrastructure/ products-repo.ts · prices-repo.ts
├── payments/
│   ├── index.ts · contracts.ts
│   ├── domain/        state-machine.ts · idempotency.ts · fees.ts · provider-availability.ts
│   ├── application/   checkout-options.ts · create-payment.ts · get-payment-status.ts · mark-paid.ts (tx: paid + unlock) · handle-click.ts · handle-payme.ts · handle-telegram.ts · refund.ts · expire-stale.ts · access.ts (unlocks, entitlements)
│   ├── infrastructure/
│   │   ├── payments-repo.ts · provider-transactions-repo.ts · payment-events-repo.ts · unlocks-repo.ts · entitlements-repo.ts · provider-configs-repo.ts
│   │   └── providers/
│   │       ├── provider.ts           # PaymentProvider interface
│   │       ├── mock.ts               # dev/test only
│   │       ├── click.ts              # Prepare/Complete, MD5 sign_string
│   │       ├── payme.ts              # JSON-RPC methods, Basic auth, tiyin, 12 h timeout
│   │       ├── payme-errors.ts       # JSON-RPC error codes + localized messages
│   │       ├── telegram-stars.ts     # createInvoiceLink (XTR), pre-checkout, successful_payment
│   │       └── stripe.ts             # placeholder: throws PROVIDER_UNAVAILABLE
│   └── ui/            checkout-sheet.tsx · provider-button.tsx · payment-status.tsx
├── sharing/
│   ├── index.ts · contracts.ts
│   ├── domain/        public-payload.ts (whitelist) · slug.ts · share-text.ts · formats.ts (1080×1920, 1080×1080, 1080×1350, 1200×630)
│   ├── application/   create-or-reuse-card.ts · get-public-card.ts · render-image.tsx · telegram-message.ts · record-event.ts · revoke-card.ts
│   ├── infrastructure/ share-cards-repo.ts · share-events-repo.ts · fonts.ts (reads assets/fonts) · qr.ts (qrcode)
│   └── ui/            card-templates/story.tsx · card-templates/square.tsx · card-templates/telegram.tsx · card-templates/og.tsx · share-builder.tsx · share-actions.tsx
├── referrals/
│   ├── index.ts · contracts.ts
│   ├── domain/        code.ts · validity.ts (self-referral rules) · status.ts · rewards.ts (rule evaluation) · viral.ts (K inputs)
│   ├── application/   get-or-create-code.ts · record-visit.ts · attribute-visit.ts · on-status-events.ts · evaluate-rewards.ts · summary.ts
│   ├── infrastructure/ codes-repo.ts · referrals-repo.ts · rules-repo.ts · grants-repo.ts
│   └── ui/            referral-card.tsx · reward-progress.tsx
├── roadmaps/
│   ├── index.ts · contracts.ts
│   ├── domain/        planner/top-actions.ts · planner/do-not.ts · planner/plan-7-day.ts · planner/plan-30-day.ts · planner/why.ts · item-status.ts
│   ├── application/   plan-preview.ts · create-roadmap.ts · activate-roadmap.ts · get-roadmap.ts · set-item-status.ts · today-items.ts
│   ├── infrastructure/ actions-repo.ts · do-not-repo.ts · roadmaps-repo.ts · roadmap-items-repo.ts · action-results-repo.ts
│   └── ui/            roadmap-week.tsx · roadmap-item.tsx
├── growth/
│   ├── index.ts · contracts.ts
│   ├── domain/        home-view.ts · badges.ts (assessed vs verified) · retest.ts · history.ts
│   ├── application/   get-home.ts · accept-roadmap.ts · propose-roadmap-on-unlock.ts · get-history.ts · record-assessed.ts · record-verified.ts · personalize.ts
│   ├── infrastructure/ goals-repo.ts · user-skills-repo.ts · history-repo.ts
│   └── ui/            today-card.tsx · progress-ring.tsx · level-badges.tsx · retest-card.tsx · timeline.tsx
├── verification/
│   ├── index.ts · contracts.ts
│   ├── domain/        rubric.ts · attempt-state.ts · verified-level.ts
│   ├── application/   list-tasks.ts · start-attempt.ts · submit-attempt.ts · score-attempt.ts
│   ├── infrastructure/ tasks-repo.ts · attempts-repo.ts
│   └── ui/            task-brief.tsx · submission-form.tsx
├── evidence/
│   ├── index.ts · contracts.ts
│   ├── domain/        reliability.ts · benchmark-gate.ts (sample_size ≥ benchmark_min_sample)
│   ├── application/   get-sources.ts · get-resources.ts · get-benchmark.ts · upsert-benchmark.ts
│   └── infrastructure/ sources-repo.ts · claims-repo.ts · resources-repo.ts · benchmarks-repo.ts
├── analytics/
│   ├── index.ts · contracts.ts       # contracts.ts holds the event-name whitelist + per-event property schemas
│   ├── domain/        event-names.ts · property-schemas.ts · funnel.ts · metrics.ts
│   ├── application/   track.ts · ingest-client-events.ts · query-funnel.ts · query-metrics.ts
│   └── infrastructure/ events-repo.ts · metrics-sql.ts
├── experiments/
│   ├── index.ts · contracts.ts
│   ├── domain/        bucketing.ts (hash(key + user_id) → weighted variant) · targeting.ts
│   ├── application/   get-variant.ts · get-assignments.ts · manage-experiments.ts
│   └── infrastructure/ experiments-repo.ts · assignments-repo.ts
├── organizations/                    # post-launch (Gate 10k); folder created only when started
│   ├── index.ts · contracts.ts
│   ├── domain/        group-visibility.ts (min_group_size, consent)
│   ├── application/   create-organization.ts · join.ts · team-assessments.ts · team-aggregate.ts
│   └── infrastructure/ organizations-repo.ts · members-repo.ts · team-assessments-repo.ts
├── ai/
│   ├── index.ts · contracts.ts
│   ├── domain/        types.ts · budget.ts · cache-key.ts · output-guards.ts (no URLs, no new numbers)
│   ├── application/   generate.ts (gateway: budget → cache → provider → validate → ledger → fallback) · usage-summary.ts
│   └── infrastructure/ anthropic-provider.ts · null-provider.ts · ai-usage-repo.ts · ai-cache-repo.ts
├── notifications/                    # post-launch (02 §6: no reminders in MVP); folder created when started
│   ├── index.ts · contracts.ts
│   ├── domain/        quiet-hours.ts · dedupe.ts · templates.ts
│   ├── application/   enqueue.ts · dispatch-due.ts · cancel.ts
│   └── infrastructure/ notifications-repo.ts · telegram-sender.ts
└── admin/                            # owns no tables
    ├── index.ts · contracts.ts
    ├── domain/        flags.ts (question/funnel flag rules) · unit-economics.ts · wilson.ts (confidence intervals) · integrity.ts
    ├── application/   dashboard.ts · cohort-readout.ts · integrity-counters.ts · question-analytics.ts · unit-economics.ts · settings.ts · commands.ts (refund, unlock, experiment status)
    ├── infrastructure/ admin-views-repo.ts (reads admin_v_* views)
    └── ui/            funnel-chart.tsx · metric-tile.tsx · question-table.tsx · flags-list.tsx · settings-form.tsx
```

The `·` separators above list sibling files in one folder to keep the tree readable; each is its own file.

---

## 5. `content/` — seed content

```text
content/
├── README.md                         # authoring rules: real-only sources, no invented URLs/stats, Uzbek orthography, review checklist
├── categories.json                   # profession_categories (slug, name {uz,ru,en}, icon, sort, is_mvp)
├── reference/
│   ├── languages.json                # uz, ru, en (+ fallback_code)
│   ├── countries.json                # UZ first; default_currency, default_locale
│   └── currencies.json               # UZS (minor_units 2), XTR (0), USD (2)
├── levels/
│   └── default.json                  # 9 default levels: names, min_composite, requires_verification, colors
├── products/
│   ├── products.json                 # full_report, deep_report, growth_os_monthly, verification_attempt
│   ├── prices.json                   # full_report UZS 100000 minor; no XTR row seeded (02 D14: admin creates it)
│   └── provider-configs.json         # click/payme/telegram_stars per country: is_active, fees; no secrets (channel map: app_settings.payments.channel_providers)
├── referrals/
│   └── reward-rules.json             # MVP active: 3 completed → 1 retest (02 D21); other rules seeded inactive
├── experiments/
│   └── experiments.json              # draft experiments (status draft until Phase 7)
├── settings/
│   └── app-settings.json             # defaults inserted only if key absent (never overwrite runtime edits)
└── professions/
    ├── entrepreneur/
    │   ├── profession.json           # slug, category, name/description, status, is_regulated, disclaimer, config, specializations
    │   ├── skills.json               # 8–11 skills: importance, kind, global_skill_key, prerequisites edges, specialization weights
    │   ├── levels.json               # optional level renames + requirements for levels 2..9
    │   ├── assessment.json           # template slug/version + context questions
    │   ├── questions/
    │   │   ├── <skill-slug>.json     # items for one skill (≤ 20 items per file), target levels 2–8, 3 languages
    │   │   └── …
    │   ├── actions.json              # ≥ 3 actions per skill across phases
    │   ├── do-not.json               # do-not rules with conditions + reasons
    │   ├── resources.json            # verified, real resources only; [] is valid
    │   └── verification-tasks.json   # (P8)
    ├── software_developer/           # same files
    ├── sales_specialist/
    ├── marketing/
    ├── manager/
    ├── accountant/
    ├── designer/
    ├── career_readiness/
    ├── teacher/
    └── driving_instructor/
```

Seeding rules (**Decision**): `scripts/content/seed.ts` upserts by natural key (`slug`, `question_key`). A question whose
content hash changed gets a **new version row** (`version + 1`, `is_current = true`, old row `is_current = false`) if the
current row has answers; otherwise it is updated in place. Prices, provider configs and settings are insert-if-absent.
Every successful seed bumps `app_settings.content.version`.

---

## 6. `scripts/`

```text
scripts/
├── db/
│   ├── migrate.ts                    # apply supabase/migrations in order; tracks meta.schema_migrations; uses DATABASE_URL_DIRECT
│   ├── reset.ts                      # drop + recreate local DB (refuses unless APP_ENV is development or test)
│   ├── new-migration.ts              # creates supabase/migrations/<YYYYMMDDHHMMSS>_<module>_<change>.sql with RLS template
│   └── check-rls.ts                  # fails if any public table lacks RLS or policies file coverage
├── content/
│   ├── validate.ts                   # zod schemas + coverage matrix + translation completeness
│   ├── lint-uz.ts                    # forbids ASCII apostrophes where ʻ (U+02BB) / ʼ (U+02BC) are required
│   ├── seed.ts                       # idempotent upsert into DB (§5 rules)
│   ├── coverage-report.ts            # per profession: items per skill × target level, types mix
│   └── schemas.ts                    # zod schemas for content files (exported to JSON Schema for editors)
├── i18n/
│   ├── check-messages.ts             # active locales must have every key of en; placeholder parity
│   └── sync-locales.ts               # writes src/i18n/locales.generated.ts from message folders
├── arch/
│   ├── check-module-deps.ts          # entry-point rule, dependency map, cycle detection
│   └── check-file-size.ts            # limits for files ESLint does not cover (SQL, JSON content, messages)
├── api/
│   └── generate-openapi.ts           # zod contracts → openapi.json (CI fails on drift)
├── telegram/
│   └── set-webhook.ts                # setWebhook with secret_token for the current environment's bot
├── sim/
│   └── assessment-sim.ts             # synthetic respondents with known θ → recovery/length/SE report per profession
├── ops/
│   ├── funnel.sql                    # validation-milestone funnel query (usable before the admin dashboard)
│   └── reconcile-payments.ts         # compare provider statements (Payme GetStatement) with payments
└── load/
    └── answer-load.ts                # (P9) concurrent answer submissions against staging
```

---

## 7. `supabase/`

```text
supabase/
├── config.toml                                   # Supabase CLI local stack (optional; plain Postgres 16 also works)
└── migrations/                                   # forward-only; each table's RLS + policies live in the same file
    ├── <ts>_kernel_extensions.sql                # (P1) pgcrypto, citext, schema meta, set_updated_at() trigger fn
    ├── <ts>_kernel_tables.sql                    # (P1) app_settings, audit_logs, rate_limits
    ├── <ts>_catalog_reference.sql                # (P1) languages, countries, currencies (+ public read policies)
    ├── <ts>_identity.sql                         # (P1) users, profiles, auth_sessions (incl. device_hash)
    ├── <ts>_identity_link_tokens.sql             # (P8) link_tokens (web → Telegram linking, single use)
    ├── <ts>_catalog_taxonomy.sql                 # (P2) categories, professions, specializations, skills, weights, prerequisites, levels, level_requirements
    ├── <ts>_evidence.sql                         # (P2) sources, claims, evidence, learning_resources, benchmarks
    ├── <ts>_roadmaps_library.sql                 # (P2) actions, do_not_rules
    ├── <ts>_assessments.sql                      # (P3) templates, questions, options, sessions, answers
    ├── <ts>_results.sql                          # (P3) assessment_results, skill_scores, level_scores (RLS on, no client policy yet)
    ├── <ts>_results_feedback.sql                 # (P4) result_feedback (F22)
    ├── <ts>_analytics.sql                        # (P3) analytics_events
    ├── <ts>_experiments.sql                      # (P3) experiments, experiment_assignments
    ├── <ts>_ai.sql                               # (P4) ai_usage, ai_cache
    ├── <ts>_pricing.sql                          # (P5) products, prices
    ├── <ts>_payments.sql                         # (P5) provider configs, payments, provider_transactions, payment_events
    ├── <ts>_payments_access.sql                  # (P5) result_unlocks, entitlements, subscriptions + results "own AND unlocked" policies
    ├── <ts>_sharing.sql                          # (P6) share_cards, share_events
    ├── <ts>_referrals.sql                        # (P6) referral codes, referrals, rules, grants + FK users.referred_by_code_id
    ├── <ts>_admin_views.sql                      # (P7) admin_v_funnel_daily, admin_v_question_stats, admin_v_unit_economics
    ├── <ts>_growth.sql                           # (P8) goals, user_skills, skill_history, level_history
    ├── <ts>_roadmaps_persisted.sql               # (P8) roadmaps, roadmap_items, action_results
    ├── <ts>_verification.sql                     # (P8) verification_tasks, verification_attempts
    ├── <ts>_notifications.sql                    # (post-launch) notifications
    └── <ts>_organizations.sql                    # (post-launch) organizations, members, team_assessments, aggregate function
```

`<ts>` = `YYYYMMDDHHMMSS` at creation time (`scripts/db/new-migration.ts`). Migrations never edit an applied file; fixes
are new files. Destructive changes follow expand → migrate code → contract across two deploys.

---

## 8. `tests/`

```text
tests/
├── stubs/
│   └── server-only.ts                # empty module (vitest alias) so index.ts files load in Node tests
├── fixtures/
│   ├── builders/                     # makeUser(), makeProfession(), makeItemBank(), makeResult() …
│   ├── professions/                  # small synthetic profession (5 skills, 30 items) for engine tests
│   ├── respondents.ts                # simulated respondents with known θ per skill
│   └── telegram.ts                   # signs fake initData (incl. start_param) with a test bot token (same algorithm as production)
├── unit/                             # mirrors src paths; pure code only; no DB, no network
│   ├── lib/                          # localized-text, money, base32, init-data, csrf, canonical-json …
│   └── modules/
│       ├── scoring/                  # irt, eap-general, eap-skill, cat/*, levels, confidence, simulation.test.ts
│       ├── assessments/              # constraints, context prior, question DTO stripping
│       ├── results/                  # bottleneck, bands, next-level, teaser has no level, report golden files
│       ├── roadmaps/                 # planner (7-day respects time_per_day, 30-day phases)
│       ├── payments/                 # state machine, fees, provider sign/verify (Click MD5, Payme auth)
│       ├── referrals/                # validity rules, reward evaluation
│       ├── experiments/              # bucketing distribution + stickiness
│       └── ai/                       # budget guard, output guards, cache key
├── integration/                      # real Postgres 16; each Vitest worker gets its own database cloned from a migrated template
│   ├── setup/
│   │   ├── global-setup.ts           # create template DB, create roles anon/authenticated/service_role, auth schema + auth.uid(), run migrations
│   │   ├── worker-db.ts              # CREATE DATABASE level_test_<worker> TEMPLATE level_template; teardown
│   │   └── as-role.ts                # asAnon(), asUser(id) → SET LOCAL ROLE + request.jwt.claims
│   ├── migrations/                   # every table: RLS enabled, updated_at trigger, CHECK constraints present
│   ├── rls/                          # per table group: catalog public read, never-readable tables, own-row, results own AND unlocked
│   ├── modules/                      # application services against real DB (start/answer/finalize, mark-paid tx, merge, rewards)
│   └── api/                          # route handlers invoked with Request objects (auth modes, CSRF, rate limits, envelopes)
└── e2e/                              # Playwright (chromium only), next build + start, mock payments, AI_PROVIDER=null
    ├── web-assessment.spec.ts        # landing → profession → context → 12 questions → teaser
    ├── tma-assessment.spec.ts        # /tma with signed fake initData → test → teaser (Bearer path)
    ├── payment-mock.spec.ts          # teaser → pay (mock) → full report; double-click safety
    ├── share-referral.spec.ts        # share card → /s/slug OG tags → /r/CODE?c=slug → friend completes → referrer stats
    ├── linking-deletion.spec.ts      # (P8) web → Telegram link token, phone link, data deletion → /s/slug 410
    ├── i18n.spec.ts                  # uz/ru/en routing, fallbacks, U+02BB/U+02BC rendering
    ├── resilience.spec.ts            # offline/retry during answer, resume after reload
    └── admin.spec.ts                 # login, dashboard loads, settings edit audited
```

---

## 9. Package scripts

| Script | Command (summary) |
|--------|-------------------|
| `dev` / `build` / `start` | `next dev` / `next build` / `next start` |
| `typecheck` | `tsc --noEmit` |
| `lint` | `eslint . --max-warnings=0` |
| `check:arch` | `tsx scripts/arch/check-module-deps.ts && tsx scripts/arch/check-file-size.ts` |
| `i18n:check` / `i18n:sync` | message key parity / regenerate locales list |
| `content:validate` / `content:lint-uz` / `content:seed` / `content:coverage` | content pipeline |
| `db:migrate` / `db:reset` / `db:new` / `db:check-rls` | database |
| `test:unit` / `test:integration` / `test:e2e` / `test` | `vitest --project unit` / `vitest --project integration` / `playwright test` / all |
| `api:openapi` | generate `openapi.json` |
| `sim:assessment` | `tsx scripts/sim/assessment-sim.ts --profession <slug> --n 2000` |
| `telegram:set-webhook` | register bot webhook for current env |

---

## 10. File-size and structure rules

| Kind | Limit (enforced by) | If exceeded |
|------|---------------------|-------------|
| Any `src/**/*.ts(x)` | ≤ 300 lines excluding blanks/comments (ESLint `max-lines` error) — brief target "< 300" | Split by responsibility (one use case per file, one component per file) |
| Functions | ≤ 60 lines (`max-lines-per-function` error), cyclomatic complexity ≤ 12 | Extract pure helpers into `domain/` |
| React components | ≤ 200 lines (ESLint override for `*.tsx`) | Extract subcomponents into the same `ui/` folder |
| Route handlers (`route.ts`) | ≤ 80 lines | Move logic into a module application service |
| `index.ts` (module public API) | ≤ 120 lines, wiring only | Group exports by sub-area files |
| Domain files | one concept per file; no file named `utils.ts`, `helpers.ts`, `misc.ts` inside modules | Name the concept (`bottleneck.ts`) |
| Tests | ≤ 500 lines per file (ESLint override) | One file per unit under test |
| SQL migrations | ≤ 400 lines per file (`check-file-size.ts`) | Split per table group; RLS stays with its table |
| Content JSON | ≤ 1,000 lines per file; ≤ 20 questions per file | Split questions by skill, then by level band (`<skill>.l2-5.json`, `<skill>.l6-8.json`) |
| Message JSON | ≤ 400 lines per namespace file | New namespace |
| Generated files | exempt (`*.generated.ts`, `openapi.json`) | — |
| Docs | exempt | — |

Further rules:
1. **No barrel files** except each module's `index.ts` and `contracts.ts` (avoid hidden coupling and bundle bloat).
2. File names are kebab-case; React components export PascalCase names; tests are `<name>.test.ts`.
3. One exported use case per `application/*.ts` file, named after the verb (`start-session.ts` → `startSession`).
4. Repositories are named `<table-or-aggregate>-repo.ts` and contain SQL only.
5. Client components start with `'use client'` and never import a module's `index.ts`.
6. No new top-level folders without updating this document.
