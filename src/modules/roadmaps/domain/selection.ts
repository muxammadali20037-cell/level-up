import type { RoadmapPhase } from "@/modules/results/domain/types";
import { compareStrings } from "./compare";
import { BUDGET_ORDER, type Action, type ActionKind, type Budget } from "./types";

/** Upper bound for a daily main action (brief §8: one main 5–30 min action per day). */
export const MAX_DAILY_MAIN_MINUTES = 30;

/** Preferred max duration of a daily main action: min(30, time per day). */
export function dailyCapMinutes(timePerDayMinutes: number): number {
  return Math.min(MAX_DAILY_MAIN_MINUTES, timePerDayMinutes);
}

/** True when `budget` is not more expensive than `maxBudget` (BUDGET_ORDER: free < low < medium < high). */
export function isWithinBudget(budget: Budget, maxBudget: Budget): boolean {
  return BUDGET_ORDER.indexOf(budget) <= BUDGET_ORDER.indexOf(maxBudget);
}

export interface EligibilityFilter {
  readonly level: number;
  readonly budget: Budget;
  /** When given, actions for other skills are dropped (e.g. skills outside the profession's model). */
  readonly skillIds?: ReadonlySet<string>;
}

/** Deterministic base order of actions: slug, then id. */
export function compareActions(a: Action, b: Action): number {
  return compareStrings(a.slug, b.slug) || compareStrings(a.id, b.id);
}

/**
 * Library actions usable at `level`: minLevel ≤ level + 1 (one level of stretch), maxLevel ≥ level, and
 * budget ≤ the user's budget. Duplicate ids are dropped; the result is sorted by slug then id.
 */
export function filterEligibleActions(actions: readonly Action[], filter: EligibilityFilter): Action[] {
  const seen = new Set<string>();
  const out: Action[] = [];
  for (const action of [...actions].sort(compareActions)) {
    if (seen.has(action.id)) continue;
    if (action.minLevel > filter.level + 1 || action.maxLevel < filter.level) continue;
    if (!isWithinBudget(action.budget, filter.budget)) continue;
    if (filter.skillIds && !filter.skillIds.has(action.skillId)) continue;
    seen.add(action.id);
    out.push(action);
  }
  return out;
}

/** Preference tier: candidates matching an earlier tier win; non-matching candidates rank after every tier. */
export type ActionTier = (action: Action) => boolean;

export const phaseTier =
  (...phases: RoadmapPhase[]): ActionTier =>
  (action) =>
    phases.includes(action.phase);

export const kindTier =
  (...kinds: ActionKind[]): ActionTier =>
  (action) =>
    kinds.includes(action.kind);

export const eitherTier =
  (...tiers: ActionTier[]): ActionTier =>
  (action) =>
    tiers.some((tier) => tier(action));

export interface SlotSpec {
  readonly tiers: readonly ActionTier[];
  /** Skill groups in priority order (e.g. [focus skills, other skills]); within a group, earlier skills rank higher. */
  readonly skillGroups: readonly (readonly string[])[];
  /** Preferred max duration: over-long actions are used only when no candidate (used or not) fits. */
  readonly maxMinutes: number;
  /**
   * Second duration bound, tried when nothing fits `maxMinutes` (e.g. the 30-min daily ceiling or the remaining
   * weekly budget). Defaults to `maxMinutes`.
   */
  readonly fallbackMaxMinutes?: number;
  /**
   * Default true: an action is reused only when no unused candidate with the same time fit exists (a fitting
   * used action still beats an unused over-long one). false: used actions are never returned.
   */
  readonly allowReuse?: boolean;
  /** Ids that are never returned (e.g. items already in the same week). */
  readonly exclude?: ReadonlySet<string>;
}

/** How many times each action id was used so far in the artifact being built. */
export type UsageCounts = ReadonlyMap<string, number>;

function rankMap(ids: readonly string[]): Map<string, number> {
  const ranks = new Map<string, number>();
  ids.forEach((id, index) => {
    if (!ranks.has(id)) ranks.set(id, index);
  });
  return ranks;
}

/** skillId → [group index, index inside the group]; the first occurrence wins. */
function groupRanks(groups: readonly (readonly string[])[]): Map<string, readonly [number, number]> {
  const ranks = new Map<string, readonly [number, number]>();
  groups.forEach((group, g) =>
    group.forEach((id, i) => {
      if (!ranks.has(id)) ranks.set(id, [g, i]);
    }),
  );
  return ranks;
}

function best<T>(items: readonly T[], compare: (a: T, b: T) => number): T | null {
  return [...items].sort(compare)[0] ?? null;
}

/**
 * Picks one action for a slot. Order of precedence:
 * 1. time fit: duration ≤ maxMinutes, then ≤ fallbackMaxMinutes, then longer — the user's time per day is a
 *    hard preference, so a fitting action is REUSED before an unused over-long one is taken;
 * 2. unused before reused (least-used first) — no repeats while an unused candidate of the same fit exists;
 * 3. earlier skill group (focus before other skills);
 * 4. earlier tier (phase/kind preference), 5. earlier skill in its group, 6. shorter duration, 7. slug/id.
 * Over-long candidates (beyond both bounds) rank by usage, group, then the shortest first.
 * `allowReuse: false` drops used actions entirely. Returns null only when there is no candidate at all.
 */
