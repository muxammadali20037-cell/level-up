import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "@/lib/db/client";
import {
  cleanupFixtures,
  connectTestDb,
  createAnswer,
  createCatalog,
  createPayment,
  createQuestion,
  createResult,
  createSession,
  createUser,
  getPrice,
  i18n,
  uniqueCode,
  uniqueSlug,
  unlockResult,
  type CatalogFixture,
} from "./fixtures";

const UNIQUE_VIOLATION = { code: "23505" };
const CHECK_VIOLATION = { code: "23514" };

let sql: Sql;
let catalog: CatalogFixture;

beforeAll(async () => {
  sql = connectTestDb();
  catalog = await createCatalog(sql);
});

afterAll(async () => {
  await cleanupFixtures(sql);
  await sql.end();
});

async function setStatus(paymentId: string, status: string): Promise<void> {
  await sql`update public.payments set status = ${status} where id = ${paymentId}`;
}

describe("payments", () => {
  it("allows only one PAID payment per (user, product, target)", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    const first = await createPayment(sql, { userId, targetId: resultId, provider: "click" });
    await setStatus(first, "paid");

    // A new open attempt is allowed (the first is no longer open) but it can never become a second PAID.
    const second = await createPayment(sql, { userId, targetId: resultId, provider: "click" });
    await expect(setStatus(second, "paid")).rejects.toMatchObject({
      ...UNIQUE_VIOLATION,
      constraint_name: "payments_one_paid_per_target",
    });
  });

  it("allows one OPEN payment per (user, product, target, provider) but other providers in parallel", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    await createPayment(sql, { userId, targetId: resultId, provider: "payme" });
    await expect(createPayment(sql, { userId, targetId: resultId, provider: "payme" })).rejects.toMatchObject({
      ...UNIQUE_VIOLATION,
      constraint_name: "payments_one_open_per_target_provider",
    });
    const pending = await createPayment(sql, { userId, targetId: resultId, provider: "click", status: "pending" });
    await expect(createPayment(sql, { userId, targetId: resultId, provider: "click" })).rejects.toMatchObject(
      UNIQUE_VIOLATION,
    );
    // Once the click attempt failed, a fresh click attempt is allowed again.
    await setStatus(pending, "failed");
    await expect(createPayment(sql, { userId, targetId: resultId, provider: "click" })).resolves.toBeTypeOf("string");
  });

  it("deduplicates by (user, idempotency_key) and by provider payment id", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    const idempotencyKey = `idem-${randomUUID()}`;
    await createPayment(sql, { userId, targetId: resultId, provider: "click", idempotencyKey });
    await expect(
      createPayment(sql, { userId, targetId: resultId, provider: "payme", idempotencyKey }),
    ).rejects.toMatchObject(UNIQUE_VIOLATION);

    const other = await createUser(sql);
    const { resultId: otherResult } = await createResult(sql, { userId: other, catalog });
    const a = await createPayment(sql, { userId, targetId: resultId, provider: "mock" });
    const b = await createPayment(sql, { userId: other, targetId: otherResult, provider: "mock" });
    await sql`update public.payments set provider_payment_id = 'prov-1-' || ${a} where id = ${a}`;
    await expect(
      sql`update public.payments set provider_payment_id = 'prov-1-' || ${a} where id = ${b}`,
    ).rejects.toMatchObject(UNIQUE_VIOLATION);
  });

  it("follows the legal status machine and stamps timestamps", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    const paymentId = await createPayment(sql, { userId, targetId: resultId });
    await setStatus(paymentId, "pending");
    await setStatus(paymentId, "pending"); // same-status update (duplicate webhook) is fine
    await setStatus(paymentId, "paid");
    await setStatus(paymentId, "refunded");
    const [row] = await sql<{ paidAt: Date | null; refundedAt: Date | null }[]>`
      select paid_at, refunded_at from public.payments where id = ${paymentId}`;
    expect(row?.paidAt).toBeInstanceOf(Date);
    expect(row?.refundedAt).toBeInstanceOf(Date);
    // refunded is terminal
    await expect(setStatus(paymentId, "paid")).rejects.toMatchObject(CHECK_VIOLATION);
  });

  it("rejects illegal transitions paid -> pending and failed -> paid", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    const paid = await createPayment(sql, { userId, targetId: resultId, provider: "click" });
    await setStatus(paid, "paid");
    await expect(setStatus(paid, "pending")).rejects.toMatchObject({
      ...CHECK_VIOLATION,
      message: expect.stringMatching(/illegal payment status transition paid -> pending/),
    });

    const failed = await createPayment(sql, { userId, targetId: resultId, provider: "payme" });
    await setStatus(failed, "failed");
    await expect(setStatus(failed, "paid")).rejects.toMatchObject({
      ...CHECK_VIOLATION,
      message: expect.stringMatching(/failed -> paid/),
    });
    await expect(setStatus(failed, "pending")).rejects.toMatchObject(CHECK_VIOLATION);
  });

  it("never accepts an amount that differs from the server price, and freezes the amount", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    await expect(createPayment(sql, { userId, targetId: resultId, amountMinor: 1 })).rejects.toMatchObject(
      CHECK_VIOLATION,
    );
    const paymentId = await createPayment(sql, { userId, targetId: resultId });
    await expect(
      sql`update public.payments set amount_minor = amount_minor - 1 where id = ${paymentId}`,
    ).rejects.toMatchObject(CHECK_VIOLATION);
  });

  it("stores each provider event once (replay-safe)", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    const paymentId = await createPayment(sql, { userId, targetId: resultId, provider: "click" });
    const eventId = `evt-${randomUUID()}`;
    const insert = (eventType: string) => sql`
      insert into public.payment_events (payment_id, provider, event_type, provider_event_id, payload, signature_valid)
      values (${paymentId}, 'click', ${eventType}, ${eventId}, '{}'::jsonb, true)`;
    await insert("complete");
    await expect(insert("complete")).rejects.toMatchObject(UNIQUE_VIOLATION);
    await expect(insert("prepare")).resolves.toBeDefined();
  });

  it("deduplicates provider transactions", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    const paymentId = await createPayment(sql, { userId, targetId: resultId, provider: "payme" });
    const txnId = `txn-${randomUUID()}`;
    const insert = () => sql`
      insert into public.provider_transactions (payment_id, provider, provider_txn_id, state, amount_minor, create_time)
      values (${paymentId}, 'payme', ${txnId}, 1, 100000, 1759300000000)`;
    await insert();
    await expect(insert()).rejects.toMatchObject(UNIQUE_VIOLATION);
  });

  it("rejects secrets in provider settings", async () => {
    await expect(sql`
      insert into public.payment_provider_configs (provider, country_code, settings)
      values ('stripe', 'US', '{"secret_key": "sk_live_x"}'::jsonb)`).rejects.toMatchObject(CHECK_VIOLATION);
  });
});

