import { describe, expect, it } from "vitest";
import { DEFAULT_PROFESSION_CONFIG, type ProfessionConfig } from "@/modules/catalog/domain/types";
import { selectNextQuestion } from "./routing";
import { buildSessionPool, isScenarioLike, normalizeRoutingConfig } from "./routing-pool";
import {
  answerOf,
  irtResponder,
  makeBank,
  makeQuestion,
  makeSkills,
  routingInput,
  simulateSession,
  standardBank,
  standardSkills,
} from "./test-fixtures";
import type { Question } from "./types";

const bank = standardBank();
const skills = standardSkills();

describe("self_report cap", () => {
  it("never serves more than maxSelfReportItems self_report items", () => {
    // Make self_report items the closest-difficulty candidates so coverage would prefer them.
    const lureBank = bank.map((q) => (q.type === "self_report" ? { ...q, difficulty: 0 } : q));
    for (const maxSelfReportItems of [0, 1, 2]) {
      const config = { ...DEFAULT_PROFESSION_CONFIG, maxSelfReportItems };
      for (let seed = 0; seed < 8; seed += 1) {
        const session = simulateSession(routingInput({ bank: lureBank, skills, config, rngSeed: seed }), irtResponder(0), seed);
        const selfReports = session.questions.filter((q) => q.type === "self_report").length;
        expect(selfReports).toBeLessThanOrEqual(maxSelfReportItems);
      }
    }
  });

  it("falls back to the next skill when a core skill only has blocked self_report items", () => {
    const srOnly = makeQuestion({ id: "sr-only", skillId: "s0", type: "self_report" });
    const others = makeBank({ skills: 3, itemsPerSkill: 2 }).filter((q) => q.skillId !== "s0");
    const answered = [
      answerOf(makeQuestion({ id: "old-sr1", skillId: "s2", type: "self_report" }), 1),
      answerOf(makeQuestion({ id: "old-sr2", skillId: "s2", type: "self_report" }), 1),
    ];
    const decision = selectNextQuestion(
      routingInput({ bank: [srOnly, ...others], skills: makeSkills([0.5, 0.3, 0.2]), answered }),
    );
    expect(decision).toMatchObject({ kind: "question", phase: "coverage", question: { skillId: "s1" } });
  });

  it("stops with bank_exhausted when only blocked self_report items remain", () => {
    const srBank = [makeQuestion({ id: "sr1", skillId: "s0", type: "self_report" })];
    const answered = [
      answerOf(makeQuestion({ id: "a", skillId: "s0", type: "self_report" }), 1),
      answerOf(makeQuestion({ id: "b", skillId: "s0", type: "self_report" }), 1),
    ];
    const decision = selectNextQuestion(routingInput({ bank: srBank, skills: makeSkills([1]), answered }));
    expect(decision).toMatchObject({ kind: "stop", reason: "bank_exhausted", plannedTotal: 2 });
  });
});

describe("scenario-like minimum", () => {
  // s0..s3 only have knowledge items; the scenario-like items belong to a near-zero-importance skill s4.
  const knowledge = makeBank({ skills: 4, itemsPerSkill: 4 });
  const scenarios = [0, 1, 2].map((i) =>
    makeQuestion({ id: `scn-${i}`, skillId: "s4", type: i === 0 ? "judgment" : "scenario", targetLevel: 4 + i }),
  );
  const quotaSkills = makeSkills([0.3, 0.3, 0.2, 0.19, 0.01]);
  const small: ProfessionConfig = {
    ...DEFAULT_PROFESSION_CONFIG,
    minQuestions: 4,
    targetQuestions: 6,
    maxQuestions: 8,
    minScenarioLikeItems: 2,
  };

  it("forces scenario-like items when the remaining slots before target equal the missing count", () => {
    const config = { ...small, targetSe: 0.01 };
    const session = simulateSession(
      routingInput({ bank: [...knowledge, ...scenarios], skills: quotaSkills, config, rngSeed: 3 }),
      irtResponder(0),
      8,
    );
    const types = session.questions.map((q) => q.type);
    expect(types.slice(0, 4).some(isScenarioLike)).toBe(false);
    expect(types.slice(4, 6).every(isScenarioLike)).toBe(true);
    expect(session.final.reason).toBe("max_items");
  });

  it("defers an otherwise-due precision stop until the quota is met", () => {
    const config = { ...small, targetSe: 5 };
    const input = routingInput({ bank: [...knowledge, ...scenarios], skills: quotaSkills, config, rngSeed: 3 });
    const withQuota = simulateSession(input, irtResponder(0), 8);
    expect(withQuota.questions.filter((q) => isScenarioLike(q.type))).toHaveLength(2);
    expect(withQuota.final.reason).toBe("precision_reached");
    expect(withQuota.questions).toHaveLength(6);

    const withoutQuota = simulateSession({ ...input, config: { ...config, minScenarioLikeItems: 0 } }, irtResponder(0), 8);
    expect(withoutQuota.questions).toHaveLength(4);
  });

  it("does not block stopping when the bank has no scenario-like item", () => {
    const config = { ...small, targetSe: 5 };
    const session = simulateSession(routingInput({ bank: knowledge, skills: quotaSkills, config }), irtResponder(0), 1);
    expect(session.final.reason).toBe("precision_reached");
    expect(session.questions).toHaveLength(4);
  });
});

describe("recently seen items", () => {
  const config = normalizeRoutingConfig(DEFAULT_PROFESSION_CONFIG);

  it("excludes recently seen keys while enough fresh items remain", () => {
    const recentlySeenKeys = new Set(bank.filter((_, i) => i % 5 < 2).map((q) => q.key)); // 20 of 50
    const input = routingInput({ bank, skills, recentlySeenKeys });
    const pool = buildSessionPool(input, config);
    expect(pool.pool).toHaveLength(30);
    for (let seed = 0; seed < 8; seed += 1) {
      const session = simulateSession({ ...input, rngSeed: seed }, irtResponder(0.3), seed);
      expect(session.questions.some((q) => recentlySeenKeys.has(q.key))).toBe(false);
    }
  });

  it("allows recently seen keys when fewer fresh items remain than the session may still need", () => {
    const recentlySeenKeys = new Set(bank.slice(0, 40).map((q) => q.key)); // 10 fresh < 15 remaining
    const input = routingInput({ bank, skills, recentlySeenKeys });
    expect(buildSessionPool(input, config).pool).toHaveLength(50);

    const tiny: Question[] = makeBank({ skills: 3, itemsPerSkill: 4 });
    const seen = new Set(tiny.slice(0, 8).map((q) => q.key));
    const session = simulateSession(
      routingInput({ bank: tiny, skills: makeSkills([0.4, 0.3, 0.3]), recentlySeenKeys: seen }),
      irtResponder(0),
      2,
    );
    expect(session.questions.length).toBeGreaterThanOrEqual(DEFAULT_PROFESSION_CONFIG.minQuestions);
  });
});
