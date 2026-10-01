import { describe, expect, it } from "vitest";
import type { I18nText } from "@/lib/i18n/text";
import { DEFAULT_PLAN_PREFERENCES } from "@/modules/roadmaps/domain/types";
import { developerActions, developerDoNotRules, entrepreneurActions } from "./__fixtures__/actions";
import { developerModel, developerScores, entrepreneurModel, entrepreneurScores } from "./__fixtures__/models";
import { highConfidence, makeAbility, makeAssignment, mediumConfidence } from "./__fixtures__/scoring";
import { mulberry32, randomInt } from "./__fixtures__/text";
import { EDUCATIONAL_DISCLAIMER, REGULATED_DISCLAIMER_FALLBACK } from "./copy";
import { buildReport, type BuildReportInput } from "./report";

const entrepreneurInput: BuildReportInput = {
  professionId: "entrepreneur",
  specializationId: "small_business_owner",
  ability: makeAbility(entrepreneurModel, entrepreneurScores),
  assignment: makeAssignment(5),
  confidence: mediumConfidence,
  skillModel: entrepreneurModel,
  actions: entrepreneurActions,
  doNotRules: [],
  preferences: { timePerDayMinutes: 30, budget: "free", goal: "build_business" },
  percentile: null,
};

const developerInput: BuildReportInput = {
  professionId: "software_developer",
  specializationId: null,
  ability: makeAbility(developerModel, developerScores, ["communication"]),
  assignment: makeAssignment(3),
  confidence: highConfidence,
  skillModel: developerModel,
  actions: developerActions,
  doNotRules: developerDoNotRules,
  preferences: DEFAULT_PLAN_PREFERENCES,
  percentile: { value: 62, sampleSize: 1500, windowDays: 90 },
};

describe("buildReport — entrepreneur", () => {
  const report = buildReport(entrepreneurInput);

  it("composes level, bands, strongest/weakest and the bottleneck", () => {
    expect(report.schemaVersion).toBe(1);
    expect(report.level).toBe(5);
    expect(report.composite).toBe(entrepreneurInput.ability.composite);
    expect(report.skills.map((s) => s.skillId)).toEqual(entrepreneurModel.skills.map((s) => s.id));
    expect(report.skills.filter((s) => s.band === "strong").map((s) => s.skillId)).toEqual(["sales", "marketing"]);
    expect(report.strongest).toEqual(["sales", "marketing", "product"]);
    expect(report.weakest).toEqual(["finance", "systems"]);
    expect(report.bottleneck?.skillId).toBe("systems");
    expect(report.bottleneck?.reason).toBe("limits_strong_skills");
    expect(report.nextLevel?.number).toBe(6);
  });

  it("builds 3 distinct actions now (bottleneck first), a 7-day plan and a 4-week roadmap", () => {
    expect(report.actionsNow).toHaveLength(3);
    expect(new Set(report.actionsNow.map((a) => a.actionId)).size).toBe(3);
    expect(report.actionsNow[0]?.skillId).toBe("systems");
    expect(report.actionsNow[1]?.skillId).toBe("finance");
    expect(report.plan7).toHaveLength(7);
    expect(report.plan7[0]?.main.skillId).toBe("systems");
    expect(report.roadmap30.map((w) => w.phase)).toEqual(["foundation", "practice", "application", "verification"]);
    expect(report.roadmap30.every((w) => w.items.length === 4)).toBe(true);
    for (const rec of report.actionsNow) expect(rec.why.confidence).toBe("medium");
  });

  it("always carries the educational disclaimer and passes percentile through", () => {
    expect(report.disclaimers).toEqual([EDUCATIONAL_DISCLAIMER]);
    expect(report.percentile).toBeNull();
    expect(report.doNot).toEqual([]);
  });

  it("adds the regulated disclaimer (given text, else the fallback)", () => {
    const own = { uz: "Maxsus", ru: "Особый", en: "Special" };
    expect(buildReport({ ...entrepreneurInput, isRegulated: true, disclaimer: own }).disclaimers).toEqual([
      EDUCATIONAL_DISCLAIMER,
      own,
    ]);
    expect(buildReport({ ...entrepreneurInput, isRegulated: true }).disclaimers).toEqual([
      EDUCATIONAL_DISCLAIMER,
      REGULATED_DISCLAIMER_FALLBACK,
    ]);
  });

  it("treats a blank profession disclaimer as missing (regulated fallback, never an empty text)", () => {
    const blanks: I18nText[] = [{}, { uz: " ", ru: "", en: "" }];
    for (const blank of blanks) {
      expect(buildReport({ ...entrepreneurInput, isRegulated: true, disclaimer: blank }).disclaimers).toEqual([
        EDUCATIONAL_DISCLAIMER,
        REGULATED_DISCLAIMER_FALLBACK,
      ]);
      expect(buildReport({ ...entrepreneurInput, disclaimer: blank }).disclaimers).toEqual([EDUCATIONAL_DISCLAIMER]);
    }
  });

  it("is deterministic: same input → deep-equal, JSON-stable output", () => {
    const again = buildReport(entrepreneurInput);
    expect(again).toEqual(report);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
  });
});

