import { describe, expect, it } from "vitest";
import { DEFAULT_PROFESSION_CONFIG, type GoalType, type Skill } from "@/modules/catalog/domain/types";
import { assignLevel, compositeFromSkillScores, type ScoringSkill } from "@/modules/scoring/domain";
import { defaultLevels, levelInput } from "@/modules/scoring/domain/test-fixtures";
import {
  adjustedImportance,
  compositeImportance,
  GOAL_BOOST_MULTIPLIER,
  goalBoosts,
  routingImportance,
} from "./importance";
import { text } from "./test-fixtures";

function skill(id: string, importance: number, overrides: Partial<Skill> = {}): Skill {
  return {
    id,
    slug: id,
    globalSkillKey: null,
    name: text(id),
    description: text(id),
    kind: "hard",
    importance,
    sortOrder: 0,
    ...overrides,
  };
}

const sum = (values: readonly { importance: number }[]): number => values.reduce((a, b) => a + b.importance, 0);

describe("adjustedImportance", () => {
  const skills = [skill("a", 0.5), skill("b", 0.3), skill("c", 0.2)];

  it("normalizes to 1 and preserves order without multipliers", () => {
    const result = adjustedImportance(skills);
    expect(result.map((s) => s.id)).toEqual(["a", "b", "c"]);
    expect(sum(result)).toBeCloseTo(1, 12);
    expect(result[0]?.importance).toBeCloseTo(0.5, 12);
  });

  it("multiplies importance by specialization weights and boosts before normalizing", () => {
    // raw: a 0.5×2 = 1.0, b 0.3×1×1.5 = 0.45, c 0.2 → total 1.65
    const result = adjustedImportance(skills, { specializationWeights: { a: 2 }, boosts: { b: 1.5 } });
    expect(result.find((s) => s.id === "a")?.importance).toBeCloseTo(1.0 / 1.65, 12);
    expect(result.find((s) => s.id === "b")?.importance).toBeCloseTo(0.45 / 1.65, 12);
    expect(result.find((s) => s.id === "c")?.importance).toBeCloseTo(0.2 / 1.65, 12);
    expect(sum(result)).toBeCloseTo(1, 12);
  });

  it("drops a skill with specialization weight 0 and ignores invalid multipliers", () => {
    const result = adjustedImportance(skills, {
      specializationWeights: { c: 0, b: Number.NaN },
      boosts: { a: -3 },
    });
    expect(result.find((s) => s.id === "c")?.importance).toBe(0);
    expect(result.find((s) => s.id === "a")?.importance).toBeCloseTo(0.5 / 0.8, 12);
    expect(result.find((s) => s.id === "b")?.importance).toBeCloseTo(0.3 / 0.8, 12);
  });

  it("is monotone: raising one multiplier raises that skill's share", () => {
    let previous = 0;
    for (const boost of [0.5, 1, 1.3, 2, 4]) {
      const share = adjustedImportance(skills, { boosts: { c: boost } }).find((s) => s.id === "c")?.importance ?? 0;
      expect(share).toBeGreaterThan(previous);
      previous = share;
    }
  });

  it("falls back to equal weights when everything is zero, and handles empty input and duplicates", () => {
    expect(adjustedImportance([skill("x", 0), skill("y", 0)]).map((s) => s.importance)).toEqual([0.5, 0.5]);
    expect(adjustedImportance([])).toEqual([]);
    const deduped = adjustedImportance([skill("x", 1), skill("x", 5), skill("y", 1)]);
    expect(deduped).toEqual([
      { id: "x", importance: 0.5 },
      { id: "y", importance: 0.5 },
    ]);
  });
});

