import { describe, expect, it } from "vitest";
import { buildThetaGrid, eapEstimate, posteriorWeights, THETA_GRID } from "./eap";
import { item } from "./test-fixtures";

describe("theta grid", () => {
  it("covers [−4, 4] in 0.05 steps, symmetric", () => {
    expect(THETA_GRID).toHaveLength(161);
    expect(THETA_GRID[0]).toBe(-4);
    expect(THETA_GRID[80]).toBe(0);
    expect(THETA_GRID[160]).toBe(4);
    expect(THETA_GRID[1]).toBe(-3.95);
  });

  it("rejects invalid grids", () => {
    expect(() => buildThetaGrid(0, 1, 0)).toThrow(RangeError);
    expect(() => buildThetaGrid(1, 0, 0.1)).toThrow(RangeError);
  });
});

describe("eapEstimate", () => {
  it("returns the prior mean and SD when there are no items", () => {
    const standard = eapEstimate([], { mean: 0, sd: 1 });
    expect(standard.theta).toBeCloseTo(0, 10);
    expect(standard.se).toBeCloseTo(1, 3);
    const shifted = eapEstimate([], { mean: 0.8, sd: 1 });
    // Truncation of the grid at +4 pulls the mean very slightly inwards.
    expect(shifted.theta).toBeCloseTo(0.8, 2);
    expect(shifted.se).toBeCloseTo(1, 2);
  });

  it("rejects invalid priors", () => {
    expect(() => eapEstimate([], { mean: 0, sd: 0 })).toThrow(RangeError);
    expect(() => eapEstimate([], { mean: Number.NaN, sd: 1 })).toThrow(RangeError);
  });

  it("all-correct on hard items gives a high θ; all-wrong on easy items gives a low θ", () => {
    const hard = Array.from({ length: 10 }, (_, i) => item({ difficulty: 1.4 + (i % 3) * 0.35, credit: 1 }));
    const easy = Array.from({ length: 10 }, (_, i) => item({ difficulty: -1.4 - (i % 3) * 0.35, credit: 0 }));
    const high = eapEstimate(hard, { mean: 0, sd: 1 });
    const low = eapEstimate(easy, { mean: 0, sd: 1 });
    expect(high.theta).toBeGreaterThan(1.5);
    expect(low.theta).toBeLessThan(-1.5);
    expect(high.se).toBeLessThan(1);
    expect(low.se).toBeLessThan(1);
  });

  it("is monotone in credit", () => {
    const base = Array.from({ length: 6 }, (_, i) => item({ difficulty: -1 + i * 0.4, credit: i % 2 }));
    let previous = -Infinity;
    for (const credit of [0, 0.25, 0.5, 0.75, 1]) {
      const responses = [...base, item({ difficulty: 0.3, credit })];
      const { theta } = eapEstimate(responses, { mean: 0, sd: 1 });
      expect(theta).toBeGreaterThan(previous);
      previous = theta;
    }
  });

  it("is monotone in the number of correct answers", () => {
    let previous = -Infinity;
    for (let correct = 0; correct <= 8; correct++) {
      const responses = Array.from({ length: 8 }, (_, i) => item({ difficulty: 0, credit: i < correct ? 1 : 0 }));
      const { theta } = eapEstimate(responses, { mean: 0, sd: 1 });
      expect(theta).toBeGreaterThan(previous);
      previous = theta;
    }
  });

  it("shrinks SE as items are added", () => {
    const responses = Array.from({ length: 12 }, (_, i) => item({ difficulty: (i % 5) * 0.5 - 1, credit: i % 2 }));
    const se4 = eapEstimate(responses.slice(0, 4), { mean: 0, sd: 1 }).se;
    const se12 = eapEstimate(responses, { mean: 0, sd: 1 }).se;
    expect(se12).toBeLessThan(se4);
    expect(se4).toBeLessThan(1);
  });

  it("down-weights low-weight items", () => {
    const full = eapEstimate([item({ difficulty: 0, credit: 1, weight: 1 })], { mean: 0, sd: 1 });
    const half = eapEstimate([item({ difficulty: 0, credit: 1, weight: 0.5 })], { mean: 0, sd: 1 });
    expect(full.theta).toBeGreaterThan(half.theta);
    expect(half.theta).toBeGreaterThan(0);
  });

  it("stays numerically stable with many extreme responses", () => {
    const responses = Array.from({ length: 400 }, () => item({ difficulty: -3, credit: 0, discrimination: 2 }));
    const weights = posteriorWeights(responses, { mean: 0, sd: 1 });
    expect(weights.reduce((sum, w) => sum + w, 0)).toBeCloseTo(1, 12);
    const { theta, se } = eapEstimate(responses, { mean: 0, sd: 1 });
    expect(Number.isFinite(theta)).toBe(true);
    expect(theta).toBeGreaterThanOrEqual(-4);
    expect(theta).toBeLessThan(-3);
    expect(se).toBeGreaterThanOrEqual(0);
  });

  it("is deterministic", () => {
    const responses = [item({ difficulty: 0.7, credit: 1 }), item({ difficulty: -0.7, credit: 0.5 })];
    expect(eapEstimate(responses, { mean: 0.4, sd: 1 })).toEqual(eapEstimate(responses, { mean: 0.4, sd: 1 }));
  });
});
