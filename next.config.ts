import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Turbopack requires a relative path here (see docs digest §4).
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV !== "production";
const paymeTestMode = ["1", "true"].includes(process.env.PAYME_TEST_MODE ?? "");

/**
 * Static CSP (no nonces) so landing and other public pages stay statically rendered.
 * - `'unsafe-inline'` scripts/styles: required by Next's inline bootstrap without nonces.
 * - telegram.org: Telegram Mini App SDK (telegram-web-app.js).
 * - frame-ancestors: Telegram Web clients embed Mini Apps in an iframe, so no X-Frame-Options: DENY.
 * - form-action: hosted checkout pages of Click and Payme (+ Payme's test checkout in PAYME_TEST_MODE;
 *   Chrome also enforces form-action on redirects after a Server Action POST).
 * - 'unsafe-inline' scripts mean this CSP does not mitigate XSS; pages that render user-controlled text
 *   (/s/{slug}, results) should move to a per-request nonce CSP set in proxy.ts (digest §15).
 */
function contentSecurityPolicy(frameAncestors: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://telegram.org${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://t.me https://*.telegram.org",
    "font-src 'self' data:",
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "frame-src 'self'",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    `form-action 'self' https://my.click.uz https://checkout.paycom.uz${paymeTestMode ? " https://test.paycom.uz" : ""}`,
    `frame-ancestors ${frameAncestors}`,
    "manifest-src 'self'",
  ].join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy("'self' https://web.telegram.org https://*.telegram.org") },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // next-intl's Link/redirect type hrefs themselves; Next's typedRoutes would fight them.
  typedRoutes: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Later entries override the same header key (`:path*` also matches /admin): never frame the admin console.
      {
        source: "/admin/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy("'none'") },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