export function pickAction(pool: readonly Action[], slot: SlotSpec, used: UsageCounts): Action | null {
  const ranks = groupRanks(slot.skillGroups);
  const tierOf = (action: Action): number => {
    const index = slot.tiers.findIndex((tier) => tier(action));
    return index === -1 ? slot.tiers.length : index;
  };
  const fallbackMax = slot.fallbackMaxMinutes ?? slot.maxMinutes;
  const fitOf = (a: Action): number =>
    a.durationMinutes <= slot.maxMinutes ? 0 : a.durationMinutes <= fallbackMax ? 1 : 2;
  const usage = (a: Action, b: Action): number => (used.get(a.id) ?? 0) - (used.get(b.id) ?? 0);
  const group = (a: Action, b: Action): number => (ranks.get(a.skillId)?.[0] ?? 0) - (ranks.get(b.skillId)?.[0] ?? 0);
  const skill = (a: Action, b: Action): number => (ranks.get(a.skillId)?.[1] ?? 0) - (ranks.get(b.skillId)?.[1] ?? 0);
  const tier = (a: Action, b: Action): number => tierOf(a) - tierOf(b);
  const duration = (a: Action, b: Action): number => a.durationMinutes - b.durationMinutes;
  const candidates = pool.filter(
    (a) => ranks.has(a.skillId) && !slot.exclude?.has(a.id) && (slot.allowReuse !== false || !used.has(a.id)),
  );
  return best(candidates, (a, b) => {
    const fit = fitOf(a) - fitOf(b);
    if (fit !== 0) return fit;
    const rest =
      fitOf(a) < 2
        ? group(a, b) || tier(a, b) || skill(a, b) || duration(a, b)
        : group(a, b) || duration(a, b) || tier(a, b) || skill(a, b);
    return usage(a, b) || rest || compareActions(a, b);
  });
}

/** Everything the selectors need, prepared once per report (see `createPlanContext`). */
export interface SelectionContext {
  /** Eligible actions (level, budget, model skills), sorted by slug. */
  readonly pool: readonly Action[];
  /** Bottleneck, or the first focus skill when there is no bottleneck. */
  readonly primarySkillId: string | null;
  /** Priority-ordered focus skills (bottleneck first). */
  readonly focus: readonly string[];
  /** Remaining model skills, lowest score first. */
  readonly others: readonly string[];
  readonly dailyCap: number;
}

const NOW_TIERS: readonly ActionTier[] = [
  phaseTier("foundation"),
  phaseTier("practice"),
  phaseTier("application", "verification"),
];

function quickWin(ctx: SelectionContext, used: UsageCounts, takenSkills: ReadonlySet<string>): Action | null {
  const groups = [
    ctx.focus.filter((id) => !takenSkills.has(id)),
    ctx.others.filter((id) => !takenSkills.has(id)),
    [...ctx.focus, ...ctx.others],
  ];
  for (const group of groups) {
    const rank = rankMap(group);
    const candidates = ctx.pool.filter((a) => rank.has(a.skillId) && !used.has(a.id));
    if (candidates.length === 0) continue;
    return best(
      candidates,
      (a, b) =>
        a.durationMinutes - b.durationMinutes ||
        (rank.get(a.skillId) ?? 0) - (rank.get(b.skillId) ?? 0) ||
        compareActions(a, b),
    );
  }
  return null;
}

/**
 * Top actions to do now (no duplicates, up to `count`, default 3):
 * 1. the bottleneck (primary) skill — foundation, else practice, else application/verification;
 * 2. the next priority focus skill that has any action (fallback: another focus action);
 * 3. a quick win — the shortest unused action for a skill not covered by 1–2 (focus skills first);
 * then filled from focus → other skills until `count`. Skills without library actions are skipped, never invented.
 */
export function selectActionsNow(ctx: SelectionContext, count = 3): Action[] {
  const chosen: Action[] = [];
  const used = new Map<string, number>();
  const take = (action: Action | null): boolean => {
    if (!action || chosen.length >= count || used.has(action.id)) return false;
    chosen.push(action);
    used.set(action.id, 1);
    return true;
  };
  const pickFor = (groups: readonly (readonly string[])[]): Action | null =>
    pickAction(ctx.pool, { tiers: NOW_TIERS, skillGroups: groups, maxMinutes: ctx.dailyCap, allowReuse: false }, used);

  if (ctx.primarySkillId) take(pickFor([[ctx.primarySkillId]]));
  let second: Action | null = null;
  for (const skillId of ctx.focus) {
    if (skillId === ctx.primarySkillId) continue;
    second = pickFor([[skillId]]);
    if (second) break;
  }
  take(second ?? pickFor([ctx.focus]));
  take(quickWin(ctx, used, new Set(chosen.map((a) => a.skillId))));
  while (chosen.length < count && take(pickFor([ctx.focus, ctx.others]))) {
    // keep filling
  }
  return chosen;
}
