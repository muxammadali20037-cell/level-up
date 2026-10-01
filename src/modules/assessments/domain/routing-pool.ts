import type { ProfessionConfig } from "@/modules/catalog/domain/types";
import type { ScoringSkill } from "@/modules/scoring/domain";
import { SCENARIO_LIKE_TYPES, type Question, type QuestionType, type RoutingInput } from "./types";

/** Slots of the normal length reserved for precision items after coverage (core = target − 3). */
export const CORE_RESERVED_SLOTS = 3;
/** Upper bound on core skills covered before the precision phase. */
export const MAX_CORE_SKILLS = 8;

/** Config with sane bounds: 1 ≤ maxQuestions, 0 ≤ minQuestions ≤ targetQuestions ≤ maxQuestions (integers). */
export function normalizeRoutingConfig(config: ProfessionConfig): ProfessionConfig {
  const maxQuestions = Math.max(1, Math.floor(config.maxQuestions));
  const minQuestions = Math.min(maxQuestions, Math.max(0, Math.floor(config.minQuestions)));
  const targetQuestions = Math.min(maxQuestions, Math.max(minQuestions, Math.floor(config.targetQuestions)));
  return { ...config, maxQuestions, minQuestions, targetQuestions };
}

export function isScenarioLike(type: QuestionType): boolean {
  return SCENARIO_LIKE_TYPES.includes(type);
}

/** Servable by the deterministic engine: no AI-scored open items, at least two options. */
export function isServable(question: Question): boolean {
  return question.type !== "open" && question.scoringRule !== "open_ai" && question.options.length >= 2;
}

/** Empty specializationIds = every specialization; otherwise the session's specialization must be listed. */
export function matchesSpecialization(question: Question, specializationId: string | null): boolean {
  if (question.specializationIds.length === 0) return true;
  return specializationId !== null && question.specializationIds.includes(specializationId);
}

/** Skills with duplicate ids removed (first occurrence wins), input order preserved. */
export function uniqueSkills(skills: readonly ScoringSkill[]): ScoringSkill[] {
  const byId = new Map<string, ScoringSkill>();
  for (const skill of skills) if (!byId.has(skill.id)) byId.set(skill.id, skill);
  return [...byId.values()];
}

/**
 * Skills routing may serve: unique skills with a positive finite importance (a specialization weight of 0 removes
 * a skill from the composite, so it gets no item). When no skill has positive importance every unique skill is
 * kept, mirroring the equal-weight fallback of `normalizeImportances`.
 */
export function routableSkills(skills: readonly ScoringSkill[]): ScoringSkill[] {
  const unique = uniqueSkills(skills);
  const weighted = unique.filter((skill) => Number.isFinite(skill.importance) && skill.importance > 0);
  return weighted.length > 0 ? weighted : unique;
}

/** Unique skills sorted by importance desc; ties keep input order. */
export function skillsByImportance(skills: readonly ScoringSkill[]): ScoringSkill[] {
  return uniqueSkills(skills)
    .map((skill, index) => ({ skill, index }))
    .sort((x, y) => y.skill.importance - x.skill.importance || x.index - y.index)
    .map(({ skill }) => skill);
}

export interface SessionPool {
  /** Servable, specialization-matching items of known skills — served or not (stable during a session). */
  readonly sessionBank: readonly Question[];
  /** Unserved items of sessionBank (no id or key served before). */
  readonly eligible: readonly Question[];
  /** eligible without recently seen keys when enough fresh items remain, else eligible. */
  readonly pool: readonly Question[];
  readonly coveredSkillIds: ReadonlySet<string>;
  readonly selfReportCount: number;
  readonly scenarioLikeCount: number;
}

interface ServedItem {
  readonly skillId: string;
  readonly type: QuestionType;
}

/** Answered items plus bank items whose id was served (pending), deduplicated by question id. */
function servedItems(input: RoutingInput): Map<string, ServedItem> {
  const served = new Map<string, ServedItem>();
  for (const item of input.answered) served.set(item.questionId, item);
  const ids = new Set(input.servedQuestionIds);
  for (const question of input.bank) {
    if (ids.has(question.id) && !served.has(question.id)) served.set(question.id, question);
  }
  return served;
}