describe("buildReport — developer", () => {
  const report = buildReport(developerInput);

  it("uses the prerequisite-first bottleneck and focus order", () => {
    expect(report.bottleneck?.skillId).toBe("git");
    expect(report.bottleneck?.reason).toBe("prerequisite_of_weak");
    expect(report.actionsNow.map((a) => a.skillId).slice(0, 2)).toEqual(["git", "sql"]);
    expect(report.plan7.slice(0, 3).map((d) => d.main.skillId)).toEqual(["git", "sql", "api"]);
  });

  it("evaluates do-not rules with the bottleneck first and passes the percentile through", () => {
    expect(report.doNot.map((d) => d.ruleId)).toEqual([
      "rule_skip_version_control",
      "rule_advanced_microservices",
      "rule_premature_optimization",
    ]);
    expect(report.percentile).toEqual({ value: 62, sampleSize: 1500, windowDays: 90 });
  });

  it("flags unmeasured skills and prefers measured ones in strongest", () => {
    expect(report.skills.find((s) => s.skillId === "communication")).toMatchObject({ measured: false, nItems: 0 });
    expect(report.strongest).toEqual(["javascript", "debugging", "communication"]);
  });
});

describe("buildReport — edge cases and simulation", () => {
  it("without weak skills: no bottleneck, recommendations on the lowest skills", () => {
    const scores = Object.fromEntries(entrepreneurModel.skills.map((s, i) => [s.id, 62 + i]));
    const report = buildReport({ ...entrepreneurInput, ability: makeAbility(entrepreneurModel, scores) });
    expect(report.bottleneck).toBeNull();
    expect(report.weakest).toEqual([]);
    expect(report.actionsNow[0]?.skillId).toBe("sales");
    expect(report.plan7).toHaveLength(7);
    expect(report.roadmap30[0]?.theme.en).toBe("Close your foundation gaps");
  });

  it("flags the experience cap of the next level when the experience band is known", () => {
    const atCap = { ...entrepreneurInput, assignment: makeAssignment(4) };
    expect(buildReport({ ...atCap, experience: "none" }).nextLevel).toMatchObject({ number: 5, blockedBy: ["experience"] });
    expect(buildReport({ ...atCap, experience: "5plus" }).nextLevel?.blockedBy).toEqual([]);
    expect(buildReport(atCap).nextLevel?.blockedBy).toEqual([]);
  });

  it("at level 9 there is no next level", () => {
    expect(buildReport({ ...entrepreneurInput, assignment: makeAssignment(9) }).nextLevel).toBeNull();
  });

  it("keeps invariants on random profiles (seeded)", () => {
    const rng = mulberry32(7);
    for (let run = 0; run < 120; run += 1) {
      const scores = Object.fromEntries(developerModel.skills.map((s) => [s.id, randomInt(rng, 0, 100)]));
      const input: BuildReportInput = {
        ...developerInput,
        ability: makeAbility(developerModel, scores),
        assignment: makeAssignment(randomInt(rng, 1, 9)),
      };
      const report = buildReport(input);
      expect(buildReport(input)).toEqual(report);
      const weak = report.skills.filter((s) => s.band === "weak").map((s) => s.skillId);
      if (weak.length > 0) expect(weak).toContain(report.bottleneck?.skillId);
      else expect(report.bottleneck).toBeNull();
      expect(report.weakest.every((id) => report.skills.find((s) => s.skillId === id)?.band !== "strong")).toBe(true);
      expect(new Set(report.actionsNow.map((a) => a.actionId)).size).toBe(report.actionsNow.length);
      expect(report.plan7.length === 0 || report.plan7.length === 7).toBe(true);
      expect(report.doNot.length).toBeLessThanOrEqual(3);
      expect(report.disclaimers[0]).toEqual(EDUCATIONAL_DISCLAIMER);
    }
  });
});
