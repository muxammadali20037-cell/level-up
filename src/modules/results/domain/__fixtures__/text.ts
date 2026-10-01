import type { I18nText } from "@/lib/i18n/text";

/** Test-only localized text: the English string tagged per locale (fixtures are not product copy). */
export function tx(en: string): I18nText {
  return { uz: `[uz] ${en}`, ru: `[ru] ${en}`, en };
}

/** Deterministic PRNG (mulberry32) for simulations — never Math.random() in tests either. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer in [min, max] from a PRNG. */
export function randomInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}
