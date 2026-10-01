import type { I18nText } from "@/lib/i18n/text";
import type { Skill, SkillEdge } from "@/modules/catalog/domain/types";
import { compareStrings } from "@/modules/roadmaps/domain/compare";
import { hasText, interpolateI18n } from "@/modules/roadmaps/domain/i18n-format";
import { prerequisiteDescendants, prerequisiteOrder } from "@/modules/roadmaps/domain/topo";
import { WEAK_BELOW } from "./banding";
import { BOTTLENECK_EXPLANATION_TEMPLATES } from "./copy";
import type { Bottleneck, BottleneckReason } from "./types";

/** Gap target for a skill without a next-level skill_min threshold (the weak-band boundary). */
export const DEFAULT_GAP_TARGET = WEAK_BELOW;

/**
 * gap_to_next target of a skill: max(40, next-level skill_min threshold) — exactly the boundary below which
 * {@link bandForScore} calls a score weak. So every weak skill has a positive gap, and a skill that gates L+1
 * (threshold > 40) gets a larger gap than an identical skill that gates nothing.
 */
export function gapTarget(nextLevelThreshold?: number): number {
  return Math.max(DEFAULT_GAP_TARGET, nextLevelThreshold ?? DEFAULT_GAP_TARGET);
}

export interface BottleneckInput {
  /** Skills with (specialization-adjusted) importance; `Skill` satisfies this. */
  readonly skills: readonly Pick<Skill, "id" | "importance">[];
  /** skillId → score 0..100. */
  readonly scores: Readonly<Record<string, number>>;
  /** skillId → directly measured (used as a tie-breaker: measured skills win ties). */
  readonly measured: Readonly<Record<string, boolean>>;
  readonly edges: readonly SkillEdge[];
  /** skillId → skill_min threshold of the next level. */
  readonly nextLevelThresholds: Readonly<Record<string, number>>;
  readonly weakSkillIds: readonly string[];
}

export interface LimitContribution {
  /** The limited skill (edge target). */
  readonly skillId: string;
  /** strength × max(0, score(target) − score(source)) / 100 */
  readonly contribution: number;
  readonly edge: SkillEdge;
}

export interface LeverageBreakdown {
  readonly skillId: string;
  /** importance × max(0, target − score) / 100, target = {@link gapTarget}(next-level threshold). */
  readonly gapTerm: number;
  /** Σ contributions of outgoing `limits` edges. */
  readonly limitsTerm: number;
  readonly leverage: number;
  /** Outgoing `limits` contributions, largest first (ties: strength desc, id asc). */
  readonly limits: readonly LimitContribution[];
}

/**
 * Leverage of fixing skill w (brief §8):
 *   leverage(w) = importance(w) · max(0, target(w) − score(w)) / 100
 *               + Σ_{edges w →limits y} strength · max(0, score(y) − score(w)) / 100
 * where target(w) = {@link gapTarget} = max(40, next-level skill_min threshold of w). Unknown importance = 0;
 * a limited skill without a score contributes 0.
 */
export function computeLeverage(skillId: string, input: BottleneckInput): LeverageBreakdown {
  const score = input.scores[skillId] ?? 0;
  const importance = input.skills.find((s) => s.id === skillId)?.importance ?? 0;
  const target = gapTarget(input.nextLevelThresholds[skillId]);
  const gapTerm = (importance * Math.max(0, target - score)) / 100;
  const limits = input.edges
    .filter((e) => e.relation === "limits" && e.from === skillId && e.to !== skillId)
    .map((edge) => ({
      skillId: edge.to,
      contribution: (edge.strength * Math.max(0, (input.scores[edge.to] ?? score) - score)) / 100,
      edge,
    }))
    .sort(
      (a, b) =>
        b.contribution - a.contribution || b.edge.strength - a.edge.strength || compareStrings(a.skillId, b.skillId),
    );
  const limitsTerm = limits.reduce((sum, l) => sum + l.contribution, 0);
  return { skillId, gapTerm, limitsTerm, leverage: gapTerm + limitsTerm, limits };
}

const round4 = (value: number): number => Math.round(value * 10_000) / 10_000;

function isPrerequisiteOf(edges: readonly SkillEdge[], from: string, to: string): boolean {
  return edges.some((e) => e.relation === "prerequisite" && e.strength > 0 && e.from === from && e.to === to);
}

function explain(
  reason: BottleneckReason,
  chosen: LeverageBreakdown,
  unlocks: readonly string[],
  limited: readonly string[],
  edges: readonly SkillEdge[],
): I18nText {
  const template = BOTTLENECK_EXPLANATION_TEMPLATES[reason];
  if (reason === "prerequisite_of_weak") {
    for (const target of unlocks) {
      const edge = edges.find((e) => isPrerequisiteOf([e], chosen.skillId, target) && hasText(e.rationale));
      if (edge?.rationale) return edge.rationale;
    }
    return template;
  }
  if (reason === "limits_strong_skills") {
    const dominant = chosen.limits.find((l) => l.contribution > 0 && limited.includes(l.skillId));
    if (dominant?.edge.rationale && hasText(dominant.edge.rationale)) return dominant.edge.rationale;
  }
  return template;
}

