import { jwtVerify, SignJWT } from "jose";

/**
 * LEVEL session token (HS256). Stored in the httpOnly `level_session` cookie (web / Telegram Mini App) or sent as
 * `Authorization: Bearer` (future native apps). Anonymous users get a token on first request — no login wall.
 */
export const SESSION_COOKIE = "level_session";
export const SESSION_ISSUER = "level";
export const SESSION_AUDIENCE = "level-app";
export const SESSION_TTL_SECONDS = 90 * 24 * 60 * 60;
/** Re-issue the cookie when less than this remains. */
export const SESSION_RENEW_BELOW_SECONDS = 30 * 24 * 60 * 60;

export type SessionChannel = "web" | "telegram" | "mobile";

export interface SessionClaims {
  /** users.id */
  readonly userId: string;
  /** auth_sessions.id */
  readonly sessionId: string;
  readonly channel: SessionChannel;
  readonly anonymous: boolean;
  readonly issuedAt: number;
  readonly expiresAt: number;
}

const encoder = new TextEncoder();
const key = (secret: string): Uint8Array => {
  if (secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");
  return encoder.encode(secret);
};

export async function signSessionToken(
  claims: Pick<SessionClaims, "userId" | "sessionId" | "channel" | "anonymous">,
  secret: string,
  nowSeconds: number,
  ttlSeconds: number = SESSION_TTL_SECONDS,
): Promise<string> {
  return new SignJWT({ sid: claims.sessionId, ch: claims.channel, anon: claims.anonymous })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.userId)
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt(nowSeconds)
    .setExpirationTime(nowSeconds + ttlSeconds)
    .sign(key(secret));
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CHANNELS: readonly SessionChannel[] = ["web", "telegram", "mobile"];

/** Returns null for any invalid, expired, or malformed token. */
export async function verifySessionToken(
  token: string,
  secret: string,
  nowSeconds: number,
): Promise<SessionClaims | null> {
  if (!token || token.length > 2048) return null;
  try {
    const { payload } = await jwtVerify(token, key(secret), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
      currentDate: new Date(nowSeconds * 1000),
    });
    const { sub, sid, ch, anon, iat, exp } = payload as Record<string, unknown>;
    if (typeof sub !== "string" || !UUID_RE.test(sub)) return null;
    if (typeof sid !== "string" || !UUID_RE.test(sid)) return null;
    if (typeof ch !== "string" || !CHANNELS.includes(ch as SessionChannel)) return null;
    if (typeof iat !== "number" || typeof exp !== "number") return null;
    return {
      userId: sub,
      sessionId: sid,
      channel: ch as SessionChannel,
      anonymous: anon === true,
      issuedAt: iat,
      expiresAt: exp,
    };
  } catch {
    return null;
  }
}

export function shouldRenew(claims: SessionClaims, nowSeconds: number): boolean {
  return claims.expiresAt - nowSeconds < SESSION_RENEW_BELOW_SECONDS;
}
