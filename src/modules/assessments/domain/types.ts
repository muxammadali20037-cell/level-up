import type { I18nText } from "@/lib/i18n/text";
import type { ExperienceBand, GoalType, WorkingStatus } from "@/modules/catalog/domain/types";

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

/** Client-safe projection: no option scores, no explanation, no IRT parameters. */
export interface PublicQuestion {
  readonly id: string;
  readonly type: QuestionType;
  readonly prompt: string;
  readonly scenario: string | null;
  readonly media: QuestionMedia | null;
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
