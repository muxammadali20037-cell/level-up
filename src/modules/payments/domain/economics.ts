/**
 * Per-payment unit economics in integer minor units of the payment currency.
 *
 * Rounding: the percentage fee is computed exactly with integer arithmetic (the percent is first converted to
 * thousandths of a percent, matching `payment_provider_configs.fee_percent numeric(6,3)`) and rounded HALF UP
 * (away from zero for the non-negative inputs allowed here) to a whole minor unit. The fixed fee is added after
 * rounding. Every other cost is already an integer. `net` may be negative (a loss-making payment).
 */

export interface ContributionInput {
  /** Gross charged amount, minor units. */
  readonly gross: number;
  /** Provider percentage fee, e.g. 1.5 for 1.5 %. At most 3 decimals (numeric(6,3)). */
  readonly providerFeePercent: number;
  readonly providerFeeFixedMinor: number;
  readonly aiCostMinor: number;
  readonly infraCostMinor: number;
  readonly referralRewardCostMinor: number;
}

export interface Contribution {
  readonly gross: number;
  readonly providerFee: number;
  readonly ai: number;
  readonly infra: number;
  readonly referral: number;
  readonly net: number;
}

function assertNonNegativeInt(name: string, value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer, got ${value}`);
}

/** Percent (≤ 3 decimals) → integer thousandths of a percent; 1.5 → 1500. */
export function percentToMilli(percent: number): number {
  if (!Number.isFinite(percent) || percent < 0 || percent >= 100) {
    throw new Error(`providerFeePercent must be in [0, 100), got ${percent}`);
  }
  const milli = Math.round(percent * 1000);
  if (Math.abs(milli - percent * 1000) > 1e-6) throw new Error(`providerFeePercent has more than 3 decimals: ${percent}`);
  return milli;
}

/** round_half_up(gross × percent / 100) using integers only: gross × milli / 100_000. */
export function percentFeeMinor(gross: number, percent: number): number {
  assertNonNegativeInt("gross", gross);
  const numerator = BigInt(gross) * BigInt(percentToMilli(percent));
  const denominator = 100_000n;
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  return Number(remainder * 2n >= denominator ? quotient + 1n : quotient);
}

export function contribution(input: ContributionInput): Contribution {
  assertNonNegativeInt("gross", input.gross);
  assertNonNegativeInt("providerFeeFixedMinor", input.providerFeeFixedMinor);
  assertNonNegativeInt("aiCostMinor", input.aiCostMinor);
  assertNonNegativeInt("infraCostMinor", input.infraCostMinor);
  assertNonNegativeInt("referralRewardCostMinor", input.referralRewardCostMinor);
  const providerFee = percentFeeMinor(input.gross, input.providerFeePercent) + input.providerFeeFixedMinor;
  const ai = input.aiCostMinor;
  const infra = input.infraCostMinor;
  const referral = input.referralRewardCostMinor;
  return { gross: input.gross, providerFee, ai, infra, referral, net: input.gross - providerFee - ai - infra - referral };
}
