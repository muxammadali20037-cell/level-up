import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "@/lib/db/client";
import { connectTestDb } from "./fixtures";

/** Every table the migrations must create (content_embeddings is optional: only when pgvector is available). */
const EXPECTED_TABLES = [
  // identity
  "users", "profiles", "auth_sessions", "languages", "countries", "currencies",
  // catalog
  "profession_categories", "professions", "specializations", "skills", "specialization_skill_weights",
  "skill_prerequisites", "levels", "level_requirements",
  // assessments
  "assessment_templates", "assessment_questions", "question_options", "assessment_sessions", "assessment_answers",
  "assessment_results", "skill_scores", "level_scores", "result_feedback",
  // verification
  "verification_tasks", "verification_attempts",
  // payments
  "products", "prices", "payment_provider_configs", "payments", "provider_transactions", "payment_events",
  "result_unlocks", "entitlements", "subscriptions",
  // sharing & referrals
  "share_cards", "share_events", "referral_codes", "referrals", "referral_reward_rules", "referral_reward_grants",
  // growth
  "goals", "roadmaps", "roadmap_items", "actions", "action_results", "do_not_rules", "user_skills", "skill_history",
  "level_history",
  // evidence
  "sources", "claims", "evidence", "learning_resources", "benchmarks",
  // analytics & experiments
  "analytics_events", "experiments", "experiment_assignments",
  // orgs & ops
  "notifications", "organizations", "organization_members", "team_assessments", "audit_logs", "rate_limits",
  "ai_usage", "ai_cache", "app_settings",
].sort();

const OPTIONAL_TABLES = ["content_embeddings"];

let sql: Sql;

beforeAll(() => {
  sql = connectTestDb();
});

afterAll(async () => {
  await sql.end();
});

interface TableInfo {
  name: string;
  rls: boolean;
  comment: string | null;
}

async function publicTables(): Promise<TableInfo[]> {
  return sql<TableInfo[]>`
    select c.relname as name, c.relrowsecurity as rls, obj_description(c.oid, 'pg_class') as comment
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind in ('r', 'p')
     order by c.relname`;
}

