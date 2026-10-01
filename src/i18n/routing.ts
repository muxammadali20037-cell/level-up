import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n/text";

/** Locale-prefixed routing: /uz, /ru, /en. Kept in sync with SUPPORTED_LOCALES (content fallback chain). */
export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  // hreflang comes only from page metadata (localeAlternates + metadataBase). The middleware's `Link`
  // header would point x-default at the redirecting `/` and is built from the request Host header.
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];

/** Cookie next-intl's middleware uses to remember the chosen locale. */
export const LOCALE_COOKIE = "NEXT_LOCALE";
