import { describe, expect, it } from "vitest";
import { DEFAULT_PROFESSION_CONFIG, type ExperienceBand, type LevelDefinition } from "@/modules/catalog/domain/types";
import { assignLevel } from "@/modules/scoring/domain/levels";
import { makeLevels } from "./__fixtures__/levels";
import { entrepreneurModel, entrepreneurScores } from "./__fixtures__/models";
import { makeAssignment } from "./__fixtures__/scoring";
import { tx } from "./__fixtures__/text";
import { VERIFICATION_REQUIREMENT_DESCRIPTION } from "./copy";
import { buildNextLevel, nextLevelSkillThresholds } from "./next-level";

const levels = entrepreneurModel.levels;

describe("nextLevelSkillThresholds", () => {
  it("collects skill_min thresholds of level L+1 only", () => {
    expect(nextLevelSkillThresholds(levels, 5)).toEqual({ systems: 45, sales: 50 });
    expect(nextLevelSkillThresholds(levels, 4)).toEqual({});
    expect(nextLevelSkillThresholds(levels, 9)).toEqual({});
  });
});

describe("buildNextLevel", () => {
  it("lists every requirement of L+1 with current values and met flags", () => {
    const next = buildNextLevel(makeAssignment(5), levels, 52.34, entrepreneurScores);
    expect(next?.number).toBe(6);
    expect(next?.compositeGap).toBe(2.7);
    expect(next?.requirements.map((r) => [r.type, r.skillId, r.threshold, r.current, r.met, r.gatesAssessed])).toEqual([
      ["composite_min", null, 55, 52.3, false, true],
      ["skill_min", "systems", 45, 35, false, true],
      ["skill_min", "sales", 50, 81, true, true],
    ]);
    expect(next?.requirements[1]?.description.en).toBe("systems at least 45");
  });

  it("has a zero composite gap once the composite threshold is reached", () => {
    const next = buildNextLevel(makeAssignment(5), levels, 58, entrepreneurScores);
    expect(next?.compositeGap).toBe(0);
    expect(next?.requirements[0]?.met).toBe(true);
  });

  it("returns null at level 9 or when L+1 is undefined", () => {
    expect(buildNextLevel(makeAssignment(9), levels, 90, entrepreneurScores)).toBeNull();
    expect(buildNextLevel(makeAssignment(3), levels.slice(0, 3), 30, entrepreneurScores)).toBeNull();
  });

  it("treats a skill without a score as unmet", () => {
    const next = buildNextLevel(makeAssignment(5), levels, 60, { sales: 70 });
    expect(next?.requirements[1]).toMatchObject({ skillId: "systems", current: null, met: false });
  });

  it("resolves verification requirements from the evaluation, then counts, else unknown", () => {
    const unknown = buildNextLevel(makeAssignment(7), levels, 70, entrepreneurScores);
    expect(unknown?.number).toBe(8);
    expect(unknown?.requirements[1]).toMatchObject({ type: "verified_scenario", current: null, met: false });

    const counted = buildNextLevel(makeAssignment(7), levels, 70, entrepreneurScores, {
      verifiedScenarios: 1,
      practicalActions: 0,
    });
    expect(counted?.requirements[1]).toMatchObject({ current: 1, met: true });

    const missing = makeAssignment(7, [
      {
        number: 8,
        met: false,
        missing: [{ type: "verified_scenario", skillId: null, threshold: 1, current: 0, gatesAssessed: false }],
      },
    ]);
    expect(buildNextLevel(missing, levels, 70, entrepreneurScores)?.requirements[1]).toMatchObject({
      current: 0,
      met: false,
    });
    const satisfied = makeAssignment(7, [{ number: 8, met: true, missing: [] }]);
    expect(buildNextLevel(satisfied, levels, 80, entrepreneurScores)?.requirements[1]).toMatchObject({ met: true });
  });
});

