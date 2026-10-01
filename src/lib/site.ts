const LOCAL_ORIGIN = "http://localhost:3000";

type SiteEnv = Partial<
  Record<"NODE_ENV" | "APP_URL" | "VERCEL_PROJECT_PRODUCTION_URL" | "VERCEL_URL" | "ALLOW_LOCALHOST_METADATA", string>
>;

function parseOrigin(value: string | undefined, name: string): URL | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    throw new Error(`${name} is not a valid URL: "${trimmed}"`);
  }
}

/**
 * Public origin for metadata (metadataBase → canonical, hreflang, og:url) and share links.
 * Resolution: APP_URL → https://VERCEL_PROJECT_PRODUCTION_URL → https://VERCEL_URL.
 *
 * Prerendered pages freeze this at build time, so production must resolve a real https origin: otherwise
 * this throws and the build fails instead of shipping localhost URLs. Local production builds and e2e
 * opt in to http://localhost explicitly with ALLOW_LOCALHOST_METADATA=1 (e.g. in an untracked .env.local).
 */
export function siteUrl(env: SiteEnv = process.env): URL {
  const url =
    parseOrigin(env.APP_URL, "APP_URL") ??
    parseOrigin(env.VERCEL_PROJECT_PRODUCTION_URL, "VERCEL_PROJECT_PRODUCTION_URL") ??
    parseOrigin(env.VERCEL_URL, "VERCEL_URL");
  const allowLocal = env.ALLOW_LOCALHOST_METADATA === "1" || env.ALLOW_LOCALHOST_METADATA === "true";
  if (env.NODE_ENV !== "production" || allowLocal) return url ?? new URL(LOCAL_ORIGIN);
  if (!url || url.protocol !== "https:") {
    throw new Error(
      "APP_URL must be the public https origin in production (canonical/hreflang/og:url are fixed at build time). " +
        "For a local production build set ALLOW_LOCALHOST_METADATA=1.",
    );
  }
  return url;
}
