import { describe, expect, it } from "vitest";
import { makeAction } from "@/modules/results/domain/__fixtures__/actions";
import { entrepreneurModel } from "@/modules/results/domain/__fixtures__/models";
import { mulberry32, randomInt } from "@/modules/results/domain/__fixtures__/text";
import { createPlanContext, type RecommendationInput } from "./context";
import { buildPlan7, buildRecommendations, buildRoadmap30, weeklyItemCapMinutes } from "./plan";
import { dailyCapMinutes, MAX_DAILY_MAIN_MINUTES, phaseTier, pickAction } from "./selection";
import { type Action, PACE_OPTIONS, type PaceMinutes } from "./types";

/** Regressions: fewer fitting actions than slots must lead to reuse, not to over-long unused actions. */
const sparse: Action[] = [
  makeAction("systems", "foundation", 20),
  makeAction("systems", "practice", 25),
  makeAction("systems", "application", 30),
  makeAction("finance", "foundation", 60),
  makeAction("finance", "practice", 90),
  makeAction("finance", "application", 45),
  makeAction("sales", "application", 120),
];

const input = (pace: PaceMinutes, actions: readonly Action[] = sparse): RecommendationInput => ({
  skillModel: entrepreneurModel,
  level: 5,
  weakSkillIds: ["systems", "finance"],
  actions,
  preferences: { timePerDayMinutes: pace, budget: "free", goal: "build_business" },
  confidence: "high",
});

const durations = (actions: readonly { durationMinutes: number }[]): number[] => actions.map((a) => a.durationMinutes);
const sum = (values: readonly number[]): number => values.reduce((total, v) => total + v, 0);

describe("pickAction — time fit outranks novelty", () => {
  const pool = [makeAction("a", "foundation", 20), makeAction("a", "practice", 60), makeAction("b", "foundation", 90)];
  const slot = { tiers: [phaseTier("foundation")], skillGroups: [["a"], ["b"]], maxMinutes: 30 };
  const used = new Map([["act_a_foundation_20", 3]]);

  it("reuses a fitting action before taking an unused over-long one", () => {
    expect(pickAction(pool, slot, used)?.slug).toBe("a_foundation_20");
  });

  it("uses the fallback bound before anything longer, and unused-only slots still never repeat", () => {
    expect(pickAction(pool, { ...slot, maxMinutes: 10, fallbackMaxMinutes: 95 }, used)?.slug).toBe("a_practice_60");
    expect(pickAction(pool, { ...slot, allowReuse: false }, used)?.slug).toBe("a_practice_60");
  });
});

describe("buildPlan7 — respects time per day when any action fits", () => {
  it("pace 120: every day ≤ 30 min although longer unused actions exist", () => {
    const plan = buildPlan7(createPlanContext(input(120)));
    expect(plan).toHaveLength(7);
    expect(durations(plan.map((d) => d.main))).toEqual([20, 25, 30, 25, 30, 20, 30]);
    expect(plan[0]?.main.skillId).toBe("systems");
  });

  it("pace 15: only the ≤ 15-min actions are used (repeated), never the 20–30-min ones", () => {
    const actions = [
      makeAction("systems", "foundation", 15),
      makeAction("systems", "practice", 25),
      makeAction("finance", "foundation", 10),
      makeAction("finance", "practice", 20),
      makeAction("sales", "application", 30),
    ];
    const plan = buildPlan7(createPlanContext(input(15, actions)));
    for (const day of plan) expect(day.main.durationMinutes).toBeLessThanOrEqual(15);
  });

  it("pace 15 with nothing ≤ 15: stays within the 30-min daily ceiling instead of escalating", () => {
    const plan = buildPlan7(createPlanContext(input(15)));
    expect(plan).toHaveLength(7);
    for (const day of plan) expect(day.main.durationMinutes).toBeLessThanOrEqual(MAX_DAILY_MAIN_MINUTES);
    expect(new Set(plan.map((d) => d.main.actionId)).size).toBe(3);
  });
});

describe("buildRoadmap30 — weekly budget 7 × pace", () => {
  it("pace 15: reuses the three fitting actions every week instead of 45–120-min ones", () => {
    const roadmap = buildRoadmap30(createPlanContext(input(15)), 15);
    for (const week of roadmap) {
      expect(week.items).toHaveLength(3);
      for (const item of week.items) expect(item.durationMinutes).toBeLessThanOrEqual(weeklyItemCapMinutes(15));
    }
  });

  it("with too few fitting actions, fills only while the week stays within budget", () => {
    const actions = [makeAction("systems", "foundation", 10), ...sparse.slice(3)];
    const roadmap = buildRoadmap30(createPlanContext(input(15, actions)), 15);
    expect(roadmap).toHaveLength(4);
    for (const week of roadmap) {
      expect(week.items.length).toBeGreaterThan(0);
      expect(sum(durations(week.items))).toBeLessThanOrEqual(7 * 15);
      expect(new Set(week.items.map((i) => i.actionId)).size).toBe(week.items.length);
    }
    expect(durations(roadmap[0]?.items ?? [])).toEqual([10, 60]);
  });

  it("keeps a single (shortest-first) item when no action fits the weekly budget at all", () => {
    const actions = [makeAction("systems", "foundation", 120), makeAction("systems", "practice", 110)];
    const roadmap = buildRoadmap30(createPlanContext(input(15, actions)), 15);
    expect(roadmap.map((w) => w.items.length)).toEqual([1, 1, 1, 1]);
    expect(roadmap[0]?.items[0]?.durationMinutes).toBe(110);
  });
});

describe("time budget — seeded simulation over random libraries", () => {
  it("plan7 days fit min(30, pace) and roadmap weeks fit 7 × pace whenever the library allows", () => {
    const rng = mulberry32(31337);
    const skills = entrepreneurModel.skills.map((s) => s.id);
    const phases = ["foundation", "practice", "application", "verification"] as const;
    for (let run = 0; run < 200; run += 1) {
      const actions = Array.from({ length: randomInt(rng, 1, 14) }, (_, i) =>
        makeAction(skills[randomInt(rng, 0, skills.length - 1)] ?? "sales", phases[randomInt(rng, 0, 3)] ?? "practice",
          5 * randomInt(rng, 1, 24), { slug: `a${i}` }),
      );
      const pace = PACE_OPTIONS[randomInt(rng, 0, 3)] as PaceMinutes;
      const set = buildRecommendations({ ...input(pace, actions), weakSkillIds: skills.filter(() => rng() < 0.4) });
      const shortest = Math.min(...durations(actions));
      const cap = dailyCapMinutes(pace);
      for (const day of set.plan7) {
        if (shortest <= cap) expect(day.main.durationMinutes).toBeLessThanOrEqual(cap);
        else if (shortest <= MAX_DAILY_MAIN_MINUTES) expect(day.main.durationMinutes).toBeLessThanOrEqual(MAX_DAILY_MAIN_MINUTES);
      }
      for (const week of set.roadmap30) {
        if (shortest <= 7 * pace) expect(sum(durations(week.items))).toBeLessThanOrEqual(7 * pace);
        else expect(week.items).toHaveLength(1);
      }
    }
  });
});
