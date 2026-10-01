import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql, TransactionSql } from "@/lib/db/client";
import {
  addMember,
  cleanupFixtures,
  closeTeamAssessment,
  connectTestDb,
  createCatalog,
  createGoal,
  createOrganization,
  createPayment,
  createQuestion,
  createResult,
  createSession,
  createTeamAssessment,
  createUser,
  uniqueCode,
  uniqueSlug,
  unlockResult,
  type CatalogFixture,
} from "./fixtures";

type ApiRole = "anon" | "authenticated";

class Rollback<T> extends Error {
  constructor(readonly value: T) {
    super("rollback");
  }
}

/**
 * Runs `fn` inside a transaction as a Supabase API role with the given JWT claims (exactly what PostgREST does:
 * `set local role` + `request.jwt.claims`), then rolls back so nothing a test does as that role persists.
 */
async function withRole<T>(
  sql: Sql,
  role: ApiRole,
  userId: string | null,
  fn: (tx: TransactionSql) => Promise<T>,
): Promise<T> {
  const claims = JSON.stringify(userId ? { sub: userId, role } : { role });
  try {
    await sql.begin(async (tx) => {
      await tx.unsafe(`set local role ${role === "anon" ? "anon" : "authenticated"}`);
      await tx`select set_config('request.jwt.claims', ${claims}, true)`;
      throw new Rollback(await fn(tx as unknown as TransactionSql));
    });
  } catch (error) {
    if (error instanceof Rollback) return error.value as T;
    throw error;
  }
  throw new Error("unreachable: transaction was not rolled back");
}

const asAnon = <T>(fn: (tx: TransactionSql) => Promise<T>) => withRole(sql, "anon", null, fn);
const asUser = <T>(userId: string, fn: (tx: TransactionSql) => Promise<T>) =>
  withRole(sql, "authenticated", userId, fn);

const PERMISSION_DENIED = { code: "42501" };

/** Visible row count for a role, or "denied" when the role has no privilege on the table at all. */
async function visibleRows(role: ApiRole, userId: string | null, table: string): Promise<number | "denied"> {
  try {
    return await withRole(sql, role, userId, async (tx) => {
      const [row] = await tx.unsafe<{ count: number }[]>(`select count(*)::int as count from public.${table}`);
      return row!.count;
    });
  } catch (error) {
    if ((error as { code?: string }).code === "42501") return "denied";
    throw error;
  }
}

async function privilegedRows(table: string): Promise<number> {
  const [row] = await sql.unsafe<{ count: number }[]>(`select count(*)::int as count from public.${table}`);
  return row!.count;
}

let sql: Sql;
let catalog: CatalogFixture;
let draft: CatalogFixture;
let userA: string;
let userB: string;

beforeAll(async () => {
  sql = connectTestDb();
  catalog = await createCatalog(sql, { status: "active" });
  draft = await createCatalog(sql, { status: "draft" });
  userA = await createUser(sql, { displayName: "Aziz" });
  userB = await createUser(sql, { displayName: "Bek" });

  // Rows in every "never readable" table, so "0 visible rows" really means "filtered", not "empty".
  await createQuestion(sql, { professionId: catalog.professionId, skillId: catalog.skillIds[0]! });
  const { resultId } = await createResult(sql, { userId: userA, catalog });
  const paymentId = await createPayment(sql, { userId: userA, targetId: resultId });
  await sql`update public.payments set status = 'paid' where id = ${paymentId}`;
  await unlockResult(sql, { userId: userA, resultId, paymentId });
  await sql`
    insert into public.payment_events (payment_id, provider, event_type, provider_event_id, payload)
    values (${paymentId}, 'mock', 'webhook', ${`evt-${paymentId}`}, '{}'::jsonb)`;
  await sql`insert into public.analytics_events (name, user_id) values ('landing_view', ${userA})`;
  await sql`insert into public.result_feedback (result_id, user_id, rating) values (${resultId}, ${userA}, 'accurate')`;
  await sql`
    insert into public.auth_sessions (user_id, channel, expires_at)
    values (${userA}, 'web', now() + interval '180 days')`;
});

afterAll(async () => {
  await cleanupFixtures(sql);
  await sql.end();
});

