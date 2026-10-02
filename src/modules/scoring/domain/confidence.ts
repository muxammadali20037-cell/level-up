import type { AnsweredItem } from "@/modules/assessments/domain/types";
import { normalizeImportances } from "./estimate";
import type {
  ConfidenceAssessment,
  ConfidenceInput,
  ConfidenceLevel,
  ConfidenceReason,
  ScoringSkill,
  SkillEstimate,
} from "./types";

/** Answers faster than this are considered "speeding". */
export const DEFAULT_SPEEDING_THRESHOLD_MS = 2500;
/** Speeding share above which confidence is downgraded one step. */
export const MAX_SPEEDING_RATIO = 0.3;
/** Model-based self-report gap (see `computeSelfReportGap`) above which confidence is downgraded one step. */
export const MAX_SELF_REPORT_GAP = 0.45;
export const HIGH_CONFIDENCE = { minItems: 12, maxSe: 0.35 } as const;
export const MEDIUM_CONFIDENCE = { minItems: 8, maxSe: 0.55 } as const;

const ORDER: readonly ConfidenceLevel[] = ["low", "medium", "high"];

/**
 * Share of timed items answered in less than `thresholdMs` (default 2.5 s). Items with `responseMs` null (or
 * non-finite) are ignored; returns 0 when no item has timing.
 */
export function computeSpeedingRatio(
  items: readonly Pick<AnsweredItem, "responseMs">[],
  thresholdMs: number = DEFAULT_SPEEDING_THRESHOLD_MS,
): number {
  let timed = 0;
  let fast = 0;
  for (const item of items) {
    if (item.responseMs === null || !Number.isFinite(item.responseMs)) continue;
    timed += 1;
    if (item.responseMs < thresholdMs) fast += 1;
  }
  return timed === 0 ? 0 : fast / timed;
}

/**
 * Number of unmeasured skills whose normalized importance is at least `minShare` (default: the average share
 * 1/n, i.e. skills at or above average importance count as important).
 */
export function countUnmeasuredImportantSkills(
  estimates: readonly SkillEstimate[],
  skills: readonly ScoringSkill[],
  minShare?: number,
): number {
  const weights = normalizeImportances(skills);
  if (weights.size === 0) return 0;
  const threshold = (minShare ?? 1 / weights.size) - 1e-12;
  return estimates.filter((e) => !e.measured && (weights.get(e.skillId) ?? 0) >= threshold).length;
}

/**
 * Confidence of an assessed result.
 *
 * Base: HIGH if n ≥ 12 and SE_g ≤ 0.35; MEDIUM if n ≥ 8 and SE_g ≤ 0.55; else LOW.
 * Downgrades (one step each, never below LOW): speedingRatio > 0.3; selfReportGap > 0.45.
 * Reasons (fixed order): few_items (n < 12), high_uncertainty (SE_g > 0.35), speeding, self_report_gap,
 * near_boundary (informational), unmeasured_skills (informational, when > 0 important skills are unmeasured).
 *
 * Calibration (07a-scoring-calibration.md): HIGH is designed for the extended assessment (deep report, up to 25
 * items) and for verification; MEDIUM is the normal outcome of the 7–15 item test. The test stops as soon as
 * SE_g ≤ targetSe (0.45), and with brief-default items (a = 1, c = 1/n) SE_g ≤ 0.35 needs ≈ 16 perfectly targeted
 * items, so 0% of simulated default sessions reach HIGH (minimum SE_g ≈ 0.46; ≈ 60% MEDIUM, the rest LOW). Even a
 * 25-item extended run reaches HIGH only with calibrated items of a ≈ 1.4 (≈ 17% of simulated respondents).
 */
export function assessConfidence(input: ConfidenceInput): ConfidenceAssessment {
  let rank: number;
  if (input.nItems >= HIGH_CONFIDENCE.minItems && input.seG <= HIGH_CONFIDENCE.maxSe) rank = 2;
  else if (input.nItems >= MEDIUM_CONFIDENCE.minItems && input.seG <= MEDIUM_CONFIDENCE.maxSe) rank = 1;
  else rank = 0;

  const speeding = input.speedingRatio > MAX_SPEEDING_RATIO;
  const selfReportGap = input.selfReportGap !== null && input.selfReportGap > MAX_SELF_REPORT_GAP;
  if (speeding) rank -= 1;
  if (selfReportGap) rank -= 1;

  const reasons: ConfidenceReason[] = [];
  if (input.nItems < HIGH_CONFIDENCE.minItems) reasons.push("few_items");
  if (!(input.seG <= HIGH_CONFIDENCE.maxSe)) reasons.push("high_uncertainty");
  if (speeding) reasons.push("speeding");
  if (selfReportGap) reasons.push("self_report_gap");
  if (input.nearBoundary) reasons.push("near_boundary");
  if (input.unmeasuredImportantSkills > 0) reasons.push("unmeasured_skills");

  return { level: ORDER[Math.max(0, rank)] ?? "low", reasons };
}
