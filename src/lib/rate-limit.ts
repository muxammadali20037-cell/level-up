import "server-only";
import { type Db } from "@/lib/db/client";
import { rateLimited } from "@/lib/http/errors";

/**
 * Fixed-window rate limiting backed by public.rate_limit_hit (atomic upsert on rate_limits). Keys are
 * `<preset>:<subject>`; subjects are user ids or salted hashes (never raw IPs).
 */
export interface RateLimitResult {
  readonly allowed: boolean;
  readonly current: number;
  readonly limit: number;
  /** Seconds until the current window ends. */
  readonly resetIn: number;
}

function secondsUntilWindowEnd(windowSeconds: number, nowMs: number = Date.now()): number {
  const now = nowMs / 1000;
  return Math.max(1, Math.ceil(Math.floor(now / windowSeconds) * windowSeconds + windowSeconds - now));
}

/** Counts one hit; returns the result without throwing. */
export async function rateLimitHit(db: Db, key: string, windowSeconds: number, limit: number): Promise<RateLimitResult> {
  const [row] = await db<{ allowed: boolean; current: number }[]>`
    select allowed, current from public.rate_limit_hit(${key.slice(0, 200)}, ${windowSeconds}::int, ${limit}::int)`;
  return {
    allowed: row?.allowed ?? true,
    current: row?.current ?? 0,
    limit,
    resetIn: secondsUntilWindowEnd(windowSeconds),
  };
}

/** Counts one hit and throws ApiError rate_limited (429, Retry-After) when over the limit. */
export async function rateLimit(db: Db, key: string, windowSeconds: number, limit: number): Promise<RateLimitResult> {
  const result = await rateLimitHit(db, key, windowSeconds, limit);
  if (!result.allowed) throw rateLimited(result.resetIn);
  return result;
}

export interface RateLimitPreset {
  readonly windowSeconds: number;
  readonly limit: number;
  /** On limiter (database) failure: true lets the request through (abuse protection only); false rejects it. */
  readonly failOpen: boolean;
}

export const RATE_LIMITS = {
  session_create: { windowSeconds: 600, limit: 30, failOpen: true }, // subject: ip hash
  assessment_start_user: { windowSeconds: 3600, limit: 20, failOpen: true },
  assessment_start_ip: { windowSeconds: 3600, limit: 60, failOpen: true },
  answer: { windowSeconds: 60, limit: 120, failOpen: true }, // subject: user id
  payment_create: { windowSeconds: 600, limit: 10, failOpen: false }, // subject: user id
  events: { windowSeconds: 60, limit: 300, failOpen: true }, // subject: user id
  telegram_auth: { windowSeconds: 600, limit: 30, failOpen: true }, // subject: ip hash
  share_create: { windowSeconds: 3600, limit: 30, failOpen: true }, // subject: user id
  admin_login: { windowSeconds: 900, limit: 5, failOpen: false }, // subject: ip hash
} as const satisfies Record<string, RateLimitPreset>;

export type RateLimitName = keyof typeof RATE_LIMITS;

/**
 * Applies a named preset to a subject (user id or ip/device hash). Throws 429 when over the limit. A database
 * failure is swallowed (logged) for fail-open presets and rethrown for fail-closed ones.
 */
export async function enforceRateLimit(db: Db, name: RateLimitName, subject: string): Promise<void> {
  const preset: RateLimitPreset = RATE_LIMITS[name];
  let result: RateLimitResult;
  try {
    result = await rateLimitHit(db, `${name}:${subject}`, preset.windowSeconds, preset.limit);
  } catch (error) {
    if (!preset.failOpen) throw error;
    console.warn(JSON.stringify({ level: "warn", msg: "rate_limit_unavailable", preset: name }));
    return;
  }
  if (!result.allowed) throw rateLimited(result.resetIn, { limit: name });
}
