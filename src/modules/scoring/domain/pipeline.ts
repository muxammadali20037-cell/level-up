import { EXPERIENCE_PRIOR_MEAN } from "@/modules/assessments/domain/types";
import {
  assessConfidence,
  computeSpeedingRatio,
  countUnmeasuredImportantSkills,
  DEFAULT_SPEEDING_THRESHOLD_MS,
} from "./confidence";
import { estimateAbilities, skillScoreMap, skillScoreSeMap } from "./estimate";
import { assignLevel } from "./levels";
import { computeSelfReportGap } from "./self-report";
import { SCORING_MODEL_VERSION, type AssessmentScoring, type AssessmentScoringInput } from "./types";

/**
 * One-call scoring of a completed session (server-side only):
 *
 * 1. `estimateAbilities` with prior mean = `priorMean` ?? EXPERIENCE_PRIOR_MEAN[experience].
 * 2. `assignLevel` from the composite, skill scores (+ per-skill SE margins), experience and verified counts.
 * 3. `assessConfidence` with n = number of answered items, SE_g, speeding ratio, the model-based self-report gap
 *    (`computeSelfReportGap`, same prior/τ),
 *    near_boundary = a level range was reported, and unmeasured skills of at least average importance.
 *
 * Deterministic: identical inputs always yield an identical result tagged with SCORING_MODEL_VERSION.
 */
export function scoreAssessment(input: AssessmentScoringInput): AssessmentScoring {
  const priorMean = input.priorMean ?? EXPERIENCE_PRIOR_MEAN[input.experience];
  const ability = estimateAbilities({
    items: input.items,
    skills: input.skills,
    priorMean,
    priorSd: input.priorSd,
    tau: input.tau,
  });

  const assignment = assignLevel(
    {
      composite: ability.composite,
      compositeSe: ability.compositeSe,
      skillScores: skillScoreMap(ability.skills),
      skillScoreSes: skillScoreSeMap(ability.skills),
      experience: input.experience,
      verifiedScenarios: input.verifiedScenarios ?? 0,
      practicalActions: input.practicalActions ?? 0,
    },
    input.levels,
    input.config,
  );

  const speedingRatio = computeSpeedingRatio(input.items, input.speedingThresholdMs ?? DEFAULT_SPEEDING_THRESHOLD_MS);
  const selfReportGap = computeSelfReportGap(input.items, { priorMean, priorSd: input.priorSd, tau: input.tau });
  const confidence = assessConfidence({
    nItems: input.items.length,
    seG: ability.seG,
    speedingRatio,
    selfReportGap,
    nearBoundary: assignment.range !== null,
    unmeasuredImportantSkills: countUnmeasuredImportantSkills(ability.skills, input.skills),
  });

  return { scoringModelVersion: SCORING_MODEL_VERSION, ability, assignment, confidence, speedingRatio, selfReportGap };
}
