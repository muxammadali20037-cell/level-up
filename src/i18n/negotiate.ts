import { isSupportedLocale } from "@/lib/i18n/text";
import { routing, type AppLocale } from "./routing";

/**
 * Locale for unprefixed entry links (/s/{slug}): NEXT_LOCALE cookie → Accept-Language (by q, then order,
 * primary subtag only) → default. Link-preview bots usually send no Accept-Language and get the default.
 */
export function negotiateLocale(input: { cookie?: string | null; acceptLanguage?: string | null }): AppLocale {
  if (isSupportedLocale(input.cookie)) return input.cookie;
  const ranked = (input.acceptLanguage ?? "")
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.map((param) => param.trim()).find((param) => param.startsWith("q="));
      const quality = q === undefined ? 1 : Number(q.slice(2));
      return { language: tag.trim().toLowerCase().split("-")[0], quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((entry) => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  for (const { language } of ranked) if (isSupportedLocale(language)) return language;
  return routing.defaultLocale;
}