/**
 * Builds the candidate pool for one routing step:
 * 1. sessionBank = bank items that are servable, match the specialization and belong to a routable skill
 *    (`routableSkills`: importance > 0, so zero-weight skills are never served — not even once the weighted
 *    skills run out of items; their answers would only move θ_g with no weight in the composite).
 * 2. eligible = sessionBank minus items already served (by id, or by stable key of a served version).
 * 3. pool = eligible minus recentlySeenKeys when at least (maxQuestions − n) fresh items remain; otherwise the
 *    whole eligible set (the bank does not allow excluding them).
 * Also counts what was served so far (covered skills, self_report and scenario-like items).
 */
export function buildSessionPool(input: RoutingInput, config: ProfessionConfig): SessionPool {
  const skillIds = new Set(routableSkills(input.skills).map((skill) => skill.id));
  const sessionBank = input.bank.filter(
    (question) =>
      isServable(question) && skillIds.has(question.skillId) && matchesSpecialization(question, input.specializationId),
  );
  const served = servedItems(input);
  const servedKeys = new Set(input.bank.filter((question) => served.has(question.id)).map((question) => question.key));
  const eligible = sessionBank.filter((question) => !served.has(question.id) && !servedKeys.has(question.key));

  const recent = input.recentlySeenKeys;
  const fresh = recent && recent.size > 0 ? eligible.filter((question) => !recent.has(question.key)) : eligible;
  const remaining = config.maxQuestions - input.answered.length;
  const pool = fresh.length >= remaining ? fresh : eligible;

  let selfReportCount = 0;
  let scenarioLikeCount = 0;
  const coveredSkillIds = new Set<string>();
  for (const item of served.values()) {
    coveredSkillIds.add(item.skillId);
    if (item.type === "self_report") selfReportCount += 1;
    if (isScenarioLike(item.type)) scenarioLikeCount += 1;
  }
  return { sessionBank, eligible, pool, coveredSkillIds, selfReportCount, scenarioLikeCount };
}

/**
 * Core skills, in importance order: the top min(#skills, max(1, targetQuestions − 3), 8) routable skills
 * (importance > 0, see `routableSkills`) by routing importance among skills that have at least one item in the
 * session bank. Computed on the session bank (not on the shrinking pool) so the core set stays stable while items
 * are served. A zero-weight skill is never core, so it never takes a coverage slot.
 */
export function coreSkillIds(
  skills: readonly ScoringSkill[],
  sessionBank: readonly Question[],
  config: ProfessionConfig,
): string[] {
  const withItems = new Set(sessionBank.map((question) => question.skillId));
  const ranked = skillsByImportance(routableSkills(skills));
  const count = Math.min(ranked.length, Math.max(1, config.targetQuestions - CORE_RESERVED_SLOTS), MAX_CORE_SKILLS);
  return ranked
    .filter((skill) => withItems.has(skill.id))
    .slice(0, count)
    .map((skill) => skill.id);
}

/** Hard/soft content constraints applied to candidate items of one step. */
export interface ItemConstraints {
  /** False once config.maxSelfReportItems self_report items were served. */
  readonly allowSelfReport: boolean;
  /** True when the scenario-like minimum must be met now (only judgment/scenario/decision allowed). */
  readonly scenarioOnly: boolean;
}

export function passesConstraints(question: Question, constraints: ItemConstraints): boolean {
  if (!constraints.allowSelfReport && question.type === "self_report") return false;
  if (constraints.scenarioOnly && !isScenarioLike(question.type)) return false;
  return true;
}

/** Pool items of one skill that satisfy the constraints. */
export function candidatesForSkill(
  pool: readonly Question[],
  skillId: string,
  constraints: ItemConstraints,
): Question[] {
  return pool.filter((question) => question.skillId === skillId && passesConstraints(question, constraints));
}
