import type { Metadata } from "next";
import { routing, type AppLocale } from "./routing";

/** canonical + hreflang alternates for a locale-prefixed path such as "" or "/start". */
export function localeAlternates(locale: AppLocale, path = ""): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}${path}`;
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

export const OG_LOCALES: Record<AppLocale, string> = { uz: "uz_UZ", ru: "ru_RU", en: "en_US" };

/**
 * Open Graph fields every page needs. Next merges metadata shallowly per top-level key, so a page-level
 * `openGraph` replaces the layout's: always spread this into page metadata, e.g.
 * `openGraph: { ...pageOpenGraph(locale, "/start"), title }`.
 */
export function pageOpenGraph(locale: AppLocale, path = "") {
  return {
    type: "website",
    siteName: "LEVEL",
    locale: OG_LOCALES[locale],
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
    url: `/${locale}${path}`,
  } satisfies NonNullable<Metadata["openGraph"]>;
}
