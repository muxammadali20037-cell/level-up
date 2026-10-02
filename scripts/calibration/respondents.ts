/** Simulated respondents: flat and uneven skill profiles with a plausible (noisy) experience answer. */
import { EXPERIENCE_PRIOR_MEAN, mulberry32 } from "@/modules/assessments/domain";
import { EXPERIENCE_BANDS, type ExperienceBand, type SkillEdge } from "@/modules/catalog/domain/types";
import { SKILLS } from "./bank";

export interface Respondent {
  readonly id: number;
  readonly kind: "flat" | "uneven";
  /** Flat: the common θ; uneven: the general level the profile was built around. */
  readonly thetaG: number;
  /** True θ_s per skill id. */
  readonly thetas: Readonly<Record<string, number>>;
  readonly strong: readonly string[];
  readonly weak: readonly string[];
  /** Designed bottleneck: a weak skill that `limits` a strong one (uneven only). */
  readonly bottleneck: string | null;
  readonly edges: readonly SkillEdge[];
  readonly experience: ExperienceBand;
}

export const FLAT_THETAS = [-2, -1, 0, 1, 2] as const;
export const UNEVEN_THETAS = [-1, 0, 1] as const;
/** Probability that the experience answer is one band off the plausible one. */
export const EXPERIENCE_NOISE = 0.15;
/** Limits edge strength of the designed bottleneck. */
export const LIMITS_STRENGTH = 0.8;

/** True composite θ: importance-weighted mean of the true skill abilities. */
export function trueCompositeTheta(thetas: Readonly<Record<string, number>>): number {
  return SKILLS.reduce((sum, s) => sum + s.importance * (thetas[s.id] ?? 0), 0);
}

/**
 * Plausible experience band: the band whose prior mean (EXPERIENCE_PRIOR_MEAN) is nearest the true composite θ;
 * with probability 15% the respondent reports an adjacent band instead (random direction, inward at the ends).
 */
export function experienceFor(theta: number, u: () => number): ExperienceBand {
  let best = 0;
  EXPERIENCE_BANDS.forEach((band, i) => {
    const current = EXPERIENCE_BANDS[best] as ExperienceBand;
    if (Math.abs(EXPERIENCE_PRIOR_MEAN[band] - theta) < Math.abs(EXPERIENCE_PRIOR_MEAN[current] - theta)) best = i;
  });
  if (u() < EXPERIENCE_NOISE) {
    const last = EXPERIENCE_BANDS.length - 1;
    const step = best === 0 ? 1 : best === last ? -1 : u() < 0.5 ? -1 : 1;
    best += step;
  }
  return EXPERIENCE_BANDS[best] ?? "1to3";
}

function shuffled<T>(items: readonly T[], u: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(u() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

/**
 * Builds the respondent population (deterministic for a seed):
 * - flat: every skill at θ ∈ {−2, −1, 0, 1, 2} (`perFlat` each);
 * - uneven: θ_g ∈ {−1, 0, 1} (`perUneven` each); 2 random skills at θ_g + U(1.2, 1.8) (strong), 2 at
 *   θ_g − U(1.2, 1.8) (weak), the rest θ_g + U(−0.3, 0.3); weak[0] `limits` strong[0] (strength 0.8).
 */
export function makeRespondents(seed: number, perFlat: number, perUneven: number): Respondent[] {
  const u = mulberry32(seed);
  const out: Respondent[] = [];
  const ids = SKILLS.map((s) => s.id);
  for (const theta of FLAT_THETAS) {
    for (let r = 0; r < perFlat; r++) {
      const thetas = Object.fromEntries(ids.map((id) => [id, theta]));
      out.push({
        id: out.length,
        kind: "flat",
        thetaG: theta,
        thetas,
        strong: [],
        weak: [],
        bottleneck: null,
        edges: [],
        experience: experienceFor(theta, u),
      });
    }
  }
  for (const thetaG of UNEVEN_THETAS) {
    for (let r = 0; r < perUneven; r++) {
      const [s1, s2, w1, w2] = shuffled(ids, u) as [string, string, string, string];
      const thetas: Record<string, number> = {};
      for (const id of ids) thetas[id] = thetaG + (u() - 0.5) * 0.6;
      for (const id of [s1, s2]) thetas[id] = thetaG + 1.2 + 0.6 * u();
      for (const id of [w1, w2]) thetas[id] = thetaG - 1.2 - 0.6 * u();
      out.push({
        id: out.length,
        kind: "uneven",
        thetaG,
        thetas,
        strong: [s1, s2],
        weak: [w1, w2],
        bottleneck: w1,
        edges: [{ from: w1, to: s1, relation: "limits", strength: LIMITS_STRENGTH }],
        experience: experienceFor(trueCompositeTheta(thetas), u),
      });
    }
  }
  return out;
}