describe("schema", () => {
  it("creates exactly the expected public tables", async () => {
    const names = (await publicTables()).map((t) => t.name).filter((n) => !OPTIONAL_TABLES.includes(n));
    expect(names).toEqual(EXPECTED_TABLES);
  });

  it("enables row level security on every public table", async () => {
    const withoutRls = (await publicTables()).filter((t) => !t.rls).map((t) => t.name);
    expect(withoutRls).toEqual([]);
  });

  it("documents every public table with a comment", async () => {
    const undocumented = (await publicTables()).filter((t) => !t.comment?.trim()).map((t) => t.name);
    expect(undocumented).toEqual([]);
  });

  it("maintains updated_at with a trigger on every table that has the column", async () => {
    const missing = await sql<{ table: string }[]>`
      select c.table_name as table
        from information_schema.columns c
       where c.table_schema = 'public' and c.column_name = 'updated_at'
         and not exists (
           select 1
             from pg_trigger t
             join pg_proc p on p.oid = t.tgfoid
            where t.tgrelid = format('public.%I', c.table_name)::regclass
              and p.proname = 'set_updated_at' and not t.tgisinternal
         )
       order by 1`;
    expect(missing.map((m) => m.table)).toEqual([]);
  });

  it("backs every foreign key with an index on its leading columns", async () => {
    const unindexed = await sql<{ fk: string }[]>`
      select c.conrelid::regclass::text || '.' || c.conname as fk
        from pg_constraint c
        join pg_namespace n on n.oid = c.connamespace
       where c.contype = 'f' and n.nspname = 'public'
         and not exists (
           select 1 from pg_index i
            where i.indrelid = c.conrelid
              and (i.indkey::int2[])[0:array_length(c.conkey, 1) - 1] @> c.conkey
              and (i.indkey::int2[])[0:array_length(c.conkey, 1) - 1] <@ c.conkey
         )
       order by 1`;
    expect(unindexed.map((u) => u.fk)).toEqual([]);
  });

  it("pins search_path on every function defined in public", async () => {
    const unpinned = await sql<{ fn: string }[]>`
      select p.oid::regprocedure::text as fn
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        left join pg_depend d on d.objid = p.oid and d.deptype = 'e'
       where n.nspname = 'public' and d.objid is null
         and not coalesce(p.proconfig::text[], '{}') && array['search_path=""', 'search_path=']
       order by 1`;
    expect(unpinned.map((u) => u.fn)).toEqual([]);
  });

  it("never lets anon execute SECURITY DEFINER functions", async () => {
    const exposed = await sql<{ fn: string }[]>`
      select p.oid::regprocedure::text as fn
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.prosecdef and has_function_privilege('anon', p.oid, 'execute')
       order by 1`;
    expect(exposed.map((e) => e.fn)).toEqual([]);
  });

  it("lets API roles execute only the RLS policy helpers and the team aggregate RPC", async () => {
    const executable = await sql<{ grant: string }[]>`
      select r.role || ':' || p.proname as grant
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
       cross join (values ('anon'), ('authenticated')) as r (role)
       where n.nspname = 'public'
         and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
         and has_function_privilege(r.role, p.oid, 'execute')
       order by 1`;
    expect(executable.map((e) => e.grant)).toEqual([
      "anon:current_user_id",
      "authenticated:current_user_id",
      "authenticated:is_org_admin",
      "authenticated:is_org_member",
      "authenticated:is_result_unlocked",
      "authenticated:team_assessment_aggregate",
    ]);
  });

  it("creates future functions without EXECUTE for PUBLIC/anon/authenticated (no accidental /rpc exposure)", async () => {
    const probe = await sql
      .begin(async (tx) => {
        await tx.unsafe(`
          create function public.zz_future_admin_probe() returns integer
          language sql security definer set search_path = '' as 'select 1'`);
        const [row] = await tx<{ anon: boolean; authenticated: boolean; serviceRole: boolean }[]>`
          select has_function_privilege('anon', 'public.zz_future_admin_probe()', 'execute') as anon,
                 has_function_privilege('authenticated', 'public.zz_future_admin_probe()', 'execute') as authenticated,
                 has_function_privilege('service_role', 'public.zz_future_admin_probe()', 'execute') as service_role`;
        throw Object.assign(new Error("rollback"), { row });
      })
      .catch((error: { row?: unknown }) => error.row);
    expect(probe).toEqual({ anon: false, authenticated: false, serviceRole: true });
  });

  it("keeps extensions out of the API schema when Supabase's extensions schema exists, and skips pgcrypto", async () => {
    const rows = await sql<{ extname: string; schema: string }[]>`
      select e.extname, n.nspname as schema
        from pg_extension e join pg_namespace n on n.oid = e.extnamespace
       order by 1`;
    const byName = Object.fromEntries(rows.map((r) => [r.extname, r.schema]));
    expect(byName).not.toHaveProperty("pgcrypto");
    const [ext] = await sql<{ exists: boolean }[]>`
      select exists (select 1 from pg_namespace where nspname = 'extensions') as exists`;
    if (ext!.exists) {
      for (const name of ["citext", "vector"]) if (byName[name]) expect(byName[name]).toBe("extensions");
    } else {
      expect(byName.citext).toBeDefined();
    }
  });

  it("grants API roles no write/TRUNCATE privileges except column-level profile updates", async () => {
    const writable = await sql<{ grant: string }[]>`
      select c.relname || ':' || r.role || ':' || p.privilege as grant
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
       cross join (values ('anon'), ('authenticated')) as r (role)
       cross join (values ('INSERT'), ('UPDATE'), ('DELETE'), ('TRUNCATE'), ('REFERENCES'), ('TRIGGER')) as p (privilege)
       where n.nspname = 'public' and c.relkind in ('r', 'p')
         and has_table_privilege(r.role, c.oid, p.privilege)
       order by 1`;
    expect(writable).toEqual([]);

    const profileColumns = await sql<{ column: string }[]>`
      select column_name as column
        from information_schema.columns
       where table_schema = 'public' and table_name = 'profiles'
         and has_column_privilege('authenticated', 'public.profiles', column_name, 'UPDATE')
       order by 1`;
    expect(profileColumns.map((c) => c.column)).toEqual(
      [
        "budget", "display_name", "first_name", "goal_type", "location", "marketing_opt_in", "notifications_opt_in",
        "show_name_on_share", "time_per_day_minutes", "timezone",
      ].sort(),
    );
  });
});

