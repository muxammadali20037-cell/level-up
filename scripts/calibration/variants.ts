/**
 * Variant registry. Named study variants (V0–V5) plus a small grammar for the search:
 *   EB:<tau>:<guess>[:<priorSd>]             plug-in empirical Bayes (current engine structure)
 *   IND:<tau>:<guess>[:<priorSd>]            independent skills → importance-weighted θ_g (V4 structure)
 *   J:<tau>:<guess>:<g|c|u>[:<priorSd>]      joint hierarchical posterior; SE_g = SD of θ_g (g), of θ_c (c), or the
 *                                            unidimensional EAP SE over all items (u, the V0 definition)
 *   PROD                                     the shipped engine (`estimateAbilities`, DEFAULT_TAU, `guessingFor`)
 * guess: u = 1/n for single_best + partial_credit (`guessingFor`), s = 1/n for single_best only (c = 0 for
 * partial_credit), e = expected random credit (Σ option scores / n).
 */
import { DEFAULT_TAU, estimateAbilities } from "@/modules/scoring/domain";
import type { GuessingPolicy } from "./bank";
import {
  empiricalBayes,
  expectedCreditGuessing,
  independentMean,
  joint,
  singleBestGuessing,
  uniformGuessing,
  type ScoringModel,
} from "./models";

const GUESSING: Readonly<Record<string, GuessingPolicy>> = {
  u: uniformGuessing,
  s: singleBestGuessing,
  e: expectedCreditGuessing,
};

const GUESS_LABEL: Readonly<Record<string, string>> = {
  u: "c=1/n single_best+partial",
  s: "c=1/n single_best only",
  e: "c=expected random credit",
};

/** Named variants of the study (V5 is the chosen combination, see docs/architecture/07a-scoring-calibration.md). */
export const NAMED: Readonly<Record<string, string>> = {
  V0: "EB:0.8:u",
  V1: "EB:1.0:u",
  V2: "EB:1.2:u",
  V3: "EB:1.0:s",
  V4: "IND:1.0:u",
  V5: "J:1.5:u:u",
  PROD: "PROD",
};

export function parseVariant(name: string): ScoringModel {
  const spec = NAMED[name] ?? name;
  if (spec === "PROD") {
    const description = `shipped estimateAbilities (joint, τ=${DEFAULT_TAU}, guessingFor)`;
    return { id: name, description, tau: DEFAULT_TAU, guessing: uniformGuessing, estimate: estimateAbilities };
  }
  const [kind, tauText, guess = "u", ...rest] = spec.split(":");
  const tau = Number(tauText);
  const guessing = GUESSING[guess];
  if (!guessing || !(tau > 0)) throw new Error(`Bad variant: ${name}`);
  const label = `${spec} (τ=${tau}, ${GUESS_LABEL[guess]})`;
  if (kind === "EB" || kind === "IND") {
    const priorSd = rest[0] ? Number(rest[0]) : 1;
    const estimate = kind === "EB" ? empiricalBayes(tau, priorSd) : independentMean(tau, priorSd);
    return { id: name, description: `${kind === "EB" ? "plug-in EB" : "independent mean"} ${label}`, tau, guessing, estimate };
  }
  if (kind === "J") {
    const se = rest[0] === "c" ? "composite" : rest[0] === "u" ? "unidim" : "general";
    const priorSd = rest[1] ? Number(rest[1]) : 1;
    return { id: name, description: `joint, SE_g=${se} ${label}`, tau, guessing, estimate: joint(tau, se, priorSd) };
  }
  throw new Error(`Bad variant: ${name}`);
}
