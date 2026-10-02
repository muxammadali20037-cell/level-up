/** Per-session evaluation: what the product would report vs what a perfect measurement would report. */
import { DEFAULT_PROFESSION_CONFIG, type LevelDefinition } from "@/modules/catalog/domain/types";
import { bandSkills, findBottleneck, nextLevelSkillThresholds, pickStrongest } from "@/modules/results/domain";
import {
  assessConfidence,
  assignLevel,
  computeSelfReportGap,
  countUnmeasuredImportantSkills,
  HIGH_CONFIDENCE,
  skillScoreMap,
  skillScoreSeMap,
  type ConfidenceLevel,
  type LevelAssignment,
  type SkillEstimate,
} from "@/modules/scoring/domain";
import { levels, SKILLS } from "./bank";
import type { Respondent } from "./respondents";
import type { SessionResult } from "./session";

export interface SessionMetrics {
  readonly respondent: Respondent;
  readonly n: number;
  readonly trueComposite: number;
  readonly composite: number;
  readonly compositeSe: number;
  readonly seG: number;
  readonly trueLevel: number;
  readonly level: number;
  readonly range: boolean;
  readonly oldRange: boolean;
  readonly confidence: ConfidenceLevel;
  readonly highPrecision: boolean;
  /** Uneven only (null for flat). */
  readonly spearman: number | null;
  readonly gapTrue: number | null;
  readonly gapEstimated: number | null;
  readonly oracleBottleneck: string | null;
  readonly bottleneck: string | null;
  readonly strongestHit: boolean | null;
  /** Flat only: SD of the estimated scores of measured skills (spurious unevenness). */
  readonly spuriousSpread: number | null;
  /** Mean squared error of the 10 skill scores vs the true skill scores (score points²). */
  readonly skillSquaredError: number;
  /** Uneven only: share of the 4 designed strong/weak skills that received at least one item. */
  readonly designedMeasured: number | null;
}

const LEVELS: readonly LevelDefinition[] = levels();
const IMPORTANCE = Object.fromEntries(SKILLS.map((s) => [s.id, s.importance]));
const exactScore = (theta: number): number => Math.min(100, Math.max(0, ((theta + 3.5) / 7) * 100));
const mean = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);

function ranks(values: readonly number[]): number[] {
  const order = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const out = new Array<number>(values.length).fill(0);
  for (let k = 0; k < order.length; ) {
    let end = k;
    while (end + 1 < order.length && order[end + 1]?.v === order[k]?.v) end++;
    for (let m = k; m <= end; m++) out[order[m]?.i ?? 0] = (k + end) / 2;
    k = end + 1;
  }
  return out;
}

/** Spearman rank correlation (average ranks for ties); 0 when either side is constant. */
export function spearman(x: readonly number[], y: readonly number[]): number {
  const rx = ranks(x);
  const ry = ranks(y);
  const mx = mean(rx);
  const my = mean(ry);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  rx.forEach((v, i) => {
    const dy = (ry[i] ?? 0) - my;
    sxy += (v - mx) * dy;
    sxx += (v - mx) ** 2;
    syy += dy * dy;
  });
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
}

/** Pre-change rule: range when the next (unblocked) or the current boundary is within one compositeSe. */
function oldRange(assignment: LevelAssignment, composite: number, se: number, cap: number | undefined): boolean {
  const idx = assignment.level - 1;
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const blocked = !next || next.requiresVerification || (cap !== undefined && next.number > cap);
  if (!blocked && next && next.minComposite - composite <= se) return true;
  return idx > 0 && current !== undefined && composite - current.minComposite < se;
}

function bottleneckOf(skills: readonly SkillEstimate[], level: number, respondent: Respondent) {
  const thresholds = nextLevelSkillThresholds(LEVELS, level);
  const banded = bandSkills(skills, thresholds);
  const bottleneck = findBottleneck({
    skills: SKILLS,
    scores: skillScoreMap(skills),
    measured: Object.fromEntries(skills.map((s) => [s.skillId, s.measured])),
    edges: respondent.edges,
    nextLevelThresholds: thresholds,
    weakSkillIds: banded.filter((s) => s.band === "weak").map((s) => s.skillId),
  });
  const strongest = pickStrongest(banded, IMPORTANCE, 1, bottleneck ? [bottleneck.skillId] : [])[0] ?? null;
  return { bottleneck: bottleneck?.skillId ?? null, strongest };
}

