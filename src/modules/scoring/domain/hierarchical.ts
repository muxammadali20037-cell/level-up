import { THETA_GRID } from "./eap";
import { totalLogLikelihood } from "./irt";
import type { EapResult, NormalPrior, ScoredResponse } from "./types";

/** Smallest marginal likelihood used inside a logarithm (keeps log finite when a skill's data is far away). */
const MIN_MASS = 1e-300;

export interface HierarchicalInput {
  /** Responses grouped by skill id. Every group informs θ_g; skills without a group are unmeasured. */
  readonly groups: ReadonlyMap<string, readonly ScoredResponse[]>;
  /** Prior of the general ability θ_g. */
  readonly prior: NormalPrior;
  /** SD of a skill ability around θ_g: θ_s | θ_g ~ N(θ_g, τ²). */
  readonly tau: number;
  /** Composite weights by skill id (normalized, sum 1). Skills listed here get a posterior even without data. */
  readonly weights: ReadonlyMap<string, number>;
  readonly grid?: readonly number[];
}

export interface HierarchicalPosterior {
  /** Posterior mean / SD of θ_g. */
  readonly general: EapResult;
  /** Posterior mean / SD of every θ_s (weighted skills and every group). */
  readonly skills: ReadonlyMap<string, EapResult>;
  /** Posterior mean / SD of the composite ability θ_c = Σ_s w_s·θ_s. */
  readonly composite: EapResult;
}

interface Kernel {
  /** rows[j][k] = P(θ_s = θ_k | θ_g = θ_j): N(θ_j, τ²) discretized on the grid, each row normalized. */
  readonly rows: readonly Float64Array[];
  /** Σ_k θ_k·rows[j][k] and Σ_k θ_k²·rows[j][k] (moments of an unmeasured skill given θ_g = θ_j). */
  readonly mean: Float64Array;
  readonly second: Float64Array;
}

const kernelCache = new Map<string, Kernel>();

function kernelFor(grid: readonly number[], tau: number): Kernel {
  const cacheKey = `${tau}|${grid.length}|${grid[0]}|${grid[grid.length - 1]}`;
  const cached = kernelCache.get(cacheKey);
  if (cached) return cached;
  const n = grid.length;
  const mean = new Float64Array(n);
  const second = new Float64Array(n);
  const rows = grid.map((center, j) => {
    const row = new Float64Array(n);
    let total = 0;
    for (let k = 0; k < n; k++) {
      const z = ((grid[k] ?? 0) - center) / tau;
      row[k] = Math.exp(-0.5 * z * z);
      total += row[k] ?? 0;
    }
    for (let k = 0; k < n; k++) {
      const value = (row[k] ?? 0) / total;
      const theta = grid[k] ?? 0;
      row[k] = value;
      mean[j] = (mean[j] ?? 0) + theta * value;
      second[j] = (second[j] ?? 0) + theta * theta * value;
    }
    return row;
  });
  const kernel: Kernel = { rows, mean, second };
  if (kernelCache.size > 32) kernelCache.clear();
  kernelCache.set(cacheKey, kernel);
  return kernel;
}

/** Conditional moments of one measured skill given each θ_g grid point: log marginal likelihood, E[θ_s], E[θ_s²]. */
interface Conditional {
  readonly logMass: Float64Array;
  readonly mean: Float64Array;
  readonly second: Float64Array;
}

function conditional(responses: readonly ScoredResponse[], grid: readonly number[], kernel: Kernel): Conditional {
  const n = grid.length;
  const logs = grid.map((theta) => totalLogLikelihood(theta, responses));
  let max = -Infinity;
  for (const value of logs) if (value > max) max = value;
  const likelihood = logs.map((value) => Math.exp(value - max));
  const logMass = new Float64Array(n);
  const mean = new Float64Array(n);
  const second = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    const row = kernel.rows[j] as Float64Array;
    let mass = 0;
    let m1 = 0;
    let m2 = 0;
    for (let k = 0; k < n; k++) {
      const value = (row[k] ?? 0) * (likelihood[k] ?? 0);
      const theta = grid[k] ?? 0;
      mass += value;
      m1 += theta * value;
      m2 += theta * theta * value;
    }
    const safe = Math.max(mass, MIN_MASS);
    logMass[j] = Math.log(safe) + max;
    mean[j] = mass > 0 ? m1 / mass : (kernel.mean[j] ?? 0);
    second[j] = mass > 0 ? m2 / mass : (kernel.second[j] ?? 0);
  }
  return { logMass, mean, second };
}

