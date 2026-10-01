import type { I18nText } from "@/lib/i18n/text";
import type { PlanDay, Recommendation, RoadmapPhase, RoadmapWeek } from "@/modules/results/domain/types";
import { createPlanContext, type PlanContext, type RecommendationInput } from "./context";
import { FOUNDATION_THEME_WITH_SKILL, WEEK_THEMES } from "./copy";
import { interpolateI18n } from "./i18n-format";
import {
  type ActionTier,
  eitherTier,
  kindTier,
  MAX_DAILY_MAIN_MINUTES,
  phaseTier,
  pickAction,
  selectActionsNow,
} from "./selection";
import { PACE_OPTIONS, type PaceMinutes } from "./types";
import { toRecommendation } from "./why";

/** Roadmap items per week by daily pace (minutes/day). */
export const ITEMS_PER_WEEK: Readonly<Record<PaceMinutes, number>> = { 15: 3, 30: 4, 60: 5, 120: 6 };

/** Items per week for a pace; non-standard paces use the largest standard pace ≤ it (min 15). */
export function itemsPerWeek(timePerDayMinutes: number): number {
  const pace = [...PACE_OPTIONS].reverse().find((p) => p <= timePerDayMinutes) ?? 15;
  return ITEMS_PER_WEEK[pace];
}

/** Preferred max duration of one roadmap item: the weekly time budget (7 × pace) split over the week's items. */
export function weeklyItemCapMinutes(timePerDayMinutes: number): number {
  return Math.floor((7 * timePerDayMinutes) / itemsPerWeek(timePerDayMinutes));
}

const FOUNDATION_DAY: readonly ActionTier[] = [phaseTier("foundation"), phaseTier("practice")];
const PRACTICE_DAY: readonly ActionTier[] = [phaseTier("practice"), phaseTier("application"), phaseTier("foundation")];
const WRAP_UP_DAY: readonly ActionTier[] = [
  eitherTier(phaseTier("application", "verification"), kindTier("apply", "verify", "reflect")),
  phaseTier("practice"),
];

function markUsed(used: Map<string, number>, id: string): void {
  used.set(id, (used.get(id) ?? 0) + 1);
}

/**
 * 7-day plan, one main action per day:
 * - days 1–3 foundation, skills in prerequisite order (bottleneck's weak prerequisites first, then bottleneck,
 *   then other focus skills);
 * - days 4–6 practice (bottleneck first);
 * - day 7 apply or verify/reflect.
 * Time per day is a hard preference: every day is ≤ min(30, time/day) whenever ANY eligible action fits — fitting
 * actions are repeated (least-used first) rather than taking a longer unused one; when none fits, ≤ 30 min (the
 * brief's daily ceiling) when possible, else the least-used/shortest. Among fitting actions, focus skills come
 * before other skills (lowest score first) and unused before used (see `pickAction`).
 * Returns [] when no eligible action exists (nothing is invented); otherwise exactly 7 days.
 */
export function buildPlan7(ctx: PlanContext): PlanDay[] {
  const used = new Map<string, number>();
  const days: PlanDay[] = [];
  for (let day = 1; day <= 7; day += 1) {
    const tiers = day <= 3 ? FOUNDATION_DAY : day <= 6 ? PRACTICE_DAY : WRAP_UP_DAY;
    const focus = day <= 3 ? ctx.foundationOrder : ctx.focus;
    const action = pickAction(
      ctx.pool,
      { tiers, skillGroups: [focus, ctx.others], maxMinutes: ctx.dailyCap, fallbackMaxMinutes: MAX_DAILY_MAIN_MINUTES },
      used,
    );
    if (!action) break;
    markUsed(used, action.id);
    days.push({ day, main: toRecommendation(action, ctx.why) });
  }
  return days;
}

interface WeekSpec {
  readonly week: number;
  readonly phase: RoadmapPhase;
  readonly tiers: readonly ActionTier[];
}