describe("unlocks", () => {
  it("unlocks a result at most once per unlock type", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    const paymentId = await createPayment(sql, { userId, targetId: resultId });
    await setStatus(paymentId, "paid");
    await unlockResult(sql, { userId, resultId, paymentId });
    await expect(unlockResult(sql, { userId, resultId, paymentId })).rejects.toMatchObject({
      ...UNIQUE_VIOLATION,
      constraint_name: "result_unlocks_result_id_unlock_type_key",
    });
    await expect(unlockResult(sql, { userId, resultId, unlockType: "deep" })).resolves.toBeTypeOf("string");
  });

  it("requires a payment reference for payment-sourced unlocks", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    await expect(sql`
      insert into public.result_unlocks (user_id, result_id, unlock_type, source)
      values (${userId}, ${resultId}, 'full', 'payment')`).rejects.toMatchObject(CHECK_VIOLATION);
  });
});

describe("referrals", () => {
  async function createCode(userId: string): Promise<string> {
    const [row] = await sql<{ id: string }[]>`
      insert into public.referral_codes (user_id, code) values (${userId}, ${uniqueCode(8)}) returning id`;
    return row!.id;
  }

  it("rejects self-referrals", async () => {
    const userId = await createUser(sql);
    const codeId = await createCode(userId);
    await expect(sql`
      insert into public.referrals (referral_code_id, referrer_user_id, referred_user_id)
      values (${codeId}, ${userId}, ${userId})`).rejects.toMatchObject({
      ...CHECK_VIOLATION,
      constraint_name: "referrals_not_self",
    });
  });

  it("attributes a referred user only once and validates code format", async () => {
    const referrer = await createUser(sql);
    const other = await createUser(sql);
    const referred = await createUser(sql);
    const codeId = await createCode(referrer);
    const otherCodeId = await createCode(other);
    await sql`
      insert into public.referrals (referral_code_id, referrer_user_id, referred_user_id)
      values (${codeId}, ${referrer}, ${referred})`;
    await expect(sql`
      insert into public.referrals (referral_code_id, referrer_user_id, referred_user_id)
      values (${otherCodeId}, ${other}, ${referred})`).rejects.toMatchObject(UNIQUE_VIOLATION);

    const lowercase = await createUser(sql);
    await expect(
      sql`insert into public.referral_codes (user_id, code) values (${lowercase}, 'abc123')`,
    ).rejects.toMatchObject(CHECK_VIOLATION);
    // one code per user
    await expect(sql`insert into public.referral_codes (user_id, code) values (${referrer}, ${uniqueCode(8)})`)
      .rejects.toMatchObject(UNIQUE_VIOLATION);
  });

  it("grants each reward rule at most once per user", async () => {
    const userId = await createUser(sql);
    const [rule] = await sql<{ id: string }[]>`
      select id from public.referral_reward_rules where key = 'three_paid_deep_analysis'`;
    await sql`insert into public.referral_reward_grants (user_id, rule_id) values (${userId}, ${rule!.id})`;
    await expect(
      sql`insert into public.referral_reward_grants (user_id, rule_id) values (${userId}, ${rule!.id})`,
    ).rejects.toMatchObject(UNIQUE_VIOLATION);
  });
});

