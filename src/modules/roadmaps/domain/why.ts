import type { I18nText } from "@/lib/i18n/text";
import type { Recommendation, WhyThis } from "@/modules/results/domain/types";
import type { ConfidenceLevel } from "@/modules/scoring/domain/types";
import {
  EVIDENCE_FROM_SOURCES,
  LIMITATION_NO_SOURCES,
  REASON_BOTTLENECK_TEMPLATE,
  REASON_FOCUS_TEMPLATE,
} from "./copy";
import { hasText, interpolateI18n } from "./i18n-format";
import type { Action } from "./types";

const CONFIDENCE_RANK: Readonly<Record<ConfidenceLevel, number>> = { low: 0, medium: 1, high: 2 };

/** The lower of two confidence levels (low < medium < high). */
export function minConfidence(a: ConfidenceLevel, b: ConfidenceLevel): ConfidenceLevel {
  return CONFIDENCE_RANK[a] <= CONFIDENCE_RANK[b] ? a : b;
}

export interface WhyContext {
  /** Null when the focus skills are not weak (no bottleneck). */
  readonly bottleneckSkillId: string | null;
  /** Localized skill names for template interpolation. */
  readonly skillNames: ReadonlyMap<string, I18nText>;
  /** Overall report confidence. */
  readonly confidence: ConfidenceLevel;
}

/**
 * WHY / SOURCE / EVIDENCE / LIMITATION / CONFIDENCE for one library action:
 * - reason: the action's own `why`; if blank, a template naming the skill (bottleneck wording when it targets
 *   the bottleneck), interpolated per locale with the localized skill name.
 * - sourceIds: the action's sourceIds (never invented).
 * - evidence: null unless sources exist (then a pointer to the cited sources).
 * - limitation: when there are no sources, "Based on LEVEL's skill model and your answers; not an external study."
 * - confidence: min(report confidence, "medium" when there are no sources).
 */
export function buildWhy(action: Action, ctx: WhyContext): WhyThis {
  const hasSources = action.sourceIds.length > 0;
  const template = action.skillId === ctx.bottleneckSkillId ? REASON_BOTTLENECK_TEMPLATE : REASON_FOCUS_TEMPLATE;
  const reason = hasText(action.why)
    ? action.why
    : interpolateI18n(template, { skill: ctx.skillNames.get(action.skillId) ?? action.skillId });
  return {
    reason,
    sourceIds: [...action.sourceIds],
    evidence: hasSources ? EVIDENCE_FROM_SOURCES : null,
    limitation: hasSources ? null : LIMITATION_NO_SOURCES,
    confidence: hasSources ? ctx.confidence : minConfidence(ctx.confidence, "medium"),
  };
}

/** Snapshots a library action into a report recommendation (texts copied, WhyThis attached). */
export function toRecommendation(action: Action, ctx: WhyContext): Recommendation {
  return {
    actionId: action.id,
    skillId: action.skillId,
    title: action.title,
    description: action.description,
    durationMinutes: action.durationMinutes,
    phase: action.phase,
    successCriteria: hasText(action.successCriteria) ? action.successCriteria : null,
    resourceIds: [...action.resourceIds],
    why: buildWhy(action, ctx),
  };
}
