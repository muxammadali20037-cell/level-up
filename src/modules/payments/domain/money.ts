/**
 * Money in integer minor units. Minor-unit exponents come from the `currencies` table (passed in as a
 * {@link CurrencyTable}); {@link DEFAULT_CURRENCIES} mirrors the seeded reference data for tests and fallbacks.
 */

export type CurrencyCode = string;
export type MoneyLocale = "uz" | "ru" | "en";

export interface Money {
  /** Integer amount in minor units (tiyin for UZS, cents for USD, whole stars for XTR). */
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
}

export interface CurrencyInfo {
  /** Minor-unit exponent: UZS 2 (1 soʻm = 100 tiyin), XTR 0. */
  readonly minorUnits: number;
  readonly symbol: string;
}

export type CurrencyTable = Readonly<Record<CurrencyCode, CurrencyInfo>>;

/** Mirrors `public.currencies` seed rows (migration 1400). Prefer the DB table when available. */
export const DEFAULT_CURRENCIES: CurrencyTable = {
  UZS: { minorUnits: 2, symbol: "soʻm" },
  USD: { minorUnits: 2, symbol: "$" },
  XTR: { minorUnits: 0, symbol: "⭐" },
  RUB: { minorUnits: 2, symbol: "₽" },
  KZT: { minorUnits: 2, symbol: "₸" },
};

/** Tiyin per soʻm. */
export const TIYIN_PER_SOM = 100;

const NBSP = " ";

export function currencyInfo(currency: CurrencyCode, table: CurrencyTable = DEFAULT_CURRENCIES): CurrencyInfo {
  const info = table[currency];
  if (!info) throw new Error(`unknown currency ${currency}`);
  return info;
}

export function minorUnitsOf(currency: CurrencyCode, table: CurrencyTable = DEFAULT_CURRENCIES): number {
  return currencyInfo(currency, table).minorUnits;
}

export function isMinorAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}

/** Builds a Money value, rejecting fractional or unsafe amounts. */
export function money(amountMinor: number, currency: CurrencyCode): Money {
  if (!isMinorAmount(amountMinor)) throw new Error(`amountMinor must be a safe integer, got ${amountMinor}`);
  return { amountMinor, currency };
}

/**
 * Parses a decimal major-unit string ("1000", "1000.5", "1000.00") into minor units without floating point.
 * Extra fractional digits are accepted only when they are zeros ("1000.000" with 2 minor units). Returns null for
 * anything else (signs, exponents, spaces, empty strings, unsafe magnitudes).
 */
export function parseMajorToMinor(input: string, minorUnits: number): number | null {
  const match = /^(\d+)(?:\.(\d*))?$/.exec(input.trim());
  if (!match) return null;
  const whole = match[1] ?? "0";
  let frac = match[2] ?? "";
  if (frac.length > minorUnits) {
    if (!/^0*$/.test(frac.slice(minorUnits))) return null;
    frac = frac.slice(0, minorUnits);
  }
  const value = BigInt(whole) * 10n ** BigInt(minorUnits) + BigInt(frac.padEnd(minorUnits, "0") || "0");
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) return null;
  return Number(value);
}

/** Minor units → fixed-point major string with exactly `minorUnits` decimals: (100000, 2) → "1000.00". */
export function toMajorString(amountMinor: number, minorUnits: number): string {
  if (!isMinorAmount(amountMinor)) throw new Error(`amountMinor must be a safe integer, got ${amountMinor}`);
  const negative = amountMinor < 0;
  const digits = Math.abs(amountMinor).toString().padStart(minorUnits + 1, "0");
  const whole = digits.slice(0, digits.length - minorUnits);
  const frac = minorUnits > 0 ? `.${digits.slice(digits.length - minorUnits)}` : "";
  return `${negative ? "-" : ""}${whole}${frac}`;
}

/** Soʻm (number or decimal string) → tiyin. Throws on values that are not a whole number of tiyin. */
export function toTiyin(som: number | string): number {
  const text = typeof som === "number" ? som.toFixed(4) : som;
  if (typeof som === "number" && (!Number.isFinite(som) || som < 0)) throw new Error(`invalid soʻm amount ${som}`);
  const tiyin = parseMajorToMinor(text, 2);
  if (tiyin === null) throw new Error(`invalid soʻm amount ${String(som)}`);
  return tiyin;
}

/** Tiyin → soʻm decimal string with two decimals ("1000.00"). */
export function tiyinToSomString(tiyin: number): string {
  return toMajorString(tiyin, 2);
}

function groupThousands(whole: string, separator: string): string {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

const LOCAL_SYMBOLS: Readonly<Record<CurrencyCode, Partial<Record<MoneyLocale, string>>>> = {
  UZS: { uz: "soʻm", ru: "сум" },
  RUB: { uz: "rubl", ru: "₽" },
  KZT: { uz: "tenge", ru: "₸" },
};

/**
 * Formats money for display. Fraction digits are shown only when the amount is not whole
 * ("1 000 soʻm", "1 000,50 soʻm"). uz/ru group with a no-break space and put the symbol after the number;
 * en uses the ISO code prefix with comma grouping ("UZS 1,000"). XTR is always "⭐ 5".
 */
export function formatMoney(value: Money, locale: MoneyLocale, table: CurrencyTable = DEFAULT_CURRENCIES): string {
  const info = currencyInfo(value.currency, table);
  const major = toMajorString(value.amountMinor, info.minorUnits);
  const negative = major.startsWith("-");
  const [wholeRaw = "0", fracRaw = ""] = (negative ? major.slice(1) : major).split(".");
  const showFrac = fracRaw !== "" && !/^0+$/.test(fracRaw);
  const en = locale === "en";
  const whole = groupThousands(wholeRaw, en ? "," : NBSP);
  const number = `${negative ? "-" : ""}${whole}${showFrac ? (en ? "." : ",") + fracRaw : ""}`;
  if (value.currency === "XTR") return `⭐${NBSP}${number}`;
  if (en) return `${value.currency}${NBSP}${number}`;
  const symbol = LOCAL_SYMBOLS[value.currency]?.[locale] ?? info.symbol;
  return `${number}${NBSP}${symbol}`;
}
