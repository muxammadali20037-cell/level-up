import { describe, expect, it } from "vitest";
import { eapEstimate } from "./eap";
import {
  compositeFromSkillScores,
  estimateAbilities,
  normalizeImportances,
  scoreFromTheta,
  skillScoreMap,
  thetaFromScore,
} from "./estimate";
import { item } from "./test-fixtures";

describe("score mapping", () => {
  it("maps known θ values", () => {
    expect(scoreFromTheta(0)).toBe(50);
    expect(scoreFromTheta(-3.5)).toBe(0);
    expect(scoreFromTheta(3.5)).toBe(100);
    expect(scoreFromTheta(1)).toBe(64); // 4.5/7 = 64.29
    expect(scoreFromTheta(-4)).toBe(0);
    expect(scoreFromTheta(4)).toBe(100);
    expect(Object.is(scoreFromTheta(-3.52), 0)).toBe(true);
  });

  it("is the inverse of thetaFromScore (up to rounding)", () => {
    for (let score = 0; score <= 100; score += 1) expect(scoreFromTheta(thetaFromScore(score))).toBe(score);
    expect(thetaFromScore(50)).toBeCloseTo(0, 12);
    expect(thetaFromScore(150)).toBeCloseTo(3.5, 12);
  });
});

describe("composite weighting", () => {
  const skills = [
    { id: "a", importance: 3 },
    { id: "b", importance: 1 },
  ];

  it("normalizes importances and computes a weighted mean (1 decimal)", () => {
    expect(compositeFromSkillScores({ a: 80, b: 40 }, skills)).toBe(70);
    expect(compositeFromSkillScores({ a: 81, b: 40 }, skills)).toBe(70.8); // 60.75 + 10
  });

  it("uses equal weights when all importances are zero or invalid", () => {
    const weights = normalizeImportances([
      { id: "a", importance: 0 },
      { id: "b", importance: -1 },
    ]);
    expect(weights.get("a")).toBe(0.5);
    expect(weights.get("b")).toBe(0.5);
    expect(
      compositeFromSkillScores({ a: 81, b: 40 }, [
        { id: "a", importance: 0 },
        { id: "b", importance: 0 },
      ]),
    ).toBe(60.5);
  });

  it("is scale invariant in importances", () => {
    const scaled = skills.map((s) => ({ ...s, importance: s.importance * 17 }));
    expect(compositeFromSkillScores({ a: 63, b: 22 }, scaled)).toBe(compositeFromSkillScores({ a: 63, b: 22 }, skills));
  });
});

