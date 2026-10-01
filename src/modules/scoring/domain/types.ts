import type { AnsweredItem } from "@/modules/assessments/domain/types";
import type {
  ExperienceBand,
  LevelDefinition,
  ProfessionConfig,
  RequirementType,
} from "@/modules/catalog/domain/types";

/**
 * Bump on ANY change that could alter a score for the same answers. Results store the version they were scored
 * with; historical results are never silently re-scored.
 */
export const SCORING_MODEL_VERSION = "irt3pl-eap-hier-v1";

export interface ScoringSkill {
  readonly id: string;
  /**
   * Importance after specialization multipliers and normalization. For scoring this is the composite importance
   * (skills.importance × specialization weight, `compositeImportance`), never goal-boosted; routing may pass
   * goal-boosted weights (`routingImportance`) for its own ordering only.
   */
  readonly importance: number;
}

export interface ScoringInput {
  readonly items: readonly AnsweredItem[];
  /** Composite importance (`compositeImportance`): never goal-boosted, so the level depends only on answers. */
  readonly skills: readonly ScoringSkill[];
  /** Prior mean of general ability (from experience band). */
  readonly priorMean: number;
  /** Prior SD of general ability. Default 1.0. */
  readonly priorSd?: number;
  /** SD of skill ability around general ability. Default 0.8. */
  readonly tau?: number;
}

export interface SkillEstimate {
  readonly skillId: string;
  readonly theta: number;
  /** Posterior SD of theta. */
  readonly se: number;
  /** 0..100 */
  readonly score: number;
  readonly nItems: number;
  /** False when no item for this skill was answered (score falls back to general ability). */
  readonly measured: boolean;
}

export interface AbilityEstimate {
  readonly thetaG: number;
  readonly seG: number;
  readonly skills: readonly SkillEstimate[];
  /** Importance-weighted mean of skill scores, 0..100 (one decimal). */
  readonly composite: number;
  /** Composite uncertainty expressed in score points. */
  readonly compositeSe: number;
}

export type ConfidenceLevel = "high" | "medium" | "low";

export type ConfidenceReason =
  | "few_items"
  | "high_uncertainty"
  | "speeding"
  | "self_report_gap"
  | "near_boundary"
  | "unmeasured_skills";

export interface ConfidenceAssessment {
  readonly level: ConfidenceLevel;
  readonly reasons: readonly ConfidenceReason[];
}

export interface MissingRequirement {
  readonly type: RequirementType;
  readonly skillId: string | null;
  readonly threshold: number | null;
  /** Current value (score or count); null when unknown (e.g. no verification data). */
  readonly current: number | null;
  readonly gatesAssessed: boolean;
}

export interface LevelEvaluation {
  readonly number: number;
  /** All gates_assessed requirements met (and composite threshold). */
  readonly met: boolean;
  readonly missing: readonly MissingRequirement[];
}

export interface LevelAssignment {
  /** Final assessed level after caps. Never a requiresVerification level (except a floor level marked so). */
  readonly level: number;
  /** Level before verification/experience caps. */
  readonly uncappedLevel: number;
  readonly cappedBy: "verification" | "experience" | null;
  /** When the composite is within one SE of a boundary: e.g. [4, 5]. */
  readonly range: readonly [number, number] | null;
  readonly evaluations: readonly LevelEvaluation[];
}

export interface LevelAssignmentInput {
  readonly composite: number;
  readonly compositeSe: number;
  readonly skillScores: Readonly<Record<string, number>>;
  readonly experience: ExperienceBand;
  /**
   * Verified counts (verified scenarios / practical actions) — 0 for a fresh assessment. They are compared with
   * explicit verified_scenario / practical_action requirements only; they never lift the cap on
   * requiresVerification levels (those are never ASSESSED, AC-F07-02; the VERIFIED level is computed separately).
   */
  readonly verifiedScenarios: number;
  readonly practicalActions: number;
  /**
   * Optional per-skill uncertainty in score points (100/7 × posterior SD of θ_s). Used as the margin of a skill
   * gate when deciding whether to report a level range. Missing entries fall back to `compositeSe`.
   */
  readonly skillScoreSes?: Readonly<Record<string, number>>;
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Additions used by the pure scoring engine (irt.ts, eap.ts, estimate.ts, levels.ts, confidence.ts, pipeline.ts) */
/* ------------------------------------------------------------------------------------------------------------ */

/**
 * IRT parameters of one item. Structurally satisfied by both `Question` and `AnsweredItem`, so the same
 * functions serve scoring and adaptive item selection.
 */
export interface IrtItemParams {
  /** b */
  readonly difficulty: number;
  /** a */
  readonly discrimination: number;
  /** c (fixed lower asymptote) */
  readonly guessing: number;
}

/** An item with an observed (possibly fractional) credit and a likelihood weight. */
export interface ScoredResponse extends IrtItemParams {
  /** 0..1 */
  readonly credit: number;
  /** ≥ 0; self_report items use 0.5. */
  readonly weight: number;
}

export interface NormalPrior {
  readonly mean: number;
  /** > 0 */
  readonly sd: number;
}

/** Posterior mean (EAP) and posterior SD of θ. */
export interface EapResult {
  readonly theta: number;
  readonly se: number;
}

export interface ConfidenceInput {
  readonly nItems: number;
  readonly seG: number;
  /** Share (0..1) of timed items answered faster than the speeding threshold. */
  readonly speedingRatio: number;
  /**
   * |mean self-report credit − mean credit the tested items predict for those self-report items| (model-based,
   * see `computeSelfReportGap`); null when there is no self-report or no tested item.
   */
  readonly selfReportGap: number | null;
  /** True when a level range is reported (composite within one SE of a boundary). */
  readonly nearBoundary: boolean;
  /** Number of important skills that received no item. */
  readonly unmeasuredImportantSkills: number;
}

/** Input of the one-call scoring pipeline (`scoreAssessment`). */
export interface AssessmentScoringInput extends Omit<ScoringInput, "priorMean"> {
  /** Defaults to EXPERIENCE_PRIOR_MEAN[experience]. */
  readonly priorMean?: number;
  readonly experience: ExperienceBand;
  readonly levels: readonly LevelDefinition[];
  readonly config: ProfessionConfig;
  /** Default 0 (fresh assessment). */
  readonly verifiedScenarios?: number;
  /** Default 0 (fresh assessment). */
  readonly practicalActions?: number;
  /** Default 2500 ms. */
  readonly speedingThresholdMs?: number;
}

export interface AssessmentScoring {
  readonly scoringModelVersion: typeof SCORING_MODEL_VERSION;
  readonly ability: AbilityEstimate;
  readonly assignment: LevelAssignment;
  readonly confidence: ConfidenceAssessment;
  readonly speedingRatio: number;
  readonly selfReportGap: number | null;
}
