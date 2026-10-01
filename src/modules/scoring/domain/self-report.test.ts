import { describe, expect, it } from "vitest";
import type { AnsweredItem } from "@/modules/assessments/domain/types";
import { MAX_SELF_REPORT_GAP } from "./confidence";
import { probability } from "./irt";
import { computeSelfReportGap } from "./self-report";
import { item, mulberry32 } from "./test-fixtures";

const LIKERT = [0, 0.25, 0.5, 0.75, 1] as const;
const opts = { priorMean: 0 };

/** Brief-default self_report item: a = 0.5, c = 0, weight 0.5, b = (targetLevel − 5) × 0.7. */
function selfReport(targetLevel: number, credit: number, skillId = "s1"): AnsweredItem {
  return item({
    skillId,
    type: "self_report",
    difficulty: (targetLevel - 5) * 0.7,
    discrimination: 0.5,
    guessing: 0,
    weight: 0.5,
    credit,
  });
}

/** Two 2PL items at b = 0 answered 1 and 0: the likelihood is symmetric, so θ̂ = prior mean = 0. */
function symmetricTested(skillId = "s1"): AnsweredItem[] {
  return [0, 1].map((credit) => item({ skillId, type: "knowledge", difficulty: 0, guessing: 0, credit }));
}

const nearestLikert = (p: number): number =>
  LIKERT.reduce((best, step) => (Math.abs(step - p) < Math.abs(best - p) ? step : best));

describe("computeSelfReportGap — known answers", () => {
  it("returns null when there is no self-report or no tested item", () => {
    expect(computeSelfReportGap([item({ credit: 1 })], opts)).toBeNull();
    expect(computeSelfReportGap([selfReport(5, 1)], opts)).toBeNull();
    expect(computeSelfReportGap([], opts)).toBeNull();
  });

  it("compares self-report credit with the credit predicted at the tested ability", () => {
    // θ̂ = 0 → P_sr = 0.5 at b = 0, and 1/(1 + e^{1.7·0.5·2.1}) at b = 2.1 (target level 8).
    expect(computeSelfReportGap([...symmetricTested(), selfReport(5, 0.5)], opts)).toBeCloseTo(0, 6);
    expect(computeSelfReportGap([...symmetricTested(), selfReport(5, 1)], opts)).toBeCloseTo(0.5, 6);
    const pLevel8 = 1 / (1 + Math.exp(1.7 * 0.5 * 2.1));
    expect(computeSelfReportGap([...symmetricTested(), selfReport(8, 0.25)], opts)).toBeCloseTo(0.25 - pLevel8, 6);
  });

  it("averages several self-report items before taking the absolute difference", () => {
    // Expected 0.5 for both items: (1 + 0) / 2 − 0.5 = 0.
    const items = [...symmetricTested(), selfReport(5, 1), selfReport(5, 0)];
    expect(computeSelfReportGap(items, opts)).toBeCloseTo(0, 6);
  });

  it("ignores self-report answers when estimating the tested ability (gap = |x − E|, E fixed)", () => {
    const tested = [item({ difficulty: -0.7, credit: 1 }), item({ difficulty: 0.7, credit: 0 }), item({ credit: 1 })];
    const expected = computeSelfReportGap([...tested, selfReport(6, 0)], opts) ?? Number.NaN;
    expect(expected).toBeGreaterThan(0);
    for (const credit of LIKERT) {
      expect(computeSelfReportGap([...tested, selfReport(6, credit)], opts)).toBeCloseTo(Math.abs(credit - expected), 9);
    }
  });

  it("uses the self-reported skill's own tested ability", () => {
    // Strong in s1, weak in s2: a high self-rating is consistent for s1, inconsistent for s2.
    const tested = [
      ...[-0.7, 0, 0.7, 1.4].map((difficulty) => item({ skillId: "s1", difficulty, credit: 1 })),
      ...[-1.4, -0.7, 0, 0.7].map((difficulty) => item({ skillId: "s2", difficulty, credit: 0 })),
    ];
    const strong = computeSelfReportGap([...tested, selfReport(5, 1, "s1")], opts) ?? 1;
    const weak = computeSelfReportGap([...tested, selfReport(5, 1, "s2")], opts) ?? 0;
    expect(strong).toBeLessThan(weak);
  });

  it("flags clearly inconsistent self-ratings", () => {
    const failsAll = [-0.7, 0, 0, 0.7, 0.7, 1.4].map((difficulty) => item({ difficulty, credit: 0 }));
    const acesAll = [-0.7, 0, 0, 0.7, 0.7, 1.4].map((difficulty) => item({ difficulty, credit: 1 }));
    expect(computeSelfReportGap([...failsAll, selfReport(5, 1)], opts)).toBeGreaterThan(MAX_SELF_REPORT_GAP);
    expect(computeSelfReportGap([...acesAll, selfReport(5, 0)], opts)).toBeGreaterThan(MAX_SELF_REPORT_GAP);
    // A modest self-rating on a master-level statement is consistent even for a strong performer.
    expect(computeSelfReportGap([...acesAll, selfReport(9, 0)], opts)).toBeLessThan(MAX_SELF_REPORT_GAP);
  });
});

