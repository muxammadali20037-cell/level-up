import { randomUUID } from "node:crypto";
import { createSql, withTransaction, type Db, type Sql } from "@/lib/db/client";
import { TEST_DATABASE_URL } from "../../helpers/test-db-url";

/**
 * Small, explicit fixture builders for schema/RLS integration tests. They use the privileged connection (table
 * owner, bypasses RLS) exactly like the application server does. Every builder generates unique slugs/keys, so
 * tests never depend on each other or on execution order.
 */

export function connectTestDb(): Sql {
  return createSql(TEST_DATABASE_URL, { max: 3 });
}

/**
 * Everything the builders create is tracked (per test file: vitest isolates modules) so `cleanupFixtures` can remove
 * it in afterAll and later test files only ever see the seed + their own fixtures.
 */
const created = { users: new Set<string>(), categories: new Set<string>(), professions: new Set<string>() };

export async function cleanupFixtures(db: Db): Promise<void> {
  const users = [...created.users];
  const professions = [...created.professions];
  const categories = [...created.categories];
  // One transaction: a PAID payment's unlock may only disappear together with the payment (checked at commit), and
  // audit rows can only be purged with level.allow_audit_purge set for the transaction.
  await withTransaction(db, async (tx) => {
    await tx`select set_config('level.allow_audit_purge', 'on', true)`;
    if (users.length) {
      // Financial rows are protected (ON DELETE RESTRICT) from user deletes, so remove them explicitly first.
      await tx`delete from public.result_unlocks where user_id = any(${users}::uuid[])
                 or payment_id in (select id from public.payments where user_id = any(${users}::uuid[]))`;
      await tx`delete from public.entitlements where user_id = any(${users}::uuid[])
                 or payment_id in (select id from public.payments where user_id = any(${users}::uuid[]))`;
      await tx`delete from public.payment_events where payment_id in (select id from public.payments where user_id = any(${users}::uuid[]))`;
      await tx`delete from public.provider_transactions where payment_id in (select id from public.payments where user_id = any(${users}::uuid[]))`;
      await tx`delete from public.payments where user_id = any(${users}::uuid[])`;
      await tx`delete from public.organizations where owner_user_id = any(${users}::uuid[])`;
      await tx`delete from public.analytics_events where user_id = any(${users}::uuid[])`;
      await tx`delete from public.audit_logs where actor_user_id = any(${users}::uuid[])`;
      await tx`delete from public.users where id = any(${users}::uuid[])`;
    }
    if (professions.length) await tx`delete from public.professions where id = any(${professions}::uuid[])`;
    if (categories.length) await tx`delete from public.profession_categories where id = any(${categories}::uuid[])`;
  });
  created.users.clear();
  created.professions.clear();
  created.categories.clear();
}

