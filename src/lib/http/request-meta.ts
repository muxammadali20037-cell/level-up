import { randomUUID } from "node:crypto";
import { type NextRequest } from "next/server";
import { saltedHash } from "@/lib/crypto/hash";
import { env } from "@/lib/env";

/**
 * Request metadata for rate limiting, sessions and attribution. Raw IPs / user agents / device ids are never stored:
 * only HMAC(HASH_SALT, value) hashes leave this module.
 */
export const DEVICE_HEADER = "x-level-device";
export const REQUEST_ID_HEADER = "x-request-id";
/** `web | tma | android | ios` (01-architecture §5.1 client identification). */
export const CLIENT_PLATFORM_HEADER = "x-client-platform";

const DEVICE_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const REQUEST_ID_RE = /^[A-Za-z0-9._:-]{8,128}$/;

/**
 * Client IP: first hop of `x-forwarded-for`, else `x-real-ip`. On Vercel both are set by the platform edge (a
 * client-supplied x-forwarded-for is overwritten), so the first hop is the real client address. Self-hosting
 * behind another proxy must make that proxy overwrite (not append to) the header.
 */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first.slice(0, 64);
  const real = headers.get("x-real-ip")?.trim();
  return real ? real.slice(0, 64) : null;
}

/** Client-generated device id (uuid kept in localStorage by the app), validated; null when absent/invalid. */
export function deviceId(headers: Headers): string | null {
  const value = headers.get(DEVICE_HEADER)?.trim();
  return value && DEVICE_ID_RE.test(value) ? value : null;
}

export type ClientChannel = "web" | "telegram" | "mobile";

/** Session channel from X-Client-Platform: tma → telegram, android/ios → mobile, anything else → web. */
export function clientChannel(headers: Headers): ClientChannel {
  const platform = headers.get(CLIENT_PLATFORM_HEADER)?.trim().toLowerCase();
  if (platform === "tma" || platform === "telegram") return "telegram";
  if (platform === "android" || platform === "ios" || platform === "mobile") return "mobile";
  return "web";
}

/** ISO country from the hosting edge (Vercel sets x-vercel-ip-country); null when absent or malformed. */
export function edgeCountry(headers: Headers): string | null {
  const value = headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  return value && /^[A-Z]{2}$/.test(value) && value !== "XX" ? value : null;
}

export function requestId(headers: Headers): string {
  const incoming = headers.get(REQUEST_ID_HEADER);
  return incoming && REQUEST_ID_RE.test(incoming) ? incoming : randomUUID();
}

export function hashValue(value: string, salt: string = env().HASH_SALT): string {
  return saltedHash(value, salt);
}

export interface RequestMeta {
  readonly requestId: string;
  /** Hash of the client IP, or of "unknown" when no IP header is present (still rate-limitable as one bucket). */
  readonly ipHash: string;
  readonly uaHash: string | null;
  readonly deviceHash: string | null;
}

export function requestMeta(request: NextRequest | Request, salt: string = env().HASH_SALT): RequestMeta {
  const { headers } = request;
  const ip = clientIp(headers);
  const ua = headers.get("user-agent");
  const device = deviceId(headers);
  return {
    requestId: requestId(headers),
    ipHash: saltedHash(`ip:${ip ?? "unknown"}`, salt),
    uaHash: ua ? saltedHash(`ua:${ua.slice(0, 512)}`, salt) : null,
    deviceHash: device ? saltedHash(`device:${device}`, salt) : null,
  };
}
