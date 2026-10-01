import { describe, expect, it } from "vitest";
import { SESSION_TTL_SECONDS, shouldRenew, signSessionToken, verifySessionToken } from "./session-token";

const SECRET = "s".repeat(40);
const NOW = 1_790_000_000;
const claims = {
  userId: "7b0c6a52-1f7e-4e0b-9a49-3c1f4a0c2d11",
  sessionId: "0f3e2d1c-5b6a-4c7d-8e9f-a0b1c2d3e4f5",
  channel: "web" as const,
  anonymous: true,
};

describe("session tokens", () => {
  it("round-trips claims", async () => {
    const token = await signSessionToken(claims, SECRET, NOW);
    const verified = await verifySessionToken(token, SECRET, NOW + 10);
    expect(verified).toMatchObject({ ...claims, issuedAt: NOW, expiresAt: NOW + SESSION_TTL_SECONDS });
  });

  it("rejects a token signed with another secret", async () => {
    const token = await signSessionToken(claims, SECRET, NOW);
    expect(await verifySessionToken(token, "x".repeat(40), NOW)).toBeNull();
  });

  it("rejects expired and tampered tokens", async () => {
    const token = await signSessionToken(claims, SECRET, NOW, 60);
    expect(await verifySessionToken(token, SECRET, NOW + 61)).toBeNull();
    const [h, p, s] = token.split(".");
    const payload = JSON.parse(Buffer.from(p ?? "", "base64url").toString()) as Record<string, unknown>;
    payload.sub = "11111111-1111-4111-8111-111111111111";
    const forged = `${h}.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.${s}`;
    expect(await verifySessionToken(forged, SECRET, NOW)).toBeNull();
  });

  it("rejects alg=none tokens", async () => {
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const body = Buffer.from(JSON.stringify({ sub: claims.userId, sid: claims.sessionId, ch: "web" })).toString("base64url");
    expect(await verifySessionToken(`${header}.${body}.`, SECRET, NOW)).toBeNull();
  });

  it("flags tokens close to expiry for renewal", async () => {
    const token = await signSessionToken(claims, SECRET, NOW);
    const verified = await verifySessionToken(token, SECRET, NOW);
    expect(verified && shouldRenew(verified, NOW)).toBe(false);
    expect(verified && shouldRenew(verified, NOW + SESSION_TTL_SECONDS - 100)).toBe(true);
  });

  it("refuses short secrets", async () => {
    await expect(signSessionToken(claims, "short", NOW)).rejects.toThrow();
  });
});
