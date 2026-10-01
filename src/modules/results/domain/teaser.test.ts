import { describe, expect, it } from "vitest";
import { developerActions, entrepreneurActions } from "./__fixtures__/actions";
import { developerModel, entrepreneurModel, entrepreneurScores } from "./__fixtures__/models";
import { makeAbility, makeAssignment, mediumConfidence } from "./__fixtures__/scoring";
import { mulberry32, randomInt } from "./__fixtures__/text";
import { buildReport } from "./report";
import { buildTeaser } from "./teaser";

const report = buildReport({
  professionId: "entrepreneur",
  specializationId: null,
  ability: makeAbility(entrepreneurModel, entrepreneurScores),
  assignment: makeAssignment(5),
  confidence: mediumConfidence,
  skillModel: entrepreneurModel,
  actions: entrepreneurActions,
  doNotRules: [],
  preferences: { timePerDayMinutes: 15, budget: "free", goal: "scale_business" },
  percentile: null,
});

describe("buildTeaser", () => {
  it("shows the strongest skill, the bottleneck as main problem and the confidence only", () => {
    expect(buildTeaser(report)).toEqual({
      professionId: "entrepreneur",
      strongestSkillId: "sales",
      mainProblemSkillId: "systems",
      confidence: "medium",
    });
  });

  it("falls back to weakest[0], then null", () => {
    expect(buildTeaser({ ...report, bottleneck: null }).mainProblemSkillId).toBe("finance");
    const empty = buildTeaser({ ...report, bottleneck: null, weakest: [], strongest: [] });
    expect(empty.mainProblemSkillId).toBeNull();
    expect(empty.strongestSkillId).toBeNull();
  });

  it("does not leak locked data (level, skills, roadmap)", () => {
    expect(Object.keys(buildTeaser(report)).sort()).toEqual([
      "confidence",
      "mainProblemSkillId",
      "professionId",
      "strongestSkillId",
    ]);
  });
});

describe("buildTeaser — strongest skill never equals the main problem", () => {
  const beginner = (model: typeof developerModel, scores: Readonly<Record<string, number>>, level: number) =>
    buildReport({
      professionId: model.professionId,
      specializationId: null,
      ability: makeAbility(model, scores),
      assignment: makeAssignment(level),
      confidence: mediumConfidence,
      skillModel: model,
      actions: model === developerModel ? developerActions : entrepreneurActions,
      doNotRules: [],
      preferences: { timePerDayMinutes: 30, budget: "free", goal: "start" },
      percentile: null,
    });

  it("all-weak developer profile: git is the bottleneck, so it is not shown as the strongest skill", () => {
    const scores = { git: 39, sql: 11, api: 16, testing: 22, javascript: 25, architecture: 10, debugging: 13, communication: 37 };
    const report = beginner(developerModel, scores, 2);
    expect(report.skills.every((s) => s.band === "weak")).toBe(true);
    expect(report.bottleneck?.skillId).toBe("git");
    expect(report.strongest).toEqual(["communication", "javascript", "testing"]);
    expect(buildTeaser(report)).toMatchObject({ strongestSkillId: "communication", mainProblemSkillId: "git" });
  });

  it("guards the teaser itself when the report lists the main problem first", () => {
    const report = beginner(developerModel, { git: 39 }, 2);
    const teaser = buildTeaser({ ...report, bottleneck: null, weakest: ["x"], strongest: ["x", "y"] });
    expect(teaser).toMatchObject({ strongestSkillId: "y", mainProblemSkillId: "x" });
    expect(buildTeaser({ ...report, bottleneck: null, weakest: ["x"], strongest: ["x"] }).strongestSkillId).toBeNull();
  });

  it("seeded simulation: 2000 beginner profiles, no collision", () => {
    const rng = mulberry32(7);
    for (let run = 0; run < 2000; run += 1) {
      const model = run % 2 === 0 ? developerModel : entrepreneurModel;
      const scores = Object.fromEntries(model.skills.map((s) => [s.id, randomInt(rng, 10, 45)]));
      const teaser = buildTeaser(beginner(model, scores, randomInt(rng, 1, 3)));
      expect(teaser.strongestSkillId).not.toBeNull();
      expect(teaser.strongestSkillId).not.toBe(teaser.mainProblemSkillId);
    }
  });
});
