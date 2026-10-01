import { describe, expect, it } from "vitest";
import { estimateAbilities } from "@/modules/scoring/domain";
import { selectNextQuestion } from "./routing";
import { coreSkillIds } from "./routing-pool";
import { rankByDifficultyDistance } from "./routing-rank";
import {
  answerOf,
  irtResponder,
  makeQuestion,
  routingInput,
  simulateSession,
  standardBank,
  standardSkills,
} from "./test-fixtures";
import type { Question, RoutingDecision } from "./types";

const bank = standardBank();
const skills = standardSkills();

function questionOf(decision: RoutingDecision): Question {
  if (decision.kind !== "question") throw new Error(`Expected a question, got stop (${decision.reason})`);
  return decision.question;
}

describe("selectNextQuestion — determinism", () => {
  it("returns the same decision for the same input", () => {
    const input = routingInput({ bank, skills, rngSeed: 777 });
    expect(selectNextQuestion(input)).toEqual(selectNextQuestion(input));
  });

  it("does not depend on bank order", () => {
    const answered = [answerOf(bank[0] as Question, 1), answerOf(bank[6] as Question, 0)];
    const base = { skills, answered, servedQuestionIds: answered.map((a) => a.questionId), rngSeed: 31 };
    const forward = selectNextQuestion(routingInput({ ...base, bank }));
    const reversed = selectNextQuestion(routingInput({ ...base, bank: [...bank].reverse() }));
    expect(questionOf(reversed).id).toBe(questionOf(forward).id);
  });

  it("replays a whole simulated session identically from the same seeds", () => {
    const base = routingInput({ bank, skills, rngSeed: 2026 });
    const first = simulateSession(base, irtResponder(0.5), 11);
    const second = simulateSession(base, irtResponder(0.5), 11);
    expect(second.questions.map((q) => q.id)).toEqual(first.questions.map((q) => q.id));
    expect(second.final).toEqual(first.final);
  });

  it("varies the served items across session seeds (randomesque exposure control)", () => {
    const firstItems = new Set<string>();
    for (let seed = 0; seed < 40; seed += 1) {
      firstItems.add(questionOf(selectNextQuestion(routingInput({ bank, skills, rngSeed: seed }))).id);
    }
    expect(firstItems.size).toBeGreaterThan(1);
    expect(firstItems.size).toBeLessThanOrEqual(3);
  });
});

describe("selectNextQuestion — coverage phase", () => {
  it("starts with the most important skill and an item among the 3 closest to θ_g", () => {
    for (const priorMean of [-1, 0, 0.8]) {
      for (let seed = 0; seed < 15; seed += 1) {
        const decision = selectNextQuestion(routingInput({ bank, skills, priorMean, rngSeed: seed }));
        const question = questionOf(decision);
        expect(decision.kind === "question" && decision.phase).toBe("coverage");
        expect(question.skillId).toBe("s0");
        const thetaG = estimateAbilities({ items: [], skills, priorMean }).thetaG;
        const top3 = rankByDifficultyDistance(
          bank.filter((q) => q.skillId === "s0"),
          thetaG,
        ).slice(0, 3);
        expect(top3.map((q) => q.id)).toContain(question.id);
      }
    }
  });

  it("covers every core skill, in importance order, before any precision item", () => {
    const core = coreSkillIds(skills, bank, routingInput().config);
    expect(core).toEqual(["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"]);
    for (const theta of [-1.5, 0, 1.5]) {
      const session = simulateSession(routingInput({ bank, skills, rngSeed: 5 }), irtResponder(theta), 3);
      const phases = session.decisions.flatMap((d) => (d.kind === "question" ? [d.phase] : []));
      expect(session.questions.slice(0, core.length).map((q) => q.skillId)).toEqual(core);
      expect(phases.slice(0, core.length).every((phase) => phase === "coverage")).toBe(true);
      expect(phases.slice(core.length).every((phase) => phase === "precision")).toBe(true);
    }
  });

  it("uses at most 8 core skills, and target − 3 for shorter tests", () => {
    const config = { ...routingInput().config, targetQuestions: 7, minQuestions: 5 };
    expect(coreSkillIds(skills, bank, config)).toEqual(["s0", "s1", "s2", "s3"]);
    expect(coreSkillIds(skills.slice(0, 2), bank, routingInput().config)).toEqual(["s0", "s1"]);
  });

  it("only counts skills that have items as core skills", () => {
    const partialBank = bank.filter((q) => q.skillId !== "s0" && q.skillId !== "s3");
    expect(coreSkillIds(skills, partialBank, routingInput().config)).toEqual([
      "s1",
      "s2",
      "s4",
      "s5",
      "s6",
      "s7",
      "s8",
      "s9",
    ]);
  });
});