export function uniqueSlug(prefix = "t"): string {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

/** Referral/invite-code style token: ^[A-Z2-9]{n}$ */
export function uniqueCode(length = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export const i18n = (text: string): string => JSON.stringify({ uz: text, ru: text, en: text });

export async function createUser(
  db: Db,
  opts: { role?: "user" | "admin"; telegramUserId?: number; displayName?: string } = {},
): Promise<string> {
  const [user] = await db<{ id: string }[]>`
    insert into public.users (is_anonymous, role, telegram_user_id)
    values (${opts.telegramUserId == null}, ${opts.role ?? "user"}, ${opts.telegramUserId ?? null})
    returning id`;
  created.users.add(user!.id);
  await db`insert into public.profiles (user_id, display_name) values (${user!.id}, ${opts.displayName ?? null})`;
  return user!.id;
}

export interface CatalogFixture {
  categoryId: string;
  professionId: string;
  professionSlug: string;
  skillIds: string[];
  levelIds: Record<number, string>;
}

/** Category + profession + N skills + a profession-specific level scheme (levels 1..5). */
export async function createCatalog(
  db: Db,
  opts: { status?: "draft" | "active" | "archived"; skills?: number } = {},
): Promise<CatalogFixture> {
  const [category] = await db<{ id: string }[]>`
    insert into public.profession_categories (slug, name, is_active, is_mvp)
    values (${uniqueSlug("cat")}, ${i18n("Category")}::text::jsonb, true, false)
    returning id`;
  created.categories.add(category!.id);
  const professionSlug = uniqueSlug("prof");
  const [profession] = await db<{ id: string }[]>`
    insert into public.professions (category_id, slug, name, status)
    values (${category!.id}, ${professionSlug}, ${i18n("Profession")}::text::jsonb, ${opts.status ?? "active"})
    returning id`;
  created.professions.add(profession!.id);
  const skillIds: string[] = [];
  const skillCount = opts.skills ?? 3;
  for (let i = 0; i < skillCount; i++) {
    const [skill] = await db<{ id: string }[]>`
      insert into public.skills (profession_id, slug, name, kind, importance, sort_order)
      values (${profession!.id}, ${uniqueSlug("skill")}, ${i18n(`Skill ${i + 1}`)}::text::jsonb, 'hard', 0.3, ${i})
      returning id`;
    skillIds.push(skill!.id);
  }
  const levelIds: Record<number, string> = {};
  for (let n = 1; n <= 5; n++) {
    const [level] = await db<{ id: string }[]>`
      insert into public.levels (profession_id, number, slug, name, min_composite)
      values (${profession!.id}, ${n}, ${`level_${n}`}, ${i18n(`Level ${n}`)}::text::jsonb, ${(n - 1) * 15})
      returning id`;
    levelIds[n] = level!.id;
  }
  return { categoryId: category!.id, professionId: profession!.id, professionSlug, skillIds, levelIds };
}

/** Active knowledge question with two options (written as a draft first: an active item needs 2-5 options). */
export async function createQuestion(
  db: Db,
  opts: { professionId: string; skillId: string; key?: string; version?: number; isCurrent?: boolean },
): Promise<{ questionId: string; questionKey: string }> {
  const questionKey = opts.key ?? `test.${uniqueSlug("q")}.01`;
  const [question] = await db<{ id: string }[]>`
    insert into public.assessment_questions
      (question_key, version, is_current, profession_id, skill_id, type, target_level, difficulty, guessing,
       prompt, scoring_rule, status)
    values (${questionKey}, ${opts.version ?? 1}, ${opts.isCurrent ?? true}, ${opts.professionId}, ${opts.skillId},
            'knowledge', 5, 0, 0.5, ${i18n("Which option is best?")}::text::jsonb, 'single_best', 'draft')
    returning id`;
  await db`
    insert into public.question_options (question_id, option_key, label, score, sort_order) values
      (${question!.id}, 'a', ${i18n("Option A")}::text::jsonb, 1, 0),
      (${question!.id}, 'b', ${i18n("Option B")}::text::jsonb, 0, 1)`;
  await db`update public.assessment_questions set status = 'active' where id = ${question!.id}`;
  return { questionId: question!.id, questionKey };
}

export async function createSession(
  db: Db,
  opts: { userId: string; professionId: string; status?: "in_progress" | "completed"; teamAssessmentId?: string },
): Promise<string> {
  const status = opts.status ?? "in_progress";
  const [session] = await db<{ id: string }[]>`
    insert into public.assessment_sessions (user_id, profession_id, status, completed_at, team_assessment_id)
    values (${opts.userId}, ${opts.professionId}, ${status}, ${status === "completed" ? new Date() : null},
            ${opts.teamAssessmentId ?? null})
    returning id`;
  return session!.id;
}

export async function createAnswer(
  db: Db,
  opts: { sessionId: string; questionId: string; sequence: number; credit?: number },
): Promise<string> {
  const [answer] = await db<{ id: string }[]>`
    insert into public.assessment_answers (session_id, question_id, question_version, sequence, selected_option_keys,
                                           credit, answered_at, response_ms)
    values (${opts.sessionId}, ${opts.questionId}, 1, ${opts.sequence}, ${["a"]}::text[], ${opts.credit ?? 1},
            now(), 4200)
    returning id`;
  return answer!.id;
}

export const QUESTION_VERSIONS = JSON.stringify([{ question_key: "test.fixture.01", version: 1 }]);

/** Completed session + result + one skill score per skill + a level score row. */
export async function createResult(
  db: Db,
  opts: {
    userId: string;
    catalog: CatalogFixture;
    composite?: number;
    level?: number;
    teamAssessmentId?: string;
  },
): Promise<{ resultId: string; sessionId: string }> {
  const level = opts.level ?? 3;
  const sessionId = await createSession(db, {
    userId: opts.userId,
    professionId: opts.catalog.professionId,
    status: "completed",
    teamAssessmentId: opts.teamAssessmentId,
  });
  const [result] = await db<{ id: string }[]>`
    insert into public.assessment_results
      (session_id, user_id, profession_id, assessment_version, scoring_model_version, question_versions,
       composite_score, composite_se, theta, assessed_level, level_id, confidence, teaser, report)
    values (${sessionId}, ${opts.userId}, ${opts.catalog.professionId}, 'test@1', 'irt2pl-eap-hier-v1',
            ${QUESTION_VERSIONS}::text::jsonb,
            ${opts.composite ?? 40}, 0.4, 0.3, ${level}, ${opts.catalog.levelIds[level]!}, 'medium',
            ${JSON.stringify({ strongestSkillId: opts.catalog.skillIds[0] })}::text::jsonb,
            ${JSON.stringify({ schemaVersion: 1 })}::text::jsonb)
    returning id`;
  for (const [i, skillId] of opts.catalog.skillIds.entries()) {
    await db`
      insert into public.skill_scores (result_id, skill_id, score, theta, se, n_items)
      values (${result!.id}, ${skillId}, ${(opts.composite ?? 40) + i}, 0.1, 0.5, 2)`;
  }
  await db`
    insert into public.level_scores (result_id, level_number, met, missing)
    values (${result!.id}, ${level}, true, '[]'::jsonb)`;
  return { resultId: result!.id, sessionId };
}

export interface PriceRow {
  priceId: string;
  productId: string;
  amountMinor: number;
  currency: string;
}

export async function getPrice(db: Db, productSlug: string, currency = "UZS"): Promise<PriceRow> {
  const [price] = await db<PriceRow[]>`
    select pr.id as price_id, pr.product_id, pr.amount_minor, pr.currency
      from public.prices pr
      join public.products p on p.id = pr.product_id
     where p.slug = ${productSlug} and pr.currency = ${currency}
     order by pr.is_active desc, pr.created_at desc
     limit 1`;
  if (!price) throw new Error(`no ${currency} price for ${productSlug}`);
  return price;
}

/** Payments are born created|pending; later statuses are reached through the legal transitions. */
const PAYMENT_PATH: Record<string, string[]> = {
  created: [],
  pending: [],
  paid: ["paid"],
  failed: ["failed"],
  refunded: ["paid", "refunded"],
};

export async function createPayment(
  db: Db,
  opts: {
    userId: string;
    targetId: string | null;
    targetType?: "assessment_result" | "verification_task" | "subscription" | "none";
    productSlug?: string;
    provider?: "click" | "payme" | "telegram_stars" | "stripe" | "mock";
    status?: "created" | "pending" | "paid" | "failed" | "refunded";
    idempotencyKey?: string;
    amountMinor?: number;
  },
): Promise<string> {
  const price = await getPrice(db, opts.productSlug ?? "full_report");
  const status = opts.status ?? "created";
  const [payment] = await db<{ id: string }[]>`
    insert into public.payments (user_id, product_id, price_id, target_type, target_id, amount_minor, currency,
                                 provider, status, idempotency_key)
    values (${opts.userId}, ${price.productId}, ${price.priceId},
            ${opts.targetType ?? (opts.targetId ? "assessment_result" : "none")}, ${opts.targetId},
            ${opts.amountMinor ?? price.amountMinor}, ${price.currency}, ${opts.provider ?? "mock"},
            ${status === "pending" ? "pending" : "created"}, ${opts.idempotencyKey ?? `idem-${randomUUID()}`})
    returning id`;
  for (const next of PAYMENT_PATH[status] ?? []) {
    await db`update public.payments set status = ${next} where id = ${payment!.id}`;
  }
  return payment!.id;
}

export async function unlockResult(
  db: Db,
  opts: { userId: string; resultId: string; paymentId?: string; unlockType?: "full" | "deep" },
): Promise<string> {
  const [unlock] = await db<{ id: string }[]>`
    insert into public.result_unlocks (user_id, result_id, unlock_type, source, payment_id)
    values (${opts.userId}, ${opts.resultId}, ${opts.unlockType ?? "full"},
            ${opts.paymentId ? "payment" : "admin"}, ${opts.paymentId ?? null})
    returning id`;
  return unlock!.id;
}

export async function createGoal(db: Db, opts: { userId: string; professionId: string }): Promise<string> {
  const [goal] = await db<{ id: string }[]>`
    insert into public.goals (user_id, profession_id, goal_type, target_level)
    values (${opts.userId}, ${opts.professionId}, 'professional', 5)
    returning id`;
  return goal!.id;
}

export async function createOrganization(
  db: Db,
  opts: { ownerUserId: string },
): Promise<string> {
  const [org] = await db<{ id: string }[]>`
    insert into public.organizations (name, slug, type, owner_user_id)
    values ('Test Org', ${uniqueSlug("org").replace(/_/g, "-")}, 'company', ${opts.ownerUserId})
    returning id`;
  await db`
    insert into public.organization_members (organization_id, user_id, role)
    values (${org!.id}, ${opts.ownerUserId}, 'owner')`;
  return org!.id;
}

export async function addMember(
  db: Db,
  opts: { organizationId: string; userId: string; role?: "owner" | "admin" | "member"; consent?: boolean },
): Promise<void> {
  const consent = opts.consent ?? false;
  await db`
    insert into public.organization_members (organization_id, user_id, role, consent_share_results, consent_at)
    values (${opts.organizationId}, ${opts.userId}, ${opts.role ?? "member"}, ${consent}, ${consent ? new Date() : null})`;
}

export async function closeTeamAssessment(db: Db, teamAssessmentId: string): Promise<void> {
  await db`update public.team_assessments set status = 'closed' where id = ${teamAssessmentId}`;
}

export async function createTeamAssessment(
  db: Db,
  opts: { organizationId: string; professionId: string; minGroupSize?: number },
): Promise<string> {
  const [ta] = await db<{ id: string }[]>`
    insert into public.team_assessments (organization_id, profession_id, title, invite_code, status, min_group_size)
    values (${opts.organizationId}, ${opts.professionId}, 'Q4 baseline', ${uniqueCode(8)}, 'open',
            ${opts.minGroupSize ?? 5})
    returning id`;
  return ta!.id;
}
