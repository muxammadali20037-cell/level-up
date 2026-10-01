import { describe, expect, it } from "vitest";
import type { SkillEdge, SkillModel } from "@/modules/catalog/domain/types";
import { developerModel, developerScores, entrepreneurModel, entrepreneurScores, SYSTEMS_LIMITS_SALES } from "./__fixtures__/models";
import { prerequisiteDescendants } from "@/modules/roadmaps/domain/topo";
import { mulberry32, randomInt } from "./__fixtures__/text";
import { bandForScore } from "./banding";
import { type BottleneckInput, computeLeverage, findBottleneck, renderBottleneckExplanation } from "./bottleneck";
import { BOTTLENECK_EXPLANATION_TEMPLATES } from "./copy";
import { nextLevelSkillThresholds } from "./next-level";

function inputFor(model: SkillModel, scores: Readonly<Record<string, number>>, level: number): BottleneckInput {
  const thresholds = nextLevelSkillThresholds(model.levels, level);
  return {
    skills: model.skills,
    scores,
    measured: Object.fromEntries(model.skills.map((s) => [s.id, true])),
    edges: model.edges,
    nextLevelThresholds: thresholds,
    weakSkillIds: model.skills.filter((s) => bandForScore(scores[s.id] ?? 0, thresholds[s.id]) === "weak").map((s) => s.id),
  };
}

const entrepreneur = inputFor(entrepreneurModel, entrepreneurScores, 5);
const developer = inputFor(developerModel, developerScores, 3);