const WEEKS: readonly WeekSpec[] = [
  { week: 1, phase: "foundation", tiers: [phaseTier("foundation"), phaseTier("practice")] },
  { week: 2, phase: "practice", tiers: [phaseTier("practice"), phaseTier("foundation"), phaseTier("application")] },
  { week: 3, phase: "application", tiers: [eitherTier(phaseTier("application"), kindTier("apply")), phaseTier("practice")] },
  {
    week: 4,
    phase: "verification",
    tiers: [eitherTier(phaseTier("verification"), kindTier("verify", "reflect")), phaseTier("application")],
  },
];

function weekTheme(phase: RoadmapPhase, ctx: PlanContext): I18nText {
  const name = ctx.bottleneckSkillId ? ctx.skillNames.get(ctx.bottleneckSkillId) : undefined;
  if (phase === "foundation" && name) return interpolateI18n(FOUNDATION_THEME_WITH_SKILL, { skill: name });
  return WEEK_THEMES[phase];
}

/**
 * 30-day roadmap: W1 foundation gap, W2 practice, W3 real application, W4 verification.
 * Up to `itemsPerWeek(pace)` items per week (15→3, 30→4, 60→5, 120→6) within the weekly budget B = 7·pace:
 * - each item preferably ≤ B / items ({@link weeklyItemCapMinutes}); fitting actions are reused across weeks
 *   before a longer unused one is taken;
 * - when nothing fits that cap, an action ≤ the remaining budget; when none fits either, the week stops early
 *   (it always keeps ≥ 1 item, the least-used/shortest), so a week totals ≤ B whenever any action ≤ B exists.
 * Within a week the phase match wins over skill priority (focus skills, then other skills lowest score first);
 * W1 uses prerequisite order. No duplicates inside a week. Returns [] when no eligible action exists.
 */
export function buildRoadmap30(ctx: PlanContext, timePerDayMinutes: number): RoadmapWeek[] {
  if (ctx.pool.length === 0) return [];
  const perWeek = itemsPerWeek(timePerDayMinutes);
  const maxMinutes = weeklyItemCapMinutes(timePerDayMinutes);
  const weeklyBudget = 7 * timePerDayMinutes;
  const used = new Map<string, number>();
  return WEEKS.map((spec) => {
    const inWeek = new Set<string>();
    const items: Recommendation[] = [];
    const order = spec.week === 1 ? ctx.foundationOrder : ctx.focus;
    const skillGroups = [[...order, ...ctx.others]];
    let remaining = weeklyBudget;
    while (items.length < perWeek) {
      const slot = { tiers: spec.tiers, skillGroups, maxMinutes, fallbackMaxMinutes: remaining, exclude: inWeek };
      const action = pickAction(ctx.pool, slot, used);
      if (!action || (items.length > 0 && action.durationMinutes > remaining)) break;
      inWeek.add(action.id);
      markUsed(used, action.id);
      remaining -= action.durationMinutes;
      items.push(toRecommendation(action, ctx.why));
    }
    return { week: spec.week, phase: spec.phase, theme: weekTheme(spec.phase, ctx), items };
  });
}

export interface RecommendationSet {
  /** Up to 3 (exactly 3 when the library allows). */
  readonly actionsNow: readonly Recommendation[];
  /** Exactly 7 days, or [] when no eligible action exists. */
  readonly plan7: readonly PlanDay[];
  /** Exactly 4 weeks (each with ≥ 1 item), or [] when no eligible action exists. */
  readonly roadmap30: readonly RoadmapWeek[];
}

/**
 * Builds actions-now, the 7-day plan and the 30-day roadmap from the action library only (never invents
 * content). Eligibility: minLevel ≤ level + 1, maxLevel ≥ level, budget ≤ preference. See the individual
 * builders for slot rules. Deterministic: same input → same output.
 */
export function buildRecommendations(input: RecommendationInput): RecommendationSet {
  const ctx = createPlanContext(input);
  return {
    actionsNow: selectActionsNow(ctx).map((action) => toRecommendation(action, ctx.why)),
    plan7: buildPlan7(ctx),
    roadmap30: buildRoadmap30(ctx, input.preferences.timePerDayMinutes),
  };
}
