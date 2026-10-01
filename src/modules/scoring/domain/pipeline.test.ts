import { describe, expect, it } from "vitest";
import { DEFAULT_PROFESSION_CONFIG } from "@/modules/catalog/domain/types";
import { estimateAbilities } from "./estimate";
import { scoreAssessment } from "./index";
import { defaultLevels, item, requirement } from "./test-fixtures";
import { SCORING_MODEL_VERSION } from "./types";

const skills = [
  { id: "sales", importance: 0.35 },
  { id: "finance", importance: 0.25 },
  // Never served below, and above average importance → "unmeasured_skills".
  { id: "ops", importance: 0.4 },
];

function session(credit: (i: number) => number, responseMs = 9000) {
  return Array.from({ length: 12 }, (_, i) =>
    item({
      questionId: `q${i}`,
      skillId: skills[i % 2]!.id,
      difficulty: -1.4 + (i % 5) * 0.7,
      credit: credit(i),
      responseMs,
    }),
  );
}

describe("scoreAssessment", () => {
  const levels = defaultLevels({ 5: [requirement({ type: "skill_min", skillId: "finance", threshold: 45 })] });

  it("chains estimation, level assignment and confidence deterministically", () => {
    const items = session((i) => (i % 3 === 0 ? 0 : 1));
    const input = { items, skills, experience: "1to3" as const, levels, config: DEFAULT_PROFESSION_CONFIG };
    const first = scoreAssessment(input);
    expect(first).toEqual(scoreAssessment(input));
    expect(first.scoringModelVersion).toBe(SCORING_MODEL_VERSION);
    expect(first.ability).toEqual(estimateAbilities({ items, skills, priorMean: 0 }));
    expect(first.speedingRatio).toBe(0);
    expect(first.selfReportGap).toBeNull();
    expect(first.assignment.evaluations).toHaveLength(9);
    expect(first.confidence.reasons).toContain("unmeasured_skills");
    expect(first.confidence.reasons.includes("near_boundary")).toBe(first.assignment.range !== null);
  });

  it("uses the experience prior and experience caps", () => {
    const items = session(() => 1);
    const base = { items, skills, levels, config: DEFAULT_PROFESSION_CONFIG };
    const novice = scoreAssessment({ ...base, experience: "none" });
    const veteran = scoreAssessment({ ...base, experience: "5plus" });
    expect(veteran.ability.thetaG).toBeGreaterThan(novice.ability.thetaG);
    expect(novice.assignment.level).toBeLessThanOrEqual(4);
    expect(veteran.assignment.level).toBeGreaterThanOrEqual(novice.assignment.level);
  });

  it("judges self-report consistency against the tested ability, not raw credit (regression)", () => {
    // Tested items answered ~67% correct; an honest "not yet" (credit 0) on two master-level self-report
    // statements (target level 9, b = 2.8). Raw credit means differ by 0.67 but the model expects ≈ 0.05.
    const tested = session((i) => (i % 3 === 0 ? 0 : 1));
    const masterLevel = { type: "self_report" as const, difficulty: 2.8, discrimination: 0.5, guessing: 0, weight: 0.5 };
    const honest = [item({ ...masterLevel, skillId: "sales", credit: 0 }), item({ ...masterLevel, skillId: "finance", credit: 0 })];
    const base = { skills, experience: "1to3" as const, levels, config: DEFAULT_PROFESSION_CONFIG };
    const result = scoreAssessment({ ...base, items: [...tested, ...honest] });
    expect(result.selfReportGap).not.toBeNull();
    expect(result.selfReportGap).toBeLessThan(0.15);
    expect(result.confidence.reasons).not.toContain("self_report_gap");
    // Claiming full mastery on the same statements after those answers is inconsistent.
    const inflated = honest.map((answer) => ({ ...answer, credit: 1 }));
    const flagged = scoreAssessment({ ...base, items: [...tested, ...inflated] });
    expect(flagged.confidence.reasons).toContain("self_report_gap");
  });

  it("lowers confidence for speeding", () => {
    const items = session((i) => i % 2, 1200);
    const result = scoreAssessment({ items, skills, experience: "1to3", levels, config: DEFAULT_PROFESSION_CONFIG });
    expect(result.speedingRatio).toBe(1);
    expect(result.confidence.reasons).toContain("speeding");
    expect(result.confidence.level).not.toBe("high");
  });
});