export function evaluate(respondent: Respondent, session: SessionResult, tau: number): SessionMetrics {
  const { estimate, answered } = session;
  const config = DEFAULT_PROFESSION_CONFIG;
  const ids = SKILLS.map((s) => s.id);
  const trueThetas = ids.map((id) => respondent.thetas[id] ?? 0);
  const trueSkills: SkillEstimate[] = ids.map((skillId, i) => {
    const score = Math.round(exactScore(trueThetas[i] ?? 0));
    return { skillId, theta: trueThetas[i] ?? 0, se: 0, score, nItems: 1, measured: true };
  });
  const trueComposite = SKILLS.reduce((sum, s, i) => sum + s.importance * exactScore(trueThetas[i] ?? 0), 0);
  const base = { experience: respondent.experience, verifiedScenarios: 0, practicalActions: 0 };
  const truth = assignLevel(
    { ...base, composite: trueComposite, compositeSe: 0, skillScores: skillScoreMap(trueSkills) },
    LEVELS,
    config,
  );
  const assignment = assignLevel(
    {
      ...base,
      composite: estimate.composite,
      compositeSe: estimate.compositeSe,
      skillScores: skillScoreMap(estimate.skills),
      skillScoreSes: skillScoreSeMap(estimate.skills),
    },
    LEVELS,
    config,
  );
  const confidence = assessConfidence({
    nItems: answered.length,
    seG: estimate.seG,
    speedingRatio: 0,
    selfReportGap: computeSelfReportGap(answered, { priorMean: session.priorMean, tau }),
    nearBoundary: assignment.range !== null,
    unmeasuredImportantSkills: countUnmeasuredImportantSkills(estimate.skills, SKILLS),
  });
  const uneven = respondent.kind === "uneven";
  const scoreOf = (id: string): number => estimate.skills.find((s) => s.skillId === id)?.score ?? 0;
  const gap = (score: (id: string) => number): number =>
    mean(respondent.strong.map(score)) - mean(respondent.weak.map(score));
  const measuredScores = estimate.skills.filter((s) => s.measured).map((s) => s.score);
  const spread = Math.sqrt(mean(measuredScores.map((s) => (s - mean(measuredScores)) ** 2)));
  const estimated = uneven ? bottleneckOf(estimate.skills, assignment.level, respondent) : null;
  const oracle = uneven ? bottleneckOf(trueSkills, truth.level, respondent) : null;
  return {
    respondent,
    n: answered.length,
    trueComposite,
    composite: estimate.composite,
    compositeSe: estimate.compositeSe,
    seG: estimate.seG,
    trueLevel: truth.level,
    level: assignment.level,
    range: assignment.range !== null,
    oldRange: oldRange(assignment, estimate.composite, estimate.compositeSe, config.experienceCaps[respondent.experience]),
    confidence: confidence.level,
    highPrecision: answered.length >= HIGH_CONFIDENCE.minItems && estimate.seG <= HIGH_CONFIDENCE.maxSe,
    spearman: uneven ? spearman(trueThetas, ids.map(scoreOf)) : null,
    gapTrue: uneven ? gap((id) => exactScore(respondent.thetas[id] ?? 0)) : null,
    gapEstimated: uneven ? gap(scoreOf) : null,
    oracleBottleneck: oracle?.bottleneck ?? null,
    bottleneck: estimated?.bottleneck ?? null,
    strongestHit: estimated ? respondent.strong.includes(estimated.strongest ?? "") : null,
    spuriousSpread: uneven ? null : spread,
    skillSquaredError: mean(ids.map((id) => (scoreOf(id) - exactScore(respondent.thetas[id] ?? 0)) ** 2)),
    designedMeasured: uneven
      ? mean([...respondent.strong, ...respondent.weak].map((id) => Number(answered.some((a) => a.skillId === id))))
      : null,
  };
}
