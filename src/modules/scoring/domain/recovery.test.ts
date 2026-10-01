import { describe, expect, it } from "vitest";
import { EXPERIENCE_PRIOR_MEAN, type AnsweredItem } from "@/modules/assessments/domain/types";
import { eapEstimate } from "./eap";
import { estimateAbilities } from "./estimate";
import { probability } from "./irt";
import { mulberry32 } from "./test-fixtures";

const ITEMS = 12;
const RESPONDENTS = 200;
const SPREAD = 1;
const THETAS = [-2, -1, 0, 1, 2] as const;
/** Experience band a respondent of this true ability would plausibly report. */
const PRIOR_FOR: Record<(typeof THETAS)[number], number> = {
  [-2]: EXPERIENCE_PRIOR_MEAN.none,
  [-1]: EXPERIENCE_PRIOR_MEAN.lt1,
  0: EXPERIENCE_PRIOR_MEAN["1to3"],
  1: EXPERIENCE_PRIOR_MEAN["3to5"],
  2: EXPERIENCE_PRIOR_MEAN["5plus"],
};

/** 12 items with b evenly spread over θ ± 1 (a = 1, c = 0.25); binary responses drawn from the 3PL. */
function simulate(trueTheta: number, rng: () => number, skillId = "s"): AnsweredItem[] {
  return Array.from({ length: ITEMS }, (_, i): AnsweredItem => {
    const params = { difficulty: trueTheta - SPREAD + (2 * SPREAD * i) / (ITEMS - 1), discrimination: 1, guessing: 0.25 };
    const credit = rng() < probability(trueTheta, params) ? 1 : 0;
    return { questionId: `q${i}`, skillId, type: "knowledge", weight: 1, credit, responseMs: 9000, ...params };
  });
}

function recover(trueTheta: number, priorMean: number, seed: number) {
  const rng = mulberry32(seed);
  let absError = 0;
  let signedError = 0;
  let seSum = 0;
  for (let r = 0; r < RESPONDENTS; r++) {
    const estimate = eapEstimate(simulate(trueTheta, rng), { mean: priorMean, sd: 1 });
    absError += Math.abs(estimate.theta - trueTheta);
    signedError += estimate.theta - trueTheta;
    seSum += estimate.se;
  }
  return { mae: absError / RESPONDENTS, bias: signedError / RESPONDENTS, meanSe: seSum / RESPONDENTS };
}

describe("ability recovery simulation (seeded mulberry32)", () => {
  for (const trueTheta of THETAS) {
    it(`recovers θ = ${trueTheta} with mean |θ̂ − θ| < 0.6 (experience-consistent prior)`, () => {
      const { mae, bias, meanSe } = recover(trueTheta, PRIOR_FOR[trueTheta], 1000 + trueTheta * 7);
      expect(mae).toBeLessThan(0.6);
      expect(Math.abs(bias)).toBeLessThan(0.45);
      // Reported posterior SD is of the same order as the observed error.
      expect(meanSe).toBeGreaterThan(0.3);
      expect(meanSe).toBeLessThan(0.65);
    });
  }

  it("keeps the overall mean |θ̂ − θ| < 0.6 with a neutral N(0, 1) prior", () => {
    const results = THETAS.map((theta) => recover(theta, 0, 2000 + theta * 13));
    const overall = results.reduce((sum, r) => sum + r.mae, 0) / results.length;
    expect(overall).toBeLessThan(0.6);
    // Central abilities are recovered well.
    for (const r of results.slice(1, 4)) expect(r.mae).toBeLessThan(0.6);
    // Known limitation: EAP shrinks extremes towards the prior mean (stronger at the top for 3PL, c = 0.25).
    const [low, , , , high] = results;
    expect(low?.bias).toBeGreaterThan(0);
    expect(high?.bias).toBeLessThan(0);
    expect(high?.mae).toBeLessThan(0.9);
  });

  it("orders respondents correctly on average", () => {
    const rng = mulberry32(42);
    const means = THETAS.map((theta) => {
      let sum = 0;
      for (let r = 0; r < 50; r++) sum += eapEstimate(simulate(theta, rng), { mean: 0, sd: 1 }).theta;
      return sum / 50;
    });
    for (let i = 1; i < means.length; i++) expect(means[i]!).toBeGreaterThan(means[i - 1]!);
  });

  /**
   * Spiky profile: one skill at θ = 1.5, another at θ = −1.5, 6 items each. Known limitation of the specified
   * model: with c = 0.25 the unidimensional θ_g reads correct answers on hard items as partly guessed and lands
   * below the midpoint, and the τ = 0.8 prior then pulls the strong skill towards it. Ordering survives, but the
   * gap (true ≈ 43 points) is compressed; with c = 0 items (partial credit / self-report) the gap is much wider.
   */
  function meanSkillGap(guessing: number, seed: number): number {
    const rng = mulberry32(seed);
    const runs = 50;
    let gap = 0;
    for (let r = 0; r < runs; r++) {
      const strong = simulate(1.5, rng, "strong").filter((_, i) => i % 2 === 0);
      const weak = simulate(-1.5, rng, "weak").filter((_, i) => i % 2 === 0);
      const result = estimateAbilities({
        items: [...strong, ...weak].map((i) => ({ ...i, guessing })),
        skills: [
          { id: "strong", importance: 0.5 },
          { id: "weak", importance: 0.5 },
        ],
        priorMean: 0,
      });
      const [s, w] = result.skills;
      gap += (s?.score ?? 0) - (w?.score ?? 0);
    }
    return gap / runs;
  }

  it("keeps a strong skill above a weak one through the hierarchical model (c = 0.25)", () => {
    const gap = meanSkillGap(0.25, 7);
    expect(gap).toBeGreaterThan(8);
    expect(gap).toBeLessThan(43);
  });

  it("separates skills more clearly without guessing (c = 0)", () => {
    const gap = meanSkillGap(0, 7);
    expect(gap).toBeGreaterThan(18);
    expect(gap).toBeGreaterThan(meanSkillGap(0.25, 7));
  });
});