describe("assessment item immutability", () => {
  it("blocks content edits of answered questions but allows lifecycle changes", async () => {
    const userId = await createUser(sql);
    const { questionId, questionKey } = await createQuestion(sql, {
      professionId: catalog.professionId,
      skillId: catalog.skillIds[0]!,
    });

    // Before any answer the row is still editable.
    await sql`update public.assessment_questions set prompt = ${i18n("Edited before use")}::text::jsonb where id = ${questionId}`;
    await sql`update public.question_options set score = 0.5 where question_id = ${questionId} and option_key = 'b'`;

    const sessionId = await createSession(sql, { userId, professionId: catalog.professionId });
    await createAnswer(sql, { sessionId, questionId, sequence: 1 });

    await expect(
      sql`update public.assessment_questions set prompt = ${i18n("Edited after use")}::text::jsonb where id = ${questionId}`,
    ).rejects.toMatchObject({ ...CHECK_VIOLATION, message: expect.stringMatching(/immutable/) });
    await expect(
      sql`update public.assessment_questions set difficulty = 1.4 where id = ${questionId}`,
    ).rejects.toMatchObject(CHECK_VIOLATION);
    await expect(
      sql`update public.question_options set score = 1 where question_id = ${questionId} and option_key = 'b'`,
    ).rejects.toMatchObject(CHECK_VIOLATION);
    await expect(
      sql`insert into public.question_options (question_id, option_key, label, score)
          values (${questionId}, 'c', ${i18n("Option C")}::text::jsonb, 0)`,
    ).rejects.toMatchObject(CHECK_VIOLATION);
    await expect(
      sql`delete from public.question_options where question_id = ${questionId} and option_key = 'b'`,
    ).rejects.toMatchObject(CHECK_VIOLATION);
    // Blocked either by the answers FK (23503) or by the options guard firing first via ON DELETE CASCADE (23514).
    await expect(sql`delete from public.assessment_questions where id = ${questionId}`).rejects.toMatchObject({
      code: expect.stringMatching(/^23(503|514)$/),
    });

    // Lifecycle columns stay editable; a new version takes over as current.
    await sql`update public.assessment_questions set status = 'retired', is_current = false where id = ${questionId}`;
    const next = await createQuestion(sql, {
      professionId: catalog.professionId,
      skillId: catalog.skillIds[0]!,
      key: questionKey,
      version: 2,
    });
    expect(next.questionId).not.toBe(questionId);
  });

  it("keeps exactly one current version per question_key", async () => {
    const { questionKey } = await createQuestion(sql, {
      professionId: catalog.professionId,
      skillId: catalog.skillIds[1]!,
    });
    await expect(
      createQuestion(sql, { professionId: catalog.professionId, skillId: catalog.skillIds[1]!, key: questionKey, version: 2 }),
    ).rejects.toMatchObject({ ...UNIQUE_VIOLATION, constraint_name: "assessment_questions_one_current_key" });
    await expect(
      createQuestion(sql, { professionId: catalog.professionId, skillId: catalog.skillIds[1]!, key: questionKey, version: 1, isCurrent: false }),
    ).rejects.toMatchObject(UNIQUE_VIOLATION);
  });

  it("cannot activate a question (or add options to an active one) without uz/ru/en text", async () => {
    const draftKey = `test.${uniqueSlug("q")}.02`;
    const insertQuestion = (status: string, prompt: string) => sql<{ id: string }[]>`
      insert into public.assessment_questions
        (question_key, profession_id, skill_id, type, target_level, difficulty, prompt, scoring_rule, status)
      values (${draftKey}, ${catalog.professionId}, ${catalog.skillIds[0]!}, 'knowledge', 4, -0.7, ${prompt}::text::jsonb,
              'single_best', ${status})
      returning id`;
    const englishOnly = JSON.stringify({ en: "Only English so far" });
    await expect(insertQuestion("active", englishOnly)).rejects.toMatchObject({
      ...CHECK_VIOLATION,
      constraint_name: "assessment_questions_active_requires_locales",
    });

    // Drafts may be partially translated; activation is blocked until prompt and every option label are complete.
    const [draftQuestion] = await insertQuestion("draft", i18n("Complete prompt"));
    await sql`
      insert into public.question_options (question_id, option_key, label, score)
      values (${draftQuestion!.id}, 'a', ${englishOnly}::text::jsonb, 1),
             (${draftQuestion!.id}, 'b', ${i18n("Option B")}::text::jsonb, 0)`;
    await expect(
      sql`update public.assessment_questions set status = 'active' where id = ${draftQuestion!.id}`,
    ).rejects.toMatchObject(CHECK_VIOLATION);
    await sql`update public.question_options set label = ${i18n("Option A")}::text::jsonb
               where question_id = ${draftQuestion!.id}`;
    await sql`update public.assessment_questions set status = 'active' where id = ${draftQuestion!.id}`;
    await expect(sql`
      insert into public.question_options (question_id, option_key, label, score)
      values (${draftQuestion!.id}, 'c', ${englishOnly}::text::jsonb, 0)`).rejects.toMatchObject({
      ...CHECK_VIOLATION,
      constraint_name: "question_options_active_requires_locales",
    });
  });

  it("rejects a question whose skill belongs to another profession", async () => {
    const other = await createCatalog(sql);
    await expect(
      createQuestion(sql, { professionId: catalog.professionId, skillId: other.skillIds[0]! }),
    ).rejects.toMatchObject({ code: "23503" });
  });
});

