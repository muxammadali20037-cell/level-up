import { describe, expect, it } from "vitest";
import { developerDoNotRules } from "@/modules/results/domain/__fixtures__/actions";
import { type DoNotContext, doNotConditionMatches, evaluateDoNotRules, MAX_DO_NOT_ITEMS } from "./do-not";

const base: DoNotContext = {
  level: 3,
  weakSkillIds: ["git", "sql", "api", "testing", "architecture"],
  goal: "professional",
  bottleneckSkillId: "git",
};

describe("doNotConditionMatches", () => {
  it("treats missing fields and empty lists as no constraint", () => {
    expect(doNotConditionMatches({}, base)).toBe(true);
    expect(doNotConditionMatches({ weakSkillIds: [], goalTypes: [] }, base)).toBe(true);
  });

  it("uses inclusive level bounds", () => {
    expect(doNotConditionMatches({ minLevel: 3, maxLevel: 3 }, base)).toBe(true);
    expect(doNotConditionMatches({ maxLevel: 2 }, base)).toBe(false);
    expect(doNotConditionMatches({ minLevel: 4 }, base)).toBe(false);
  });

  it("matches when ANY listed skill is weak, and when the goal is listed", () => {
    expect(doNotConditionMatches({ weakSkillIds: ["javascript", "api"] }, base)).toBe(true);
    expect(doNotConditionMatches({ weakSkillIds: ["javascript"] }, base)).toBe(false);
    expect(doNotConditionMatches({ goalTypes: ["find_job", "professional"] }, base)).toBe(true);
    expect(doNotConditionMatches({ goalTypes: ["find_job"] }, base)).toBe(false);
  });
});

describe("evaluateDoNotRules", () => {
  it("developer level 3 with weak architecture gets the 'advanced microservices' rule", () => {
    const items = evaluateDoNotRules(developerDoNotRules, base);
    expect(items.map((i) => i.ruleId)).toEqual([
      "rule_skip_version_control", // touches the bottleneck (git) → first
      "rule_advanced_microservices",
      "rule_premature_optimization",
    ]);
    const micro = items.find((i) => i.ruleId === "rule_advanced_microservices");
    expect(micro?.skillId).toBe("architecture");
    expect(micro?.message.en).toBe("Do not: advanced_microservices");
    expect(micro?.reason.en).toBe("Because advanced_microservices");
  });

  it("drops the microservices rule above maxLevel 4 or when architecture is not weak", () => {
    const atFive = evaluateDoNotRules(developerDoNotRules, { ...base, level: 5 }).map((i) => i.ruleId);
    expect(atFive).not.toContain("rule_advanced_microservices");
    const archOk = evaluateDoNotRules(developerDoNotRules, { ...base, weakSkillIds: ["git"] }).map((i) => i.ruleId);
    expect(archOk).not.toContain("rule_advanced_microservices");
  });

  it("caps at 3 items, bottleneck-touching first, then by slug", () => {
    const items = evaluateDoNotRules(developerDoNotRules, { ...base, goal: "find_job" });
    expect(items).toHaveLength(MAX_DO_NOT_ITEMS);
    expect(items.map((i) => i.ruleId)).toEqual([
      "rule_skip_version_control",
      "rule_advanced_microservices",
      "rule_learn_many_frameworks",
    ]);
  });

  it("orders purely by slug when there is no bottleneck and returns [] when nothing matches", () => {
    const items = evaluateDoNotRules(developerDoNotRules, { ...base, bottleneckSkillId: null });
    expect(items.map((i) => i.ruleId)).toEqual([
      "rule_advanced_microservices",
      "rule_premature_optimization",
      "rule_skip_version_control",
    ]);
    expect(evaluateDoNotRules(developerDoNotRules, { ...base, level: 9, weakSkillIds: [] })).toEqual([
      {
        ruleId: "rule_lead_team_now",
        skillId: null,
        message: developerDoNotRules[4]?.message,
        reason: developerDoNotRules[4]?.reason,
      },
    ]);
    expect(evaluateDoNotRules([], base)).toEqual([]);
  });
});