describe("anon", () => {
  it("reads active catalog rows only", async () => {
    const visible = await asAnon(async (tx) => {
      const rows = await tx<{ id: string }[]>`
        select id from public.professions where id in (${catalog.professionId}, ${draft.professionId})`;
      return rows.map((r) => r.id);
    });
    expect(visible).toEqual([catalog.professionId]);

    const skills = await asAnon(
      (tx) => tx<{ id: string }[]>`select id from public.skills where profession_id = ${draft.professionId}`,
    );
    expect(skills).toHaveLength(0);
    const levels = await asAnon(
      (tx) => tx<{ id: string }[]>`select id from public.levels where profession_id = ${catalog.professionId}`,
    );
    expect(levels).toHaveLength(5);
    const prices = await asAnon((tx) => tx<{ currency: string }[]>`select currency from public.prices`);
    expect(prices.map((p) => p.currency)).not.toContain("XTR"); // inactive price stays hidden
    expect(await visibleRows("anon", null, "languages")).toBe(3);
  });

  it.each([
    "assessment_questions",
    "question_options",
    "payments",
    "payment_events",
    "analytics_events",
    "app_settings",
    "users",
    "assessment_results",
    "result_unlocks",
    "result_feedback",
    "payment_provider_configs",
  ])("cannot read %s", async (table) => {
    expect(await privilegedRows(table)).toBeGreaterThan(0);
    const visible = await visibleRows("anon", null, table);
    expect(visible === "denied" || visible === 0).toBe(true);
  });

  it("cannot call privileged functions", async () => {
    await expect(asAnon((tx) => tx`select public.is_result_unlocked(gen_random_uuid())`)).rejects.toMatchObject(
      PERMISSION_DENIED,
    );
    await expect(asAnon((tx) => tx`select * from public.rate_limit_hit('x', 60, 1)`)).rejects.toMatchObject(
      PERMISSION_DENIED,
    );
  });
});

describe("authenticated: own rows", () => {
  it("sees only own payments, sessions and goals", async () => {
    const { resultId: resultB } = await createResult(sql, { userId: userB, catalog });
    const paymentB = await createPayment(sql, { userId: userB, targetId: resultB });
    const sessionA = await createSession(sql, { userId: userA, professionId: catalog.professionId });
    const sessionB = await createSession(sql, { userId: userB, professionId: catalog.professionId });
    const goalA = await createGoal(sql, { userId: userA, professionId: catalog.professionId });
    const goalB = await createGoal(sql, { userId: userB, professionId: catalog.professionId });

    const seenByA = await asUser(userA, async (tx) => ({
      payments: (await tx<{ userId: string }[]>`select user_id from public.payments`).map((r) => r.userId),
      sessions: (await tx<{ id: string }[]>`select id from public.assessment_sessions where id in (${sessionA}, ${sessionB})`).map((r) => r.id),
      goals: (await tx<{ id: string }[]>`select id from public.goals where id in (${goalA}, ${goalB})`).map((r) => r.id),
      users: (await tx<{ id: string }[]>`select id from public.users`).map((r) => r.id),
    }));
    expect(new Set(seenByA.payments)).toEqual(new Set([userA]));
    expect(seenByA.sessions).toEqual([sessionA]);
    expect(seenByA.goals).toEqual([goalA]);
    expect(seenByA.users).toEqual([userA]);

    const seenByB = await asUser(userB, async (tx) =>
      (await tx<{ id: string }[]>`select id from public.payments`).map((r) => r.id),
    );
    expect(seenByB).toEqual([paymentB]);
  });

  it("never exposes adaptive-engine internals of a session", async () => {
    const sessionA = await createSession(sql, { userId: userA, professionId: catalog.professionId });
    await expect(
      asUser(userA, (tx) => tx`select ability_state from public.assessment_sessions where id = ${sessionA}`),
    ).rejects.toMatchObject(PERMISSION_DENIED);
    await expect(
      asUser(userA, (tx) => tx`select rng_seed from public.assessment_sessions where id = ${sessionA}`),
    ).rejects.toMatchObject(PERMISSION_DENIED);
  });

  it.each([
    "assessment_questions",
    "question_options",
    "payment_events",
    "analytics_events",
    "app_settings",
    "result_unlocks",
    "result_feedback",
    "auth_sessions",
  ])(
    "cannot read %s (not even own rows)",
    async (table) => {
      expect(await privilegedRows(table)).toBeGreaterThan(0);
      const visible = await visibleRows("authenticated", userA, table);
      expect(visible === "denied" || visible === 0).toBe(true);
    },
  );
});

