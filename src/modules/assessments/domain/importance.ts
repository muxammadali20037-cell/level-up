import type { GoalType, Skill } from "@/modules/catalog/domain/types";
import { normalizeImportances, type ScoringSkill } from "@/modules/scoring/domain";

/** Multipliers keyed by skill id (missing = 1). */
export type SkillMultipliers = Readonly<Record<string, number>>;

export interface ImportanceOptions {
  /** Specialization multipliers (Specialization.skillWeights). 0 removes a skill from the composite and routing. */
  readonly specializationWeights?: SkillMultipliers;
  /** Extra multipliers, e.g. from `goalBoosts`. Routing only: never use boosted weights for scoring. */
  readonly boosts?: SkillMultipliers;
}

/** A multiplier is used only when finite and ≥ 0; anything else is ignored (treated as 1). */
function multiplier(map: SkillMultipliers | undefined, skillId: string): number {
  const value = map?.[skillId];
  return value !== undefined && Number.isFinite(value) && value >= 0 ? value : 1;
}

/**
 * Generic normalized importance (building block of `compositeImportance` and `routingImportance`):
 *
 *   raw_s = importance_s × specializationWeight_s × boost_s,    w_s = raw_s / Σ raw
 *
 * Normalization follows the scoring engine (`normalizeImportances`): negative/non-finite importances count as 0
 * and if every raw value is 0 all skills get equal weight. Skill order is preserved; duplicate ids keep their
 * first occurrence. The returned importances sum to 1 (empty input → empty output).
 *
 * Prefer the two purpose-named helpers: the composite (brief §6) uses importance × specialization weight only;
 * goal boosts change ROUTING priority only, so the assessed level never depends on the goal a user states.
 */
export function adjustedImportance(skills: readonly Skill[], opts: ImportanceOptions = {}): ScoringSkill[] {
  const raw: ScoringSkill[] = skills.map((skill) => ({
    id: skill.id,
    importance:
      skill.importance * multiplier(opts.specializationWeights, skill.id) * multiplier(opts.boosts, skill.id),
  }));
  const weights = normalizeImportances(raw);
  return [...weights].map(([id, importance]) => ({ id, importance }));
}

/** One data-driven goal rule: skills whose globalSkillKey or slug contains a keyword get `multiplier`. */
export interface GoalBoostRule {
  readonly keywords: readonly string[];
  readonly multiplier: number;
}

/**
 * Conservative boost: a goal nudges ROUTING priority (core skills, precision order) only. It never changes the
 * composite or the assessed level, and never dominates the profession's weights.
 */
export const GOAL_BOOST_MULTIPLIER = 1.3;

const PEOPLE_LEADERSHIP_RULE: GoalBoostRule = {
  keywords: ["leadership", "management", "people", "delegation"],
  multiplier: GOAL_BOOST_MULTIPLIER,
};

/**
 * Goal → boost rule. Goals without a rule get no boost, deliberately:
 * - lead / manager: leading people is part of the goal itself, so people-leadership skills are boosted.
 * - expert: depth across the whole profession is the goal — no single skill family is favoured.
 * - find_job / first_job: hiring needs vary by employer; we have no reliable data to favour particular skills.
 * - start, professional, increase_income, build_business, scale_business, change_career: no reliable evidence
 *   that the goal changes which current competencies matter, so the profession weights stand unchanged.
 */
export const GOAL_BOOST_RULES: Readonly<Partial<Record<GoalType, GoalBoostRule>>> = {
  lead: PEOPLE_LEADERSHIP_RULE,
  manager: PEOPLE_LEADERSHIP_RULE,
};

function matchesRule(skill: Skill, rule: GoalBoostRule): boolean {
  const haystacks = [skill.slug, skill.globalSkillKey ?? ""].map((value) => value.toLowerCase());
  return rule.keywords.some((keyword) => haystacks.some((value) => value.includes(keyword.toLowerCase())));
}

/**
 * Importance boosts implied by the user's goal (see GOAL_BOOST_RULES): skillId → multiplier for every skill whose
 * `globalSkillKey` or `slug` contains one of the rule's keywords (case-insensitive substring). Skills that do not
 * match are omitted (multiplier 1). Pass the result as `boosts` to `adjustedImportance`.
 */
export function goalBoosts(goal: GoalType, skills: readonly Skill[]): Record<string, number> {
  const rule = GOAL_BOOST_RULES[goal];
  const boosts: Record<string, number> = {};
  if (!rule) return boosts;
  for (const skill of skills) {
    if (matchesRule(skill, rule)) boosts[skill.id] = rule.multiplier;
  }
  return boosts;
}

/**
 * Composite (scoring) importance, brief §6: w_s = importance_s × specializationWeight_s / Σ, normalized as in
 * `adjustedImportance`. Never goal-boosted, so identical answers always give the same composite and assessed level
 * whatever goal was stated. Pass it to scoring (`AssessmentScoringInput.skills`).
 */
export function compositeImportance(
  skills: readonly Skill[],
  specializationWeights?: SkillMultipliers,
): ScoringSkill[] {
  return adjustedImportance(skills, { specializationWeights });
}

export interface RoutingImportanceOptions {
  readonly specializationWeights?: SkillMultipliers;
  /** The user's stated goal; boosts come from `goalBoosts(goal, skills)`. */
  readonly goal?: GoalType | null;
}

/**
 * Routing importance: importance_s × specializationWeight_s × goalBoost_s, normalized (see `adjustedImportance`).
 * Use it ONLY for `RoutingInput.skills` (which skills are core, precision priority). Never pass it to scoring:
 * the composite uses `compositeImportance`. Without a goal (or a goal without a rule) it equals compositeImportance.
 */
export function routingImportance(skills: readonly Skill[], opts: RoutingImportanceOptions = {}): ScoringSkill[] {
  const boosts = opts.goal ? goalBoosts(opts.goal, skills) : undefined;
  return adjustedImportance(skills, { specializationWeights: opts.specializationWeights, boosts });
}