/**
 * The bottleneck: the weak skill whose improvement unlocks the most — NOT simply the lowest score.
 *
 * 1. Leverage for every weak skill ({@link computeLeverage}); best = max leverage
 *    (ties: measured first, importance desc, id asc).
 * 2. Prerequisite-first: while some weak skill w is a TRANSITIVE `prerequisite` of the current choice v (a path
 *    w → … → v, possibly through non-weak skills — the same rule as the plan's foundation order), move to w;
 *    among several such w take the best-ranked. Visited skills are not revisited, so cycles terminate.
 * 3. limitedSkillIds: non-weak targets of its `limits` edges with a positive contribution (largest first).
 *    unlocksSkillIds: weak skills reachable from it via `prerequisite` edges, in prerequisite order.
 * 4. reason: "prerequisite_of_weak" if step 2 moved; else "limits_strong_skills" if it caps non-weak skills and
 *    that part of the limits term dominates (Σ contributions to non-weak targets > gapTerm); else
 *    "prerequisite_of_weak" if it unlocks weak skills; else "largest_gap". (Limits edges to weak targets still
 *    count in leverage, but never make the reason "limits_strong_skills".)
 * 5. explanation: for prerequisite_of_weak the rationale of a direct prerequisite edge to the first unlocked skill
 *    that has one; for limits_strong_skills the rationale of the dominant edge to a limited (non-weak) skill;
 *    otherwise / without rationale the reason template from {@link BOTTLENECK_EXPLANATION_TEMPLATES}
 *    (placeholders {skill}/{limited}/{unlocks}).
 * Returns null when there are no weak skills (with scores).
 */
export function findBottleneck(input: BottleneckInput): Bottleneck | null {
  const weak = [...new Set(input.weakSkillIds)].filter((id) => input.scores[id] !== undefined);
  if (weak.length === 0) return null;
  const weakSet = new Set(weak);
  const breakdowns = new Map(weak.map((id) => [id, computeLeverage(id, input)] as const));
  const importanceOf = (id: string): number => input.skills.find((s) => s.id === id)?.importance ?? 0;
  const compare = (a: string, b: string): number =>
    (breakdowns.get(b)?.leverage ?? 0) - (breakdowns.get(a)?.leverage ?? 0) ||
    Number(input.measured[b] ?? false) - Number(input.measured[a] ?? false) ||
    importanceOf(b) - importanceOf(a) ||
    compareStrings(a, b);

  const descendants = new Map(weak.map((id) => [id, prerequisiteDescendants(id, input.edges)] as const));
  let current = [...weak].sort(compare)[0] ?? weak[0] ?? "";
  const visited = new Set([current]);
  let moved = false;
  for (;;) {
    const from = current;
    const prerequisites = weak.filter((w) => !visited.has(w) && descendants.get(w)?.has(from)).sort(compare);
    const next = prerequisites[0];
    if (next === undefined) break;
    current = next;
    visited.add(next);
    moved = true;
  }

  const chosen = breakdowns.get(current) ?? computeLeverage(current, input);
  const downstream = descendants.get(current) ?? new Set<string>();
  const unlocks = prerequisiteOrder(
    weak.filter((id) => id !== current && downstream.has(id)).sort(compare),
    input.edges,
  );
  const strongLimits = chosen.limits.filter((l) => l.contribution > 0 && !weakSet.has(l.skillId));
  const limited = [...new Set(strongLimits.map((l) => l.skillId))];
  const strongLimitsTerm = strongLimits.reduce((sum, l) => sum + l.contribution, 0);
  const reason: BottleneckReason = moved
    ? "prerequisite_of_weak"
    : limited.length > 0 && strongLimitsTerm > chosen.gapTerm
      ? "limits_strong_skills"
      : unlocks.length > 0
        ? "prerequisite_of_weak"
        : "largest_gap";
  return {
    skillId: current,
    leverage: round4(chosen.leverage),
    reason,
    limitedSkillIds: limited,
    unlocksSkillIds: unlocks,
    explanation: explain(reason, chosen, unlocks, limited, input.edges),
  };
}

/**
 * Fills the explanation placeholders ({skill}, {limited}, {unlocks}) with localized skill names for every locale
 * of the explanation (lists joined as "A, B and C"). Unknown skill ids fall back to the raw id.
 */
export function renderBottleneckExplanation(
  bottleneck: Bottleneck,
  skills: readonly Pick<Skill, "id" | "name">[],
): I18nText {
  const nameOf = (id: string): I18nText | string => skills.find((s) => s.id === id)?.name ?? id;
  return interpolateI18n(bottleneck.explanation, {
    skill: nameOf(bottleneck.skillId),
    limited: bottleneck.limitedSkillIds.map(nameOf),
    unlocks: bottleneck.unlocksSkillIds.map(nameOf),
  });
}