describe("skill graph", () => {
  const insertEdge = (to: string, from: string) => sql`
    insert into public.skill_prerequisites (skill_id, depends_on_skill_id, relation, strength, rationale)
    values (${to}, ${from}, 'limits', 0.7, ${i18n("Weak processes cap strong sales")}::text::jsonb)`;

  it("accepts edges inside one profession and rejects self-edges", async () => {
    const [a, b] = catalog.skillIds;
    await expect(insertEdge(a!, b!)).resolves.toBeDefined();
    await expect(insertEdge(a!, a!)).rejects.toMatchObject({
      ...CHECK_VIOLATION,
      constraint_name: "skill_prerequisites_not_self",
    });
  });

  it("rejects edges between skills of different professions", async () => {
    const other = await createCatalog(sql);
    await expect(insertEdge(catalog.skillIds[0]!, other.skillIds[0]!)).rejects.toMatchObject({
      ...CHECK_VIOLATION,
      constraint_name: "skill_prerequisites_same_profession",
    });
    const [edgeTo, edgeFrom] = [catalog.skillIds[1]!, catalog.skillIds[2]!];
    await insertEdge(edgeTo, edgeFrom);
    await expect(
      sql`update public.skill_prerequisites set depends_on_skill_id = ${other.skillIds[1]!}
           where skill_id = ${edgeTo} and depends_on_skill_id = ${edgeFrom}`,
    ).rejects.toMatchObject(CHECK_VIOLATION);
  });

  it("keeps one default level per number but allows per-profession overrides", async () => {
    // Runs in a rolled-back transaction: the default scheme belongs to the content seed, not to this test.
    const outcome = await sql
      .begin(async (tx) => {
        const insertDefault = () => tx`
          insert into public.levels (profession_id, number, slug, name, min_composite)
          values (null, 9, 'master', ${i18n("Master")}::text::jsonb, 85)`;
        const [existing] = await tx<{ n: number }[]>`
          select count(*)::int as n from public.levels where profession_id is null and number = 9`;
        if (existing!.n === 0) await insertDefault();
        const duplicate = await tx.savepoint(() => insertDefault()).then(
          () => null,
          (error: unknown) => error,
        );
        throw Object.assign(new Error("rollback"), { duplicate });
      })
      .catch((error: { duplicate?: unknown }) => error.duplicate);
    expect(outcome).toMatchObject({ ...UNIQUE_VIOLATION, constraint_name: "levels_default_number_key" });

    await expect(sql`
      insert into public.levels (profession_id, number, slug, name, min_composite)
      values (${catalog.professionId}, 1, 'starter', ${i18n("Starter")}::text::jsonb, 0)`).rejects.toMatchObject({
      ...UNIQUE_VIOLATION,
      constraint_name: "levels_profession_number_key",
    });
  });
});