describe("reference data", () => {
  it("seeds languages with a fallback chain to English", async () => {
    const rows = await sql<{ code: string; nativeName: string; fallbackCode: string | null }[]>`
      select code, native_name, fallback_code from public.languages order by sort_order`;
    expect(rows).toEqual([
      { code: "uz", nativeName: "Oʻzbekcha", fallbackCode: "en" },
      { code: "ru", nativeName: "Русский", fallbackCode: "en" },
      { code: "en", nativeName: "English", fallbackCode: null },
    ]);
  });

  it("seeds currencies with minor units and Uzbekistan defaults", async () => {
    const currencies = await sql<{ code: string; minorUnits: number; symbol: string }[]>`
      select code, minor_units, symbol from public.currencies order by code`;
    expect(currencies).toEqual([
      { code: "KZT", minorUnits: 2, symbol: "₸" },
      { code: "RUB", minorUnits: 2, symbol: "₽" },
      { code: "USD", minorUnits: 2, symbol: "$" },
      { code: "UZS", minorUnits: 2, symbol: "soʻm" },
      { code: "XTR", minorUnits: 0, symbol: "⭐" },
    ]);
    const [uz] = await sql<{ defaultCurrency: string; defaultLocale: string }[]>`
      select default_currency, default_locale from public.countries where code = 'UZ'`;
    expect(uz).toEqual({ defaultCurrency: "UZS", defaultLocale: "uz" });
  });

  it("seeds products in three languages and server-side prices in minor units", async () => {
    const products = await sql<
      { slug: string; kind: string; entitlement: string; isActive: boolean; name: Record<string, string> }[]
    >`select slug, kind, entitlement, is_active, name from public.products order by sort_order`;
    // The MVP sells only the full report; the rest is configured but switched off until launched.
    expect(products.map((p) => [p.slug, p.kind, p.entitlement, p.isActive])).toEqual([
      ["full_report", "one_time", "result_unlock", true],
      ["deep_report", "one_time", "deep_analysis", false],
      ["growth_os_monthly", "subscription", "growth_os", false],
      ["verification_attempt", "one_time", "verification_attempt", false],
    ]);
    for (const p of products) expect(Object.keys(p.name).sort()).toEqual(["en", "ru", "uz"]);
    // Uzbek copy must use U+02BB/U+02BC, never an ASCII apostrophe.
    for (const p of products) expect(p.name.uz).not.toMatch(/['`’]/);

    const prices = await sql<{ slug: string; currency: string; amountMinor: number; isActive: boolean }[]>`
      select p.slug, pr.currency, pr.amount_minor, pr.is_active
        from public.prices pr join public.products p on p.id = pr.product_id
       order by p.sort_order, pr.currency`;
    expect(prices).toEqual([
      { slug: "full_report", currency: "UZS", amountMinor: 100000, isActive: true },
      { slug: "full_report", currency: "XTR", amountMinor: 5, isActive: false },
      { slug: "deep_report", currency: "UZS", amountMinor: 1490000, isActive: true },
      { slug: "growth_os_monthly", currency: "UZS", amountMinor: 2990000, isActive: true },
      { slug: "verification_attempt", currency: "UZS", amountMinor: 990000, isActive: true },
    ]);
  });

  it("seeds provider configs without invented fees, reward rules and app settings", async () => {
    const providers = await sql<
      { provider: string; channels: string[]; currencies: string[]; feePercent: number; settings: Record<string, unknown> }[]
    >`select provider, channels, currencies, fee_percent, settings from public.payment_provider_configs
       where country_code = 'UZ' order by provider`;
    expect(providers.map((p) => [p.provider, p.channels, p.currencies])).toEqual([
      ["click", ["web"], ["UZS"]],
      ["mock", ["web", "telegram"], ["UZS", "XTR"]],
      ["payme", ["web"], ["UZS"]],
      ["telegram_stars", ["telegram"], ["XTR"]],
    ]);
    for (const p of providers) {
      expect(p.feePercent).toBe(0);
      expect(p.settings).toEqual({ note: "set contracted fee" });
    }

    const rules = await sql<{ key: string; metric: string; threshold: number; entitlement: string; quantity: number }[]>`
      select key, metric, threshold, entitlement, quantity from public.referral_reward_rules order by key`;
    expect(rules).toEqual([
      { key: "three_completed_verification", metric: "completed", threshold: 3, entitlement: "verification_attempt", quantity: 1 },
      { key: "three_paid_deep_analysis", metric: "paid", threshold: 3, entitlement: "deep_analysis", quantity: 1 },
    ]);

    // value::text: the app's postgres.js camelCase transform also rewrites jsonb object keys on read.
    const settings = await sql<{ key: string; value: string }[]>`
      select key, value::text as value from public.app_settings order by key`;
    expect(Object.fromEntries(settings.map((s) => [s.key, JSON.parse(s.value) as unknown]))).toEqual({
      ai_monthly_budget_usd: null,
      benchmark_min_sample: 1000,
      benchmark_window_days: 90,
      default_retest_cooldown_days: 14,
      infra_cost_per_assessment_minor: { amount_minor: null, currency: "UZS" },
      share_base_url: null,
    });
  });
});
