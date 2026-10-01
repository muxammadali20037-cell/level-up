/**
 * Localized content text stored as `{ "uz": "...", "ru": "...", "en": "..." }`.
 * Unlimited locales by design: any BCP-47-like code can be a key.
 */
export type LocaleCode = string;
export type I18nText = Readonly<Record<LocaleCode, string>>;

export const SUPPORTED_LOCALES = ["uz", "ru", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "uz";

/** Fallback chain: requested → en → uz → first available value. */
export const FALLBACK_CHAIN: readonly LocaleCode[] = ["en", "uz"];

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function localize(text: I18nText | null | undefined, locale: LocaleCode): string {
  if (!text) return "";
  const direct = text[locale];
  if (direct) return direct;
  for (const fallback of FALLBACK_CHAIN) {
    const value = text[fallback];
    if (value) return value;
  }
  const first = Object.values(text).find((v) => v.length > 0);
  return first ?? "";
}

/** Interpolates `{name}` placeholders. Unknown placeholders are left untouched. */
export function interpolate(template: string, values: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  );
}
