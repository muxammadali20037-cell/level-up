import type { ScoringRule } from "./types";

/**
 * Fixed lower asymptote c of an item (scoring model "irt3pl-eap-hier-v1"), set when items are built (content seeder):
 *
 *   single_best, partial_credit → 1 / numOptions     (blind guessing floor; partial credit: see below)
 *   likert, open_ai             → 0                  (no "correct" option to guess)
 *
 * Partial-credit items (best 1 / acceptable 0.5 / poor 0) deliberately keep c = 1/n instead of the brief's c = 0:
 * a random pick still earns expected credit Σscore/n (0.375 for 1/0.5/0/0), and the calibration study
 * (docs/architecture/07a-scoring-calibration.md) showed c = 0 inflates low-ability composites by ~13 points at
 * θ = −2 (+5 overall bias, RMSE +30%), while 1/n stays unbiased across blind and attractive-distractor guessing.
 *
 * numOptions is floored and must be ≥ 2 for guessable rules; otherwise RangeError (items have 2–5 options).
 */
export function guessingFor(scoringRule: ScoringRule, numOptions: number): number {
  if (scoringRule === "likert" || scoringRule === "open_ai") return 0;
  const n = Math.floor(numOptions);
  if (!Number.isFinite(n) || n < 2) throw new RangeError(`A ${scoringRule} item needs ≥ 2 options, got ${numOptions}`);
  return 1 / n;
}
