import { describe, expect, it } from "vitest";
import { DEFAULT_PROFESSION_CONFIG } from "@/modules/catalog/domain/types";
import { coreSkillIds, isScenarioLike } from "./routing-pool";
import {
  irtResponder,
  routingInput,
  simulateSession,
  standardBank,
  standardSkills,
  type SimulatedSession,
} from "./test-fixtures";

/**
 * Monte-Carlo check of the whole adaptive loop: 10 skills × 5 items (target levels 2..8, mixed types, one
 * self_report per two skills), respondents at θ ∈ {−2, 0, 2} answering by the 3PL model with seeded PRNGs.
 */
const bank = standardBank();
const skills = standardSkills();
const config = DEFAULT_PROFESSION_CONFIG;
const SESSIONS_PER_THETA = 30;
const THETAS: readonly number[] = [-2, 0, 2];

const mean = (values: readonly number[]): number => values.reduce((a, b) => a + b, 0) / values.length;

const runs = new Map<number, SimulatedSession[]>(
  THETAS.map((theta) => [
    theta,
    Array.from({ length: SESSIONS_PER_THETA }, (_, k) =>
      simulateSession(
        routingInput({ bank, skills, config, priorMean: 0, rngSeed: 1000 + k * 7919 + theta * 31 }),
        irtResponder(theta),
        77 + k * 31 + theta * 1009,
      ),
    ),
  ]),
);
const all = [...runs.values()].flat();

describe("adaptive routing simulation", () => {
  it("stops every session within [minQuestions, maxQuestions] without exhausting the bank", () => {
    for (const session of all) {
      expect(session.answered.length).toBeGreaterThanOrEqual(config.minQuestions);
      expect(session.answered.length).toBeLessThanOrEqual(config.maxQuestions);
      expect(session.final.reason).not.toBe("bank_exhausted");
    }
  });

  it("keeps the average length close to the target", () => {
    const averageLength = mean(all.map((s) => s.answered.length));
    expect(Math.abs(averageLength - config.targetQuestions)).toBeLessThanOrEqual(2);
    for (const sessions of runs.values()) {
      expect(mean(sessions.map((s) => s.answered.length))).toBeGreaterThanOrEqual(config.minQuestions);
    }
  });

  it("respects every content constraint in every session", () => {
    const core = coreSkillIds(skills, bank, config);
    for (const session of all) {
      const ids = session.questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(session.questions.filter((q) => q.type === "self_report").length).toBeLessThanOrEqual(
        config.maxSelfReportItems,
      );
      expect(session.questions.filter((q) => isScenarioLike(q.type)).length).toBeGreaterThanOrEqual(
        config.minScenarioLikeItems,
      );
      const covered = new Set(session.questions.map((q) => q.skillId));
      for (const skillId of core) expect(covered.has(skillId)).toBe(true);
    }
  });

  it("recovers ability with reasonable error and preserves the ordering of respondents", () => {
    const estimates = new Map(THETAS.map((theta) => [theta, (runs.get(theta) ?? []).map((s) => s.final.thetaG)]));
    const meanEstimate = (theta: number): number => mean(estimates.get(theta) ?? []);
    const meanAbsError = (theta: number): number => mean((estimates.get(theta) ?? []).map((e) => Math.abs(e - theta)));

    expect(meanAbsError(0)).toBeLessThan(0.5);
    expect(meanAbsError(-2)).toBeLessThan(0.9);
    expect(meanAbsError(2)).toBeLessThan(0.9);
    expect(meanEstimate(-2)).toBeLessThan(-1);
    expect(meanEstimate(2)).toBeGreaterThan(1);
    expect(meanEstimate(-2)).toBeLessThan(meanEstimate(0));
    expect(meanEstimate(0)).toBeLessThan(meanEstimate(2));
    expect(mean(all.map((s) => s.final.seG))).toBeLessThan(config.targetSe + 0.15);
  });

  it("adapts difficulty to the respondent: stronger respondents see harder items on average", () => {
    const averageDifficulty = (theta: number): number =>
      mean((runs.get(theta) ?? []).flatMap((s) => s.questions.map((q) => q.difficulty)));
    expect(averageDifficulty(-2)).toBeLessThan(averageDifficulty(0));
    expect(averageDifficulty(0)).toBeLessThan(averageDifficulty(2));
  });
});