describe("estimateAbilities", () => {
  const skills = [
    { id: "sales", importance: 0.5 },
    { id: "finance", importance: 0.3 },
    { id: "ops", importance: 0.2 },
  ];

  it("returns the prior and unmeasured skills when nothing was answered", () => {
    const result = estimateAbilities({ items: [], skills, priorMean: 0 });
    expect(result.thetaG).toBeCloseTo(0, 10);
    expect(result.seG).toBeCloseTo(1, 3);
    expect(result.composite).toBe(50);
    expect(result.compositeSe).toBe(14.3);
    for (const skill of result.skills) {
      expect(skill.measured).toBe(false);
      expect(skill.nItems).toBe(0);
      expect(skill.theta).toBe(result.thetaG);
      expect(skill.se).toBeCloseTo(Math.sqrt(result.seG ** 2 + 0.8 ** 2), 12);
    }
  });

  it("estimates θ_g from all items and θ_s from the skill's items with prior N(θ_g, τ²)", () => {
    const items = [
      item({ skillId: "sales", difficulty: 0.7, credit: 1 }),
      item({ skillId: "sales", difficulty: 1.4, credit: 1 }),
      item({ skillId: "sales", difficulty: 2.1, credit: 1 }),
      item({ skillId: "finance", difficulty: -0.7, credit: 0 }),
      item({ skillId: "finance", difficulty: -1.4, credit: 0 }),
      item({ skillId: "finance", difficulty: 0, credit: 0 }),
    ];
    const result = estimateAbilities({ items, skills, priorMean: 0 });
    const general = eapEstimate(items, { mean: 0, sd: 1 });
    expect(result.thetaG).toBeCloseTo(general.theta, 12);
    expect(result.seG).toBeCloseTo(general.se, 12);

    const [sales, finance, ops] = result.skills;
    const salesItems = items.filter((i) => i.skillId === "sales");
    expect(sales?.theta).toBeCloseTo(eapEstimate(salesItems, { mean: general.theta, sd: 0.8 }).theta, 12);
    expect(sales?.theta).toBeGreaterThan(result.thetaG);
    expect(finance?.theta).toBeLessThan(result.thetaG);
    expect(sales?.nItems).toBe(3);
    expect(ops).toMatchObject({ measured: false, nItems: 0, theta: result.thetaG });
    expect(result.composite).toBe(compositeFromSkillScores(skillScoreMap(result.skills), skills));
  });

  it("shrinks a skill with a single item towards θ_g", () => {
    const items = [
      ...Array.from({ length: 10 }, (_, i) => item({ skillId: "sales", difficulty: -0.5 + (i % 3) * 0.3, credit: i % 2 })),
      item({ skillId: "finance", difficulty: 2.1, credit: 1 }),
    ];
    const result = estimateAbilities({ items, skills, priorMean: 0 });
    const finance = result.skills.find((s) => s.skillId === "finance");
    expect(finance?.measured).toBe(true);
    expect(finance?.nItems).toBe(1);
    expect(Math.abs((finance?.theta ?? 0) - result.thetaG)).toBeLessThan(0.6);
    // A flat prior would let one correct hard item pull much further than the hierarchical prior does.
    const loose = eapEstimate([items[10]!], { mean: result.thetaG, sd: 3 });
    expect(loose.theta - result.thetaG).toBeGreaterThan((finance?.theta ?? 0) - result.thetaG);
  });

  it("lets many consistent items pull a skill away from θ_g", () => {
    const items = [
      ...Array.from({ length: 8 }, (_, i) => item({ skillId: "sales", difficulty: -0.7 + (i % 3) * 0.7, credit: 1 })),
      ...Array.from({ length: 8 }, (_, i) => item({ skillId: "finance", difficulty: -0.7 + (i % 3) * 0.7, credit: 0 })),
    ];
    const result = estimateAbilities({ items, skills, priorMean: 0 });
    const sales = result.skills.find((s) => s.skillId === "sales")!;
    const finance = result.skills.find((s) => s.skillId === "finance")!;
    expect(sales.theta).toBeGreaterThan(result.thetaG + 0.5);
    expect(finance.theta).toBeLessThan(result.thetaG - 0.5);
    expect(sales.score - finance.score).toBeGreaterThan(25);
  });

  it("treats a pattern explainable by guessing conservatively (3PL)", () => {
    // Correct on hard items but wrong on easy ones: the correct answers are attributed to guessing.
    const items = [
      ...Array.from({ length: 8 }, () => item({ skillId: "sales", difficulty: 1.4, credit: 1 })),
      ...Array.from({ length: 8 }, () => item({ skillId: "finance", difficulty: -1.4, credit: 0 })),
    ];
    const result = estimateAbilities({ items, skills, priorMean: 0 });
    expect(result.thetaG).toBeLessThan(-1);
    expect(result.composite).toBeLessThan(35);
  });

  it("uses the experience prior mean for θ_g", () => {
    const items = [item({ skillId: "sales", difficulty: 0, credit: 0.5 })];
    const novice = estimateAbilities({ items, skills, priorMean: -1 });
    const veteran = estimateAbilities({ items, skills, priorMean: 0.8 });
    expect(veteran.thetaG).toBeGreaterThan(novice.thetaG);
    expect(veteran.composite).toBeGreaterThan(novice.composite);
  });

  it("falls back to scoreFromTheta(θ_g) without skills and dedupes skills", () => {
    const items = [item({ difficulty: 1, credit: 1 })];
    const none = estimateAbilities({ items, skills: [], priorMean: 0 });
    expect(none.skills).toHaveLength(0);
    expect(none.composite).toBe(scoreFromTheta(none.thetaG));
    const dup = estimateAbilities({ items, skills: [skills[0]!, skills[0]!], priorMean: 0 });
    expect(dup.skills).toHaveLength(1);
  });

  it("rejects an invalid τ", () => {
    expect(() => estimateAbilities({ items: [], skills, priorMean: 0, tau: 0 })).toThrow(RangeError);
  });
});
