/**
 * Build-time display price for the full report until the `prices` table is wired (02-mvp-spec D3).
 * Display only: the server-side price row is always the source of truth at checkout.
 */
export const FULL_REPORT_DISPLAY_PRICE = { amountMinor: 100_000, currency: "UZS", minorUnits: 2 } as const;

/** Major-unit amount formatted for the locale: uz/ru "1 000", en "1,000". */
export function formatMajorAmount(locale: string, amountMinor: number, minorUnits: number): string {
  const major = amountMinor / 10 ** minorUnits;
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(major);
}
