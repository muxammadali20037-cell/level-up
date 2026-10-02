import type { ProfessionConfig } from "@/modules/catalog/domain/types";
import { estimateAbilities, type AbilityEstimate } from "@/modules/scoring/domain";
import { deriveSeed, RNG_STREAM } from "./rng";
import {
  buildSessionPool,
  candidatesForSkill,
  coreSkillIds,
  isScenarioLike,
  normalizeRoutingConfig,
  type ItemConstraints,
  type SessionPool,
} from "./routing-pool";
import { coverageCandidates, pickRandomesque, precisionCandidates } from "./routing-rank";
import type { Question, RoutingDecision, RoutingInput, RoutingPhase, RoutingStopReason } from "./types";

/** The test runs past targetQuestions (up to maxQuestions) only while SE_g > targetSe + this margin. */
export const EXTENSION_SE_MARGIN = 0.1;

/**
 * Progress denominator while serving item n + 1: targetQuestions normally; once the session extends past the
 * target it becomes n + 1 (so the bar never shows n > D and never moves backwards). Clamped to maxQuestions.
 */
export function plannedTotalFor(answeredCount: number, config: ProfessionConfig): number {
  const normalized = normalizeRoutingConfig(config);
  return Math.min(normalized.maxQuestions, Math.max(normalized.targetQuestions, answeredCount + 1));
}

interface StepContext {
  readonly input: RoutingInput;
  readonly config: ProfessionConfig;
  readonly n: number;
  readonly pool: SessionPool;
  readonly estimate: AbilityEstimate;
}

/** True when precision allows stopping now (ignoring coverage and the scenario quota). */
function precisionAllowsStop({ config, n, estimate }: StepContext): boolean {
  if (n >= config.minQuestions && estimate.seG <= config.targetSe) return true;
  return n >= config.targetQuestions && estimate.seG <= config.targetSe + EXTENSION_SE_MARGIN;
}

function serve(ctx: StepContext, ranked: readonly Question[], phase: RoutingPhase): RoutingDecision | null {
  const seed = deriveSeed(ctx.input.rngSeed, ctx.n, RNG_STREAM.routing);
  const question = pickRandomesque(ranked, seed);
  if (!question) return null;
  return {
    kind: "question",
    question,
    phase,
    plannedTotal: plannedTotalFor(ctx.n, ctx.config),
    thetaG: ctx.estimate.thetaG,
    seG: ctx.estimate.seG,
  };
}

function stop(ctx: StepContext, reason: RoutingStopReason): RoutingDecision {
  return { kind: "stop", reason, plannedTotal: ctx.n, thetaG: ctx.estimate.thetaG, seG: ctx.estimate.seG };
}

/**
 * Chooses the next item of an adaptive session, or decides to stop (brief §6). Pure and deterministic:
 * the same input always yields the same decision.
 *
 * Estimate: θ_g, SE_g and θ_s, SD_s from `estimateAbilities` (or the injected `input.estimator`) over the answered
 * items (n = answered.length).
 * Pool: see `buildSessionPool` (specialization filter, never repeat an id/key, no open items, avoid recently
 * seen keys while ≥ maxQuestions − n fresh items remain).
 *
 * Stop rules, in order:
 * 1. n ≥ maxQuestions → max_items.
 * 2. empty pool → bank_exhausted.
 * 3. coverage done AND scenario quota met (or unreachable) AND
 *    (n ≥ minQuestions AND SE_g ≤ targetSe  OR  n ≥ targetQuestions AND SE_g ≤ targetSe + 0.1) → precision_reached.
 *    Coverage is done when every core skill was served or has no candidate left under the self_report cap.
 *
 * Selection:
 * - Coverage phase (an uncovered core skill remains): next uncovered core skill by importance, its items ranked by
 *   |b − θ_g|. Precision phase: skill maximizing importance × SD_s, items ranked by Fisher information at θ_s.
 *   A skill without a candidate under the constraints falls back to the next skill.
 * - Constraints: no self_report item once maxSelfReportItems were served. Scenario-like minimum: while
 *   needed = minScenarioLikeItems − served scenario-like > 0, only judgment/scenario/decision items are allowed when
 *   targetQuestions − n ≤ needed, or when the quota is the only thing preventing a stop.
 * - Randomesque: uniform pick among the top 3 ranked candidates with mulberry32(deriveSeed(rngSeed, n)).
 * - If only self_report items beyond the cap remain → bank_exhausted.
 */
export function selectNextQuestion(input: RoutingInput): RoutingDecision {
  const config = normalizeRoutingConfig(input.config);
  const n = input.answered.length;
  const pool = buildSessionPool(input, config);
  const estimate = (input.estimator ?? estimateAbilities)({
    items: input.answered,
    skills: input.skills,
    priorMean: input.priorMean,
  });
  const ctx: StepContext = { input, config, n, pool, estimate };

  if (n >= config.maxQuestions) return stop(ctx, "max_items");
  if (pool.pool.length === 0) return stop(ctx, "bank_exhausted");

  const allowSelfReport = pool.selfReportCount < config.maxSelfReportItems;
  const hardOnly: ItemConstraints = { allowSelfReport, scenarioOnly: false };
  const uncoveredCore = coreSkillIds(input.skills, pool.sessionBank, config).filter(
    (skillId) =>
      !pool.coveredSkillIds.has(skillId) && candidatesForSkill(pool.pool, skillId, hardOnly).length > 0,
  );
  const coverageDone = uncoveredCore.length === 0;

  const scenarioNeeded = Math.max(0, config.minScenarioLikeItems - pool.scenarioLikeCount);
  const quotaPending = scenarioNeeded > 0 && pool.pool.some((question) => isScenarioLike(question.type));
  const canStop = precisionAllowsStop(ctx);
  if (coverageDone && !quotaPending && canStop) return stop(ctx, "precision_reached");

  const scenarioOnly =
    quotaPending && (config.targetQuestions - n <= scenarioNeeded || (coverageDone && canStop));
  const constraints: ItemConstraints = { allowSelfReport, scenarioOnly };

  if (!coverageDone) {
    const decision = serve(ctx, coverageCandidates(uncoveredCore, pool.pool, constraints, estimate.thetaG), "coverage");
    if (decision) return decision;
  }
  const precision = serve(ctx, precisionCandidates(input.skills, estimate, pool.pool, constraints), "precision");
  if (precision) return precision;
  if (scenarioOnly) {
    const relaxed = serve(ctx, precisionCandidates(input.skills, estimate, pool.pool, hardOnly), "precision");
    if (relaxed) return relaxed;
  }
  return stop(ctx, "bank_exhausted");
}
