/**
 * Scoring-model variants compared by the calibration study. Each variant = a guessing policy (how c is set when
 * items are built) + an ability estimator (used both by routing and for the final result).
 */
import { guessingFor, type AnsweredItem } from "@/modules/assessments/domain";
import {
  compositeFromSkillScores,
  eapEstimate,
  normalizeImportances,
  round1,
  scoreFromTheta,
  scoreSeFromThetaSe,
  type AbilityEstimate,
  type ScoringInput,
  type SkillEstimate,
} from "@/modules/scoring/domain";
import { hierarchicalPosterior } from "@/modules/scoring/domain/hierarchical";
import type { GuessingPolicy } from "./bank";

export interface ScoringModel {
  readonly id: string;
  readonly description: string;
  readonly tau: number;
  readonly guessing: GuessingPolicy;
  readonly estimate: (input: ScoringInput) => AbilityEstimate;
}

/** c = 1/n for single_best and partial_credit, 0 for likert: the production policy (`guessingFor`). */
export const uniformGuessing: GuessingPolicy = (rule, options) => guessingFor(rule, options.length);
/** c = 1/n for single_best only; 0 for partial_credit and likert (brief §6 wording). */
export const singleBestGuessing: GuessingPolicy = (rule, options) => (rule === "single_best" ? 1 / options.length : 0);
/** c = expected credit of a uniformly random pick (1/n for single_best, mean option score for partial_credit). */
export const expectedCreditGuessing: GuessingPolicy = (rule, options) =>
  rule === "likert" ? 0 : options.reduce((sum, o) => sum + o.score, 0) / options.length;

function groupBySkill(items: readonly AnsweredItem[]): Map<string, AnsweredItem[]> {
  const groups = new Map<string, AnsweredItem[]>();
  for (const item of items) groups.set(item.skillId, [...(groups.get(item.skillId) ?? []), item]);
  return groups;
}

function finish(
  thetaG: number,
  seG: number,
  skills: SkillEstimate[],
  input: ScoringInput,
  compositeSd: number,
): AbilityEstimate {
  const scores = Object.fromEntries(skills.map((s) => [s.skillId, s.score]));
  const composite = skills.length > 0 ? compositeFromSkillScores(scores, input.skills) : scoreFromTheta(thetaG);
  return { thetaG, seG, skills, composite, compositeSe: round1(scoreSeFromThetaSe(compositeSd)) };
}

const uniqueIds = (input: ScoringInput): string[] => [...new Set(input.skills.map((s) => s.id))];

/** V0–V3: plug-in empirical Bayes (θ_g = unidimensional EAP over all items; θ_s ~ N(θ̂_g, τ²)). */
export function empiricalBayes(tau: number, priorSd = 1): ScoringModel["estimate"] {
  return (input) => {
    const general = eapEstimate(input.items, { mean: input.priorMean, sd: priorSd });
    const groups = groupBySkill(input.items);
    const skills = uniqueIds(input).map((skillId): SkillEstimate => {
      const items = groups.get(skillId) ?? [];
      if (items.length === 0) {
        const se = Math.sqrt(general.se ** 2 + tau ** 2);
        return { skillId, theta: general.theta, se, score: scoreFromTheta(general.theta), nItems: 0, measured: false };
      }
      const { theta, se } = eapEstimate(items, { mean: general.theta, sd: tau });
      return { skillId, theta, se, score: scoreFromTheta(theta), nItems: items.length, measured: true };
    });
    return finish(general.theta, general.se, skills, input, general.se);
  };
}

/**
 * V4: each skill estimated independently with its marginal prior N(μ0, 1 + τ²); θ_g = importance-weighted mean of
 * those (unmeasured skills at μ0), SE_g = sqrt(Σ w²·se²); displayed θ_s = EAP with prior N(θ_g, τ²).
 */
export function independentMean(tau: number, priorSd = 1): ScoringModel["estimate"] {
  return (input) => {
    const groups = groupBySkill(input.items);
    const weights = normalizeImportances(input.skills);
    const marginalSd = Math.sqrt(priorSd ** 2 + tau ** 2);
    let thetaG = 0;
    let varG = 0;
    for (const [skillId, w] of weights) {
      const items = groups.get(skillId) ?? [];
      const ind = items.length > 0 ? eapEstimate(items, { mean: input.priorMean, sd: marginalSd }) : null;
      thetaG += w * (ind?.theta ?? input.priorMean);
      varG += w * w * (ind?.se ?? marginalSd) ** 2;
    }
    if (weights.size === 0) thetaG = input.priorMean;
    const seG = weights.size === 0 ? priorSd : Math.sqrt(varG);
    const skills = uniqueIds(input).map((skillId): SkillEstimate => {
      const items = groups.get(skillId) ?? [];
      const est = items.length > 0 ? eapEstimate(items, { mean: thetaG, sd: tau }) : null;
      const theta = est?.theta ?? thetaG;
      const se = est?.se ?? Math.sqrt(seG ** 2 + tau ** 2);
      return { skillId, theta, se, score: scoreFromTheta(theta), nItems: items.length, measured: items.length > 0 };
    });
    return finish(thetaG, seG, skills, input, seG);
  };
}

export type JointSe = "general" | "composite" | "unidim";

/**
 * Joint hierarchical posterior (θ_g and every θ_s integrated exactly on the grid, see `hierarchicalPosterior`).
 * `se` chooses what SE_g reports: the posterior SD of θ_g ("general"), of the composite θ_c ("composite"), or the
 * posterior SD of the unidimensional EAP over all items ("unidim", the SE_g definition of V0–V3).
 */
export function joint(tau: number, se: JointSe, priorSd = 1): ScoringModel["estimate"] {
  return (input) => {
    const groups = groupBySkill(input.items);
    const weights = normalizeImportances(input.skills);
    const post = hierarchicalPosterior({ groups, prior: { mean: input.priorMean, sd: priorSd }, tau, weights });
    const skills = uniqueIds(input).map((skillId): SkillEstimate => {
      const p = post.skills.get(skillId) ?? post.general;
      const nItems = groups.get(skillId)?.length ?? 0;
      return { skillId, theta: p.theta, se: p.se, score: scoreFromTheta(p.theta), nItems, measured: nItems > 0 };
    });
    const seG =
      se === "general"
        ? post.general.se
        : se === "composite"
          ? post.composite.se
          : eapEstimate(input.items, { mean: input.priorMean, sd: priorSd }).se;
    return finish(post.general.theta, seG, skills, input, post.composite.se);
  };
}