/** Real scoring-engine assignment (no skill gates in these schemes). */
function assign(levels: readonly LevelDefinition[], composite: number, experience: ExperienceBand, counts = [0, 0]) {
  return assignLevel(
    {
      composite,
      compositeSe: 2,
      skillScores: {},
      experience,
      verifiedScenarios: counts[0] ?? 0,
      practicalActions: counts[1] ?? 0,
    },
    levels,
    DEFAULT_PROFESSION_CONFIG,
  );
}

describe("buildNextLevel — null thresholds use the scoring engine's effective threshold", () => {
  const levels = makeLevels({
    5: [{ type: "practical_action", skillId: null, threshold: null, gatesAssessed: false, description: tx("Practice") }],
  });

  it("a null-threshold count requirement ('at least one') is unmet with 0 actions", () => {
    const assignment = assign(levels, 40, "5plus");
    expect(assignment.level).toBe(4);
    const row = buildNextLevel(assignment, levels, 40, {})?.requirements.find((r) => r.type === "practical_action");
    expect(row).toMatchObject({ threshold: 1, current: 0, met: false });
    const done = assign(levels, 40, "5plus", [0, 1]);
    expect(buildNextLevel(done, levels, 40, {})?.requirements[1]).toMatchObject({ current: null, met: true });
  });

  it("the counts-only path applies the same rule", () => {
    const counts = (practicalActions: number) =>
      buildNextLevel(makeAssignment(4), levels, 40, {}, { verifiedScenarios: 0, practicalActions })?.requirements[1];
    expect(counts(0)).toMatchObject({ threshold: 1, current: 0, met: false });
    expect(counts(2)).toMatchObject({ current: 2, met: true });
  });
});

describe("buildNextLevel — caps the scores alone cannot lift", () => {
  // Like content/levels/default.ts: levels 8–9 require verification but list no explicit requirement.
  const levels = makeLevels().map((l) => ({ ...l, requirements: [] }));

  it("lists the implicit verification requirement of a requires_verification level and flags the block", () => {
    const assignment = assign(levels, 80, "5plus");
    expect(assignment).toMatchObject({ level: 7, uncappedLevel: 8, cappedBy: "verification" });
    const next = buildNextLevel(assignment, levels, 80, {});
    expect(next).toMatchObject({ number: 8, compositeGap: 0, blockedBy: ["verification"] });
    expect(next?.requirements).toEqual([
      {
        type: "verified_scenario",
        skillId: null,
        threshold: 1,
        current: 0,
        met: false,
        gatesAssessed: false,
        description: VERIFICATION_REQUIREMENT_DESCRIPTION,
      },
    ]);
  });

  it("is met and unblocked once a scenario is verified (evaluation or counts)", () => {
    const next = buildNextLevel(assign(levels, 70, "5plus", [1, 0]), levels, 70, {});
    expect(next).toMatchObject({ number: 8, blockedBy: [] });
    expect(next?.requirements[0]).toMatchObject({ type: "verified_scenario", met: true });
    const counted = buildNextLevel(makeAssignment(7), levels, 70, {}, { verifiedScenarios: 1, practicalActions: 0 });
    expect(counted).toMatchObject({ blockedBy: [], requirements: [{ current: 1, met: true }] });
    expect(buildNextLevel(makeAssignment(7), levels, 70, {})).toMatchObject({ blockedBy: ["verification"] });
  });

  it("flags the experience cap (from the assignment, or from the band's cap when given)", () => {
    const capped = assign(levels, 62, "none");
    expect(capped).toMatchObject({ level: 4, uncappedLevel: 6, cappedBy: "experience" });
    expect(buildNextLevel(capped, levels, 62, {})).toMatchObject({ number: 5, compositeGap: 0, blockedBy: ["experience"] });

    const atCap = assign(levels, 40, "none");
    expect(atCap.cappedBy).toBeNull();
    expect(buildNextLevel(atCap, levels, 40, {})?.blockedBy).toEqual([]);
    expect(buildNextLevel(atCap, levels, 40, {}, undefined, 4)?.blockedBy).toEqual(["experience"]);
    expect(buildNextLevel(atCap, levels, 40, {}, undefined, null)?.blockedBy).toEqual([]);
  });
});
