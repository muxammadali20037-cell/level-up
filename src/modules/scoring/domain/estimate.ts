import type { AnsweredItem } from "@/modules/assessments/domain/types";
import { eapEstimate } from "./eap";
import { hierarchicalPosterior } from "./hierarchical";
import { clamp, nonNegative, round1 } from "./numeric";
import type { AbilityEstimate, ScoringInput, ScoringSkill, SkillEstimate } from "./types";

/** Prior SD of general ability θ_g. */
export const DEFAULT_PRIOR_SD = 1.0;
/**
 * SD of a skill ability θ_s around θ_g (hierarchical prior). 1.5 = the largest τ that keeps skill-score RMSE within
 * 5% of τ = 0.8 while more than doubling the preserved strong-vs-weak gap (07a-scoring-calibration.md).
 */
export const DEFAULT_TAU = 1.5;
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

function groupBySkill(items: readonly AnsweredItem[]): Map<string, AnsweredItem[]> {
  const groups = new Map<string, AnsweredItem[]>();
  for (const item of items) {
    const list = groups.get(item.skillId);
    if (list) list.push(item);
    else groups.set(item.skillId, [item]);
  }
  return groups;
}

/**
 * Estimates general and per-skill abilities (scoring model "irt3pl-eap-hier-v1", calibrated in
 * docs/architecture/07a-scoring-calibration.md):
 *
 * 1. Joint two-level posterior on the θ grid (`hierarchicalPosterior`): θ_g ~ N(priorMean, priorSd²) (priorSd
 *    default 1.0), θ_s | θ_g ~ N(θ_g, τ²) (τ default 1.5), each item informs only its own skill's θ_s. θ_g and
 *    every θ_s are posterior means with θ_g integrated out, so a strong and a weak skill no longer drag one
 *    plug-in θ_g (and through it each other) the way a unidimensional fit does.
 * 2. SE_g (stop rule, confidence) = posterior SD of the unidimensional EAP over ALL items with the same prior:
 *    the precision index the brief §6/§7 thresholds (target 0.45, HIGH 0.35, MEDIUM 0.55) are defined on.
 * 3. A skill with no items: posterior of θ_g widened by τ (≈ N(θ_g, SE² + τ²)), measured = false.
 * 4. Skill score = scoreFromTheta(θ_s); composite = importance-weighted mean of skill scores (1 decimal);
 *    compositeSe = round1(100/7 × posterior SD of θ_c = Σ w_s·θ_s) (skill-level uncertainty included). With no
 *    skills at all the composite falls back to scoreFromTheta(θ_g) and compositeSe to 100/7 × SE_g.
 *
 * Items whose skill is not listed in `skills` still inform θ_g. Skill estimates follow `skills` order
 * (duplicates removed). Throws RangeError when priorSd or τ is not a positive finite number.
 */
export function estimateAbilities(input: ScoringInput): AbilityEstimate {
  const priorSd = input.priorSd ?? DEFAULT_PRIOR_SD;
  const tau = input.tau ?? DEFAULT_TAU;
  if (!(Number.isFinite(tau) && tau > 0)) throw new RangeError(`Invalid tau: ${tau}`);
  const prior = { mean: input.priorMean, sd: priorSd };
  const unidimensional = eapEstimate(input.items, prior);
  const groups = groupBySkill(input.items);
  const post = hierarchicalPosterior({ groups, prior, tau, weights: normalizeImportances(input.skills) });

  const seen = new Set<string>();
  const skills: SkillEstimate[] = [];
  for (const skill of input.skills) {
    if (seen.has(skill.id)) continue;
    seen.add(skill.id);
    const { theta, se } = post.skills.get(skill.id) ?? post.general;
    const nItems = groups.get(skill.id)?.length ?? 0;
    skills.push({ skillId: skill.id, theta, se, score: scoreFromTheta(theta), nItems, measured: nItems > 0 });
  }

  const hasSkills = skills.length > 0;
  const composite = hasSkills
    ? compositeFromSkillScores(skillScoreMap(skills), input.skills)
    : scoreFromTheta(post.general.theta);
  return {
    thetaG: post.general.theta,
    seG: unidimensional.se,
    skills,
    composite,
    compositeSe: round1(scoreSeFromThetaSe(hasSkills ? post.composite.se : unidimensional.se)),
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
