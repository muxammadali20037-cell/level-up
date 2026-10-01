import type { AnsweredItem } from "@/modules/assessments/domain/types";
import { eapEstimate } from "./eap";
import { clamp, nonNegative, round1 } from "./numeric";
import type { AbilityEstimate, ScoringInput, ScoringSkill, SkillEstimate } from "./types";

/** Prior SD of general ability θ_g. */
export const DEFAULT_PRIOR_SD = 1.0;
/** SD of a skill ability θ_s around θ_g (hierarchical prior). */
export const DEFAULT_TAU = 0.8;
/** Score mapping: θ = −3.5 → 0, θ = 0 → 50, θ = 3.5 → 100. */
export const SCORE_THETA_OFFSET = 3.5;
export const SCORE_THETA_SPAN = 7;

/** Maps θ to a 0..100 score: clamp(round((θ + 3.5) / 7 × 100), 0, 100). Monotone non-decreasing. */
export function scoreFromTheta(theta: number): number {
  return clamp(Math.round(((theta + SCORE_THETA_OFFSET) / SCORE_THETA_SPAN) * 100), 0, 100);
}

/** Inverse of the (unrounded) score mapping: θ = score/100 × 7 − 3.5, with score clamped to [0, 100]. */
export function thetaFromScore(score: number): number {
  return (clamp(score, 0, 100) / 100) * SCORE_THETA_SPAN - SCORE_THETA_OFFSET;
}

/** Converts a θ-scale SD into score points: 100/7 × se (unrounded). */
export function scoreSeFromThetaSe(se: number): number {
  return (100 / SCORE_THETA_SPAN) * se;
}

/**
 * Normalized composite weights per skill id. Negative/non-finite importances count as 0; if every importance is
 * 0 the weights are equal. Duplicate skill ids keep their first occurrence.
 */
export function normalizeImportances(skills: readonly ScoringSkill[]): Map<string, number> {
  const unique = new Map<string, number>();
  for (const skill of skills) {
    if (!unique.has(skill.id)) unique.set(skill.id, nonNegative(skill.importance));
  }
  let total = 0;
  for (const value of unique.values()) total += value;
  const weights = new Map<string, number>();
  for (const [id, value] of unique) {
    weights.set(id, total > 0 ? value / total : 1 / unique.size);
  }
  return weights;
}

/**
 * Composite = Σ_s w_s · score_s with normalized importances w_s (see `normalizeImportances`), rounded to one
 * decimal. Skills without a score contribute nothing and their weight is redistributed. Returns 0 when there is
 * nothing to weigh.
 */
export function compositeFromSkillScores(
  scores: Readonly<Record<string, number>>,
  skills: readonly ScoringSkill[],
): number {
  const weights = normalizeImportances(skills.filter((skill) => scores[skill.id] !== undefined));
  let sum = 0;
  for (const [id, weight] of weights) sum += weight * (scores[id] ?? 0);
  return round1(sum);
}

function skillEstimate(
  skillId: string,
  items: readonly AnsweredItem[],
  thetaG: number,
  seG: number,
  tau: number,
): SkillEstimate {
  if (items.length === 0) {
    const se = Math.sqrt(seG * seG + tau * tau);
    return { skillId, theta: thetaG, se, score: scoreFromTheta(thetaG), nItems: 0, measured: false };
  }
  const { theta, se } = eapEstimate(items, { mean: thetaG, sd: tau });
  return { skillId, theta, se, score: scoreFromTheta(theta), nItems: items.length, measured: true };
}

/**
 * Estimates general and per-skill abilities ("irt3pl-eap-hier-v1"):
 *
 * 1. θ_g = EAP over ALL answered items with prior N(priorMean, priorSd²) (priorSd default 1.0); SE_g = posterior SD.
 * 2. For each skill with items: θ_s = EAP over that skill's items only with prior N(θ_g, τ²) (τ default 0.8) —
 *    empirical-Bayes shrinkage: a skill with one item stays near θ_g, many consistent items pull it away.
 * 3. A skill with no items: θ_s = θ_g, SE = sqrt(SE_g² + τ²), measured = false.
 * 4. Skill score = scoreFromTheta(θ_s); composite = importance-weighted mean of skill scores (1 decimal);
 *    compositeSe = round1(100/7 × SE_g). With no skills at all the composite falls back to scoreFromTheta(θ_g).
 *
 * Items whose skill is not listed in `skills` still inform θ_g. Skill estimates follow `skills` order
 * (duplicates removed). Throws RangeError when priorSd or τ is not a positive finite number.
 */
export function estimateAbilities(input: ScoringInput): AbilityEstimate {
  const priorSd = input.priorSd ?? DEFAULT_PRIOR_SD;
  const tau = input.tau ?? DEFAULT_TAU;
  if (!(Number.isFinite(tau) && tau > 0)) throw new RangeError(`Invalid tau: ${tau}`);
  const general = eapEstimate(input.items, { mean: input.priorMean, sd: priorSd });

  const bySkill = new Map<string, AnsweredItem[]>();
  for (const item of input.items) {
    const list = bySkill.get(item.skillId);
    if (list) list.push(item);
    else bySkill.set(item.skillId, [item]);
  }

  const seen = new Set<string>();
  const skills: SkillEstimate[] = [];
  for (const skill of input.skills) {
    if (seen.has(skill.id)) continue;
    seen.add(skill.id);
    skills.push(skillEstimate(skill.id, bySkill.get(skill.id) ?? [], general.theta, general.se, tau));
  }

  const composite =
    skills.length > 0
      ? compositeFromSkillScores(skillScoreMap(skills), input.skills)
      : scoreFromTheta(general.theta);

  return {
    thetaG: general.theta,
    seG: general.se,
    skills,
    composite,
    compositeSe: round1(scoreSeFromThetaSe(general.se)),
  };
}

/** skillId → score (0..100), the shape `LevelAssignmentInput.skillScores` expects. */
export function skillScoreMap(skills: readonly SkillEstimate[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const skill of skills) map[skill.skillId] = skill.score;
  return map;
}

/** skillId → SE in score points (100/7 × se, one decimal), for `LevelAssignmentInput.skillScoreSes`. */
export function skillScoreSeMap(skills: readonly SkillEstimate[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const skill of skills) map[skill.skillId] = round1(scoreSeFromThetaSe(skill.se));
  return map;
}
