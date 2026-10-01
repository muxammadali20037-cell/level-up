import type { I18nText } from "@/lib/i18n/text";

/**
 * Catalog domain contracts: categories → professions → specializations, profession-scoped skills,
 * the skill dependency graph and per-profession level schemes.
 *
 * Pure engines (scoring, results, roadmaps) are key-agnostic: `id` fields are opaque strings. In the database
 * they are uuids; in content files and unit tests they are slugs.
 */

export type SkillKind = "hard" | "soft" | "meta";

export interface Skill {
  readonly id: string;
  readonly slug: string;
  /** Cross-profession mapping key, e.g. "communication" shared by sales and manager. */
  readonly globalSkillKey: string | null;
  readonly name: I18nText;
  readonly description: I18nText;
  readonly kind: SkillKind;
  /** Relative weight in the composite score. Weights of a profession sum to ~1. */
  readonly importance: number;
  readonly sortOrder: number;
}

/**
 * Directed edge `from → to`:
 * - prerequisite: `from` should be learned before `to`.
 * - limits:       a weak `from` caps the value of a strong `to` (e.g. operations limits sales).
 * - enables:      `from` amplifies `to` (soft positive link, informational).
 *
 * DB mapping (skill_prerequisites): skill_id = to, depends_on_skill_id = from.
 */
export type SkillRelation = "prerequisite" | "limits" | "enables";

export interface SkillEdge {
  readonly from: string;
  readonly to: string;
  readonly relation: SkillRelation;
  /** 0..1 */
  readonly strength: number;
  readonly rationale?: I18nText;
}

export type RequirementType =
  | "composite_min"
  | "skill_min"
  | "verified_scenario"
  | "practical_action"
  | "experience_min";

export interface LevelRequirement {
  readonly type: RequirementType;
  /** Required for skill_min. */
  readonly skillId?: string | null;
  /** Score threshold (0..100) for composite_min/skill_min; count for verified_scenario/practical_action. */
  readonly threshold: number | null;
  /** When true the requirement gates the ASSESSED level; otherwise it only gates the VERIFIED level. */
  readonly gatesAssessed: boolean;
  readonly description: I18nText;
}

export interface LevelDefinition {
  /** 1..9 */
  readonly number: number;
  readonly slug: string;
  readonly name: I18nText;
  readonly shortDescription: I18nText;
  readonly meaning: I18nText;
  /** Composite score (0..100) at which this level starts. */
  readonly minComposite: number;
  /** Levels that cannot be granted by self-assessment alone (default: 8 Leader, 9 Master). */
  readonly requiresVerification: boolean;
  readonly requirements: readonly LevelRequirement[];
}

export type ExperienceBand = "none" | "lt1" | "1to3" | "3to5" | "5plus";
export const EXPERIENCE_BANDS: readonly ExperienceBand[] = ["none", "lt1", "1to3", "3to5", "5plus"];

export type WorkingStatus = "yes" | "no" | "learning";

export type GoalType =
  | "start"
  | "find_job"
  | "professional"
  | "increase_income"
  | "lead"
  | "expert"
  | "first_job"
  | "manager"
  | "build_business"
  | "scale_business"
  | "change_career";

export interface ProfessionConfig {
  readonly minQuestions: number;
  readonly maxQuestions: number;
  readonly targetQuestions: number;
  /** Stop when SE of general ability ≤ targetSe (after minQuestions and coverage). */
  readonly targetSe: number;
  readonly retestCooldownDays: number;
  /** Max assessed level per self-reported experience band (missing band = no cap). */
  readonly experienceCaps: Partial<Record<ExperienceBand, number>>;
  readonly maxSelfReportItems: number;
  readonly minScenarioLikeItems: number;
}

export const DEFAULT_PROFESSION_CONFIG: ProfessionConfig = {
  minQuestions: 7,
  maxQuestions: 15,
  targetQuestions: 12,
  targetSe: 0.45,
  retestCooldownDays: 14,
  experienceCaps: { none: 4, lt1: 5 },
  maxSelfReportItems: 2,
  minScenarioLikeItems: 2,
};

export interface Specialization {
  readonly id: string;
  readonly slug: string;
  readonly name: I18nText;
  readonly description: I18nText;
  /** skillId → multiplier applied to skill importance (missing = 1). */
  readonly skillWeights: Readonly<Record<string, number>>;
}

/** Everything the engines need about one profession, loaded once per request. */
export interface SkillModel {
  readonly professionId: string;
  readonly professionSlug: string;
  readonly skills: readonly Skill[];
  readonly edges: readonly SkillEdge[];
  readonly levels: readonly LevelDefinition[];
  readonly config: ProfessionConfig;
}
