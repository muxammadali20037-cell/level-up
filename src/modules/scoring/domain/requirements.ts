import type { ExperienceBand, LevelDefinition, LevelRequirement } from "@/modules/catalog/domain/types";
import type { LevelAssignmentInput, MissingRequirement } from "./types";

/** Minimum years implied by each self-reported experience band (used by experience_min requirements). */
export const EXPERIENCE_MIN_YEARS: Readonly<Record<ExperienceBand, number>> = {
  none: 0,
  lt1: 0.5,
  "1to3": 1,
  "3to5": 3,
  "5plus": 5,
};

/** Tolerance for comparing rounded scores against thresholds. */
export const THRESHOLD_EPSILON = 1e-9;

/** value ≥ threshold, tolerant to floating-point noise. */
export function meetsThreshold(value: number, threshold: number): boolean {
  return value >= threshold - THRESHOLD_EPSILON;
}

/**
 * Threshold actually enforced for a requirement. A null threshold means "at least one" for count requirements
 * (verified_scenario, practical_action) and "no minimum" (0) for score/experience requirements.
 */
export function effectiveThreshold(requirement: LevelRequirement): number {
  if (requirement.threshold !== null && Number.isFinite(requirement.threshold)) return requirement.threshold;
  return requirement.type === "verified_scenario" || requirement.type === "practical_action" ? 1 : 0;
}

/**
 * Current value a requirement is compared against:
 * composite_min → composite; skill_min → skillScores[skillId] (null when the skill has no score);
 * experience_min → EXPERIENCE_MIN_YEARS[experience]; verified_scenario / practical_action → provided counts.
 */
export function requirementCurrentValue(requirement: LevelRequirement, input: LevelAssignmentInput): number | null {
  switch (requirement.type) {
    case "composite_min":
      return input.composite;
    case "skill_min": {
      if (!requirement.skillId) return null;
      return input.skillScores[requirement.skillId] ?? null;
    }
    case "experience_min":
      return EXPERIENCE_MIN_YEARS[input.experience];
    case "verified_scenario":
      return input.verifiedScenarios;
    case "practical_action":
      return input.practicalActions;
  }
}

/** True when the current value is known and ≥ the effective threshold. A missing skill score is never met. */
export function isRequirementMet(requirement: LevelRequirement, input: LevelAssignmentInput): boolean {
  const current = requirementCurrentValue(requirement, input);
  return current !== null && meetsThreshold(current, effectiveThreshold(requirement));
}

function toMissing(requirement: LevelRequirement, input: LevelAssignmentInput): MissingRequirement {
  return {
    type: requirement.type,
    skillId: requirement.skillId ?? null,
    threshold: effectiveThreshold(requirement),
    current: requirementCurrentValue(requirement, input),
    gatesAssessed: requirement.gatesAssessed,
  };
}

/**
 * Every unmet requirement of a level (gating and non-gating), with current values:
 * - a synthetic gating `composite_min` entry first when composite < minComposite (unless an explicit gating
 *   composite_min requirement at least as strict is already listed);
 * - each unmet explicit requirement in definition order;
 * - for `requiresVerification` levels without an explicit verified_scenario requirement, a synthetic
 *   non-gating `verified_scenario` (threshold 1) entry while verifiedScenarios < 1 — it describes what the
 *   VERIFIED level needs; it is not part of `met`, and the assessed level is capped below such levels anyway.
 */
export function missingRequirements(level: LevelDefinition, input: LevelAssignmentInput): MissingRequirement[] {
  const explicit = level.requirements.filter((r) => !isRequirementMet(r, input)).map((r) => toMissing(r, input));
  const missing: MissingRequirement[] = [];
  const compositeCovered = explicit.some(
    (m) => m.type === "composite_min" && m.gatesAssessed && (m.threshold ?? 0) >= level.minComposite,
  );
  if (!meetsThreshold(input.composite, level.minComposite) && !compositeCovered) {
    missing.push({
      type: "composite_min",
      skillId: null,
      threshold: level.minComposite,
      current: input.composite,
      gatesAssessed: true,
    });
  }
  missing.push(...explicit);
  const hasExplicitVerification = level.requirements.some((r) => r.type === "verified_scenario");
  if (level.requiresVerification && input.verifiedScenarios < 1 && !hasExplicitVerification) {
    missing.push({
      type: "verified_scenario",
      skillId: null,
      threshold: 1,
      current: input.verifiedScenarios,
      gatesAssessed: false,
    });
  }
  return missing;
}

/** All gates_assessed requirements of the level are met (composite threshold not included). */
export function levelGatesMet(level: LevelDefinition, input: LevelAssignmentInput): boolean {
  return level.requirements.every((r) => !r.gatesAssessed || isRequirementMet(r, input));
}
