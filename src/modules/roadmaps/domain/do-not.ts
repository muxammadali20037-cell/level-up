import type { GoalType } from "@/modules/catalog/domain/types";
import type { DoNotItem } from "@/modules/results/domain/types";
import { compareStrings } from "./compare";
import type { DoNotCondition, DoNotRule } from "./types";

export const MAX_DO_NOT_ITEMS = 3;

export interface DoNotContext {
  readonly level: number;
  readonly weakSkillIds: readonly string[];
  readonly goal: GoalType;
  readonly bottleneckSkillId: string | null;
}

/**
 * Condition semantics (all present fields must hold; a missing field — or an empty list — means no constraint):
 * - minLevel ≤ level ≤ maxLevel (inclusive bounds);
 * - weakSkillIds: ANY listed skill is weak;
 * - goalTypes: the user's goal is listed.
 */
export function doNotConditionMatches(condition: DoNotCondition, ctx: DoNotContext): boolean {
  if (condition.minLevel !== undefined && ctx.level < condition.minLevel) return false;
  if (condition.maxLevel !== undefined && ctx.level > condition.maxLevel) return false;
  if (condition.weakSkillIds && condition.weakSkillIds.length > 0) {
    const weak = new Set(ctx.weakSkillIds);
    if (!condition.weakSkillIds.some((id) => weak.has(id))) return false;
  }
  if (condition.goalTypes && condition.goalTypes.length > 0 && !condition.goalTypes.includes(ctx.goal)) {
    return false;
  }
  return true;
}

/** A rule touches the bottleneck when its own skill is the bottleneck or its condition lists it as weak. */
function touchesBottleneck(rule: DoNotRule, bottleneckSkillId: string | null): boolean {
  if (!bottleneckSkillId) return false;
  return rule.skillId === bottleneckSkillId || (rule.condition.weakSkillIds ?? []).includes(bottleneckSkillId);
}

/**
 * "Do not do now" items: matching rules, those touching the bottleneck first, then by slug (then id), at most
 * {@link MAX_DO_NOT_ITEMS}. Rule texts are copied as-is (content-authored, all locales).
 */
export function evaluateDoNotRules(rules: readonly DoNotRule[], ctx: DoNotContext): DoNotItem[] {
  return rules
    .filter((rule) => doNotConditionMatches(rule.condition, ctx))
    .map((rule) => ({ rule, touches: touchesBottleneck(rule, ctx.bottleneckSkillId) ? 0 : 1 }))
    .sort(
      (a, b) =>
        a.touches - b.touches || compareStrings(a.rule.slug, b.rule.slug) || compareStrings(a.rule.id, b.rule.id),
    )
    .slice(0, MAX_DO_NOT_ITEMS)
    .map(({ rule }) => ({ ruleId: rule.id, skillId: rule.skillId, message: rule.message, reason: rule.reason }));
}