describe("goalBoosts", () => {
  const skills = [
    skill("s-lead", 0.2, { slug: "team-leadership" }),
    skill("s-people", 0.2, { slug: "hiring", globalSkillKey: "people_management" }),
    skill("s-deleg", 0.2, { slug: "Delegation" }),
    skill("s-sales", 0.2, { slug: "sales-negotiation", globalSkillKey: "negotiation" }),
    skill("s-fin", 0.2, { slug: "finance" }),
  ];

  it.each<GoalType>(["lead", "manager"])("boosts people-leadership skills ×1.3 for goal %s", (goal) => {
    expect(goalBoosts(goal, skills)).toEqual({
      "s-lead": GOAL_BOOST_MULTIPLIER,
      "s-people": GOAL_BOOST_MULTIPLIER,
      "s-deleg": GOAL_BOOST_MULTIPLIER,
    });
  });

  it.each<GoalType>(["expert", "find_job", "first_job", "start", "professional", "scale_business"])(
    "gives no boost for goal %s",
    (goal) => {
      expect(goalBoosts(goal, skills)).toEqual({});
    },
  );

  it("raises a boosted skill's share by exactly ×1.3 relative to an unboosted one", () => {
    const adjusted = adjustedImportance(skills, { boosts: goalBoosts("manager", skills) });
    const lead = adjusted.find((s) => s.id === "s-lead")?.importance ?? 0;
    const sales = adjusted.find((s) => s.id === "s-sales")?.importance ?? 1;
    expect(lead / sales).toBeCloseTo(1.3, 12);
    expect(sum(adjusted)).toBeCloseTo(1, 12);
  });
});

describe("compositeImportance vs routingImportance", () => {
  // 8 equal skills; s7 is a people-management skill (boosted ×1.3 for lead/manager goals).
  const catalog = Array.from({ length: 8 }, (_, i) =>
    skill(`s${i}`, 0.125, i === 7 ? { slug: "people_management" } : {}),
  );
  const levelFor = (weights: readonly ScoringSkill[], scores: Readonly<Record<string, number>>): number => {
    const composite = compositeFromSkillScores(scores, weights);
    return assignLevel(levelInput({ composite, compositeSe: 0, skillScores: scores }), defaultLevels(), DEFAULT_PROFESSION_CONFIG)
      .level;
  };

  it("composite importance = importance × specialization weight, normalized, with no goal input", () => {
    const weights = { s0: 2, s7: 0 };
    expect(compositeImportance(catalog, weights)).toEqual(adjustedImportance(catalog, { specializationWeights: weights }));
    expect(compositeImportance(catalog).every((s) => Math.abs(s.importance - 0.125) < 1e-12)).toBe(true);
  });

  it("routing importance adds the goal boost on top of the specialization weight", () => {
    const lead = routingImportance(catalog, { goal: "lead", specializationWeights: { s0: 2 } });
    const s7 = lead.find((s) => s.id === "s7")?.importance ?? 0;
    const s1 = lead.find((s) => s.id === "s1")?.importance ?? 1;
    const s0 = lead.find((s) => s.id === "s0")?.importance ?? 1;
    expect(s7 / s1).toBeCloseTo(GOAL_BOOST_MULTIPLIER, 12);
    expect(s0 / s1).toBeCloseTo(2, 12);
    expect(sum(lead)).toBeCloseTo(1, 12);
    for (const goal of ["expert", "start", null] as const) {
      expect(routingImportance(catalog, { goal, specializationWeights: { s0: 2 } })).toEqual(
        compositeImportance(catalog, { s0: 2 }),
      );
    }
  });

  it("regression: the same answers give the same composite and level whatever the stated goal", () => {
    // s0..s6 = 38, s7 (people management) = 90. Composite weights give 44.5 → Level 4 for every goal.
    const scores: Record<string, number> = { s0: 38, s1: 38, s2: 38, s3: 38, s4: 38, s5: 38, s6: 38, s7: 90 };
    const weights = compositeImportance(catalog);
    expect(compositeFromSkillScores(scores, weights)).toBe(44.5);
    expect(levelFor(weights, scores)).toBe(4);
    // Goal-boosted routing weights would have moved the same answers to Level 5 — they must never reach scoring.
    expect(levelFor(routingImportance(catalog, { goal: "lead" }), scores)).toBe(5);
  });
});
