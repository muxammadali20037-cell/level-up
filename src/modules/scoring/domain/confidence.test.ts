import { describe, expect, it } from "vitest";
import {
  assessConfidence,
  computeSpeedingRatio,
  countUnmeasuredImportantSkills,
  HIGH_CONFIDENCE,
  MEDIUM_CONFIDENCE,
} from "./confidence";
import { eapEstimate } from "./eap";
import { probability } from "./irt";
import type { ConfidenceInput, SkillEstimate } from "./types";

const base: ConfidenceInput = {
  nItems: 12,
  seG: 0.3,
  speedingRatio: 0,
  selfReportGap: null,
  nearBoundary: false,
  unmeasuredImportantSkills: 0,
};

describe("assessConfidence — base matrix", () => {
  it.each([
    [12, 0.35, "high", []],
    [15, 0.2, "high", []],
    [12, 0.36, "medium", ["high_uncertainty"]],
    [11, 0.3, "medium", ["few_items"]],
    [8, 0.55, "medium", ["few_items", "high_uncertainty"]],
    [7, 0.3, "low", ["few_items"]],
    [12, 0.56, "low", ["high_uncertainty"]],
    [0, 1, "low", ["few_items", "high_uncertainty"]],
  ] as const)("n=%d, SE=%d → %s", (nItems, seG, level, reasons) => {
    expect(assessConfidence({ ...base, nItems, seG })).toEqual({ level, reasons });
  });
});

describe("assessConfidence — downgrades", () => {
  it("downgrades one step for speeding (> 30%)", () => {
    expect(assessConfidence({ ...base, speedingRatio: 0.3 }).level).toBe("high");
    expect(assessConfidence({ ...base, speedingRatio: 0.31 })).toEqual({ level: "medium", reasons: ["speeding"] });
  });

  it("downgrades one step for a self-report gap (> 0.45)", () => {
    expect(assessConfidence({ ...base, selfReportGap: 0.45 }).level).toBe("high");
    expect(assessConfidence({ ...base, selfReportGap: 0.5 })).toEqual({ level: "medium", reasons: ["self_report_gap"] });
  });

  it("applies one downgrade per triggered condition and never goes below low", () => {
    expect(assessConfidence({ ...base, speedingRatio: 0.5, selfReportGap: 0.6 }).level).toBe("low");
    expect(assessConfidence({ ...base, nItems: 9, speedingRatio: 0.5, selfReportGap: 0.6 }).level).toBe("low");
    expect(assessConfidence({ ...base, nItems: 9, speedingRatio: 0.5 }).level).toBe("low");
  });

  it("adds near_boundary and unmeasured_skills as informational reasons", () => {
    const result = assessConfidence({ ...base, nearBoundary: true, unmeasuredImportantSkills: 2 });
    expect(result).toEqual({ level: "high", reasons: ["near_boundary", "unmeasured_skills"] });
  });

  it("lists every factor in a fixed order", () => {
    const result = assessConfidence({
      nItems: 7,
      seG: 0.6,
      speedingRatio: 0.4,
      selfReportGap: 0.7,
      nearBoundary: true,
      unmeasuredImportantSkills: 1,
    });
    expect(result.reasons).toEqual([
      "few_items",
      "high_uncertainty",
      "speeding",
      "self_report_gap",
      "near_boundary",
      "unmeasured_skills",
    ]);
  });
});

describe("computeSpeedingRatio", () => {
  it("counts answers under the threshold among timed items only", () => {
    const items = [{ responseMs: 1000 }, { responseMs: 2499 }, { responseMs: 2500 }, { responseMs: 9000 }, { responseMs: null }];
    expect(computeSpeedingRatio(items)).toBe(0.5);
    expect(computeSpeedingRatio(items, 1500)).toBe(0.25);
  });

  it("returns 0 when no item has timing", () => {
    expect(computeSpeedingRatio([{ responseMs: null }])).toBe(0);
    expect(computeSpeedingRatio([])).toBe(0);
  });
});

describe("countUnmeasuredImportantSkills", () => {
  const estimate = (skillId: string, measured: boolean): SkillEstimate => ({
    skillId,
    theta: 0,
    se: 1,
    score: 50,
    nItems: measured ? 2 : 0,
    measured,
  });
  const skills = [
    { id: "a", importance: 0.4 },
    { id: "b", importance: 0.3 },
    { id: "c", importance: 0.2 },
    { id: "d", importance: 0.1 },
  ];

  it("counts unmeasured skills at or above average importance by default", () => {
    const estimates = [estimate("a", true), estimate("b", false), estimate("c", false), estimate("d", false)];
    expect(countUnmeasuredImportantSkills(estimates, skills)).toBe(1);
    expect(countUnmeasuredImportantSkills(estimates, skills, 0.15)).toBe(2);
    expect(countUnmeasuredImportantSkills(estimates, [])).toBe(0);
  });
});

describe("calibration canary (brief §7 thresholds vs. default item parameters)", () => {
  /** Posterior SD after n items at b = θ = 0 (a = 1, c = 1/options) with expected (fractional) credit. */
  const targetedSe = (n: number, guessing: number): number => {
    const params = { difficulty: 0, discrimination: 1, guessing };
    const responses = Array.from({ length: n }, () => ({ ...params, credit: probability(0, params), weight: 1 }));
    return eapEstimate(responses, { mean: 0, sd: 1 }).se;
  };

  it("HIGH (SE_g ≤ 0.35) is out of reach for 15 ideal single-best items; MEDIUM is reachable", () => {
    // Fails once items or thresholds are recalibrated — then revisit the confidence/range rules and this test.
    expect(targetedSe(15, 0.25)).toBeCloseTo(0.419, 2);
    expect(targetedSe(15, 0.25)).toBeGreaterThan(HIGH_CONFIDENCE.maxSe);
    expect(targetedSe(15, 0.2)).toBeGreaterThan(HIGH_CONFIDENCE.maxSe);
    expect(targetedSe(12, 0.25)).toBeLessThan(MEDIUM_CONFIDENCE.maxSe);
  });
});
