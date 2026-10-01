import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Db, Sql, TransactionSql } from "@/lib/db/client";
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
  i18n,
  QUESTION_VERSIONS,
  uniqueCode,
  uniqueSlug,
  unlockResult,
  type CatalogFixture,
} from "./fixtures";

/**
 * Integrity of the assessment record: fulfilment rows survive cleanups, denormalized owners/professions stay tied to
 * their parent rows (and follow a merge), the scored result and its answers are an immutable audit record, the item
 * bank validates specializations and option counts, and referral attribution cannot be forged.
 */

const check = (constraint: string) => ({ code: "23514", constraint_name: constraint });
const FK_VIOLATION = { code: "23503" };

let sql: Sql;
let catalog: CatalogFixture;
let other: CatalogFixture;

beforeAll(async () => {
  sql = connectTestDb();
  catalog = await createCatalog(sql);
  other = await createCatalog(sql);
});

afterAll(async () => {
  await cleanupFixtures(sql);
  await sql.end();
});

interface ResultInput {
  sessionId: string;
  userId: string;
  professionId?: string;
  level?: number;
  levelId?: string;
  bottleneckSkillId?: string | null;
  questionVersions?: string;
}

function insertResult(db: Db, input: ResultInput) {
  const level = input.level ?? 3;
  return db<{ id: string }[]>`
    insert into public.assessment_results
      (session_id, user_id, profession_id, assessment_version, scoring_model_version, question_versions,
       composite_score, composite_se, theta, assessed_level, level_id, confidence, bottleneck_skill_id)
    values (${input.sessionId}, ${input.userId}, ${input.professionId ?? catalog.professionId}, 'test@1',
            'irt2pl-eap-hier-v1', ${input.questionVersions ?? QUESTION_VERSIONS}::text::jsonb, 40, 0.4, 0.3, ${level},
            ${input.levelId ?? catalog.levelIds[level]!}, 'medium', ${input.bottleneckSkillId ?? null})
    returning id`;
}

async function createCode(userId: string): Promise<string> {
  const [row] = await sql<{ id: string }[]>`
    insert into public.referral_codes (user_id, code) values (${userId}, ${uniqueCode(8)}) returning id`;
  return row!.id;
}

describe("fulfilment records survive cleanups", () => {
  it("refuses to delete a session whose result was paid and unlocked", async () => {
    const userId = await createUser(sql);
    const { resultId, sessionId } = await createResult(sql, { userId, catalog });
    const paymentId = await createPayment(sql, { userId, targetId: resultId, status: "paid" });
    await unlockResult(sql, { userId, resultId, paymentId });

    await expect(sql`delete from public.assessment_sessions where id = ${sessionId}`).rejects.toMatchObject(FK_VIOLATION);
    await expect(sql`delete from public.assessment_results where id = ${resultId}`).rejects.toMatchObject(FK_VIOLATION);
    const [left] = await sql<{ results: number; unlocks: number }[]>`
      select (select count(*)::int from public.assessment_results where id = ${resultId}) as results,
             (select count(*)::int from public.result_unlocks where result_id = ${resultId}) as unlocks`;
    expect(left).toEqual({ results: 1, unlocks: 1 });
  });

  it("refuses to delete a referral code that has referral history", async () => {
    const referrer = await createUser(sql);
    const referred = await createUser(sql);
    const codeId = await createCode(referrer);
    await sql`
      insert into public.referrals (referral_code_id, referrer_user_id, referred_user_id, status, started_at,
                                    completed_at, paid_at)
      values (${codeId}, ${referrer}, ${referred}, 'paid', now(), now(), now())`;
    await expect(sql`delete from public.referral_codes where id = ${codeId}`).rejects.toMatchObject(FK_VIOLATION);
  });
});