function moments(weights: Float64Array, first: ArrayLike<number>, second: ArrayLike<number>): EapResult {
  let m1 = 0;
  let m2 = 0;
  for (let j = 0; j < weights.length; j++) {
    m1 += (weights[j] ?? 0) * (first[j] ?? 0);
    m2 += (weights[j] ?? 0) * (second[j] ?? 0);
  }
  return { theta: m1, se: Math.sqrt(Math.max(0, m2 - m1 * m1)) };
}

/**
 * Exact posterior of the two-level model (scoring model "irt3pl-eap-hier-v1"), by quadrature on the θ grid:
 *
 *   θ_g ~ N(μ0, σ0²),   θ_s | θ_g ~ N(θ_g, τ²),   x_i | θ_s(i) ~ weighted fractional 3PL likelihood
 *
 * 1. For each skill s with data: L_s(θ) = Π_i likelihood_i(θ) on the grid; the marginal likelihood of θ_g is
 *    M_s(θ_g) = Σ_k N(θ_k; θ_g, τ²)·L_s(θ_k) (row-normalized kernel), with the conditional moments
 *    E[θ_s | θ_g, data_s] and E[θ_s² | θ_g, data_s].
 * 2. p(θ_g | data) ∝ N(θ_g; μ0, σ0²)·Π_s M_s(θ_g) — each skill informs θ_g only through its own marginal, so an
 *    uneven profile (strong and weak skills) no longer drags θ_g the way a single unidimensional fit does.
 * 3. θ_s posterior = mixture over θ_g of the conditionals (θ_g uncertainty included). A skill without data has
 *    E[θ_s | θ_g] = θ_g, so its posterior is ≈ N(E θ_g, Var θ_g + τ²).
 * 4. Composite θ_c = Σ w_s θ_s: skills are conditionally independent given θ_g, so
 *    Var θ_c = E_g[Σ w_s²·Var(θ_s | θ_g)] + Var_g(Σ w_s·E[θ_s | θ_g]).
 *
 * Pure and deterministic. Throws RangeError for an invalid prior or τ.
 */
export function hierarchicalPosterior(input: HierarchicalInput): HierarchicalPosterior {
  const grid = input.grid ?? THETA_GRID;
  const { prior, tau } = input;
  if (!Number.isFinite(prior.mean) || !(Number.isFinite(prior.sd) && prior.sd > 0)) {
    throw new RangeError(`Invalid normal prior: mean ${prior.mean}, sd ${prior.sd}`);
  }
  if (!(Number.isFinite(tau) && tau > 0)) throw new RangeError(`Invalid tau: ${tau}`);
  const kernel = kernelFor(grid, tau);
  const n = grid.length;

  const conditionals = new Map<string, Conditional>();
  for (const [skillId, responses] of input.groups) {
    if (responses.length > 0) conditionals.set(skillId, conditional(responses, grid, kernel));
  }

  const logPost = new Float64Array(n);
  let max = -Infinity;
  for (let j = 0; j < n; j++) {
    const z = ((grid[j] ?? 0) - prior.mean) / prior.sd;
    let value = -0.5 * z * z;
    for (const c of conditionals.values()) value += c.logMass[j] ?? 0;
    logPost[j] = value;
    if (value > max) max = value;
  }
  const post = new Float64Array(n);
  let total = 0;
  for (let j = 0; j < n; j++) {
    post[j] = Math.exp((logPost[j] ?? 0) - max);
    total += post[j] ?? 0;
  }
  for (let j = 0; j < n; j++) post[j] = (post[j] ?? 0) / total;

  const general = moments(post, grid, grid.map((theta) => theta * theta));
  const skills = new Map<string, EapResult>();
  const compositeMean = new Float64Array(n);
  const compositeVar = new Float64Array(n);
  const ids = new Set([...input.weights.keys(), ...conditionals.keys()]);
  for (const skillId of ids) {
    const c = conditionals.get(skillId);
    const mean = c?.mean ?? kernel.mean;
    const second = c?.second ?? kernel.second;
    skills.set(skillId, moments(post, mean, second));
    const w = input.weights.get(skillId) ?? 0;
    if (w === 0) continue;
    for (let j = 0; j < n; j++) {
      const m = mean[j] ?? 0;
      compositeMean[j] = (compositeMean[j] ?? 0) + w * m;
      compositeVar[j] = (compositeVar[j] ?? 0) + w * w * Math.max(0, (second[j] ?? 0) - m * m);
    }
  }
  const compositeSecond = compositeMean.map((m, j) => (compositeVar[j] ?? 0) + m * m);
  return { general, skills, composite: moments(post, compositeMean, compositeSecond) };
}
