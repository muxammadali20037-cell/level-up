import type { I18nText } from "@/lib/i18n/text";
import type { ExperienceBand, GoalType, ProfessionConfig, WorkingStatus } from "@/modules/catalog/domain/types";
import type { ScoringSkill } from "@/modules/scoring/domain/types";

/** Question formats. Assessments must mix them; never only "rate yourself 1–10". */
export type QuestionType = "knowledge" | "judgment" | "scenario" | "decision" | "self_report" | "open";

/** Types that count towards the "scenario-like" minimum (applied, real-life items). */
export const SCENARIO_LIKE_TYPES: readonly QuestionType[] = ["judgment", "scenario", "decision"];

export type ScoringRule = "single_best" | "partial_credit" | "likert" | "open_ai";

export type QuestionMedia =
  | { readonly kind: "code"; readonly language: string; readonly code: string }
  | { readonly kind: "table"; readonly headers: readonly I18nText[]; readonly rows: readonly (readonly string[])[] }
  | { readonly kind: "image"; readonly src: string; readonly alt: I18nText };

export interface QuestionOption {
  readonly key: string;
  readonly label: I18nText;
  /** Credit 0..1 (1 = best answer, 0.5 = acceptable, 0 = poor). Never sent to clients. */
  readonly score: number;
}

export interface Question {
  /** Row id of this exact version. */
  readonly id: string;
  /** Stable key across versions. */
  readonly key: string;
  readonly version: number;
  readonly skillId: string;
  /** Empty = applies to every specialization. */
  readonly specializationIds: readonly string[];
  readonly type: QuestionType;
  /** Intended level 1..9; difficulty b = (targetLevel − 5) × 0.7. */
  readonly targetLevel: number;
  /** IRT b. */
  readonly difficulty: number;
  /** IRT a (0.4–2.0). */
  readonly discrimination: number;
  /** IRT c (fixed lower asymptote). */
  readonly guessing: number;
  /** Likelihood weight (self_report 0.5, others 1). */
  readonly weight: number;
  readonly scoringRule: ScoringRule;
  readonly prompt: I18nText;
  readonly scenario: I18nText | null;
  readonly media: QuestionMedia | null;
  readonly options: readonly QuestionOption[];
  readonly explanation: I18nText | null;
}

/** Client-safe projection: no option scores, no authored option keys, no explanation, no IRT parameters. */
export interface PublicQuestion {
  readonly id: string;
  readonly type: QuestionType;
  readonly prompt: string;
  readonly scenario: string | null;
  readonly media: QuestionMedia | null;
  /**
   * Options in displayed order. `key` is an opaque per-session display key ("o1".."oN" by displayed position),
   * never the authored option key; the server maps it back with `authoredOptionKeys` (option-order.ts).
   */
  readonly options: readonly { readonly key: string; readonly label: string }[];
}

export interface ContextAnswers {
  readonly experience: ExperienceBand;
  readonly working: WorkingStatus;
  readonly goal: GoalType;
  /** Profession-specific extra context answers keyed by context question key. */
  readonly extra?: Readonly<Record<string, string>>;
}

/** Prior mean of general ability by self-reported experience (weak prior, SD 1.0). */
export const EXPERIENCE_PRIOR_MEAN: Readonly<Record<ExperienceBand, number>> = {
  none: -1.0,
  lt1: -0.6,
  "1to3": 0.0,
  "3to5": 0.4,
  "5plus": 0.8,
};

export const difficultyFromTargetLevel = (targetLevel: number): number => (targetLevel - 5) * 0.7;

/** A served-and-answered item, as consumed by scoring. */
export interface AnsweredItem {
  readonly questionId: string;
  readonly skillId: string;
  readonly type: QuestionType;
  readonly difficulty: number;
  readonly discrimination: number;
  readonly guessing: number;
  readonly weight: number;
  /** 0..1 */
  readonly credit: number;
  readonly responseMs: number | null;
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Additions used by the pure adaptive routing engine (routing.ts).                                              */
/* ------------------------------------------------------------------------------------------------------------ */

/** Everything `selectNextQuestion` needs. Pure data: the caller loads it from the session and the item bank. */
export interface RoutingInput {
  /** Current item bank of the profession (current versions only). */
  readonly bank: readonly Question[];
  /** Answered items of this session, in answer order. `answered.length` is the number of answered items n. */
  readonly answered: readonly AnsweredItem[];
  /** Every question id already served in this session (answered or pending). Never served again. */
  readonly servedQuestionIds: readonly string[];
  /**
   * Skills with ROUTING importance (specialization weight × goal boost), from `routingImportance`. Routing only:
   * scoring must receive `compositeImportance` (no goal boost). Skills with importance ≤ 0 (e.g. specialization
   * weight 0) are never served while any skill has positive importance.
   */
  readonly skills: readonly ScoringSkill[];
  readonly specializationId: string | null;
  /** Prior mean of general ability (EXPERIENCE_PRIOR_MEAN[experience]). */
  readonly priorMean: number;
  readonly config: ProfessionConfig;
  /** Session seed (assessment_sessions.rng_seed). The step seed is deriveSeed(rngSeed, n). */
  readonly rngSeed: number;
  /** Question keys this user answered within the retest window; avoided while the bank allows. */
  readonly recentlySeenKeys?: ReadonlySet<string>;
}

export type RoutingPhase = "coverage" | "precision";

/**
 * Why the test stops:
 * - max_items:         n reached config.maxQuestions.
 * - precision_reached: coverage done and either SE_g ≤ targetSe (after minQuestions) or the normal length
 *                      (targetQuestions) is reached with SE_g ≤ targetSe + EXTENSION_SE_MARGIN.
 * - bank_exhausted:    no eligible item is left (or only self_report items beyond the cap).
 */
export type RoutingStopReason = "max_items" | "precision_reached" | "bank_exhausted";

export type RoutingDecision =
  | {
      readonly kind: "question";
      readonly question: Question;
      readonly phase: RoutingPhase;
      /** Progress denominator to show ("n / plannedTotal"). Never below n + 1, never above maxQuestions. */
      readonly plannedTotal: number;
      /** General ability estimate the decision was based on (for ability_state caching / logging). */
      readonly thetaG: number;
      readonly seG: number;
    }
  | {
      readonly kind: "stop";
      readonly reason: RoutingStopReason;
      /** Final length (= n): the progress bar fills to 100% on the computing screen. */
      readonly plannedTotal: number;
      readonly thetaG: number;
      readonly seG: number;
    };