describe("authenticated: results require unlock", () => {
  it("hides own result, skill and level scores until a result_unlocks row exists", async () => {
    const { resultId } = await createResult(sql, { userId: userA, catalog });
    const look = (userId: string) =>
      asUser(userId, async (tx) => ({
        results: (await tx`select id from public.assessment_results where id = ${resultId}`).length,
        skills: (await tx`select id from public.skill_scores where result_id = ${resultId}`).length,
        levels: (await tx`select id from public.level_scores where result_id = ${resultId}`).length,
      }));

    expect(await look(userA)).toEqual({ results: 0, skills: 0, levels: 0 });

    const paymentId = await createPayment(sql, { userId: userA, targetId: resultId, provider: "click" });
    await sql`update public.payments set status = 'paid' where id = ${paymentId}`;
    expect(await look(userA)).toEqual({ results: 0, skills: 0, levels: 0 }); // PAID alone is not an unlock

    await unlockResult(sql, { userId: userA, resultId, paymentId });
    expect(await look(userA)).toEqual({ results: 1, skills: catalog.skillIds.length, levels: 1 });
    expect(await look(userB)).toEqual({ results: 0, skills: 0, levels: 0 }); // never someone else's
  });
});

describe("authenticated: growth projections are paywalled like the result", () => {
  it("hides assessed user_skills, skill_history and level_history of a locked result", async () => {
    const user = await createUser(sql);
    const { resultId } = await createResult(sql, { userId: user, catalog, composite: 67.5, level: 5 });
    const [skill] = catalog.skillIds;
    // Exactly what the result.finalized subscriber writes, before any payment.
    await sql`
      insert into public.user_skills (user_id, skill_id, assessed_score, last_result_id)
      values (${user}, ${skill!}, 72, ${resultId})`;
    await sql`
      insert into public.skill_history (user_id, skill_id, score, kind, source_id)
      values (${user}, ${skill!}, 72, 'assessed', ${resultId}), (${user}, ${skill!}, 70, 'assessed', null)`;
    await sql`
      insert into public.level_history (user_id, profession_id, level, kind, source_id)
      values (${user}, ${catalog.professionId}, 5, 'assessed', ${resultId}),
             (${user}, ${catalog.professionId}, 3, 'verified', gen_random_uuid())`;

    const look = () =>
      asUser(user, async (tx) => ({
        userSkills: (await tx`select skill_id from public.user_skills`).length,
        skillHistory: (await tx`select id from public.skill_history`).length,
        levels: (await tx<{ kind: string }[]>`select kind from public.level_history order by kind`).map((r) => r.kind),
      }));
    // Locked: no assessed score or level leaks; the VERIFIED level is the user's own proof and stays visible.
    expect(await look()).toEqual({ userSkills: 0, skillHistory: 0, levels: ["verified"] });

    const paymentId = await createPayment(sql, { userId: user, targetId: resultId, status: "paid" });
    await unlockResult(sql, { userId: user, resultId, paymentId });
    // Unlocked: visible. An assessed row without a source result stays hidden (fail closed).
    expect(await look()).toEqual({ userSkills: 1, skillHistory: 1, levels: ["assessed", "verified"] });
    expect(await asUser(userB, (tx) => tx`select skill_id from public.user_skills`)).toHaveLength(0);
  });

  it("hides a roadmap (and its items) built from a locked result", async () => {
    const user = await createUser(sql);
    const { resultId } = await createResult(sql, { userId: user, catalog, level: 4 });
    const [roadmap] = await sql<{ id: string }[]>`
      insert into public.roadmaps (user_id, result_id, profession_id, from_level, to_level, generator_version)
      values (${user}, ${resultId}, ${catalog.professionId}, 4, 5, 'rules@1')
      returning id`;
    await sql`
      insert into public.roadmap_items (roadmap_id, phase, title)
      values (${roadmap!.id}, 'foundation', ${JSON.stringify({ en: "Step" })}::text::jsonb)`;
    const look = () =>
      asUser(user, async (tx) => ({
        roadmaps: (await tx`select from_level from public.roadmaps`).length,
        items: (await tx`select id from public.roadmap_items`).length,
      }));
    expect(await look()).toEqual({ roadmaps: 0, items: 0 });
    await unlockResult(sql, { userId: user, resultId });
    expect(await look()).toEqual({ roadmaps: 1, items: 1 });
  });

  it("is_result_unlocked is not an oracle for other users' results", async () => {
    const owner = await createUser(sql);
    const { resultId } = await createResult(sql, { userId: owner, catalog });
    await unlockResult(sql, { userId: owner, resultId });
    const ask = (userId: string) =>
      asUser(userId, async (tx) => {
        const [row] = await tx<{ unlocked: boolean }[]>`select public.is_result_unlocked(${resultId}) as unlocked`;
        return row!.unlocked;
      });
    expect(await ask(owner)).toBe(true);
    expect(await ask(userB)).toBe(false);
  });
});