describe("denormalized owners and professions stay tied to their parent", () => {
  it("a result matches its session's owner and profession, and its level scheme", async () => {
    const owner = await createUser(sql);
    const stranger = await createUser(sql);
    const sessionId = await createSession(sql, { userId: owner, professionId: catalog.professionId, status: "completed" });

    await expect(insertResult(sql, { sessionId, userId: stranger })).rejects.toMatchObject(FK_VIOLATION);
    await expect(
      insertResult(sql, { sessionId, userId: owner, professionId: other.professionId, levelId: other.levelIds[3]! }),
    ).rejects.toMatchObject(check("assessment_results_match_session"));
    await expect(insertResult(sql, { sessionId, userId: owner, level: 4, levelId: catalog.levelIds[5]! })).rejects.toMatchObject(
      check("assessment_results_level_scheme"),
    );
    await expect(insertResult(sql, { sessionId, userId: owner, level: 3, levelId: other.levelIds[3]! })).rejects.toMatchObject(
      check("assessment_results_level_scheme"),
    );
    await expect(
      insertResult(sql, { sessionId, userId: owner, bottleneckSkillId: other.skillIds[0]! }),
    ).rejects.toMatchObject(FK_VIOLATION);
    await expect(
      insertResult(sql, { sessionId, userId: owner, bottleneckSkillId: catalog.skillIds[1]! }),
    ).resolves.toHaveLength(1);
  });

  it("falls back to the default level scheme only for numbers the profession does not override", async () => {
    const owner = await createUser(sql);
    const outcome = await sql
      .begin(async (tx) => {
        // Default-scheme rows belong to the content seed: create what is missing, then roll everything back.
        for (const number of [4, 6]) {
          await tx`
            insert into public.levels (profession_id, number, slug, name, min_composite)
            values (null, ${number}, ${`default_${number}`}, ${i18n(`Level ${number}`)}::text::jsonb, ${number * 10})
            on conflict do nothing`;
        }
        const defaults = await tx<{ id: string; number: number }[]>`
          select id, number from public.levels where profession_id is null and number in (4, 6)`;
        const idOf = (n: number) => defaults.find((d) => d.number === n)!.id;
        const s1 = await createSession(tx, { userId: owner, professionId: catalog.professionId, status: "completed" });
        const s2 = await createSession(tx, { userId: owner, professionId: catalog.professionId, status: "completed" });
        await insertResult(tx, { sessionId: s1, userId: owner, level: 6, levelId: idOf(6) }); // not overridden: ok
        const overriddenNumber = { sessionId: s2, userId: owner, level: 4, levelId: idOf(4) };
        const overridden = await tx
          .savepoint((sp: TransactionSql) => insertResult(sp, overriddenNumber))
          .then(() => null, (error: unknown) => error);
        throw Object.assign(new Error("rollback"), { overridden });
      })
      .catch((error: { overridden?: unknown }) => error.overridden);
    expect(outcome).toMatchObject(check("assessment_results_level_scheme"));
  });

  it("skill scores belong to the result's profession", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    await expect(sql`
      insert into public.skill_scores (result_id, skill_id, score) values (${resultId}, ${other.skillIds[0]!}, 50)`,
    ).rejects.toMatchObject(check("skill_scores_same_profession"));
  });

  it("unlocks and share cards belong to the result owner and follow a merge of the session", async () => {
    const anon = await createUser(sql);
    const stranger = await createUser(sql);
    const { resultId } = await createResult(sql, { userId: anon, catalog });
    await expect(unlockResult(sql, { userId: stranger, resultId })).rejects.toMatchObject(FK_VIOLATION);
    const card = (userId: string) => sql`
      insert into public.share_cards (user_id, result_id, slug) values (${userId}, ${resultId}, ${uniqueSlug("card")})`;
    await expect(card(stranger)).rejects.toMatchObject(FK_VIOLATION);

    await unlockResult(sql, { userId: anon, resultId });
    await card(anon);
    const target = await createUser(sql);
    await sql.begin(async (tx) => {
      await tx`update public.assessment_sessions set user_id = ${target} where user_id = ${anon}`;
      await tx`update public.users set merged_into_user_id = ${target} where id = ${anon}`;
    });
    const [owners] = await sql<{ result: string; unlock: string; card: string }[]>`
      select r.user_id as result,
             (select u.user_id from public.result_unlocks u where u.result_id = r.id) as unlock,
             (select c.user_id from public.share_cards c where c.result_id = r.id) as card
        from public.assessment_results r where r.id = ${resultId}`;
    expect(owners).toEqual({ result: target, unlock: target, card: target });
  });

  it("answers reference a question of the session's profession, at its recorded version", async () => {
    const userId = await createUser(sql);
    const sessionId = await createSession(sql, { userId, professionId: catalog.professionId });
    const foreign = await createQuestion(sql, { professionId: other.professionId, skillId: other.skillIds[0]! });
    await expect(createAnswer(sql, { sessionId, questionId: foreign.questionId, sequence: 1 })).rejects.toMatchObject(
      check("assessment_answers_same_profession"),
    );
    const own = await createQuestion(sql, { professionId: catalog.professionId, skillId: catalog.skillIds[0]! });
    await expect(sql`
      insert into public.assessment_answers (session_id, question_id, question_version, sequence)
      values (${sessionId}, ${own.questionId}, 7, 1)`).rejects.toMatchObject(FK_VIOLATION);
  });
});