describe("computeSelfReportGap — model-consistent respondents (simulation)", () => {
  /**
   * One simulated session: 12 tested items (a = 1, c = 0.25) targeted near θ like adaptive routing does, answered by
   * the 3PL model; two self-report items at the given target levels answered with the Likert step closest to P(θ).
   */
  function session(theta: number, srLevels: readonly [number, number], seed: number): AnsweredItem[] {
    const next = mulberry32(seed);
    const tested = Array.from({ length: 12 }, (_, i) => {
      const params = { difficulty: theta + (next() - 0.5) * 1.4, discrimination: 1, guessing: 0.25 };
      return item({ ...params, skillId: `s${i % 4}`, credit: next() < probability(theta, params) ? 1 : 0 });
    });
    const selfReports = srLevels.map((level, i) => {
      const sr = selfReport(level, 0, `s${i}`);
      return { ...sr, credit: nearestLikert(probability(theta, sr)) };
    });
    return [...tested, ...selfReports];
  }

  const rawGap = (items: readonly AnsweredItem[]): number => {
    const mean = (xs: readonly AnsweredItem[]): number => xs.reduce((s, x) => s + x.credit, 0) / xs.length;
    return Math.abs(mean(items.filter((x) => x.type === "self_report")) - mean(items.filter((x) => x.type !== "self_report")));
  };

  it.each([
    ["easy (levels 2–3)", [2, 3] as const],
    ["mid (level 5)", [5, 5] as const],
    ["hard (levels 8–9)", [8, 9] as const],
  ])("almost never flags an honest respondent with %s self-report items", (_label, levels) => {
    for (const theta of [-2, -1, 0, 1, 2]) {
      let flagged = 0;
      for (let s = 0; s < 200; s += 1) {
        const gap = computeSelfReportGap(session(theta, levels, 1000 * (theta + 3) + s), { priorMean: theta / 2 });
        if (gap !== null && gap > MAX_SELF_REPORT_GAP) flagged += 1;
      }
      expect(flagged / 200).toBeLessThanOrEqual(0.03);
    }
  });

  it("regression: the raw credit comparison flagged honest respondents depending on item difficulty", () => {
    let raw = 0;
    let model = 0;
    for (let s = 0; s < 200; s += 1) {
      const items = session(-1, [8, 9], 77 + s);
      if (rawGap(items) > MAX_SELF_REPORT_GAP) raw += 1;
      if ((computeSelfReportGap(items, { priorMean: -0.5 }) ?? 0) > MAX_SELF_REPORT_GAP) model += 1;
    }
    expect(raw).toBeGreaterThan(100);
    expect(model).toBeLessThanOrEqual(6);
  });
});