describe("authenticated: writes", () => {
  it("cannot insert payments, unlocks or results", async () => {
    const { resultId, sessionId } = await createResult(sql, { userId: userA, catalog });
    const [price] = await sql<{ id: string; productId: string }[]>`
      select pr.id, pr.product_id from public.prices pr join public.products p on p.id = pr.product_id
       where p.slug = 'full_report' and pr.currency = 'UZS'`;

    await expect(
      asUser(userA, (tx) => tx`
        insert into public.payments (user_id, product_id, price_id, target_type, target_id, amount_minor, currency,
                                     provider, status, idempotency_key)
        values (${userA}, ${price!.productId}, ${price!.id}, 'assessment_result', ${resultId}, 100000, 'UZS',
                'mock', 'paid', 'client-forged-key')`),
    ).rejects.toMatchObject(PERMISSION_DENIED);

    await expect(
      asUser(userA, (tx) => tx`
        insert into public.result_unlocks (user_id, result_id, unlock_type, source)
        values (${userA}, ${resultId}, 'full', 'promo')`),
    ).rejects.toMatchObject(PERMISSION_DENIED);

    await expect(
      asUser(userA, (tx) => tx`
        insert into public.assessment_results (session_id, user_id, profession_id, assessment_version,
          scoring_model_version, composite_score, composite_se, theta, assessed_level, level_id, confidence)
        values (${sessionId}, ${userA}, ${catalog.professionId}, 'x', 'x', 99, 0.1, 3, 9, ${catalog.levelIds[5]!}, 'high')`),
    ).rejects.toMatchObject(PERMISSION_DENIED);

    await expect(
      asUser(userA, (tx) => tx`update public.payments set status = 'paid' where user_id = ${userA}`),
    ).rejects.toMatchObject(PERMISSION_DENIED);
    await expect(
      asUser(userA, (tx) => tx`delete from public.assessment_sessions where user_id = ${userA}`),
    ).rejects.toMatchObject(PERMISSION_DENIED);
  });

  it("cannot escalate users.role or rewrite Telegram identity", async () => {
    await expect(
      asUser(userA, (tx) => tx`update public.users set role = 'admin' where id = ${userA}`),
    ).rejects.toMatchObject(PERMISSION_DENIED);
    await expect(
      asUser(userA, (tx) => tx`update public.users set telegram_user_id = 424242 where id = ${userA}`),
    ).rejects.toMatchObject(PERMISSION_DENIED);
  });

  it("updates non-privileged profile columns of the own row only", async () => {
    const updated = await asUser(userA, async (tx) => {
      const own = await tx<{ displayName: string }[]>`
        update public.profiles set display_name = 'Aziz R.', show_name_on_share = true, time_per_day_minutes = 30
         where user_id = ${userA}
        returning display_name`;
      const foreign = await tx`update public.profiles set display_name = 'hacked' where user_id = ${userB}`;
      return { own: own.map((r) => r.displayName), foreignCount: foreign.count };
    });
    expect(updated).toEqual({ own: ["Aziz R."], foreignCount: 0 });

    const [b] = await sql<{ displayName: string }[]>`select display_name from public.profiles where user_id = ${userB}`;
    expect(b?.displayName).toBe("Bek");

    await expect(
      asUser(userA, (tx) => tx`update public.profiles set username = 'telegram_handle' where user_id = ${userA}`),
    ).rejects.toMatchObject(PERMISSION_DENIED);
    await expect(
      asUser(userA, (tx) => tx`update public.profiles set user_id = ${userB} where user_id = ${userA}`),
    ).rejects.toMatchObject(PERMISSION_DENIED);
  });

  it("cannot TRUNCATE (which would bypass RLS)", async () => {
    await expect(asUser(userA, (tx) => tx`truncate public.payments`)).rejects.toMatchObject(PERMISSION_DENIED);
    await expect(asUser(userA, (tx) => tx`truncate public.profiles`)).rejects.toMatchObject(PERMISSION_DENIED);
    await expect(asAnon((tx) => tx`truncate public.professions`)).rejects.toMatchObject(PERMISSION_DENIED);
  });
});