describe("the scored result is an immutable audit record", () => {
  it("requires a non-empty question_versions array", async () => {
    const userId = await createUser(sql);
    for (const questionVersions of ["[]", "{}", JSON.stringify({ q: 1 })]) {
      const sessionId = await createSession(sql, { userId, professionId: catalog.professionId, status: "completed" });
      await expect(insertResult(sql, { sessionId, userId, questionVersions })).rejects.toMatchObject({ code: "23514" });
    }
  });

  it("freezes scoring, versions and level; report payloads stay writable", async () => {
    const userId = await createUser(sql);
    const { resultId } = await createResult(sql, { userId, catalog });
    const frozen = check("assessment_results_immutable");
    await expect(sql`update public.assessment_results set assessed_level = 5, level_id = ${catalog.levelIds[5]!}
                      where id = ${resultId}`).rejects.toMatchObject({ code: "23514" });
    await expect(sql`update public.assessment_results set scoring_model_version = 'hacked' where id = ${resultId}`)
      .rejects.toMatchObject(frozen);
    await expect(sql`update public.assessment_results set question_versions = ${QUESTION_VERSIONS}::text::jsonb || '[{}]'::jsonb
                      where id = ${resultId}`).rejects.toMatchObject(frozen);
    await expect(sql`update public.assessment_results set composite_score = 99 where id = ${resultId}`)
      .rejects.toMatchObject(frozen);
    await expect(sql`update public.skill_scores set score = 99 where result_id = ${resultId}`).rejects.toMatchObject(
      check("skill_scores_immutable"),
    );
    await expect(sql`update public.level_scores set met = false where result_id = ${resultId}`).rejects.toMatchObject(
      check("level_scores_immutable"),
    );
    await sql`update public.assessment_results set report = '{"schemaVersion": 2}'::jsonb,
                                                  ai_report = '{"narrative": "x"}'::jsonb where id = ${resultId}`;
  });

  it("freezes a completed session's answers", async () => {
    const userId = await createUser(sql);
    const sessionId = await createSession(sql, { userId, professionId: catalog.professionId });
    const q1 = await createQuestion(sql, { professionId: catalog.professionId, skillId: catalog.skillIds[0]! });
    const q2 = await createQuestion(sql, { professionId: catalog.professionId, skillId: catalog.skillIds[1]! });
    const answerId = await createAnswer(sql, { sessionId, questionId: q1.questionId, sequence: 1, credit: 0 });
    await sql`update public.assessment_answers set credit = 1 where id = ${answerId}`; // still in progress: ok
    await sql`update public.assessment_sessions set status = 'completed', completed_at = now() where id = ${sessionId}`;

    const frozen = check("assessment_answers_immutable_once_completed");
    await expect(sql`update public.assessment_answers set credit = 0 where id = ${answerId}`).rejects.toMatchObject(frozen);
    await expect(sql`delete from public.assessment_answers where id = ${answerId}`).rejects.toMatchObject(frozen);
    await expect(createAnswer(sql, { sessionId, questionId: q2.questionId, sequence: 2 })).rejects.toMatchObject(frozen);
  });
});

