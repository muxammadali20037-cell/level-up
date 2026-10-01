import { totalLogLikelihood } from "./irt";
import type { EapResult, NormalPrior, ScoredResponse } from "./types";

export const THETA_MIN = -4;
export const THETA_MAX = 4;
export const THETA_STEP = 0.05;

/**
 * Builds an evenly spaced quadrature grid [min, min + step, …, max]. Points are computed as min + i·step and
 * rounded to 1e-9 so the default grid is exactly symmetric around 0 (161 points for [−4, 4] step 0.05).
 */
export function buildThetaGrid(min = THETA_MIN, max = THETA_MAX, step = THETA_STEP): readonly number[] {
  if (!(step > 0) || !Number.isFinite(min) || !Number.isFinite(max) || max < min) {
    throw new RangeError(`Invalid theta grid: [${min}, ${max}] step ${step}`);
  }
  const count = Math.round((max - min) / step) + 1;
  return Object.freeze(Array.from({ length: count }, (_, i) => Math.round((min + i * step) * 1e9) / 1e9));
}

/** Default grid θ ∈ [−4, 4] step 0.05. */
export const THETA_GRID: readonly number[] = buildThetaGrid();

function assertPrior(prior: NormalPrior): void {
  if (!Number.isFinite(prior.mean) || !Number.isFinite(prior.sd) || prior.sd <= 0) {
    throw new RangeError(`Invalid normal prior: mean ${prior.mean}, sd ${prior.sd}`);
  }
}

/**
 * Unnormalized log posterior on the grid:
 *
 *   log π(θ_k | data) = −½·((θ_k − μ)/σ)² + Σ_i ℓ_i(θ_k)   (+ constant)
 */
export function logPosterior(
  responses: readonly ScoredResponse[],
  prior: NormalPrior,
  grid: readonly number[] = THETA_GRID,
): number[] {
  assertPrior(prior);
  return grid.map((theta) => {
    const z = (theta - prior.mean) / prior.sd;
    return -0.5 * z * z + totalLogLikelihood(theta, responses);
  });
}

/**
 * Normalized posterior weights on the grid (sum to 1), computed with log-sum-exp:
 * w_k = exp(L_k − max L) / Σ_j exp(L_j − max L). Never overflows or underflows to all-zero.
 */
export function posteriorWeights(
  responses: readonly ScoredResponse[],
  prior: NormalPrior,
  grid: readonly number[] = THETA_GRID,
): number[] {
  if (grid.length === 0) throw new RangeError("Empty theta grid");
  const logs = logPosterior(responses, prior, grid);
  let max = -Infinity;
  for (const value of logs) if (value > max) max = value;
  const unnormalized = logs.map((value) => Math.exp(value - max));
  let total = 0;
  for (const value of unnormalized) total += value;
  return unnormalized.map((value) => value / total);
}

/**
 * Expected-a-posteriori (EAP) estimate of θ with a normal prior, by quadrature on `grid`:
 *
 *   θ̂ = Σ_k θ_k·w_k,   SE = sqrt(Σ_k (θ_k − θ̂)²·w_k)
 *
 * With no responses the result is the prior (discretized and truncated to the grid), e.g. ≈ N(0, 1) → {0, 1}.
 * More information (items) shrinks SE; higher credit moves θ̂ up. The estimate is bounded by the grid range.
 */
export function eapEstimate(
  responses: readonly ScoredResponse[],
  prior: NormalPrior,
  grid: readonly number[] = THETA_GRID,
): EapResult {
  const weights = posteriorWeights(responses, prior, grid);
  let mean = 0;
  grid.forEach((theta, k) => {
    mean += theta * (weights[k] ?? 0);
  });
  let variance = 0;
  grid.forEach((theta, k) => {
    const d = theta - mean;
    variance += d * d * (weights[k] ?? 0);
  });
  return { theta: mean, se: Math.sqrt(Math.max(0, variance)) };
}
