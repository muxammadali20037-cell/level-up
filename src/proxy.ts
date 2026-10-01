import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { negotiateLocale } from "./i18n/negotiate";
import { LOCALE_COOKIE, routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * Locale routing only (optimistic, no DB). Auth/authorization never happens here.
 * - `/s/{slug}` (public share card) is REWRITTEN, not redirected, to `/{locale}/s/{slug}` so link previews
 *   get a 200 with OG tags on the short URL (01-architecture §19, decision 20).
 * - Everything else in the matcher goes through next-intl (prefix redirects, locale cookie).
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/s/")) {
    const locale = negotiateLocale({
      cookie: request.cookies.get(LOCALE_COOKIE)?.value,
      acceptLanguage: request.headers.get("accept-language"),
    });
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.rewrite(url);
  }
  return handleI18nRouting(request);
}

/**
 * Skipped: API routes (incl. /api/v1 webhooks), Next/Vercel internals, the admin app, referral links
 * (/r/{code} resolves its own locale), the Mini App entry (/tma resolves Telegram language_code),
 * root-level generated metadata routes (/icon, /apple-icon, /opengraph-image, /twitter-image, incl.
 * numbered variants) and any path with a file extension.
 */
export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next|_vercel|admin(?:/|$)|r/|tma(?:/|$)|(?:apple-icon|icon|opengraph-image|twitter-image)\\d*(?:/|$)|.*\\..*).*)",
  ],
};
