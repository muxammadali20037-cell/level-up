import { describe, expect, it } from "vitest";
import { DEFAULT_PROFESSION_CONFIG, type ProfessionConfig } from "@/modules/catalog/domain/types";
import { compositeFromSkillScores } from "./estimate";
import { assignLevel, RANGE_MARGIN_MAX, rangeMargin, sortLevels } from "./levels";
import { defaultLevels, levelInput, requirement } from "./test-fixtures";

const config = DEFAULT_PROFESSION_CONFIG;
const levels = defaultLevels();

describe("assignLevel — composite thresholds", () => {
  it.each([
    [0, 1],
    [14.9, 1],
    [15, 2],
    [34.9, 3],
    [35, 4],
    [44.9, 4],
    [45, 5],
    [55, 6],
    [64.9, 6],
    [65, 7],
  ])("composite %d → Level %d", (composite, expected) => {
    const result = assignLevel(levelInput({ composite, compositeSe: 0 }), levels, config);
    expect(result.level).toBe(expected);
    expect(result.uncappedLevel).toBe(expected);
    expect(result.cappedBy).toBeNull();
  });

  it("sorts levels defensively and ignores duplicates", () => {
    const shuffled = [levels[4]!, levels[0]!, levels[8]!, levels[2]!, levels[1]!, levels[3]!, levels[7]!, levels[6]!];
    const withDuplicate = [...shuffled, levels[5]!, { ...levels[5]!, minComposite: 99 }];
    expect(sortLevels(withDuplicate).map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const input = levelInput({ composite: 58, compositeSe: 0 });
    expect(assignLevel(input, withDuplicate, config)).toEqual(assignLevel(input, levels, config));
  });

  it("returns Level 1 for an empty scheme", () => {
    expect(assignLevel(levelInput(), [], config)).toMatchObject({ level: 1, uncappedLevel: 1, evaluations: [] });
  });
});

describe("assignLevel — gates (worked example)", () => {
  // Entrepreneur: Sales 81, Customer 74, Marketing 72, Finance 39, Systems 31, Management 48.
  const skillScores = { sales: 81, customer: 74, marketing: 72, finance: 39, systems: 31, management: 48 };
  const skills = Object.keys(skillScores).map((id) => ({ id, importance: 1 }));
  const gated = defaultLevels({ 5: [requirement({ type: "skill_min", skillId: "finance", threshold: 45 })] });

  it("assesses Level 4 although the composite reaches Level 6", () => {
    const composite = compositeFromSkillScores(skillScores, skills);
    expect(composite).toBe(57.5);
    const result = assignLevel(levelInput({ composite, compositeSe: 4.5, skillScores }), gated, config);
    expect(result.level).toBe(4);
    expect(result.uncappedLevel).toBe(4);
    expect(result.cappedBy).toBeNull();
    expect(result.range).toBeNull();
    const l5 = result.evaluations.find((e) => e.number === 5);
    expect(l5?.met).toBe(false);
    expect(l5?.missing).toEqual([
      { type: "skill_min", skillId: "finance", threshold: 45, current: 39, gatesAssessed: true },
    ]);
    // Cumulative: Level 6 fails through the Level 5 gate even though its own composite threshold is met.
    expect(result.evaluations.find((e) => e.number === 6)?.met).toBe(false);
  });

  it("assesses Level 4 at composite exactly 45 and Level 6 once Finance reaches 45", () => {
    expect(assignLevel(levelInput({ composite: 45, compositeSe: 0, skillScores }), gated, config).level).toBe(4);
    const fixed = { ...skillScores, finance: 45 };
    expect(assignLevel(levelInput({ composite: 57.5, compositeSe: 0, skillScores: fixed }), gated, config).level).toBe(6);
  });

  it("treats a missing skill score as not met", () => {
    const result = assignLevel(levelInput({ composite: 50, compositeSe: 0, skillScores: {} }), gated, config);
    expect(result.level).toBe(4);
    expect(result.evaluations[4]?.missing[0]).toMatchObject({ skillId: "finance", current: null });
  });

  it("lists non-gating requirements as missing without blocking", () => {
    const scheme = defaultLevels({
      5: [requirement({ type: "practical_action", threshold: 2, gatesAssessed: false })],
      6: [requirement({ type: "experience_min", threshold: 3 })],
    });
    const base = levelInput({ composite: 60, compositeSe: 0, experience: "1to3" });
    const result = assignLevel(base, scheme, config);
    expect(result.level).toBe(5);
    expect(result.evaluations[4]).toMatchObject({ met: true });
    expect(result.evaluations[4]?.missing).toEqual([
      { type: "practical_action", skillId: null, threshold: 2, current: 0, gatesAssessed: false },
    ]);
    expect(result.evaluations[5]?.missing).toEqual([
      { type: "experience_min", skillId: null, threshold: 3, current: 1, gatesAssessed: true },
    ]);
    expect(assignLevel({ ...base, experience: "3to5" }, scheme, config).level).toBe(6);
  });

  it("gates on verified scenarios and practical actions counts", () => {
    const scheme = defaultLevels({
      6: [requirement({ type: "verified_scenario", threshold: null }), requirement({ type: "practical_action", threshold: 3 })],
    });
    const base = levelInput({ composite: 60, compositeSe: 0 });
    expect(assignLevel(base, scheme, config).level).toBe(5);
    expect(assignLevel({ ...base, verifiedScenarios: 1, practicalActions: 2 }, scheme, config).level).toBe(5);
    expect(assignLevel({ ...base, verifiedScenarios: 1, practicalActions: 3 }, scheme, config).level).toBe(6);
  });

  it("adds a synthetic composite entry for levels above the composite", () => {
    const result = assignLevel(levelInput({ composite: 40, compositeSe: 0 }), levels, config);
    expect(result.evaluations[4]?.missing).toEqual([
      { type: "composite_min", skillId: null, threshold: 45, current: 40, gatesAssessed: true },
    ]);
    expect(result.evaluations.map((e) => e.met)).toEqual([true, true, true, true, false, false, false, false, false]);
  });
});

describe("assignLevel — caps", () => {
  it("caps verification-only levels at the highest non-verification level", () => {
    const result = assignLevel(levelInput({ composite: 90, compositeSe: 0 }), levels, config);
    expect(result).toMatchObject({ level: 7, uncappedLevel: 9, cappedBy: "verification" });
    expect(result.evaluations[7]?.missing).toEqual([
      { type: "verified_scenario", skillId: null, threshold: 1, current: 0, gatesAssessed: false },
    ]);
    // Verified counts never lift the cap: levels 8–9 are never ASSESSED (AC-F07-02); the verified level is separate.
    const verified = assignLevel(levelInput({ composite: 90, compositeSe: 0, verifiedScenarios: 1 }), levels, config);
    expect(verified).toMatchObject({ level: 7, uncappedLevel: 9, cappedBy: "verification" });
    expect(verified.evaluations[8]?.missing).toEqual([]);
  });

  it("regression: verified counts do not unlock verification levels, even when they meet explicit requirements", () => {
    const scheme = defaultLevels({
      8: [requirement({ type: "verified_scenario", threshold: 2, gatesAssessed: false })],
      9: [requirement({ type: "verified_scenario", threshold: 3, gatesAssessed: false })],
    });
    for (const verifiedScenarios of [0, 1, 3, 10]) {
      const result = assignLevel(
        levelInput({ composite: 90, compositeSe: 0, verifiedScenarios, practicalActions: 10 }),
        scheme,
        config,
      );
      expect(result).toMatchObject({ level: 7, uncappedLevel: 9, cappedBy: "verification" });
    }
    const one = assignLevel(levelInput({ composite: 90, compositeSe: 0, verifiedScenarios: 1 }), scheme, config);
    expect(one.evaluations[8]?.missing).toEqual([
      { type: "verified_scenario", skillId: null, threshold: 3, current: 1, gatesAssessed: false },
    ]);
  });

  it("caps a profession whose verification levels start lower at the highest non-verification level", () => {
    const scheme = defaultLevels().map((level) => ({ ...level, requiresVerification: level.number >= 7 }));
    const result = assignLevel(levelInput({ composite: 80, compositeSe: 0, verifiedScenarios: 5 }), scheme, config);
    expect(result).toMatchObject({ level: 6, uncappedLevel: 8, cappedBy: "verification" });
  });

  it("applies experience caps from the profession config", () => {
    const none = assignLevel(levelInput({ composite: 60, compositeSe: 0, experience: "none" }), levels, config);
    expect(none).toMatchObject({ level: 4, uncappedLevel: 6, cappedBy: "experience" });
    const lt1 = assignLevel(levelInput({ composite: 60, compositeSe: 0, experience: "lt1" }), levels, config);
    expect(lt1).toMatchObject({ level: 5, cappedBy: "experience" });
    const below = assignLevel(levelInput({ composite: 30, compositeSe: 0, experience: "none" }), levels, config);
    expect(below).toMatchObject({ level: 3, cappedBy: null });
  });

  it("applies the stricter cap and reports it", () => {
    const strict = assignLevel(levelInput({ composite: 80, compositeSe: 0, experience: "none" }), levels, config);
    expect(strict).toMatchObject({ level: 4, uncappedLevel: 8, cappedBy: "experience" });
    const loose: ProfessionConfig = { ...config, experienceCaps: { "3to5": 8 } };
    const verification = assignLevel(levelInput({ composite: 90, compositeSe: 0 }), levels, loose);
    expect(verification).toMatchObject({ level: 7, cappedBy: "verification" });
    const tie: ProfessionConfig = { ...config, experienceCaps: { "3to5": 7 } };
    expect(assignLevel(levelInput({ composite: 90, compositeSe: 0 }), levels, tie)).toMatchObject({
      level: 7,
      cappedBy: "experience",
    });
  });
});

describe("assignLevel — range", () => {
  it("reports [L, L+1] only when the composite is within min(SE/2, 2.5) below the next boundary", () => {
    const at = (composite: number, compositeSe: number) =>
      assignLevel(levelInput({ composite, compositeSe }), levels, config).range;
    expect(at(43, 5)).toEqual([4, 5]); // margin 2.5 → from 42.5
    expect(at(42.5, 5)).toEqual([4, 5]);
    expect(at(42.4, 5)).toBeNull();
    expect(at(40, 5)).toBeNull(); // the old "within one SE" rule reported [4, 5] here
    expect(at(43, 3)).toBeNull(); // margin 1.5 → from 43.5
    expect(at(43.5, 3)).toEqual([4, 5]);
    expect(at(42.6, 20)).toEqual([4, 5]); // margin capped at 2.5
    expect(at(42.4, 20)).toBeNull();
    expect(rangeMargin(5)).toBe(2.5);
    expect(rangeMargin(3)).toBe(1.5);
    expect(rangeMargin(Number.NaN)).toBe(0);
    expect(RANGE_MARGIN_MAX).toBe(2.5);
  });

  it("never reports a lower-side range", () => {
    expect(assignLevel(levelInput({ composite: 36, compositeSe: 5 }), levels, config).range).toBeNull();
    expect(assignLevel(levelInput({ composite: 35, compositeSe: 20 }), levels, config).range).toBeNull();
  });

  it("reports no range when the composite is far from the next boundary or SE is 0", () => {
    expect(assignLevel(levelInput({ composite: 40, compositeSe: 3 }), levels, config).range).toBeNull();
    expect(assignLevel(levelInput({ composite: 44.9, compositeSe: 0 }), levels, config).range).toBeNull();
    expect(assignLevel(levelInput({ composite: 0, compositeSe: 5 }), levels, config).range).toBeNull();
  });

  it("uses skill margins min(skill SE/2, 2.5) for gated next levels", () => {
    const gated = defaultLevels({ 5: [requirement({ type: "skill_min", skillId: "finance", threshold: 45 })] });
    const near = levelInput({ composite: 50, compositeSe: 3, skillScores: { finance: 43 } });
    expect(assignLevel(near, gated, config).level).toBe(4);
    expect(assignLevel(near, gated, config).range).toBeNull(); // fallback compositeSe 3 → margin 1.5
    expect(assignLevel({ ...near, skillScoreSes: { finance: 4 } }, gated, config).range).toEqual([4, 5]);
    expect(assignLevel({ ...near, skillScoreSes: { finance: 3.9 } }, gated, config).range).toBeNull();
    expect(assignLevel({ ...near, compositeSe: 4 }, gated, config).range).toEqual([4, 5]);
    const far = { ...near, skillScores: { finance: 42 }, skillScoreSes: { finance: 30 } };
    expect(assignLevel(far, gated, config).range).toBeNull(); // margin capped at 2.5
  });

  it("does not offer a next level that a cap blocks", () => {
    const capped = assignLevel(levelInput({ composite: 74, compositeSe: 5 }), levels, config);
    expect(capped.level).toBe(7);
    expect(capped.range).toBeNull();
    const experience = assignLevel(levelInput({ composite: 44, compositeSe: 5, experience: "none" }), levels, config);
    expect(assignLevel(levelInput({ composite: 44, compositeSe: 5 }), levels, config).range).toEqual([4, 5]);
    expect(experience).toMatchObject({ level: 4, range: null });
    // Level 8 stays blocked for the assessed range even with verified scenarios.
    expect(assignLevel(levelInput({ composite: 74, compositeSe: 5, verifiedScenarios: 1 }), levels, config).range).toBeNull();
  });
});
