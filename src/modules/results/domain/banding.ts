import { compareStrings } from "@/modules/roadmaps/domain/compare";
import type { SkillEstimate } from "@/modules/scoring/domain/types";
import type { ReportSkill, SkillBand } from "./types";

/** Scores below this are always weak. */
export const WEAK_BELOW = 40;
/** Minimum score for "strong" (raised to the next-level skill threshold when that is higher). */
export const STRONG_FROM = 60;
/** Default length of the strongest/weakest lists. */
export const TOP_SKILLS = 3;

/**
 * Band of one score (brief §8):
 * - weak:   score < 40, or score < the next level's skill_min threshold for this skill;
 * - strong: score ≥ max(60, next-level threshold);
 * - ok:     otherwise.
 */
export function bandForScore(score: number, nextLevelThreshold?: number): SkillBand {
  if (score < WEAK_BELOW || (nextLevelThreshold !== undefined && score < nextLevelThreshold)) return "weak";
  if (score >= Math.max(STRONG_FROM, nextLevelThreshold ?? 0)) return "strong";
  return "ok";
}

/** Bands every skill estimate (input order kept). `nextLevelSkillThresholds`: skillId → skill_min of level L+1. */
export function bandSkills(
  skillEstimates: readonly SkillEstimate[],
  nextLevelSkillThresholds: Readonly<Record<string, number>>,
): ReportSkill[] {
  return skillEstimates.map((estimate) => ({
    skillId: estimate.skillId,
    score: estimate.score,
    band: bandForScore(estimate.score, nextLevelSkillThresholds[estimate.skillId]),
    measured: estimate.measured,
    nItems: estimate.nItems,
  }));
}

type Direction = "strongest" | "weakest";

function rankSkills(
  skills: readonly ReportSkill[],
  importance: Readonly<Record<string, number>>,
  direction: Direction,
): ReportSkill[] {
  const sign = direction === "strongest" ? -1 : 1;
  return [...skills].sort(
    (a, b) =>
      Number(b.measured) - Number(a.measured) ||
      sign * (a.score - b.score) ||
      (importance[b.skillId] ?? 0) - (importance[a.skillId] ?? 0) ||
      compareStrings(a.skillId, b.skillId),
  );
}

/**
 * Up to `limit` strongest skill ids, strongest first. Candidates: non-weak skills (all skills if every skill is
 * weak, so there is always a relative strength to show), minus `exclude` (e.g. the bottleneck, so the "strongest
 * skill" never equals the "main problem") unless that would leave no candidate. Order: measured before
 * unmeasured, score desc, importance desc, id asc.
 */
export function pickStrongest(
  skills: readonly ReportSkill[],
  importance: Readonly<Record<string, number>>,
  limit = TOP_SKILLS,
  exclude: readonly string[] = [],
): string[] {
  const nonWeak = skills.filter((s) => s.band !== "weak");
  const base = nonWeak.length > 0 ? nonWeak : skills;
  const kept = base.filter((s) => !exclude.includes(s.skillId));
  const pool = kept.length > 0 ? kept : base;
  return rankSkills(pool, importance, "strongest")
    .slice(0, limit)
    .map((s) => s.skillId);
}

/**
 * Up to `limit` weakest skill ids, weakest first. Candidates: weak skills; if none, "ok" skills; strong skills
 * never appear. Order: measured before unmeasured, score asc, importance desc (a more important weakness
 * first), id asc.
 */
export function pickWeakest(
  skills: readonly ReportSkill[],
  importance: Readonly<Record<string, number>>,
  limit = TOP_SKILLS,
): string[] {
  const weak = skills.filter((s) => s.band === "weak");
  const pool = weak.length > 0 ? weak : skills.filter((s) => s.band === "ok");
  return rankSkills(pool, importance, "weakest")
    .slice(0, limit)
    .map((s) => s.skillId);
}
