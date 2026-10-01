import { describe, expect, it } from "vitest";
import { DEFAULT_PROFESSION_CONFIG, type ProfessionConfig } from "@/modules/catalog/domain/types";
import { estimateAbilities } from "@/modules/scoring/domain";
import { EXTENSION_SE_MARGIN, plannedTotalFor, selectNextQuestion } from "./routing";
import {
  answerOf,
  irtResponder,
  makeBank,
  makeSkills,
  routingInput,
  simulateSession,
  standardBank,
  standardSkills,
} from "./test-fixtures";
import type { AnsweredItem, Question } from "./types";

// 4 skills × 6 knowledge items; core = min(4, target − 3 = 3, 8) = s0, s1, s2.
const bank = makeBank({ skills: 4, itemsPerSkill: 6, targetLevel: (_, i) => 3 + i });
const skills = makeSkills([0.4, 0.3, 0.2, 0.1]);
const small: ProfessionConfig = {
  ...DEFAULT_PROFESSION_CONFIG,
  minQuestions: 4,
  targetQuestions: 6,
  maxQuestions: 8,
  minScenarioLikeItems: 0,
};

/** Answers items of the given skills in order (first unused item of each), alternating credit 1/0. */
function answersFor(skillIds: readonly string[]): AnsweredItem[] {
  const used = new Set<string>();
  return skillIds.map((skillId, i) => {
    const question = bank.find((q) => q.skillId === skillId && !used.has(q.id)) as Question;
    used.add(question.id);
    return answerOf(question, i % 2 === 0 ? 1 : 0);
  });
}

function decide(answered: readonly AnsweredItem[], config: ProfessionConfig) {
  return selectNextQuestion(
    routingInput({ bank, skills, answered, servedQuestionIds: answered.map((a) => a.questionId), config }),
  );
}

const seOf = (answered: readonly AnsweredItem[]): number => estimateAbilities({ items: answered, skills, priorMean: 0 }).seG;

describe("stop rules", () => {
  it("stops at maxQuestions with max_items", () => {
    const answered = answersFor(["s0", "s1", "s2", "s3", "s0", "s1", "s2", "s3"]);
    expect(decide(answered, { ...small, targetSe: 0 })).toMatchObject({ kind: "stop", reason: "max_items", plannedTotal: 8 });
  });

  it("stops at minQuestions when coverage is done and SE_g ≤ targetSe", () => {
    const answered = answersFor(["s0", "s1", "s2", "s3"]);
    const decision = decide(answered, { ...small, targetSe: seOf(answered) + 0.01 });
    expect(decision).toMatchObject({ kind: "stop", reason: "precision_reached", plannedTotal: 4 });
    expect(decision.seG).toBeCloseTo(seOf(answered), 12);
  });

  it("never stops for precision before minQuestions", () => {
    const answered = answersFor(["s0", "s1", "s2"]);
    expect(decide(answered, { ...small, targetSe: 5 })).toMatchObject({ kind: "question", plannedTotal: 6 });
  });

  it("never stops for precision before every core skill is covered", () => {
    const answered = answersFor(["s0", "s0", "s1", "s1"]);
    const decision = decide(answered, { ...small, targetSe: 5 });
    expect(decision).toMatchObject({ kind: "question", phase: "coverage", question: { skillId: "s2" } });
  });

  it("stops at targetQuestions when SE_g is within targetSe + margin", () => {
    const answered = answersFor(["s0", "s1", "s2", "s3", "s0", "s1"]);
    const se = seOf(answered);
    const decision = decide(answered, { ...small, targetSe: se - EXTENSION_SE_MARGIN / 2 });
    expect(decision).toMatchObject({ kind: "stop", reason: "precision_reached", plannedTotal: 6 });
  });

  it("extends past targetQuestions while SE_g > targetSe + margin, with plannedTotal n + 1", () => {
    const answered = answersFor(["s0", "s1", "s2", "s3", "s0", "s1"]);
    const config = { ...small, targetSe: seOf(answered) - EXTENSION_SE_MARGIN * 1.5 };
    expect(decide(answered, config)).toMatchObject({ kind: "question", phase: "precision", plannedTotal: 7 });
    const seven = answersFor(["s0", "s1", "s2", "s3", "s0", "s1", "s2"]);
    expect(decide(seven, config)).toMatchObject({ kind: "question", plannedTotal: 8 });
  });

  it("stops with bank_exhausted when nothing eligible is left", () => {
    expect(decide([], small)).toMatchObject({ kind: "question" });
    const empty = selectNextQuestion(routingInput({ bank: [], skills, config: small }));
    expect(empty).toMatchObject({ kind: "stop", reason: "bank_exhausted", plannedTotal: 0 });
    const tiny = bank.slice(0, 2);
    const session = simulateSession(routingInput({ bank: tiny, skills, config: small }), irtResponder(0), 1);
    expect(session.final).toMatchObject({ reason: "bank_exhausted", plannedTotal: 2 });
  });

  it("prefers max_items over bank_exhausted when both apply", () => {
    const answered = answersFor(["s0", "s1", "s2", "s3", "s0", "s1", "s2", "s3"]);
    const decision = selectNextQuestion(routingInput({ bank: [], skills, answered, config: small }));
    expect(decision).toMatchObject({ kind: "stop", reason: "max_items" });
  });
});

describe("plannedTotal", () => {
  it("is targetQuestions before the target, then n + 1, capped at maxQuestions", () => {
    expect([0, 5, 11, 12, 13, 14, 15, 20].map((n) => plannedTotalFor(n, DEFAULT_PROFESSION_CONFIG))).toEqual([
      12, 12, 12, 13, 14, 15, 15, 15,
    ]);
  });

  it("normalizes inconsistent configs (target above max, min above target)", () => {
    const broken = { ...DEFAULT_PROFESSION_CONFIG, minQuestions: 9, targetQuestions: 20, maxQuestions: 10 };
    expect(plannedTotalFor(0, broken)).toBe(10);
    expect(plannedTotalFor(0, { ...DEFAULT_PROFESSION_CONFIG, minQuestions: 9, targetQuestions: 5 })).toBe(9);
  });

  it("never decreases, never shows n > D, never exceeds maxQuestions over real sessions", () => {
    const standard = standardBank();
    for (const theta of [-2, 0, 2]) {
      for (let seed = 0; seed < 6; seed += 1) {
        const session = simulateSession(
          routingInput({ bank: standard, skills: standardSkills(), rngSeed: seed }),
          irtResponder(theta),
          seed * 13 + 1,
        );
        let previous = 0;
        session.decisions.forEach((decision, n) => {
          if (decision.kind !== "question") return;
          expect(decision.plannedTotal).toBeGreaterThanOrEqual(previous);
          expect(decision.plannedTotal).toBeGreaterThanOrEqual(n + 1);
          expect(decision.plannedTotal).toBeLessThanOrEqual(DEFAULT_PROFESSION_CONFIG.maxQuestions);
          previous = decision.plannedTotal;
        });
        expect(session.final.plannedTotal).toBe(session.answered.length);
      }
    }
  });
});
