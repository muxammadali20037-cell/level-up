import { describe, expect, it } from "vitest";
import { fisherInformation, logLikelihood, probability, PROBABILITY_CEIL, PROBABILITY_FLOOR } from "./irt";

const item = { difficulty: 0, discrimination: 1, guessing: 0 };

describe("probability (3PL)", () => {
  it("equals c + (1 − c)/2 at θ = b", () => {
    expect(probability(0, item)).toBeCloseTo(0.5, 12);
    expect(probability(1.4, { difficulty: 1.4, discrimination: 2, guessing: 0.25 })).toBeCloseTo(0.625, 12);
  });

  it("matches the closed form at a known point", () => {
    // P(1) with a=1, b=0, c=0.2: 0.2 + 0.8 / (1 + e^-1.7)
    const expected = 0.2 + 0.8 / (1 + Math.exp(-1.7));
    expect(probability(1, { difficulty: 0, discrimination: 1, guessing: 0.2 })).toBeCloseTo(expected, 12);
  });

  it("is monotonically increasing in θ and bounded below by c", () => {
    const p = { difficulty: 0.5, discrimination: 1.2, guessing: 0.25 };
    let previous = 0;
    for (let theta = -4; theta <= 4; theta += 0.25) {
      const value = probability(theta, p);
      expect(value).toBeGreaterThan(previous);
      expect(value).toBeGreaterThanOrEqual(0.25);
      previous = value;
    }
  });

  it("is clamped away from 0 and 1", () => {
    expect(probability(-1000, item)).toBe(PROBABILITY_FLOOR);
    expect(probability(1000, item)).toBe(PROBABILITY_CEIL);
  });
});

describe("fisherInformation", () => {
  it("reduces to (D·a)²/4 at θ = b for the 2PL", () => {
    expect(fisherInformation(0, item)).toBeCloseTo((1.7 * 1.7) / 4, 6);
  });

  it("is lower with guessing and peaks above b", () => {
    const guess = { difficulty: 0, discrimination: 1, guessing: 0.25 };
    expect(fisherInformation(0, guess)).toBeLessThan(fisherInformation(0, item));
    expect(fisherInformation(0, guess)).toBeCloseTo(1.7 * 1.7 * 0.25 * 0.6, 6);
    expect(fisherInformation(0.2, guess)).toBeGreaterThan(fisherInformation(-0.2, guess));
  });

  it("grows with discrimination and vanishes far from b", () => {
    expect(fisherInformation(0, { ...item, discrimination: 2 })).toBeGreaterThan(fisherInformation(0, item));
    expect(fisherInformation(8, item)).toBeLessThan(1e-4);
    expect(fisherInformation(-8, { ...item, guessing: 0.25 })).toBeLessThan(1e-4);
  });
});

describe("logLikelihood", () => {
  it("is w·ln P for a correct answer and w·ln(1 − P) for a wrong one", () => {
    const p = probability(0.3, item);
    expect(logLikelihood(0.3, { ...item, credit: 1, weight: 1 })).toBeCloseTo(Math.log(p), 12);
    expect(logLikelihood(0.3, { ...item, credit: 0, weight: 0.5 })).toBeCloseTo(0.5 * Math.log(1 - p), 12);
  });

  it("interpolates linearly for fractional credit", () => {
    const p = probability(0, item);
    const expected = 0.5 * Math.log(p) + 0.5 * Math.log(1 - p);
    expect(logLikelihood(0, { ...item, credit: 0.5, weight: 1 })).toBeCloseTo(expected, 12);
  });

  it("ignores zero/negative weights and clamps credit", () => {
    expect(logLikelihood(0, { ...item, credit: 1, weight: 0 })).toBe(0);
    expect(logLikelihood(0, { ...item, credit: 1, weight: -2 })).toBe(0);
    expect(logLikelihood(0, { ...item, credit: 7, weight: 1 })).toBeCloseTo(Math.log(0.5), 12);
  });

  it("is always finite, even at extreme θ", () => {
    expect(Number.isFinite(logLikelihood(-50, { ...item, credit: 1, weight: 1 }))).toBe(true);
    expect(Number.isFinite(logLikelihood(50, { ...item, credit: 0, weight: 1 }))).toBe(true);
  });
});
