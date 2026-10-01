import { describe, expect, it } from "vitest";
import { DEFAULT_PROFESSION_CONFIG, type SkillEdge, type SkillModel } from "@/modules/catalog/domain/types";
import { standardLibrary } from "./__fixtures__/actions";
import { makeLevels } from "./__fixtures__/levels";
import { makeAbility, makeAssignment, mediumConfidence } from "./__fixtures__/scoring";
import { tx } from "./__fixtures__/text";
import { bandForScore } from "./banding";
import { type BottleneckInput, computeLeverage, findBottleneck, gapTarget, renderBottleneckExplanation } from "./bottleneck";
import { BOTTLENECK_EXPLANATION_TEMPLATES } from "./copy";
import { buildReport } from "./report";

const skill = (id: string, importance: number) => ({ id, importance, name: tx(id.toUpperCase()) });

function input(
  scores: Readonly<Record<string, number>>,
  edges: readonly SkillEdge[],
  importance: Readonly<Record<string, number>> = {},
  nextLevelThresholds: Readonly<Record<string, number>> = {},
): BottleneckInput {
  const ids = Object.keys(scores);
  return {
    skills: ids.map((id) => skill(id, importance[id] ?? 0.1)),
    scores,
    measured: Object.fromEntries(ids.map((id) => [id, true])),
    edges,
    nextLevelThresholds,
    weakSkillIds: ids.filter((id) => bandForScore(scores[id] ?? 0, nextLevelThresholds[id]) === "weak"),
  };
}

describe("gap target is the weak-band boundary max(40, next-level threshold)", () => {
  it("a weak skill that gates L+1 outranks an identical skill that gates nothing", () => {
    const gated = input({ a: 35, b: 35 }, [], {}, { a: 45 });
    expect(computeLeverage("a", gated).gapTerm).toBeCloseTo(0.1 * 10 / 100, 12);
    expect(computeLeverage("b", gated).gapTerm).toBeCloseTo(0.1 * 5 / 100, 12);
    expect(findBottleneck(gated)?.skillId).toBe("a");
  });

  it("a threshold below 40 never zeroes the gap of a weak skill", () => {
    const low = input({ a: 35, b: 35 }, [], {}, { a: 30 });
    expect(computeLeverage("a", low).gapTerm).toBeGreaterThan(0);
    expect(computeLeverage("a", low).gapTerm).toBe(computeLeverage("b", low).gapTerm);
  });

  it("is consistent with banding: weak ⇔ positive gap, for every score and threshold", () => {
    for (const threshold of [undefined, 10, 39, 40, 45, 70, 90]) {
      for (let score = 0; score <= 100; score += 1) {
        expect(gapTarget(threshold) - score > 0).toBe(bandForScore(score, threshold) === "weak");
      }
    }
  });
});

describe("reason limits_strong_skills only when non-weak skills are capped", () => {
  const limits = (from: string, to: string, strength: number, why?: string): SkillEdge => ({
    from,
    to,
    relation: "limits",
    strength,
    ...(why ? { rationale: tx(why) } : {}),
  });

  it("every skill weak: no empty-strengths explanation", () => {
    const bottleneck = findBottleneck(input({ systems: 10, sales: 39 }, [limits("systems", "sales", 1)]));
    expect(bottleneck).toMatchObject({ skillId: "systems", reason: "largest_gap", limitedSkillIds: [] });
    const rendered = renderBottleneckExplanation(bottleneck!, [skill("systems", 0.1), skill("sales", 0.1)]);
    expect(rendered.en).not.toContain("()");
    expect(rendered.en).toBe(
      "SYSTEMS has the largest gap to your next level, weighted by its importance. Closing it moves you forward fastest.",
    );
  });

  it("largest_gap never borrows the rationale of a limits edge to a weak skill", () => {
    const edges = [limits("finance", "marketing", 0.5, "Without a budget, marketing spend leaks.")];
    const bottleneck = findBottleneck(input({ finance: 20, marketing: 30 }, edges, { finance: 0.3 }));
    expect(bottleneck?.reason).toBe("largest_gap");
    expect(bottleneck?.explanation).toEqual(BOTTLENECK_EXPLANATION_TEMPLATES.largest_gap);
  });

  it("mixed targets: explains with the edge to the capped strong skill, not the weak one", () => {
    const edges = [limits("ops", "sales", 1, "About weak sales."), limits("ops", "brand", 0.3, "About strong brand.")];
    const bottleneck = findBottleneck(input({ ops: 10, sales: 38, brand: 70 }, edges));
    expect(bottleneck).toMatchObject({ skillId: "ops", reason: "limits_strong_skills", limitedSkillIds: ["brand"] });
    expect(bottleneck?.explanation.en).toBe("About strong brand.");
  });

  it("weak-only limits still count toward leverage (brief §8 formula) without changing the reason", () => {
    const value = computeLeverage("systems", input({ systems: 10, sales: 39 }, [limits("systems", "sales", 1)]));
    expect(value.limitsTerm).toBeCloseTo(0.29, 12);
    expect(value.leverage).toBeCloseTo(0.1 * 30 / 100 + 0.29, 12);
  });
});

describe("prerequisite-first walk is transitive (same rule as the plan's foundation order)", () => {
  const edges: SkillEdge[] = [
    { from: "finance", to: "marketing", relation: "prerequisite", strength: 0.6 },
    { from: "marketing", to: "systems", relation: "prerequisite", strength: 0.6 },
  ];
  const scores = { sales: 70, marketing: 50, systems: 20, finance: 35 };
  const importance = { sales: 0.3, marketing: 0.2, systems: 0.25, finance: 0.25 };

  it("moves to a weak prerequisite reached through a non-weak middle skill", () => {
    const bottleneck = findBottleneck(input(scores, edges, importance));
    expect(bottleneck).toMatchObject({ skillId: "finance", reason: "prerequisite_of_weak", unlocksSkillIds: ["systems"] });
  });

  it("the report, the 7-day plan and week 1 all start with the same skill", () => {
    const model: SkillModel = {
      professionId: "p",
      professionSlug: "p",
      skills: Object.entries(importance).map(([id, weight], i) => ({
        ...skill(id, weight),
        slug: id,
        globalSkillKey: null,
        description: tx(id),
        kind: "hard",
        sortOrder: i,
      })),
      edges,
      levels: makeLevels(),
      config: DEFAULT_PROFESSION_CONFIG,
    };
    const report = buildReport({
      professionId: "p",
      specializationId: null,
      ability: makeAbility(model, scores),
      assignment: makeAssignment(3),
      confidence: mediumConfidence,
      skillModel: model,
      actions: standardLibrary(Object.keys(scores)),
      doNotRules: [],
      preferences: { timePerDayMinutes: 30, budget: "free", goal: "professional" },
      percentile: null,
    });
    expect(report.bottleneck?.skillId).toBe("finance");
    expect(report.plan7[0]?.main.skillId).toBe("finance");
    expect(report.roadmap30[0]?.items[0]?.skillId).toBe("finance");
    expect(report.roadmap30[0]?.theme.en).toBe("Close the foundation gap in FINANCE");
  });
});
