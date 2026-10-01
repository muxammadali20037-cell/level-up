import type { I18nText } from "@/lib/i18n/text";
import type { SkillModel } from "@/modules/catalog/domain/types";
import type { ConfidenceLevel } from "@/modules/scoring/domain/types";
import { compareStrings } from "./compare";
import { dailyCapMinutes, filterEligibleActions, type SelectionContext } from "./selection";
import { prerequisiteOrder } from "./topo";
import type { Action, PlanPreferences } from "./types";
import type { WhyContext } from "./why";

export interface RecommendationInput {
  readonly skillModel: SkillModel;
  /** Assessed level (1..9). */
  readonly level: number;
  /**
   * Priority-ordered focus skills: bottleneck first, then prerequisite order, then gap (see `orderFocusSkills`).
   * When the user has no weak skills, callers may pass their lowest non-weak skills instead (with
   * `bottleneckSkillId: null`).
   */
  readonly weakSkillIds: readonly string[];
  readonly actions: readonly Action[];
  readonly preferences: PlanPreferences;
  /** Overall report confidence. */
  readonly confidence: ConfidenceLevel;
  /** Defaults to `weakSkillIds[0] ?? null`. Pass null when the focus skills are not weak. */
  readonly bottleneckSkillId?: string | null;
  /** Skill scores (0..100) used to order non-focus skills (lowest first). Missing → after scored skills. */
  readonly skillScores?: Readonly<Record<string, number>>;
}

export interface PlanContext extends SelectionContext {
  /** Focus skills re-ordered so that prerequisite skills come first (used by foundation slots). */
  readonly foundationOrder: readonly string[];
  readonly bottleneckSkillId: string | null;
  readonly skillNames: ReadonlyMap<string, I18nText>;
  readonly why: WhyContext;
}

/**
 * Normalizes a RecommendationInput into a PlanContext: focus skills restricted to the model (bottleneck
 * prepended if missing), the other model skills ordered by score asc → sortOrder → id, the eligible action pool
 * (level/budget/model filter) and the daily duration cap min(30, timePerDay).
 */
export function createPlanContext(input: RecommendationInput): PlanContext {
  const model = input.skillModel;
  const modelIds = new Set(model.skills.map((s) => s.id));
  let focus = [...new Set(input.weakSkillIds)].filter((id) => modelIds.has(id));
  const requested = input.bottleneckSkillId === undefined ? (focus[0] ?? null) : input.bottleneckSkillId;
  const bottleneckSkillId = requested !== null && modelIds.has(requested) ? requested : null;
  if (bottleneckSkillId && focus[0] !== bottleneckSkillId) {
    focus = [bottleneckSkillId, ...focus.filter((id) => id !== bottleneckSkillId)];
  }
  const focusSet = new Set(focus);
  const scores = input.skillScores ?? {};
  const others = [...model.skills]
    .filter((s) => !focusSet.has(s.id))
    .sort(
      (a, b) =>
        (scores[a.id] ?? Number.POSITIVE_INFINITY) - (scores[b.id] ?? Number.POSITIVE_INFINITY) ||
        a.sortOrder - b.sortOrder ||
        compareStrings(a.id, b.id),
    )
    .map((s) => s.id);
  const skillNames = new Map(model.skills.map((s) => [s.id, s.name] as const));
  return {
    pool: filterEligibleActions(input.actions, {
      level: input.level,
      budget: input.preferences.budget,
      skillIds: modelIds,
    }),
    primarySkillId: bottleneckSkillId ?? focus[0] ?? null,
    focus,
    others,
    foundationOrder: prerequisiteOrder(focus, model.edges),
    dailyCap: dailyCapMinutes(input.preferences.timePerDayMinutes),
    bottleneckSkillId,
    skillNames,
    why: { bottleneckSkillId, skillNames, confidence: input.confidence },
  };
}
