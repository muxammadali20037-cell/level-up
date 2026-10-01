import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { unstable_rethrow } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { mergeMessages, type MessageTree } from "./merge-messages";
import { routing, type AppLocale } from "./routing";

const CATALOGS: Record<AppLocale, () => Promise<{ default: MessageTree }>> = {
  uz: () => import("./messages/uz"),
  ru: () => import("./messages/ru"),
  en: () => import("./messages/en"),
};

/**
 * `[locale]` root param, or undefined where Next forbids root params (Route Handlers, Server Actions,
 * unstable_cache). Those callers must pass `{ locale }` explicitly; without it they get the default
 * locale instead of a 500. Next's own control-flow errors (dynamic usage, postpone…) are rethrown.
 */
async function readRootLocale(): Promise<string | undefined> {
  try {
    return await rootLocale();
  } catch (error) {
    unstable_rethrow(error);
    if (process.env.NODE_ENV !== "production") {
      console.warn("[i18n] No locale in this context; pass { locale } to getTranslations(). Falling back.", error);
    }
    return undefined;
  }
}

/**
 * Request config (Option A): the locale comes from the `[locale]` root param, so pages stay statically
 * renderable without `setRequestLocale`. Messages deep-merge uz ← en ← requested (fallback chain).
 */
export default getRequestConfig(async ({ locale: override }) => {
  const candidate = override ?? (await readRootLocale());
  const locale = hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale;
  const [uz, en, requested] = await Promise.all([CATALOGS.uz(), CATALOGS.en(), CATALOGS[locale]()]);
  const messages = mergeMessages(uz.default, en.default, requested.default);
  return { locale, messages, timeZone: "Asia/Tashkent" };
});