describe("item bank", () => {
  async function createSpecialization(professionId: string): Promise<string> {
    const [row] = await sql<{ id: string }[]>`
      insert into public.specializations (profession_id, slug, name)
      values (${professionId}, ${uniqueSlug("spec")}, ${i18n("Spec")}::text::jsonb)
      returning id`;
    return row!.id;
  }

  const insertQuestion = (opts: { status?: string; type?: string; specializationIds?: string[] }) => sql<{ id: string }[]>`
    insert into public.assessment_questions
      (question_key, profession_id, specialization_ids, skill_id, type, target_level, difficulty, prompt,
       scoring_rule, status)
    values (${`test.${uniqueSlug("q")}.01`}, ${catalog.professionId}, ${opts.specializationIds ?? []}::uuid[],
            ${catalog.skillIds[0]!}, ${opts.type ?? "knowledge"}, 4, -0.7, ${i18n("Prompt")}::text::jsonb,
            ${opts.type === "open" ? "open_ai" : "single_best"}, ${opts.status ?? "draft"})
    returning id`;

  /** One statement, so the option-count check sees all of them at once. */
  const addOptions = (questionId: string, keys: string[]) => sql`
    insert into public.question_options (question_id, option_key, label, score)
    select ${questionId}, k.key, jsonb_build_object('uz', k.key, 'ru', k.key, 'en', k.key), 0
      from unnest(${keys}::text[]) as k (key)`;

  it("accepts only specializations of the question's own profession", async () => {
    const own = await createSpecialization(catalog.professionId);
    const foreign = await createSpecialization(other.professionId);
    const invalid = check("assessment_questions_specializations_valid");
    await expect(insertQuestion({ specializationIds: [foreign] })).rejects.toMatchObject(invalid);
    await expect(insertQuestion({ specializationIds: [own, randomUUID()] })).rejects.toMatchObject(invalid);
    await expect(insertQuestion({ specializationIds: [own] })).resolves.toHaveLength(1);
  });

  it("an active closed-ended question has 2-5 options", async () => {
    const needsOptions = check("assessment_questions_active_requires_options");
    await expect(insertQuestion({ status: "active" })).rejects.toMatchObject(needsOptions);

    const [draft] = await insertQuestion({});
    await addOptions(draft!.id, ["a"]);
    await expect(sql`update public.assessment_questions set status = 'active' where id = ${draft!.id}`).rejects.toMatchObject(
      needsOptions,
    );
    await addOptions(draft!.id, ["b"]);
    await sql`update public.assessment_questions set status = 'active' where id = ${draft!.id}`;
    await expect(addOptions(draft!.id, ["c", "d", "e", "f"])).rejects.toMatchObject(needsOptions);
    await expect(sql`delete from public.question_options where question_id = ${draft!.id} and option_key = 'b'`)
      .rejects.toMatchObject(needsOptions);

    // Open (AI-scored) items have no options; a question and its options may be written in one transaction.
    await expect(insertQuestion({ status: "active", type: "open" })).resolves.toHaveLength(1);
    await sql.begin(async (tx) => {
      const [q] = await tx<{ id: string }[]>`
        insert into public.assessment_questions
          (question_key, profession_id, skill_id, type, target_level, difficulty, prompt, scoring_rule, status)
        values (${`test.${uniqueSlug("q")}.01`}, ${catalog.professionId}, ${catalog.skillIds[0]!}, 'knowledge', 4, -0.7,
                ${i18n("Prompt")}::text::jsonb, 'single_best', 'active')
        returning id`;
      await tx`insert into public.question_options (question_id, option_key, label, score) values
                 (${q!.id}, 'a', ${i18n("A")}::text::jsonb, 1), (${q!.id}, 'b', ${i18n("B")}::text::jsonb, 0)`;
    });
  });
});

describe("referral attribution", () => {
  it("the referrer owns the code (or absorbed its owner in a merge)", async () => {
    const owner = await createUser(sql);
    const impostor = await createUser(sql);
    const codeId = await createCode(owner);
    // The code owner as the referred user, with someone else as "referrer", would bypass referrals_not_self.
    await expect(sql`
      insert into public.referrals (referral_code_id, referrer_user_id, referred_user_id)
      values (${codeId}, ${impostor}, ${owner})`).rejects.toMatchObject(check("referrals_referrer_owns_code"));

    const anon = await createUser(sql);
    const survivor = await createUser(sql);
    const referred = await createUser(sql);
    const anonCode = await createCode(anon);
    await sql`update public.users set merged_into_user_id = ${survivor} where id = ${anon}`;
    await expect(sql`
      insert into public.referrals (referral_code_id, referrer_user_id, referred_user_id)
      values (${anonCode}, ${survivor}, ${referred})`).resolves.toBeDefined();
  });

  it("a user is never attributed to their own code", async () => {
    const userId = await createUser(sql);
    const codeId = await createCode(userId);
    await expect(sql`update public.users set referred_by_code_id = ${codeId} where id = ${userId}`).rejects.toMatchObject(
      check("users_referred_by_not_own_code"),
    );
  });

  it("status timestamps and validity flags are consistent", async () => {
    const referrer = await createUser(sql);
    const codeId = await createCode(referrer);
    const insert = async (status: string, extra: { paidAt?: Date | null; isValid?: boolean; reason?: string | null }) =>
      sql`
        insert into public.referrals (referral_code_id, referrer_user_id, referred_user_id, status, started_at,
                                      completed_at, paid_at, is_valid, invalid_reason)
        values (${codeId}, ${referrer}, ${await createUser(sql)}, ${status}, now(), now(), ${extra.paidAt ?? null},
                ${extra.isValid ?? true}, ${extra.reason ?? null})`;
    await expect(insert("paid", {})).rejects.toMatchObject(check("referrals_paid_at"));
    await expect(insert("completed", { isValid: true, reason: "other" })).rejects.toMatchObject(
      check("referrals_invalid_reason"),
    );
    await expect(insert("paid", { paidAt: new Date(), isValid: false, reason: "refunded" })).resolves.toBeDefined();
  });
});