describe("i18n jsonb checks", () => {
  const insertCategory = (name: string) => sql`
    insert into public.profession_categories (slug, name) values (${uniqueSlug("cat")}, ${name}::text::jsonb)`;

  it("accepts locale -> string objects", async () => {
    const slug = uniqueSlug("cat");
    await sql`
      insert into public.profession_categories (slug, name)
      values (${slug}, ${JSON.stringify({ uz: "Biznes", ru: "Бизнес", en: "Business", "uz-Cyrl": "Бизнес" })}::text::jsonb)`;
    await sql`delete from public.profession_categories where slug = ${slug}`;
  });

  it.each([
    ["a JSON string", JSON.stringify("Business")],
    ["an array", JSON.stringify(["Business"])],
    ["a number value", JSON.stringify({ uz: 1 })],
    ["a nested object", JSON.stringify({ uz: { text: "Biznes" } })],
    ["a null value", JSON.stringify({ uz: null })],
    ["a non-locale key", JSON.stringify({ "Not A Locale": "x" })],
    ["an empty object for a required name", JSON.stringify({})],
    ["only blank translations", JSON.stringify({ uz: "  " })],
  ])("rejects %s", async (_label, value) => {
    await expect(insertCategory(value)).rejects.toMatchObject(CHECK_VIOLATION);
  });

  it("exposes is_i18n semantics directly", async () => {
    const [row] = await sql<{ ok: boolean; empty: boolean; bad: boolean; nul: boolean | null }[]>`
      select public.is_i18n('{"uz": "a", "en": "b"}') as ok,
             public.is_i18n('{}') as empty,
             public.is_i18n('{"uz": ["a"]}') as bad,
             public.is_i18n(null) as nul`;
    expect(row).toEqual({ ok: true, empty: true, bad: false, nul: null });
  });
});

describe("ops", () => {
  it("rate_limit_hit counts atomically within a fixed window", async () => {
    const key = `test:${randomUUID()}`;
    const hits: { allowed: boolean; current: number }[] = [];
    for (let i = 0; i < 3; i++) {
      const [row] = await sql<{ allowed: boolean; current: number }[]>`
        select * from public.rate_limit_hit(${key}, 3600, 2)`;
      hits.push(row!);
    }
    expect(hits).toEqual([
      { allowed: true, current: 1 },
      { allowed: true, current: 2 },
      { allowed: false, current: 3 },
    ]);
    await sql`delete from public.rate_limits where key = ${key}`;
  });

  it("keeps audit logs append-only but lets user deletion anonymize the actor", async () => {
    const userId = await createUser(sql);
    const [log] = await sql<{ id: string }[]>`
      insert into public.audit_logs (actor_user_id, actor_type, action, entity_type, entity_id, after)
      values (${userId}, 'admin', 'price.update', 'prices', 'x', '{"amount_minor": 1}'::jsonb)
      returning id`;
    const appendOnly = { ...CHECK_VIOLATION, constraint_name: "audit_logs_append_only" };
    await expect(sql`update public.audit_logs set action = 'tampered' where id = ${log!.id}`).rejects.toMatchObject(
      appendOnly,
    );
    // The actor may only be anonymized by the user's deletion, not while the user still exists.
    await expect(
      sql`update public.audit_logs set actor_user_id = null where id = ${log!.id}`,
    ).rejects.toMatchObject(appendOnly);
    await expect(sql`delete from public.audit_logs where id = ${log!.id}`).rejects.toMatchObject(appendOnly);
    await expect(sql`truncate public.audit_logs`).rejects.toMatchObject(appendOnly);

    await sql`delete from public.users where id = ${userId}`;
    const [after] = await sql<{ actorUserId: string | null }[]>`
      select actor_user_id from public.audit_logs where id = ${log!.id}`;
    expect(after?.actorUserId).toBeNull();

    // Retention jobs purge explicitly, inside a transaction that opts in.
    await sql.begin(async (tx) => {
      await tx`select set_config('level.allow_audit_purge', 'on', true)`;
      await tx`delete from public.audit_logs where id = ${log!.id}`;
    });
    const [left] = await sql<{ n: number }[]>`select count(*)::int as n from public.audit_logs where id = ${log!.id}`;
    expect(left!.n).toBe(0);
  });

  it("protects financial records from user hard-deletes", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    await createPayment(sql, { userId, targetId: resultId });
    await expect(sql`delete from public.users where id = ${userId}`).rejects.toMatchObject({ code: "23503" });
  });

  it("resolves the seeded UZS full_report price", async () => {
    const price = await getPrice(sql, "full_report");
    expect(price).toMatchObject({ amountMinor: 100000, currency: "UZS" });
  });
});
