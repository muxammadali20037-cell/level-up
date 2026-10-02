import type { LevelDefinition, ProfessionConfig } from "@/modules/catalog/domain/types";
import {
  effectiveThreshold,
  isRequirementMet,
  levelGatesMet,
  meetsThreshold,
  missingRequirements,
} from "./requirements";
import type { LevelAssignment, LevelAssignmentInput, LevelEvaluation } from "./types";

/** Levels sorted by number ascending; duplicate numbers keep their first definition. */
export function sortLevels(levels: readonly LevelDefinition[]): LevelDefinition[] {
  const byNumber = new Map<number, LevelDefinition>();
  for (const level of levels) {
    if (!byNumber.has(level.number)) byNumber.set(level.number, level);
  }
  return [...byNumber.values()].sort((x, y) => x.number - y.number);
}

/** Highest index ≤ `upTo` satisfying `accept`, or 0 (the floor level) when none does. */
function highestIndex(
  levels: readonly LevelDefinition[],
  upTo: number,
  accept: (level: LevelDefinition) => boolean,
): number {
  for (let i = upTo; i >= 0; i--) {
    const level = levels[i];
    if (level && accept(level)) return i;
  }
  return 0;
}

interface Caps {
  /** Highest index allowed by the verification rule. */
  readonly verificationIdx: number;
  /** Highest index allowed by the experience cap. */
  readonly experienceIdx: number;
  readonly blocks: (level: LevelDefinition) => boolean;
}

/**
 * A requiresVerification level is never an ASSESSED level (brief §7, AC-F07-02), whatever the verified counts:
 * the VERIFIED level is computed separately by the verification module.
 */
function verificationBlocks(level: LevelDefinition): boolean {
  return level.requiresVerification;
}

function computeCaps(
  levels: readonly LevelDefinition[],
  uncappedIdx: number,
  input: LevelAssignmentInput,
  config: ProfessionConfig,
): Caps {
  const cap = config.experienceCaps[input.experience];
  const hasCap = cap !== undefined && Number.isFinite(cap);
  const experienceBlocks = (l: LevelDefinition): boolean => hasCap && l.number > (cap ?? Infinity);
  return {
    verificationIdx: highestIndex(levels, uncappedIdx, (l) => !verificationBlocks(l)),
    experienceIdx: highestIndex(levels, uncappedIdx, (l) => !experienceBlocks(l)),
    blocks: (l) => verificationBlocks(l) || experienceBlocks(l),
  };
}

/** Cap of the "close to the next level" margin, in score points (a quarter of a default 10-point band). */
export const RANGE_MARGIN_MAX = 2.5;

/** Margin of the next-level range: min(se / 2, 2.5) score points (0 for a missing or invalid se). */
export function rangeMargin(se: number | undefined): number {
  return se !== undefined && Number.isFinite(se) && se > 0 ? Math.min(se / 2, RANGE_MARGIN_MAX) : 0;
}

/** Composite and every unmet gating score requirement of `next` are within their margin; all other gates met. */
function closeToNext(next: LevelDefinition, input: LevelAssignmentInput): boolean {
  const margin = rangeMargin(input.compositeSe);
  if (!meetsThreshold(input.composite + margin, next.minComposite)) return false;
  return next.requirements.every((r) => {
    if (!r.gatesAssessed || isRequirementMet(r, input)) return true;
    const threshold = effectiveThreshold(r);
    if (r.type === "composite_min") return meetsThreshold(input.composite + margin, threshold);
    if (r.type === "skill_min" && r.skillId) {
      const score = input.skillScores[r.skillId];
      if (score === undefined) return false;
      return meetsThreshold(score + rangeMargin(input.skillScoreSes?.[r.skillId] ?? input.compositeSe), threshold);
    }
    return false;
  });
}

function computeRange(
  levels: readonly LevelDefinition[],
  idx: number,
  input: LevelAssignmentInput,
  caps: Caps,
): readonly [number, number] | null {
  const current = levels[idx];
  const next = levels[idx + 1];
  if (!current || !next || caps.blocks(next) || !closeToNext(next, input)) return null;
  return [current.number, next.number];
}

/**
 * Assigns the ASSESSED level from the composite, skill scores and context.
 *
 * - Levels are sorted by number; the lowest (normally Level 1) is always met.
 * - met(L) = composite ≥ minComposite(L) AND every gates_assessed requirement of every level ≤ L is met
 *   (the floor's own requirements never block). uncappedLevel = highest L with met(L).
 * - Caps: a requiresVerification level (default 8, 9) is never assessed, whatever `verifiedScenarios` is: the
 *   level is capped to the highest lower non-verification level (cappedBy "verification"). The VERIFIED level is
 *   separate (verification module). config.experienceCaps[experience] caps the level (cappedBy "experience").
 *   The stricter cap wins; on a tie "experience" is reported because it is the person-specific cap the UI must
 *   explain (AC-F07-03).
 * - Verified counts only feed explicit verified_scenario / practical_action requirements (gating or not) and the
 *   `missing` lists; they never lift the verification cap.
 * - range ("close to the next level", UI: "Level L, close to L+1"): [L, L+1] only when L+1 is attainable (not
 *   blocked by the verification or experience cap), composite ≥ minComposite(L+1) − margin with
 *   margin = min(compositeSe / 2, 2.5), and each unmet gating skill/composite requirement of L+1 is within its own
 *   margin (min(skill SE / 2, 2.5), skill SE defaulting to compositeSe) while all its other gating requirements
 *   are met. A lower-side range ([L−1, L]) is never reported. Otherwise null.
 * - evaluations: one per level with cumulative `met` and every unmet requirement (see `missingRequirements`).
 *
 * Calibration (07a-scoring-calibration.md): the old symmetric "within one compositeSe of a boundary" rule reported a
 * range for ~85–95% of results (compositeSe ≈ 6–9 points vs 10-point bands); the one-sided rule above reports it
 * for roughly the top quarter of each band.
 */
export function assignLevel(
  input: LevelAssignmentInput,
  levels: readonly LevelDefinition[],
  config: ProfessionConfig,
): LevelAssignment {
  const sorted = sortLevels(levels);
  if (sorted.length === 0) {
    return { level: 1, uncappedLevel: 1, cappedBy: null, range: null, evaluations: [] };
  }

  // The floor level is always met, so its own gates never block higher levels.
  let gatesOk = true;
  const evaluations: LevelEvaluation[] = sorted.map((level, i) => {
    if (i > 0) gatesOk = gatesOk && levelGatesMet(level, input);
    const met = i === 0 || (meetsThreshold(input.composite, level.minComposite) && gatesOk);
    return { number: level.number, met, missing: missingRequirements(level, input) };
  });

  let uncappedIdx = 0;
  evaluations.forEach((evaluation, i) => {
    if (evaluation.met) uncappedIdx = i;
  });

  const caps = computeCaps(sorted, uncappedIdx, input, config);
  const finalIdx = Math.min(uncappedIdx, caps.verificationIdx, caps.experienceIdx);
  const cappedBy =
    finalIdx === uncappedIdx ? null : caps.experienceIdx === finalIdx ? "experience" : "verification";

  const levelAt = (i: number): number => sorted[i]?.number ?? 1;
  return {
    level: levelAt(finalIdx),
    uncappedLevel: levelAt(uncappedIdx),
    cappedBy,
    range: computeRange(sorted, finalIdx, input, caps),
    evaluations,
  };
}
