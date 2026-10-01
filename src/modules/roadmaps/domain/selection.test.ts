import { describe, expect, it } from "vitest";
import { developerActions, makeAction } from "@/modules/results/domain/__fixtures__/actions";
import { developerModel } from "@/modules/results/domain/__fixtures__/models";
import { createPlanContext, type RecommendationInput } from "./context";
import {
  dailyCapMinutes,
  filterEligibleActions,
  isWithinBudget,
  phaseTier,
  pickAction,
  selectActionsNow,
} from "./selection";

const input: RecommendationInput = {
  skillModel: developerModel,
  level: 3,
  weakSkillIds: ["git", "sql", "api", "testing", "architecture"],
  actions: developerActions,
  preferences: { timePerDayMinutes: 30, budget: "free", goal: "professional" },
  confidence: "high",
};

describe("eligibility", () => {
  it("filters by level window (min ≤ L+1, max ≥ L) and budget", () => {
    const pool = filterEligibleActions(developerActions, { level: 3, budget: "free" });
    const slugs = pool.map((a) => a.slug);
    expect(slugs).not.toContain("api_advanced_only"); // minLevel 7 > 4
    expect(slugs).not.toContain("api_beginner_only"); // maxLevel 2 < 3
    expect(slugs).not.toContain("sql_paid_bootcamp"); // budget high > free
    expect(filterEligibleActions(developerActions, { level: 6, budget: "high" }).map((a) => a.slug)).toEqual(
      expect.arrayContaining(["api_advanced_only", "sql_paid_bootcamp"]),
    );
    expect(slugs).toEqual([...slugs].sort());
  });

  it("orders budgets free < low < medium < high and caps daily minutes at 30", () => {
    expect(isWithinBudget("low", "medium")).toBe(true);
    expect(isWithinBudget("high", "low")).toBe(false);
    expect([15, 30, 60, 120].map(dailyCapMinutes)).toEqual([15, 30, 30, 30]);
  });
});

describe("pickAction", () => {
  const pool = [makeAction("a", "foundation", 40), makeAction("a", "practice", 10), makeAction("b", "foundation", 10)];
  const slot = { tiers: [phaseTier("foundation")], skillGroups: [["a"], ["b"]], maxMinutes: 30 };

  it("prefers a fitting action of the earlier group, even over a better phase", () => {
    expect(pickAction(pool, slot, new Map())?.slug).toBe("a_practice_10");
  });

  it("falls back to the shortest when nothing fits and reuses only when exhausted", () => {
    expect(pickAction(pool, { ...slot, maxMinutes: 5 }, new Map())?.slug).toBe("a_practice_10");
    const used = new Map<string, number>(pool.map((a) => [a.id, 1]));
    used.set("act_a_practice_10", 2);
    expect(pickAction(pool, { ...slot, maxMinutes: 60 }, used)?.slug).toBe("a_foundation_40"); // least used
    expect(pickAction(pool, { ...slot, allowReuse: false }, used)).toBeNull();
    // Time fit beats skill-group priority: the 40-min "a" action loses to a fitting "b" action.
    expect(pickAction(pool, { ...slot, exclude: new Set(["act_a_practice_10"]) }, new Map())?.slug).toBe(
      "b_foundation_10",
    );
  });
});

describe("selectActionsNow", () => {
  it("returns 3 distinct actions: bottleneck foundation, next priority skill, quick win elsewhere", () => {
    const now = selectActionsNow(createPlanContext(input));
    expect(now).toHaveLength(3);
    expect(new Set(now.map((a) => a.id)).size).toBe(3);
    expect(now[0]?.slug).toBe("git_foundation_15"); // 45-min variant does not fit the 30-min cap
    expect(now[1]?.skillId).toBe("sql");
    expect(now[1]?.phase).toBe("foundation");
    expect(now[2]?.skillId).not.toMatch(/^(git|sql)$/);
    expect(now[2]?.durationMinutes).toBe(15); // shortest among remaining focus skills
    expect(now[2]?.skillId).toBe("api");
  });

  it("skips skills that have no library action instead of inventing one", () => {
    const actions = developerActions.filter((a) => a.skillId !== "git");
    const now = selectActionsNow(createPlanContext({ ...input, actions }));
    expect(now.map((a) => a.skillId)).not.toContain("git");
    expect(now).toHaveLength(3);
  });

  it("returns fewer than 3 only when the library is that small", () => {
    const actions = [makeAction("git", "foundation", 10), makeAction("sql", "practice", 10)];
    expect(selectActionsNow(createPlanContext({ ...input, actions })).map((a) => a.slug)).toEqual([
      "git_foundation_10",
      "sql_practice_10",
    ]);
    expect(selectActionsNow(createPlanContext({ ...input, actions: [] }))).toEqual([]);
  });

  it("with a single focus skill, takes a second bottleneck action, then a quick win elsewhere", () => {
    const now = selectActionsNow(createPlanContext({ ...input, weakSkillIds: ["architecture"] }));
    expect(now.map((a) => a.slug)).toEqual([
      "architecture_foundation_15",
      "architecture_practice_20",
      "communication_quick_note",
    ]);
  });
});
