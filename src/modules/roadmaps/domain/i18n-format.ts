import { interpolate, localize, type I18nText } from "@/lib/i18n/text";

/** A placeholder value: localized text (resolved per locale), or a literal string/number. */
export type I18nValue = I18nText | string | number;

/** Conjunction used before the last item when joining lists ("A, B and C"). */
const LIST_CONJUNCTION: Readonly<Record<string, string>> = { uz: "va", ru: "и", en: "and" };

function isList(value: I18nValue | readonly I18nValue[]): value is readonly I18nValue[] {
  return Array.isArray(value);
}

function resolveValue(value: I18nValue, locale: string): string {
  return typeof value === "object" ? localize(value, locale) : String(value);
}

/**
 * Joins already-localized items for `locale`: "A", "A and B", "A, B and C" (uz "va", ru "и").
 * Unknown locales fall back to a plain ", " separator.
 */
export function joinList(items: readonly string[], locale: string): string {
  const conjunction = LIST_CONJUNCTION[locale];
  if (items.length <= 1 || !conjunction) return items.join(", ");
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1] ?? ""}`;
}

/**
 * Interpolates `{name}` placeholders in every locale of `template`.
 * - I18nText values are localized for the same locale (standard fallback chain requested → en → uz).
 * - Lists are localized item by item and joined with {@link joinList}.
 * - Unknown placeholders are left untouched (see `interpolate`).
 * The output has exactly the template's locale keys, so a fully translated template stays fully translated.
 */
export function interpolateI18n(
  template: I18nText,
  values: Readonly<Record<string, I18nValue | readonly I18nValue[]>>,
): I18nText {
  const out: Record<string, string> = {};
  for (const [locale, text] of Object.entries(template)) {
    const resolved: Record<string, string> = {};
    for (const [key, value] of Object.entries(values)) {
      resolved[key] = isList(value)
        ? joinList(
            value.map((v) => resolveValue(v, locale)),
            locale,
          )
        : resolveValue(value, locale);
    }
    out[locale] = interpolate(text, resolved);
  }
  return out;
}

/** True when at least one locale has non-blank text. */
export function hasText(text: I18nText | null | undefined): boolean {
  return !!text && Object.values(text).some((value) => value.trim().length > 0);
}
