/** Public API of the pure scoring engine (scoring model "irt3pl-eap-hier-v1"). */
export * from "./types";
export {
  IRT_SCALING_D,
  MAX_GUESSING,
  PROBABILITY_CEIL,
  PROBABILITY_FLOOR,
  fisherInformation,
  logLikelihood,
  probability,
  totalLogLikelihood,
} from "./irt";
export {
  THETA_GRID,
  THETA_MAX,
  THETA_MIN,
  THETA_STEP,
  buildThetaGrid,
  eapEstimate,
  logPosterior,
  posteriorWeights,
} from "./eap";
export {
  DEFAULT_PRIOR_SD,
  DEFAULT_TAU,
  SCORE_THETA_OFFSET,
  SCORE_THETA_SPAN,
  compositeFromSkillScores,
  estimateAbilities,
  normalizeImportances,
  scoreFromTheta,
  scoreSeFromThetaSe,
  skillScoreMap,
  skillScoreSeMap,
  thetaFromScore,
} from "./estimate";
export {
  EXPERIENCE_MIN_YEARS,
  THRESHOLD_EPSILON,
  effectiveThreshold,
  isRequirementMet,
  levelGatesMet,
  meetsThreshold,
  missingRequirements,
  requirementCurrentValue,
} from "./requirements";
export { assignLevel, sortLevels } from "./levels";
export {
  DEFAULT_SPEEDING_THRESHOLD_MS,
  HIGH_CONFIDENCE,
  MAX_SELF_REPORT_GAP,
  MAX_SPEEDING_RATIO,
  MEDIUM_CONFIDENCE,
  assessConfidence,
  computeSpeedingRatio,
  countUnmeasuredImportantSkills,
} from "./confidence";
export {
  computeSelfReportGap,
  type SelfReportGapItem,
  type SelfReportGapOptions,
} from "./self-report";
export { scoreAssessment } from "./pipeline";
export { clamp, round1 } from "./numeric";
