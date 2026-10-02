import { describe, expect, it } from "vitest";
import { eapEstimate } from "./eap";
import { hierarchicalPosterior } from "./hierarchical";
import { item } from "./test-fixtures";
import type { ScoredResponse } from "./types";

const prior = { mean: 0, sd: 1 };
const weights = new Map([
  ["a", 0.6],
  ["b", 0.4],
]);

describe("hierarchicalPosterior", () => {
  it("returns the prior without data; unmeasured skills ≈ N(μ0, σ0² + τ²)", () => {
    const post = hierarchicalPosterior({ groups: new Map(), prior, tau: 1, weights });
    expect(post.general.theta).toBeCloseTo(0, 10);
    expect(post.general.se).toBeCloseTo(1, 3);
    for (const id of ["a", "b"]) {
      expect(post.skills.get(id)?.theta).toBeCloseTo(0, 10);
      expect(post.skills.get(id)?.se).toBeCloseTo(Math.SQRT2, 1);
    }
  });

  it("with one measured skill equals an EAP with the marginal prior N(μ0, σ0² + τ²)", () => {
    const items: ScoredResponse[] = [
      item({ difficulty: 0.5, credit: 1 }),
      item({ difficulty: 1.2, credit: 0 }),
      item({ difficulty: -0.3, credit: 1 }),
    ];
    const tau = 0.8;
    const post = hierarchicalPosterior({ groups: new Map([["a", items]]), prior, tau, weights: new Map([["a", 1]]) });
    const marginal = eapEstimate(items, { mean: 0, sd: Math.sqrt(1 + tau * tau) });
    expect(post.skills.get("a")?.theta).toBeCloseTo(marginal.theta, 2);
    expect(post.skills.get("a")?.se).toBeCloseTo(marginal.se, 2);
    expect(post.composite.theta).toBeCloseTo(post.skills.get("a")?.theta ?? NaN, 10);
  });

  it("pools skills through θ_g and reports the composite as the weighted skill mean", () => {
    const strong = Array.from({ length: 5 }, () => item({ difficulty: 0.7, credit: 1 }));
    const weak = Array.from({ length: 5 }, () => item({ difficulty: -0.7, credit: 0 }));
    const post = hierarchicalPosterior({
      groups: new Map([
        ["a", strong],
        ["b", weak],
      ]),
      prior,
      tau: 1.5,
      weights,
    });
    const a = post.skills.get("a")?.theta ?? NaN;
    const b = post.skills.get("b")?.theta ?? NaN;
    expect(a).toBeGreaterThan(post.general.theta);
    expect(b).toBeLessThan(post.general.theta);
    expect(post.composite.theta).toBeCloseTo(0.6 * a + 0.4 * b, 10);
    // A smaller τ pools harder: the two skills move towards each other.
    const pooled = hierarchicalPosterior({ groups: new Map([["a", strong], ["b", weak]]), prior, tau: 0.5, weights });
    expect((pooled.skills.get("a")?.theta ?? 0) - (pooled.skills.get("b")?.theta ?? 0)).toBeLessThan(a - b);
  });

  it("rejects an invalid prior or τ", () => {
    expect(() => hierarchicalPosterior({ groups: new Map(), prior, tau: 0, weights })).toThrow(RangeError);
    expect(() => hierarchicalPosterior({ groups: new Map(), prior: { mean: 0, sd: 0 }, tau: 1, weights })).toThrow(
      RangeError,
    );
  });
});
