/** Small numeric helpers shared by the scoring engine. Pure and deterministic. */

/** Clamps `value` into [min, max]. NaN stays NaN (callers sanitize inputs first). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Rounds half-up to one decimal place (e.g. 57.45 → 57.5). */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Maps any number into [0, 1]; non-finite values become 0. */
export function unitInterval(value: number): number {
  return Number.isFinite(value) ? clamp(value, 0, 1) : 0;
}

/** Non-negative finite weight; anything else becomes 0. */
export function nonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}
