import type { I18nText } from "@/lib/i18n/text";
import type { RequirementType } from "@/modules/catalog/domain/types";
import type { ConfidenceAssessment, ConfidenceLevel } from "@/modules/scoring/domain/types";

/**
 * The full report is generated deterministically on the server at completion time and stored as JSON
 * (assessment_results.report). Names of skills/levels are resolved from the catalog at render time by id;
 * recommendation texts are snapshotted (I18nText for every locale) so the report stays auditable.
 */
export const REPORT_SCHEMA_VERSION = 1;

export type SkillBand = "strong" | "ok" | "weak";

export interface ReportSkill {
  readonly skillId: string;
  readonly score: number;
  readonly band: SkillBand;
  readonly measured: boolean;
  readonly nItems: number;
}

export type BottleneckReason = "limits_strong_skills" | "prerequisite_of_weak" | "largest_gap";

export interface Bottleneck {
  readonly skillId: string;
  readonly leverage: number;
  readonly reason: BottleneckReason;
  /** Strong skills whose value is capped by the bottleneck (relation "limits"). */
  readonly limitedSkillIds: readonly string[];
  /** Weak skills that need the bottleneck first (relation "prerequisite"). */
  readonly unlocksSkillIds: readonly string[];
  readonly explanation: I18nText;
}

/** Every important recommendation carries WHY / SOURCE / EVIDENCE / LIMITATION / CONFIDENCE. */
export interface WhyThis {
  readonly reason: I18nText;
  readonly sourceIds: readonly string[];
  readonly evidence: I18nText | null;
  readonly limitation: I18nText | null;
  readonly confidence: ConfidenceLevel;
}

export type RoadmapPhase = "foundation" | "practice" | "application" | "verification";

export interface Recommendation {
  /** Action library id (or a synthetic id for generated items). */
  readonly actionId: string;
  readonly skillId: string | null;
  readonly title: I18nText;
  readonly description: I18nText;
  readonly durationMinutes: number;
  readonly phase: RoadmapPhase;
  readonly successCriteria: I18nText | null;
  readonly resourceIds: readonly string[];
  readonly why: WhyThis;
}

export interface DoNotItem {
  readonly ruleId: string;
  readonly skillId: string | null;
  readonly message: I18nText;
  readonly reason: I18nText;
}

export interface PlanDay {
  /** 1..7 */
  readonly day: number;
  readonly main: Recommendation;
}

export interface RoadmapWeek {
  /** 1..4 */
  readonly week: number;
  readonly phase: RoadmapPhase;
  readonly theme: I18nText;
  readonly items: readonly Recommendation[];
}

export interface NextLevelRequirementStatus {
  readonly type: RequirementType;
  readonly skillId: string | null;
  readonly threshold: number | null;
  readonly current: number | null;
  readonly met: boolean;
  readonly gatesAssessed: boolean;
  readonly description: I18nText;
}

/** A cap that keeps level L+1 out of the ASSESSED level no matter how the scores improve (brief §7). */
export type NextLevelBlocker = "experience" | "verification";

export interface NextLevel {
  readonly number: number;
  readonly compositeGap: number;
  readonly requirements: readonly NextLevelRequirementStatus[];
  /**
   * Caps blocking L+1 (in this order): "experience" — above the experience-band cap; "verification" — a
   * requires_verification level without a verified scenario. Empty when none. Optional only for backward
   * compatibility; `buildNextLevel` always sets it.
   */
  readonly blockedBy?: readonly NextLevelBlocker[];
}

export interface Percentile {
  readonly value: number;
  readonly sampleSize: number;
  readonly windowDays: number;
}

export interface ResultReport {
  readonly schemaVersion: typeof REPORT_SCHEMA_VERSION;
  readonly professionId: string;
  readonly specializationId: string | null;
  readonly level: number;
  readonly uncappedLevel: number;
  readonly cappedBy: "verification" | "experience" | null;
  readonly levelRange: readonly [number, number] | null;
  readonly composite: number;
  readonly compositeSe: number;
  readonly confidence: ConfidenceAssessment;
  readonly skills: readonly ReportSkill[];
  /** Up to 3 skill ids, strongest first. */
  readonly strongest: readonly string[];
  /** Up to 3 skill ids, weakest first. */
  readonly weakest: readonly string[];
  readonly bottleneck: Bottleneck | null;
  readonly nextLevel: NextLevel | null;
  /** Exactly 3 when the action library allows. */
  readonly actionsNow: readonly Recommendation[];
  readonly doNot: readonly DoNotItem[];
  readonly plan7: readonly PlanDay[];
  readonly roadmap30: readonly RoadmapWeek[];
  /** Only from real benchmarks with sufficient sample size; otherwise null. */
  readonly percentile: Percentile | null;
  readonly disclaimers: readonly I18nText[];
}

/** Free teaser: strongest skill + main problem; level/skills/roadmap locked. */
export interface ResultTeaser {
  readonly professionId: string;
  readonly strongestSkillId: string | null;
  readonly mainProblemSkillId: string | null;
  readonly confidence: ConfidenceLevel;
}