describe("referrals", () => {
  it("lets the referrer see own referral rows without fingerprints", async () => {
    const referred = await createUser(sql);
    const [code] = await sql<{ id: string }[]>`
      insert into public.referral_codes (user_id, code) values (${userA}, ${uniqueCode(8)}) returning id`;
    await sql`
      insert into public.referrals (referral_code_id, referrer_user_id, referred_user_id, status, started_at,
                                    completed_at, ip_hash, device_hash)
      values (${code!.id}, ${userA}, ${referred}, 'completed', now(), now(), 'iphash', 'devhash')`;

    const forReferrer = await asUser(userA, (tx) => tx<{ status: string }[]>`select status from public.referrals`);
    expect(forReferrer.map((r) => r.status)).toEqual(["completed"]);
    const forReferred = await asUser(referred, (tx) => tx`select id from public.referrals`);
    expect(forReferred).toHaveLength(0);
    await expect(asUser(userA, (tx) => tx`select ip_hash from public.referrals`)).rejects.toMatchObject(
      PERMISSION_DENIED,
    );
  });
});

describe("organizations", () => {
  it("shows members their org, own membership; owners see the roster; outsiders see nothing", async () => {
    const owner = await createUser(sql);
    const member = await createUser(sql);
    const outsider = await createUser(sql);
    const orgId = await createOrganization(sql, { ownerUserId: owner });
    await addMember(sql, { organizationId: orgId, userId: member });

    const count = (userId: string) =>
      asUser(userId, async (tx) => ({
        orgs: (await tx`select id from public.organizations where id = ${orgId}`).length,
        members: (await tx`select user_id from public.organization_members where organization_id = ${orgId}`).length,
      }));
    expect(await count(owner)).toEqual({ orgs: 1, members: 2 });
    expect(await count(member)).toEqual({ orgs: 1, members: 1 });
    expect(await count(outsider)).toEqual({ orgs: 0, members: 0 });
  });

  type AggregateRow = {
    participantCount: number;
    avgComposite: number;
    levelDistribution: Record<string, number>;
    skillAverages: { skillId: string; n: number }[];
  };
  const aggregate = (userId: string, teamId: string) =>
    asUser(userId, (tx) => tx<AggregateRow[]>`select * from public.team_assessment_aggregate(${teamId})`);

  it("team_assessment_aggregate enforces admin role, consent and min group size", async () => {
    const owner = await createUser(sql);
    const orgId = await createOrganization(sql, { ownerUserId: owner });
    const teamId = await createTeamAssessment(sql, {
      organizationId: orgId,
      professionId: catalog.professionId,
      minGroupSize: 3,
    });
    const participants: string[] = [];
    for (let i = 0; i < 5; i++) {
      const userId = await createUser(sql);
      participants.push(userId);
      // The 5th member did not consent: their result must never be counted.
      await addMember(sql, { organizationId: orgId, userId, consent: i < 4 });
    }
    await createResult(sql, { userId: participants[0]!, catalog, composite: 30, level: 2, teamAssessmentId: teamId });
    await createResult(sql, { userId: participants[1]!, catalog, composite: 40, level: 3, teamAssessmentId: teamId });
    await createResult(sql, { userId: participants[2]!, catalog, composite: 50, level: 3, teamAssessmentId: teamId });
    await createResult(sql, { userId: participants[3]!, catalog, composite: 40, level: 3, teamAssessmentId: teamId });
    await createResult(sql, { userId: participants[4]!, catalog, composite: 90, level: 5, teamAssessmentId: teamId });
    // Nothing is released while the campaign is open, even with 4 consenting results >= min_group_size.
    expect(await aggregate(owner, teamId)).toEqual([]);

    await closeTeamAssessment(sql, teamId);
    const [row] = await aggregate(owner, teamId);
    // The single level-2 participant is a small cell (< k = 3) and is suppressed.
    expect(row).toMatchObject({ participantCount: 4, avgComposite: 40, levelDistribution: { "3": 3 } });
    expect(row!.skillAverages).toHaveLength(catalog.skillIds.length);

    // Plain members (even consenting ones) and outsiders are refused.
    await expect(aggregate(participants[0]!, teamId)).rejects.toMatchObject(PERMISSION_DENIED);
    const outsider = await createUser(sql);
    await expect(aggregate(outsider, teamId)).rejects.toMatchObject(PERMISSION_DENIED);
    await expect(
      asAnon((tx) => tx`select * from public.team_assessment_aggregate(${teamId})`),
    ).rejects.toMatchObject(PERMISSION_DENIED);
  });

  it("team_assessment_aggregate cannot be differenced to recover one member's scores", async () => {
    const owner = await createUser(sql);
    const orgId = await createOrganization(sql, { ownerUserId: owner });
    const teamId = await createTeamAssessment(sql, { organizationId: orgId, professionId: catalog.professionId });
    const members: string[] = [];
    for (let i = 0; i < 6; i++) {
      const userId = await createUser(sql);
      members.push(userId);
      await addMember(sql, { organizationId: orgId, userId, consent: true });
    }
    for (const userId of members.slice(0, 5)) {
      await createResult(sql, { userId, catalog, composite: 44, level: 4, teamAssessmentId: teamId });
    }
    await closeTeamAssessment(sql, teamId);
    const before = await aggregate(owner, teamId);
    expect(before).toMatchObject([{ participantCount: 5, avgComposite: 44, levelDistribution: { "4": 5 } }]);

    // A 6th member finishing after the release (or a consent change) never produces a second, differenceable release.
    await createResult(sql, { userId: members[5]!, catalog, composite: 83.25, level: 5, teamAssessmentId: teamId });
    await sql`update public.organization_members set consent_share_results = false, consent_at = null
               where organization_id = ${orgId} and user_id = ${members[0]!}`;
    expect(await aggregate(owner, teamId)).toEqual(before);

    // The campaign cannot be reopened and re-closed to release fresh numbers, nor can its snapshot be rewritten.
    await expect(sql`update public.team_assessments set status = 'open' where id = ${teamId}`).rejects.toMatchObject({
      code: "23514",
      constraint_name: "team_assessments_frozen",
    });
    await expect(
      sql`update public.team_assessments set aggregate_snapshot = '{}'::jsonb where id = ${teamId}`,
    ).rejects.toMatchObject({ code: "23514", constraint_name: "team_assessments_frozen" });
    expect(await aggregate(owner, teamId)).toEqual(before);
  });

  it("team_assessment_aggregate suppresses thin skills and campaigns that close below the group size", async () => {
    const own = await createCatalog(sql);
    const owner = await createUser(sql);
    const orgId = await createOrganization(sql, { ownerUserId: owner });
    const teamId = await createTeamAssessment(sql, { organizationId: orgId, professionId: own.professionId, minGroupSize: 3 });
    const smallTeamId = await createTeamAssessment(sql, { organizationId: orgId, professionId: own.professionId, minGroupSize: 3 });
    const results: string[] = [];
    for (let i = 0; i < 3; i++) {
      const userId = await createUser(sql);
      await addMember(sql, { organizationId: orgId, userId, consent: true });
      results.push((await createResult(sql, { userId, catalog: own, composite: 50, level: 4, teamAssessmentId: teamId })).resultId);
      if (i < 2) await createResult(sql, { userId, catalog: own, composite: 60, level: 4, teamAssessmentId: smallTeamId });
    }
    // A skill added mid-campaign was scored for one participant only: its average would be that person's score.
    const [late] = await sql<{ id: string }[]>`
      insert into public.skills (profession_id, slug, name, kind, importance)
      values (${own.professionId}, ${uniqueSlug("late")}, ${JSON.stringify({ en: "Late" })}::text::jsonb, 'hard', 0.2)
      returning id`;
    await sql`insert into public.skill_scores (result_id, skill_id, score, n_items) values (${results[0]!}, ${late!.id}, 12, 1)`;

    await closeTeamAssessment(sql, teamId);
    await closeTeamAssessment(sql, smallTeamId);
    const [row] = await aggregate(owner, teamId);
    expect(row!.participantCount).toBe(3);
    expect(row!.skillAverages.map((a) => a.skillId).sort()).toEqual([...own.skillIds].sort());
    expect(row!.skillAverages.every((a) => a.n >= 3)).toBe(true);
    expect(await aggregate(owner, smallTeamId)).toEqual([]);
  });
});
