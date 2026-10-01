import { describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/site";

describe("siteUrl", () => {
  it("prefers APP_URL, then Vercel production, then deployment URL", () => {
    expect(siteUrl({ NODE_ENV: "production", APP_URL: "https://level.uz" }).origin).toBe("https://level.uz");
    expect(siteUrl({ NODE_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "level.uz" }).origin).toBe("https://level.uz");
    expect(siteUrl({ NODE_ENV: "production", VERCEL_URL: "level-abc.vercel.app" }).origin).toBe(
      "https://level-abc.vercel.app",
    );
  });

  it("fails a production build without a public https origin", () => {
    expect(() => siteUrl({ NODE_ENV: "production" })).toThrow(/APP_URL/);
    expect(() => siteUrl({ NODE_ENV: "production", APP_URL: "http://localhost:3000" })).toThrow(/https/);
  });

  it("never swallows an invalid APP_URL", () => {
    expect(() => siteUrl({ NODE_ENV: "development", APP_URL: "http://" })).toThrow(/APP_URL/);
  });

  it("allows localhost in development or with the explicit escape hatch", () => {
    expect(siteUrl({ NODE_ENV: "development" }).origin).toBe("http://localhost:3000");
    expect(siteUrl({ NODE_ENV: "production", ALLOW_LOCALHOST_METADATA: "1" }).origin).toBe("http://localhost:3000");
  });
});