describe("selectNextQuestion — precision phase", () => {
  it("targets the skill maximizing importance × posterior SD, with the most informative items", () => {
    const answered = skills.slice(0, 8).map((s, i) => {
      const question = bank.find((q) => q.skillId === s.id && q.type === "knowledge") as Question;
      return answerOf(question, i % 2);
    });
    const input = routingInput({ bank, skills, answered, servedQuestionIds: answered.map((a) => a.questionId) });
    const decision = selectNextQuestion(input);
    expect(decision.kind === "question" && decision.phase).toBe("precision");

    const estimate = estimateAbilities({ items: answered, skills, priorMean: 0 });
    const priorities = estimate.skills.map((s) => ({
      id: s.skillId,
      value: (skills.find((k) => k.id === s.skillId)?.importance ?? 0) * s.se,
    }));
    const best = priorities.reduce((a, b) => (b.value > a.value ? b : a));
    expect(questionOf(decision).skillId).toBe(best.id);
  });
});

describe("selectNextQuestion — eligibility", () => {
  it("never serves an item twice, nor another version of a served key", () => {
    for (let seed = 0; seed < 10; seed += 1) {
      const session = simulateSession(routingInput({ bank, skills, rngSeed: seed }), irtResponder(0), seed + 100);
      const ids = session.questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
    const v1 = makeQuestion({ id: "v1", key: "same", skillId: "s0" });
    const v2 = makeQuestion({ id: "v2", key: "same", version: 2, skillId: "s0" });
    const decision = selectNextQuestion(
      routingInput({ bank: [v1, v2], skills: skills.slice(0, 1), servedQuestionIds: ["v1"] }),
    );
    expect(decision).toMatchObject({ kind: "stop", reason: "bank_exhausted" });
  });

  it("filters by specialization (empty list = all specializations)", () => {
    const tagged = bank.map((q, i) => ({ ...q, specializationIds: i % 3 === 0 ? [] : i % 3 === 1 ? ["spA"] : ["spB"] }));
    const allowedFor = (spec: string | null) => (q: Question) =>
      q.specializationIds.length === 0 || (spec !== null && q.specializationIds.includes(spec));
    for (const spec of ["spA", "spB", null]) {
      const session = simulateSession(
        routingInput({ bank: tagged, skills, specializationId: spec, rngSeed: 9 }),
        irtResponder(0),
        4,
      );
      expect(session.questions.length).toBeGreaterThan(0);
      expect(session.questions.every(allowedFor(spec))).toBe(true);
    }
  });

  it("never serves open questions or items of unknown skills", () => {
    const extra = [
      makeQuestion({ id: "open", skillId: "s0", type: "open", scoringRule: "open_ai", targetLevel: 5 }),
      makeQuestion({ id: "ghost", skillId: "unknown", targetLevel: 5 }),
    ];
    const session = simulateSession(routingInput({ bank: [...extra, ...bank], skills, rngSeed: 1 }), irtResponder(0), 2);
    expect(session.questions.map((q) => q.id)).not.toContain("open");
    expect(session.questions.map((q) => q.id)).not.toContain("ghost");
  });
});