describe("computeLeverage", () => {
  it("matches the brief §8 formula (known answer)", () => {
    const systems = computeLeverage("systems", entrepreneur);
    expect(systems.gapTerm).toBeCloseTo(0.12 * (45 - 35) / 100, 10);
    expect(systems.limits.map((l) => [l.skillId, l.contribution])).toEqual([
      ["sales", expect.closeTo(0.8 * 0.46, 10)],
      ["marketing", expect.closeTo(0.6 * 0.37, 10)],
    ]);
    expect(systems.leverage).toBeCloseTo(0.602, 10);
    // gap target = max(40, threshold): finance has no L+1 threshold → 40.
    expect(computeLeverage("finance", entrepreneur).leverage).toBeCloseTo((0.08 * (40 - 25)) / 100, 10);
  });

  it("is monotonic: a stronger limited skill or a weaker source never lowers leverage", () => {
    let previous = -1;
    for (let sales = 0; sales <= 100; sales += 5) {
      const value = computeLeverage("systems", { ...entrepreneur, scores: { ...entrepreneurScores, sales } }).leverage;
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
    previous = -1;
    for (let systems = 100; systems >= 0; systems -= 5) {
      const value = computeLeverage("systems", { ...entrepreneur, scores: { ...entrepreneurScores, systems } }).leverage;
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });
});

describe("findBottleneck — entrepreneur (limits)", () => {
  it("picks systems, not the lowest score (finance) and not a strong skill (marketing)", () => {
    expect(entrepreneur.weakSkillIds).toEqual(["systems", "finance"]);
    const bottleneck = findBottleneck(entrepreneur);
    expect(bottleneck?.skillId).toBe("systems");
    expect(bottleneck?.skillId).not.toBe("finance");
    expect(bottleneck?.skillId).not.toBe("marketing");
    expect(bottleneck?.reason).toBe("limits_strong_skills");
    expect(bottleneck?.limitedSkillIds).toEqual(["sales", "marketing"]);
    expect(bottleneck?.unlocksSkillIds).toEqual([]);
    expect(bottleneck?.leverage).toBe(0.602);
    expect(bottleneck?.explanation.en).toBe(SYSTEMS_LIMITS_SALES);
  });

  it("falls back to the largest weighted gap without the limits edges", () => {
    // systems (gates L+1 at 45): 0.12·10/100 = finance 0.08·15/100 → tie, the more important systems wins.
    expect(findBottleneck({ ...entrepreneur, edges: [] })).toMatchObject({ skillId: "systems", reason: "largest_gap" });
    const scores = { ...entrepreneurScores, finance: 10 };
    const bottleneck = findBottleneck({ ...entrepreneur, scores, edges: [] });
    expect(bottleneck?.skillId).toBe("finance");
    expect(bottleneck?.reason).toBe("largest_gap");
    expect(bottleneck?.explanation).toEqual(BOTTLENECK_EXPLANATION_TEMPLATES.largest_gap);
    expect(renderBottleneckExplanation(bottleneck!, entrepreneurModel.skills).en).toBe(
      "Finance has the largest gap to your next level, weighted by its importance. Closing it moves you forward fastest.",
    );
  });

  it("uses the reason template (with fillable placeholders) when the edge has no rationale", () => {
    const edges: SkillEdge[] = entrepreneurModel.edges.map(({ rationale: _r, ...rest }) => rest);
    const bottleneck = findBottleneck({ ...entrepreneur, edges });
    expect(bottleneck?.explanation).toEqual(BOTTLENECK_EXPLANATION_TEMPLATES.limits_strong_skills);
    const rendered = renderBottleneckExplanation(bottleneck!, entrepreneurModel.skills);
    expect(rendered.en).toBe("Your strengths (Sales and Marketing) are capped by Systems. Improving Systems unlocks value you already have.");
    expect(rendered.uz).toContain("([uz] Sales va [uz] Marketing)");
  });
});

describe("findBottleneck — developer (prerequisites)", () => {
  it("prefers git, the root prerequisite of the weak chain, over the max-leverage api", () => {
    expect(computeLeverage("api", developer).leverage).toBeGreaterThan(computeLeverage("git", developer).leverage);
    const bottleneck = findBottleneck(developer);
    expect(bottleneck?.skillId).toBe("git");
    expect(bottleneck?.reason).toBe("prerequisite_of_weak");
    expect(bottleneck?.unlocksSkillIds).toEqual(["sql", "api", "testing"]);
    expect(bottleneck?.limitedSkillIds).toEqual([]);
    expect(bottleneck?.explanation.en).toBe("Version control comes before collaborating on database code.");
  });

  it("terminates on prerequisite cycles", () => {
    const edges: SkillEdge[] = [
      { from: "git", to: "sql", relation: "prerequisite", strength: 0.5 },
      { from: "sql", to: "git", relation: "prerequisite", strength: 0.5 },
    ];
    const bottleneck = findBottleneck({ ...developer, edges, weakSkillIds: ["git", "sql"] });
    expect(["git", "sql"]).toContain(bottleneck?.skillId);
    expect(findBottleneck({ ...developer, edges, weakSkillIds: ["sql", "git"] })).toEqual(bottleneck);
  });

  it("returns null without weak skills", () => {
    expect(findBottleneck({ ...developer, weakSkillIds: [] })).toBeNull();
    expect(findBottleneck({ ...developer, weakSkillIds: ["unknown"] })).toBeNull();
  });
});

describe("findBottleneck — seeded simulation", () => {
  it("always returns a weak skill that is the max-leverage skill or one of its weak prerequisite roots", () => {
    const rng = mulberry32(42);
    for (const model of [entrepreneurModel, developerModel]) {
      for (let run = 0; run < 300; run += 1) {
        const scores = Object.fromEntries(model.skills.map((s) => [s.id, randomInt(rng, 5, 95)]));
        const input = inputFor(model, scores, randomInt(rng, 1, 8));
        const bottleneck = findBottleneck(input);
        if (input.weakSkillIds.length === 0) {
          expect(bottleneck).toBeNull();
          continue;
        }
        expect(input.weakSkillIds).toContain(bottleneck?.skillId);
        const id = bottleneck?.skillId ?? "";
        // Prerequisite-first is transitive: no weak skill reaches the bottleneck via prerequisite edges.
        const weakAncestors = input.weakSkillIds.filter((w) => prerequisiteDescendants(w, model.edges).has(id));
        expect(weakAncestors).toEqual([]);
        const max = Math.max(...input.weakSkillIds.map((w) => computeLeverage(w, input).leverage));
        if (bottleneck?.unlocksSkillIds.length === 0) expect(computeLeverage(id, input).leverage).toBeCloseTo(max, 10);
        expect(findBottleneck(input)).toEqual(bottleneck);
      }
    }
  });
});
