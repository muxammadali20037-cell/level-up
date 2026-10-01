import type { LevelDefinition, LevelRequirement } from "@/modules/catalog/domain/types";
import { effectiveThreshold, meetsThreshold } from "@/modules/scoring/domain/requirements";
import type { LevelAssignment, LevelEvaluation, MissingRequirement } from "@/modules/scoring/domain/types";
import { VERIFICATION_REQUIREMENT_DESCRIPTION } from "./copy";
import type { NextLevel, NextLevelBlocker, NextLevelRequirementStatus } from "./types";

/** Highest level number in the scheme (9 by default). */
export const MAX_LEVEL = 9;

/** Verified counts known for the user; omit when unknown (fresh assessment). */
export interface VerifiedCounts {
  readonly verifiedScenarios: number;
  readonly practicalActions: number;
}

const round1 = (value: number): number => Math.round(value * 10) / 10;

function findLevel(levels: readonly LevelDefinition[], number: number): LevelDefinition | undefined {
  return levels.find((l) => l.number === number);
}

/**
 * skillId → skill_min threshold of level `level + 1` (the max when a skill is listed twice). Empty at the top
 * level or when L+1 is not defined. Feeds skill banding and bottleneck gap targets.
 */
export function nextLevelSkillThresholds(
  levels: readonly LevelDefinition[],
  level: number,
): Record<string, number> {
  const next = findLevel(levels, level + 1);
  const thresholds: Record<string, number> = {};
  for (const req of next?.requirements ?? []) {
    if (req.type !== "skill_min" || !req.skillId || req.threshold === null) continue;
    thresholds[req.skillId] = Math.max(thresholds[req.skillId] ?? Number.NEGATIVE_INFINITY, req.threshold);
  }
  return thresholds;
}

/** Same identity the scoring engine writes into MissingRequirement: type, skill and EFFECTIVE threshold. */
function matchesMissing(req: LevelRequirement, missing: MissingRequirement): boolean {
  return (
    missing.type === req.type &&
    (missing.skillId ?? null) === (req.skillId ?? null) &&
    missing.threshold === effectiveThreshold(req)
  );
}

/** Implicit "≥ 1 verified scenario" of a requires_verification level (mirrors scoring's missingRequirements). */
const IMPLICIT_VERIFICATION: LevelRequirement = {
  type: "verified_scenario",
  skillId: null,
  threshold: 1,
  gatesAssessed: false,
  description: VERIFICATION_REQUIREMENT_DESCRIPTION,
};

function requirementsOf(level: LevelDefinition): readonly LevelRequirement[] {
  const implicit = level.requiresVerification && !level.requirements.some((r) => r.type === "verified_scenario");
  return implicit ? [...level.requirements, IMPLICIT_VERIFICATION] : level.requirements;
}

interface StatusContext {
  readonly composite: number;
  readonly scores: Readonly<Record<string, number>>;
  readonly evaluation: LevelEvaluation | undefined;
  readonly counts: VerifiedCounts | undefined;
}

function countFor(req: LevelRequirement, counts: VerifiedCounts | undefined): number | null {
  if (!counts) return null;
  if (req.type === "verified_scenario") return counts.verifiedScenarios;
  if (req.type === "practical_action") return counts.practicalActions;
  return null;
}

function statusOf(req: LevelRequirement, ctx: StatusContext): { current: number | null; met: boolean } {
  const threshold = effectiveThreshold(req);
  if (req.type === "composite_min") {
    return { current: round1(ctx.composite), met: meetsThreshold(ctx.composite, threshold) };
  }
  if (req.type === "skill_min") {
    const current = req.skillId ? (ctx.scores[req.skillId] ?? null) : null;
    return { current, met: current !== null && meetsThreshold(current, threshold) };
  }
  const count = countFor(req, ctx.counts);
  if (ctx.evaluation) {
    const missing = ctx.evaluation.missing.find((m) => matchesMissing(req, m));
    return missing ? { current: missing.current ?? count, met: false } : { current: count, met: true };
  }
  if (count === null) return { current: null, met: false };
  return { current: count, met: meetsThreshold(count, threshold) };
}

function verificationBlocks(next: LevelDefinition, assignment: LevelAssignment, ctx: StatusContext): boolean {
  if (!next.requiresVerification) return false;
  if (assignment.cappedBy === "verification") return true;
  if (ctx.counts) return ctx.counts.verifiedScenarios < 1;
  const entry = ctx.evaluation?.missing.find((m) => m.type === "verified_scenario");
  if (entry) return entry.current === null || entry.current < 1;
  // No counts and no unmet verification entry: verified per the evaluation; without one, a fresh assessment has 0.
  return ctx.evaluation === undefined;
}

function experienceBlocks(target: number, assignment: LevelAssignment, experienceCap: number | null | undefined): boolean {
  if (experienceCap === undefined) return assignment.cappedBy === "experience";
  return experienceCap !== null && Number.isFinite(experienceCap) && target > experienceCap;
}

/**
 * Requirements of level L+1 with current values and met flags, the composite gap and the caps blocking L+1.
 * - Thresholds are the scoring engine's effective ones (`effectiveThreshold`: null → 1 for verified_scenario /
 *   practical_action, 0 otherwise); the row reports that effective threshold.
 * - composite_min / skill_min are computed from `composite` / `scores` (a skill without a score is unmet).
 * - verified_scenario / practical_action / experience_min come from the scoring engine's evaluation of L+1
 *   (unmet iff listed in `missing`); without an evaluation they use `counts` when given, else unknown → unmet.
 * - A requires_verification level without an explicit verified_scenario requirement gets the implicit row
 *   "≥ 1 verified scenario" ({@link VERIFICATION_REQUIREMENT_DESCRIPTION}), as the scoring engine enforces it.
 * - blockedBy: "experience" when L+1 > `experienceCap` (config.experienceCaps[experience]; null = known to have
 *   no cap; undefined = unknown → inferred from assignment.cappedBy); "verification" when L+1 requires
 *   verification and no verified scenario is known (assignment.cappedBy, counts, else the evaluation).
 * - compositeGap = max(0, minComposite(L+1) − composite), rounded to 1 decimal.
 * Returns null at the top level (L = 9) or when L+1 is not defined.
 */
export function buildNextLevel(
  assignment: LevelAssignment,
  levels: readonly LevelDefinition[],
  composite: number,
  scores: Readonly<Record<string, number>>,
  counts?: VerifiedCounts,
  experienceCap?: number | null,
): NextLevel | null {
  const target = assignment.level + 1;
  if (assignment.level >= MAX_LEVEL) return null;
  const next = findLevel(levels, target);
  if (!next) return null;
  const ctx: StatusContext = {
    composite,
    scores,
    evaluation: assignment.evaluations.find((e) => e.number === target),
    counts,
  };
  const requirements: NextLevelRequirementStatus[] = requirementsOf(next).map((req) => {
    const { current, met } = statusOf(req, ctx);
    return {
      type: req.type,
      skillId: req.skillId ?? null,
      threshold: effectiveThreshold(req),
      current,
      met,
      gatesAssessed: req.gatesAssessed,
      description: req.description,
    };
  });
  const blockedBy: NextLevelBlocker[] = [];
  if (experienceBlocks(target, assignment, experienceCap)) blockedBy.push("experience");
  if (verificationBlocks(next, assignment, ctx)) blockedBy.push("verification");
  return {
    number: target,
    compositeGap: round1(Math.max(0, next.minComposite - composite)),
    requirements,
    blockedBy,
  };
}
