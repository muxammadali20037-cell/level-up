/**
 * Seeded, reproducible randomness for the assessment engine. Never use Math.random() in domain code: every random
 * choice (randomesque item pick, option order) must be replayable from assessment_sessions.rng_seed.
 */

const TWO_POW_32 = 4294967296;
const GOLDEN_GAMMA_32 = 0x9e3779b9;

/** Independent random streams derived from one session seed (third argument of `deriveSeed`). */
export const RNG_STREAM = {
  /** Randomesque item selection (`selectNextQuestion`). */
  routing: 0,
  /** Option order of a served question (`toPublicQuestion`). */
  optionOrder: 1,
} as const;

/**
 * mulberry32 — tiny 32-bit PRNG with a full 2^32 period. Returns a generator of floats in [0, 1).
 * The seed is reduced modulo 2^32 (non-finite seeds count as 0). Same seed → same sequence, on every platform.
 */
export function mulberry32(seed: number): () => number {
  let state = toUint32(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / TWO_POW_32;
  };
}

/** Low 32 bits of the integer part of `value` (two's complement for negatives); non-finite → 0. */
function toUint32(value: number): number {
  return Number.isFinite(value) ? Math.trunc(value) >>> 0 : 0;
}

/** High 32 bits of a (up to 53-bit) integer, so 63-bit DB seeds above 2^32 still influence the mix. */
function highUint32(value: number): number {
  return Number.isFinite(value) ? Math.floor(Math.trunc(value) / TWO_POW_32) >>> 0 : 0;
}

/** murmur3 32-bit finalizer: an invertible avalanche mix (every input bit affects every output bit). */
function fmix32(input: number): number {
  let h = input >>> 0;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * Stable 32-bit seed for step `sequence` of a session (and an optional `stream`, see RNG_STREAM):
 *
 *   h = fmix32(lo(sessionSeed) ⊕ fmix32(hi(sessionSeed) + γ))
 *   h = fmix32(h + γ·(sequence + 1))
 *   h = fmix32(h ⊕ γ·(stream + 1))         γ = 0x9e3779b9 (golden ratio), all arithmetic mod 2^32
 *
 * Deterministic, platform-independent, and neighbouring sequences/streams give unrelated seeds.
 */
export function deriveSeed(sessionSeed: number, sequence: number, stream: number = RNG_STREAM.routing): number {
  let h = fmix32(toUint32(sessionSeed) ^ fmix32(highUint32(sessionSeed) + GOLDEN_GAMMA_32));
  h = fmix32(h + Math.imul(GOLDEN_GAMMA_32, toUint32(sequence) + 1));
  return fmix32(h ^ Math.imul(GOLDEN_GAMMA_32, toUint32(stream) + 1));
}

/**
 * Fisher–Yates shuffle driven by mulberry32(seed). Returns a new array; the input is never mutated.
 * Every permutation is reachable and the same (items, seed) always yields the same order.
 */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const result = items.slice();
  const next = mulberry32(seed);
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    const current = result[i] as T;
    result[i] = result[j] as T;
    result[j] = current;
  }
  return result;
}
