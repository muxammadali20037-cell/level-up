import type { I18nText } from "@/lib/i18n/text";
import type { GoalType } from "@/modules/catalog/domain/types";
import type { RoadmapPhase } from "@/modules/results/domain/types";

export type ActionKind = "learn" | "practice" | "apply" | "verify" | "reflect";
export type Budget = "free" | "low" | "medium" | "high";
export const BUDGET_ORDER: readonly Budget[] = ["free", "low", "medium", "high"];

/** Action library entry (content/professions/<slug>/actions.ts → actions table). */
export interface Action {
  readonly id: string;
  readonly slug: string;
  readonly skillId: string;
  readonly title: I18nText;
  readonly description: I18nText;
  readonly kind: ActionKind;
  readonly phase: RoadmapPhase;
  /** 5–120 minutes. Daily main actions should be 5–30. */
  readonly durationMinutes: number;
  readonly minLevel: number;
  readonly maxLevel: number;
  readonly budget: Budget;
  readonly successCriteria: I18nText;
  readonly why: I18nText;
  readonly resourceIds: readonly string[];
  readonly sourceIds: readonly string[];
}

export interface DoNotCondition {
  readonly maxLevel?: number;
  readonly minLevel?: number;
  /** Applies when ANY listed skill is weak. */
  readonly weakSkillIds?: readonly string[];
  readonly goalTypes?: readonly GoalType[];
}

export interface DoNotRule {
  readonly id: string;
  readonly slug: string;
  readonly skillId: string | null;
  readonly condition: DoNotCondition;
  readonly message: I18nText;
  readonly reason: I18nText;
}

export type PaceMinutes = 15 | 30 | 60 | 120;
export const PACE_OPTIONS: readonly PaceMinutes[] = [15, 30, 60, 120];

/** User constraints the roadmap adapts to. */
export interface PlanPreferences {
  readonly timePerDayMinutes: PaceMinutes;
  readonly budget: Budget;
  readonly goal: GoalType;
}

export const DEFAULT_PLAN_PREFERENCES: PlanPreferences = {
  timePerDayMinutes: 30,
  budget: "free",
  goal: "professional",
};
