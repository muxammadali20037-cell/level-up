import { fisherInformation, type AbilityEstimate, type ScoringSkill } from "@/modules/scoring/domain";
import { mulberry32 } from "./rng";
import { candidatesForSkill, routableSkills, type ItemConstraints } from "./routing-pool";
import type { Question } from "./types";

/** Randomesque exposure control: the served item is drawn uniformly from the top-K ranked candidates. */
export const RANDOMESQUE_TOP_K = 3;

/** Locale-independent string order (code units), used for deterministic tie-breaks. */
function compareCodeUnits(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Ties are broken by stable key, then id, so the ranking never depends on bank order. */
function byKeyThenId(a: Question, b: Question): number {
  return compareCodeUnits(a.key, b.key) || compareCodeUnits(a.id, b.id);
}

/** Coverage ranking: difficulty closest to the current general ability first, |b − θ_g| ascending. */
export function rankByDifficultyDistance(candidates: readonly Question[], thetaG: number): Question[] {
  return candidates
    .map((question) => ({ question, distance: Math.abs(question.difficulty - thetaG) }))
    .sort((x, y) => x.distance - y.distance || byKeyThenId(x.question, y.question))
    .map(({ question }) => question);
}

/** Precision ranking: Fisher information I(θ_s) of the 3PL item at the skill's current θ, descending. */
export function rankByInformation(candidates: readonly Question[], theta: number): Question[] {
  return candidates
    .map((question) => ({ question, information: fisherInformation(theta, question) }))
    .sort((x, y) => y.information - x.information || byKeyThenId(x.question, y.question))
    .map(({ question }) => question);
}

/**
 * Randomesque pick: index ⌊u·k⌋ with u = mulberry32(seed)() and k = min(RANDOMESQUE_TOP_K, ranked.length).
 * Returns null for an empty list. Same (ranked, seed) → same item.
 */
export function pickRandomesque(ranked: readonly Question[], seed: number): Question | null {
  const k = Math.min(RANDOMESQUE_TOP_K, ranked.length);
  if (k === 0) return null;
  const index = Math.min(k - 1, Math.floor(mulberry32(seed)() * k));
  return ranked[index] ?? null;
}

/**
 * Coverage phase: walk the uncovered core skills in importance order and return the first skill's candidates
 * ranked by |b − θ_g|. A skill with no candidate under the constraints is skipped (fall back to the next skill).
 */
export function coverageCandidates(
  uncoveredCoreSkillIds: readonly string[],
  pool: readonly Question[],
  constraints: ItemConstraints,
  thetaG: number,
): Question[] {
  for (const skillId of uncoveredCoreSkillIds) {
    const candidates = candidatesForSkill(pool, skillId, constraints);
    if (candidates.length > 0) return rankByDifficultyDistance(candidates, thetaG);
  }
  return [];
}

/**
 * Precision phase: routable skills (importance > 0, see `routableSkills`) are ordered by importance × posterior
 * SD of θ_s (ties: importance, then input order);
 * the first skill with a candidate under the constraints wins and its items are ranked by Fisher information at
 * that skill's θ_s. Unmeasured skills use θ_g and SD sqrt(SE_g² + τ²), so they naturally rank high.
 */
export function precisionCandidates(
  skills: readonly ScoringSkill[],
  estimate: AbilityEstimate,
  pool: readonly Question[],
  constraints: ItemConstraints,
): Question[] {
  const bySkill = new Map(estimate.skills.map((skill) => [skill.skillId, skill]));
  const ordered = routableSkills(skills)
    .map((skill, index) => {
      const skillEstimate = bySkill.get(skill.id);
      const se = skillEstimate?.se ?? estimate.seG;
      return { skill, index, theta: skillEstimate?.theta ?? estimate.thetaG, priority: skill.importance * se };
    })
    .sort((x, y) => y.priority - x.priority || y.skill.importance - x.skill.importance || x.index - y.index);

  for (const entry of ordered) {
    const candidates = candidatesForSkill(pool, entry.skill.id, constraints);
    if (candidates.length > 0) return rankByInformation(candidates, entry.theta);
  }
  return [];
}
