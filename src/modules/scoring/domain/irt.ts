import { clamp, nonNegative, unitInterval } from "./numeric";
import type { IrtItemParams, ScoredResponse } from "./types";

/** Logistic scaling constant: with D = 1.7 the logistic curve approximates the normal ogive. */
export const IRT_SCALING_D = 1.7;
/** Probabilities are clamped into [PROBABILITY_FLOOR, PROBABILITY_CEIL] so logs stay finite. */
export const PROBABILITY_FLOOR = 1e-6;
export const PROBABILITY_CEIL = 1 - 1e-6;
/** Guessing parameters are clamped into [0, MAX_GUESSING] so (1 − c) never vanishes. */
export const MAX_GUESSING = 0.99;

function guessingOf(item: IrtItemParams): number {
  return Number.isFinite(item.guessing) ? clamp(item.guessing, 0, MAX_GUESSING) : 0;
}

/**
 * 3PL item response function with a fixed lower asymptote:
 *
 *   P(θ) = c + (1 − c) / (1 + exp(−D·a·(θ − b))),   D = 1.7
 *
 * The result is clamped to [1e-6, 1 − 1e-6] so that ln P and ln(1 − P) are always finite.
 * P is monotonically non-decreasing in θ for a ≥ 0 and equals c + (1 − c)/2 at θ = b.
 */
export function probability(theta: number, item: IrtItemParams): number {
  const c = guessingOf(item);
  const z = -IRT_SCALING_D * item.discrimination * (theta - item.difficulty);
  const p = c + (1 - c) / (1 + Math.exp(z));
  return clamp(p, PROBABILITY_FLOOR, PROBABILITY_CEIL);
}

/**
 * Fisher information of a 3PL item at θ (Birnbaum):
 *
 *   I(θ) = (D·a)² · ((P − c)² / (1 − c)²) · ((1 − P) / P)
 *
 * For c = 0 this reduces to the 2PL information (D·a)²·P·(1 − P), maximal (= (D·a)²/4) at θ = b.
 * For c > 0 the maximum shifts slightly above b and is lower. Always ≥ 0.
 */
export function fisherInformation(theta: number, item: IrtItemParams): number {
  const c = guessingOf(item);
  const p = probability(theta, item);
  const da = IRT_SCALING_D * item.discrimination;
  const ratio = Math.max(0, p - c) / (1 - c);
  return da * da * ratio * ratio * ((1 - p) / p);
}

/**
 * Weighted fractional log-likelihood of one response:
 *
 *   ℓ(θ) = w · [x·ln P(θ) + (1 − x)·ln(1 − P(θ))]
 *
 * x ∈ [0, 1] is the (possibly partial) credit, w ≥ 0 the item weight (self_report 0.5). Credit is clamped
 * into [0, 1] and non-finite/negative weights count as 0, so a malformed item can never dominate.
 * For fixed θ, ℓ is linear in x, which makes the EAP estimate monotone in credit.
 */
export function logLikelihood(theta: number, response: ScoredResponse): number {
  const w = nonNegative(response.weight);
  if (w === 0) return 0;
  const x = unitInterval(response.credit);
  const p = probability(theta, response);
  return w * (x * Math.log(p) + (1 - x) * Math.log(1 - p));
}

/** Sum of `logLikelihood` over responses (independence given θ). */
export function totalLogLikelihood(theta: number, responses: readonly ScoredResponse[]): number {
  let sum = 0;
  for (const response of responses) sum += logLikelihood(theta, response);
  return sum;
}
