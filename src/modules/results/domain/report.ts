import type { I18nText } from "@/lib/i18n/text";
import type { ExperienceBand, SkillModel } from "@/modules/catalog/domain/types";
import { compareStrings } from "@/modules/roadmaps/domain/compare";
import { evaluateDoNotRules } from "@/modules/roadmaps/domain/do-not";
import { hasText } from "@/modules/roadmaps/domain/i18n-format";
import { buildRecommendations } from "@/modules/roadmaps/domain/plan";
import { orderFocusSkills } from "@/modules/roadmaps/domain/topo";
import type { Action, DoNotRule, PlanPreferences } from "@/modules/roadmaps/domain/types";
import type { AbilityEstimate, ConfidenceAssessment, LevelAssignment } from "@/modules/scoring/domain/types";
import { bandSkills, pickStrongest, pickWeakest } from "./banding";
import { findBottleneck, gapTarget } from "./bottleneck";
import { EDUCATIONAL_DISCLAIMER, REGULATED_DISCLAIMER_FALLBACK } from "./copy";
import { buildNextLevel, nextLevelSkillThresholds, type VerifiedCounts } from "./next-level";
import { type Percentile, REPORT_SCHEMA_VERSION, type ReportSkill, type ResultReport } from "./types";

export interface BuildReportInput {
  readonly professionId: string;
  readonly specializationId: string | null;
  readonly ability: AbilityEstimate;
  readonly assignment: LevelAssignment;
  readonly confidence: ConfidenceAssessment;
  readonly skillModel: SkillModel;
  readonly actions: readonly Action[];
  readonly doNotRules: readonly DoNotRule[];
  readonly preferences: PlanPreferences;
  /** Pass-through only: computed elsewhere from real benchmarks with sufficient sample size, else null. */
  readonly percentile: Percentile | null;
  readonly isRegulated?: boolean;
  /** Profession-specific (regulated) disclaimer. */
  readonly disclaimer?: I18nText | null;
  /** Specialization-adjusted importance (skillId → weight). Defaults to the skill model's importance. */
  readonly importance?: Readonly<Record<string, number>>;
  /** Known verification counts for next-level requirements; omit for a fresh assessment. */
  readonly verifiedCounts?: VerifiedCounts;
  /** Self-reported experience band: lets nextLevel.blockedBy flag the experience cap of L+1 (config.experienceCaps). */
  readonly experience?: ExperienceBand;
}

function orderByModel(skills: readonly ReportSkill[], model: SkillModel): ReportSkill[] {
  const sortOrder = new Map(model.skills.map((s) => [s.id, s.sortOrder] as const));
  return [...skills].sort(
    (a, b) =>
      (sortOrder.get(a.skillId) ?? Number.MAX_SAFE_INTEGER) - (sortOrder.get(b.skillId) ?? Number.MAX_SAFE_INTEGER) ||
      compareStrings(a.skillId, b.skillId),
  );
}

/** Focus skills when nothing is weak: non-strong skills (else all), lowest score first. */
function fallbackFocus(skills: readonly ReportSkill[], importance: Readonly<Record<string, number>>): string[] {
  const nonStrong = skills.filter((s) => s.band !== "strong");
  return [...(nonStrong.length > 0 ? nonStrong : skills)]
    .sort(
      (a, b) =>
        a.score - b.score ||
        (importance[b.skillId] ?? 0) - (importance[a.skillId] ?? 0) ||
        compareStrings(a.skillId, b.skillId),
    )
    .map((s) => s.skillId);
}

function disclaimersFor(input: BuildReportInput): I18nText[] {
  const out: I18nText[] = [EDUCATIONAL_DISCLAIMER];
  if (input.disclaimer && hasText(input.disclaimer)) out.push(input.disclaimer);
  else if (input.isRegulated) out.push(REGULATED_DISCLAIMER_FALLBACK);
  return out;
}

/**
 * Composes the full, deterministic result report (stored as assessment_results.report):
 * bands (next-level thresholds) → strongest/weakest → bottleneck (leverage, prerequisite-first) → next level →
 * focus order (bottleneck, prerequisite order, gap; lowest non-strong skills when nothing is weak) →
 * actions now / 7-day plan / 30-day roadmap → "do not do now" → disclaimers (educational always; the
 * profession's own disclaimer when it has text in some locale, else the regulated fallback for a regulated
 * profession). `strongest` never contains the bottleneck (it can only appear there when every skill is weak).
 * Same input → deep-equal output.
 */
export function buildReport(input: BuildReportInput): ResultReport {
  const { ability, assignment, skillModel } = input;
  const importance: Record<string, number> = {
    ...Object.fromEntries(skillModel.skills.map((s) => [s.id, s.importance])),
    ...input.importance,
  };
  const scores = Object.fromEntries(ability.skills.map((s) => [s.skillId, s.score]));
  const measured = Object.fromEntries(ability.skills.map((s) => [s.skillId, s.measured]));
  const thresholds = nextLevelSkillThresholds(skillModel.levels, assignment.level);
  const skills = orderByModel(bandSkills(ability.skills, thresholds), skillModel);
  const weakSkillIds = skills.filter((s) => s.band === "weak").map((s) => s.skillId);

  const bottleneck = findBottleneck({
    skills: skillModel.skills.map((s) => ({ id: s.id, importance: importance[s.id] ?? 0 })),
    scores,
    measured,
    edges: skillModel.edges,
    nextLevelThresholds: thresholds,
    weakSkillIds,
  });
  const gaps = Object.fromEntries(
    skills.map((s) => [s.skillId, Math.max(0, gapTarget(thresholds[s.skillId]) - s.score)]),
  );
  const focus = bottleneck
    ? orderFocusSkills({ bottleneckSkillId: bottleneck.skillId, weakSkillIds, edges: skillModel.edges, gaps })
    : fallbackFocus(skills, importance);
  const recommendations = buildRecommendations({
    skillModel,
    level: assignment.level,
    weakSkillIds: focus,
    bottleneckSkillId: bottleneck?.skillId ?? null,
    actions: input.actions,
    preferences: input.preferences,
    confidence: input.confidence.level,
    skillScores: scores,
  });

  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    professionId: input.professionId,
    specializationId: input.specializationId,
    level: assignment.level,
    uncappedLevel: assignment.uncappedLevel,
    cappedBy: assignment.cappedBy,
    levelRange: assignment.range,
    composite: ability.composite,
    compositeSe: ability.compositeSe,
    confidence: input.confidence,
    skills,
    strongest: pickStrongest(skills, importance, undefined, bottleneck ? [bottleneck.skillId] : []),
    weakest: pickWeakest(skills, importance),
    bottleneck,
    nextLevel: buildNextLevel(
      assignment,
      skillModel.levels,
      ability.composite,
      scores,
      input.verifiedCounts,
      input.experience === undefined ? undefined : (skillModel.config.experienceCaps[input.experience] ?? null),
    ),
    actionsNow: recommendations.actionsNow,
    doNot: evaluateDoNotRules(input.doNotRules, {
      level: assignment.level,
      weakSkillIds,
      goal: input.preferences.goal,
      bottleneckSkillId: bottleneck?.skillId ?? null,
    }),
    plan7: recommendations.plan7,
    roadmap30: recommendations.roadmap30,
    percentile: input.percentile,
    disclaimers: disclaimersFor(input),
  };
}
