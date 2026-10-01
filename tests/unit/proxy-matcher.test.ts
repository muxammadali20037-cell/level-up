import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it, vi } from "vitest";
import { config } from "@/proxy";

// Only the static matcher is under test; next-intl's middleware needs the Next runtime.
vi.mock("next-intl/middleware", () => ({ default: () => () => undefined }));

const matches = (path: string) => unstable_doesMiddlewareMatch({ config, url: `http://localhost${path}` });

describe("proxy matcher (next-intl locale routing)", () => {
  it.each([
    "/",
    "/uz",
    "/ru/start",
    "/en/result/abc",
    "/start",
    "/sales",
    "/rating",
    "/apiary",
    "/tmax",
    "/iconic",
    // /s/{slug} is rewritten (not redirected) to /{locale}/s/{slug} by proxy.ts itself.
    "/s/abc123",
  ])(
    "runs on page route %s",
    (path) => {
      expect(matches(path)).toBe(true);
    },
  );

  it.each([
    "/api",
    "/api/v1/payments/click/prepare",
    "/api/v1/payments/payme",
    "/api/v1/telegram/webhook",
    "/_next/static/chunks/app.js",
    "/_vercel/insights/script.js",
    "/admin",
    "/admin/results",
    "/r/ABCD2345",
    "/tma",
    "/tma/start",
    "/icon",
    "/icon1",
    "/apple-icon",
    "/opengraph-image",
    "/twitter-image",
    "/icon.svg",
    "/brand/logo.svg",
    "/robots.txt",
  ])("skips %s", (path) => {
    expect(matches(path)).toBe(false);
  });
});
