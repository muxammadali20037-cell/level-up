import { createHmac } from "node:crypto";
import { safeEqual } from "@/lib/crypto/hash";

/**
 * Telegram Mini App initData validation (server-side only).
 * secret_key = HMAC_SHA256(key = "WebAppData", message = bot_token)
 * hash       = hex(HMAC_SHA256(key = secret_key, message = data_check_string))
 * data_check_string = all received fields except `hash`, sorted by key, "key=value" joined with "\n".
 */
export interface TelegramWebAppUser {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly username: string | null;
  readonly languageCode: string | null;
  readonly isPremium: boolean;
  readonly photoUrl: string | null;
}

export type InitDataResult =
  | {
      readonly ok: true;
      readonly user: TelegramWebAppUser;
      readonly authDate: number;
      readonly startParam: string | null;
      readonly queryId: string | null;
    }
  | { readonly ok: false; readonly reason: "missing_hash" | "bad_hash" | "expired" | "missing_user" | "malformed" };

export const DEFAULT_INIT_DATA_MAX_AGE_SECONDS = 24 * 60 * 60;

export function buildDataCheckString(params: URLSearchParams): string {
  const pairs: [string, string][] = [];
  params.forEach((value, key) => {
    if (key !== "hash") pairs.push([key, value]);
  });
  pairs.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return pairs.map(([key, value]) => `${key}=${value}`).join("\n");
}

export function signInitData(params: URLSearchParams, botToken: string): string {
  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  return createHmac("sha256", secretKey).update(buildDataCheckString(params)).digest("hex");
}

export function verifyTelegramInitData(
  initData: string,
  botToken: string,
  nowSeconds: number,
  maxAgeSeconds: number = DEFAULT_INIT_DATA_MAX_AGE_SECONDS,
): InitDataResult {
  if (!initData || initData.length > 4096) return { ok: false, reason: "malformed" };
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(initData);
  } catch {
    return { ok: false, reason: "malformed" };
  }
  const hash = params.get("hash");
  if (!hash) return { ok: false, reason: "missing_hash" };
  if (!safeEqual(signInitData(params, botToken), hash.toLowerCase())) return { ok: false, reason: "bad_hash" };

  const authDate = Number(params.get("auth_date"));
  if (!Number.isFinite(authDate) || authDate <= 0) return { ok: false, reason: "malformed" };
  if (nowSeconds - authDate > maxAgeSeconds || authDate - nowSeconds > 300) return { ok: false, reason: "expired" };

  const rawUser = params.get("user");
  if (!rawUser) return { ok: false, reason: "missing_user" };
  const user = parseUser(rawUser);
  if (!user) return { ok: false, reason: "malformed" };

  return {
    ok: true,
    user,
    authDate,
    startParam: params.get("start_param"),
    queryId: params.get("query_id"),
  };
}

function parseUser(raw: string): TelegramWebAppUser | null {
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    if (typeof value.id !== "number" || !Number.isSafeInteger(value.id)) return null;
    const str = (v: unknown): string | null => (typeof v === "string" && v.length > 0 ? v.slice(0, 256) : null);
    return {
      id: value.id,
      firstName: str(value.first_name) ?? "",
      lastName: str(value.last_name),
      username: str(value.username),
      languageCode: str(value.language_code),
      isPremium: value.is_premium === true,
      photoUrl: str(value.photo_url),
    };
  } catch {
    return null;
  }
}
