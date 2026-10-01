import { describe, expect, it } from "vitest";
import { developerActions, entrepreneurActions, makeAction } from "@/modules/results/domain/__fixtures__/actions";
import { developerModel, entrepreneurModel } from "@/modules/results/domain/__fixtures__/models";
import { mulberry32, randomInt } from "@/modules/results/domain/__fixtures__/text";
import { createPlanContext, type RecommendationInput } from "./context";
import { buildPlan7, buildRecommendations, buildRoadmap30, itemsPerWeek, weeklyItemCapMinutes } from "./plan";
import { BUDGET_ORDER, PACE_OPTIONS, type Action, type PaceMinutes } from "./types";

const devInput: RecommendationInput = {
  skillModel: developerModel,
  level: 3,
  weakSkillIds: ["git", "sql", "api", "testing", "architecture"],
  actions: developerActions,
  preferences: { timePerDayMinutes: 30, budget: "free", goal: "professional" },
  confidence: "high",
};

const withPace = (pace: PaceMinutes): RecommendationInput => ({
  ...devInput,
  preferences: { ...devInput.preferences, timePerDayMinutes: pace },
});

describe("buildPlan7", () => {
  it("has exactly 7 days numbered 1..7 with no repeated action", () => {
    const plan = buildPlan7(createPlanContext(devInput));
    expect(plan.map((d) => d.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(plan.map((d) => d.main.actionId)).size).toBe(7);
  });

  it("days 1–3 foundation (bottleneck first), 4–6 practice, day 7 apply/verify", () => {
    const plan = buildPlan7(createPlanContext(devInput));
    expect(plan.slice(0, 3).map((d) => [d.main.skillId, d.main.phase])).toEqual([
      ["git", "foundation"],
      ["sql", "foundation"],
      ["api", "foundation"],
    ]);
    expect(plan.slice(3, 6).every((d) => d.main.phase === "practice")).toBe(true);
    expect(plan[3]?.main.skillId).toBe("git");
    expect(["application", "verification"]).toContain(plan[6]?.main.phase);
    expect(plan[6]?.main.skillId).toBe("git");
  });

  it("puts weak prerequisites of the bottleneck first on foundation days", () => {
    const plan = buildPlan7(createPlanContext({ ...devInput, weakSkillIds: ["api", "testing", "sql"] }));
    expect(plan.slice(0, 3).map((d) => d.main.skillId)).toEqual(["sql", "api", "testing"]);
  });

  it.each(PACE_OPTIONS)("respects the daily cap min(30, pace) for pace %i when the library allows", (pace) => {
    const cap = Math.min(30, pace);
    for (const day of buildPlan7(createPlanContext(withPace(pace)))) {
      expect(day.main.durationMinutes).toBeLessThanOrEqual(cap);
    }
  });

  it("falls back to the shortest action when nothing fits, and repeats only when the library is exhausted", () => {
    const actions = [makeAction("git", "foundation", 40), makeAction("git", "practice", 50)];
    const plan = buildPlan7(createPlanContext({ ...devInput, actions }));
    expect(plan).toHaveLength(7);
    expect(plan[0]?.main.durationMinutes).toBe(40);
    expect(new Set(plan.map((d) => d.main.actionId)).size).toBe(2);
    expect(buildPlan7(createPlanContext({ ...devInput, actions: [] }))).toEqual([]);
  });
});

describe("buildRoadmap30", () => {
  it("has 4 weeks with the foundation → practice → application → verification phases", () => {
    const roadmap = buildRoadmap30(createPlanContext(devInput), 30);
    expect(roadmap.map((w) => [w.week, w.phase])).toEqual([
      [1, "foundation"],
      [2, "practice"],
      [3, "application"],
      [4, "verification"],
    ]);
    for (const week of roadmap) expect(week.items.every((i) => i.phase === week.phase)).toBe(true);
    expect(roadmap[0]?.theme.en).toBe("Close the foundation gap in Git");
    expect(roadmap[0]?.theme.uz).toBe("«[uz] Git» boʻyicha poydevorni mustahkamlash");
    expect(roadmap[1]?.theme.en).toBe("Practice: turn knowledge into habits");
  });

  it.each([
    [15, 3],
    [30, 4],
    [60, 5],
    [120, 6],
  ] as const)("pace %i → %i items per week, no duplicates inside a week, within the weekly budget", (pace, n) => {
    expect(itemsPerWeek(pace)).toBe(n);
    const roadmap = buildRoadmap30(createPlanContext(withPace(pace)), pace);
    for (const week of roadmap) {
      expect(week.items).toHaveLength(n);
      expect(new Set(week.items.map((i) => i.actionId)).size).toBe(n);
      for (const item of week.items) expect(item.durationMinutes).toBeLessThanOrEqual(weeklyItemCapMinutes(pace));
    }
  });

  it("uses focus skills first and other skills (lowest score first) before repeating", () => {
    const ctx = createPlanContext({ ...devInput, weakSkillIds: ["git"], skillScores: { communication: 41, debugging: 50 } });
    expect(ctx.others.slice(0, 2)).toEqual(["communication", "debugging"]);
    const roadmap = buildRoadmap30(ctx, 30);
    expect(roadmap[0]?.items.map((i) => i.actionId)).toEqual([
      "act_git_foundation_15",
      "act_git_foundation_long",
      "act_communication_foundation_15",
      "act_debugging_foundation_15",
    ]);
  });
});

describe("buildRecommendations", () => {
  it("never recommends an action above the budget or outside the level window", () => {
    const set = buildRecommendations({ ...devInput, preferences: { ...devInput.preferences, budget: "low" } });
    const all = [...set.actionsNow, ...set.plan7.map((d) => d.main), ...set.roadmap30.flatMap((w) => w.items)];
    const byId = new Map(developerActions.map((a) => [a.id, a] as const));
    for (const rec of all) {
      const action = byId.get(rec.actionId) as Action;
      expect(BUDGET_ORDER.indexOf(action.budget)).toBeLessThanOrEqual(BUDGET_ORDER.indexOf("low"));
      expect(action.minLevel).toBeLessThanOrEqual(4);
      expect(action.maxLevel).toBeGreaterThanOrEqual(3);
    }
  });

  it("attaches WhyThis: limitation + capped confidence without sources, evidence with sources", () => {
    const set = buildRecommendations(withPace(120));
    const all = [...set.actionsNow, ...set.plan7.map((d) => d.main), ...set.roadmap30.flatMap((w) => w.items)];
    const unsourced = all.find((r) => r.why.sourceIds.length === 0);
    expect(unsourced?.why.limitation?.en).toBe("Based on LEVEL's skill model and your answers; not an external study.");
    expect(unsourced?.why.evidence).toBeNull();
    expect(unsourced?.why.confidence).toBe("medium");
    const sourced = all.find((r) => r.actionId === "act_testing_sourced");
    expect(sourced?.why.sourceIds).toEqual(["src_testing_guide"]);
    expect(sourced?.why.evidence).not.toBeNull();
    expect(sourced?.why.limitation).toBeNull();
    expect(sourced?.why.confidence).toBe("high");
    expect(unsourced?.why.reason.en).toMatch(/^Why /);
  });

  it("uses an interpolated reason template when an action has no own 'why'", () => {
    const blank = { uz: "", ru: "", en: "" };
    const actions = [makeAction("git", "foundation", 10, { why: blank }), makeAction("sql", "foundation", 10, { why: blank })];
    const set = buildRecommendations({ ...devInput, actions, confidence: "low" });
    expect(set.actionsNow[0]?.why.reason.en).toBe("Strengthens Git, the skill that limits your progress the most right now.");
    expect(set.actionsNow[1]?.why.reason.ru).toBe("Развивает навык «[ru] Sql» — один из приоритетных для следующего уровня.");
    expect(set.actionsNow[0]?.why.confidence).toBe("low");
  });

  it("is deterministic and keeps invariants across random preferences (seeded simulation)", () => {
    const rng = mulberry32(20261001);
    const skills = entrepreneurModel.skills.map((s) => s.id);
    for (let run = 0; run < 150; run += 1) {
      const pace = PACE_OPTIONS[randomInt(rng, 0, 3)] as PaceMinutes;
      const budget = BUDGET_ORDER[randomInt(rng, 0, 3)] ?? "free";
      const weak = skills.filter(() => rng() < 0.4);
      const input: RecommendationInput = {
        skillModel: entrepreneurModel,
        level: randomInt(rng, 1, 9),
        weakSkillIds: weak,
        actions: entrepreneurActions,
        preferences: { timePerDayMinutes: pace, budget, goal: "build_business" },
        confidence: "high",
      };
      const set = buildRecommendations(input);
      expect(buildRecommendations(input)).toEqual(set);
      expect(set.plan7).toHaveLength(7);
      expect(set.roadmap30).toHaveLength(4);
      expect(set.actionsNow).toHaveLength(3);
      expect(new Set(set.actionsNow.map((r) => r.actionId)).size).toBe(3);
      if (weak[0]) expect(set.actionsNow[0]?.skillId).toBe(weak[0]);
      for (const day of set.plan7) expect(day.main.durationMinutes).toBeLessThanOrEqual(Math.min(30, pace));
    }
  });
});
