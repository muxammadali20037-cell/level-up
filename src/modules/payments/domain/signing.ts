import { createHash, createHmac } from "node:crypto";
import { safeEqual } from "@/lib/crypto/hash";

/** HMAC-SHA256 as base64url (no padding). */
export function hmacBase64Url(secret: string, message: string): string {
  if (secret.length < 16) throw new Error("payment signing secret must be at least 16 characters");
  return createHmac("sha256", secret).update(message, "utf8").digest("base64url");
}

/** Constant-time check of an HMAC-SHA256 base64url signature. */
export function verifyHmacBase64Url(secret: string, message: string, signature: string): boolean {
  return safeEqual(hmacBase64Url(secret, message), signature);
}

export function md5Hex(value: string): string {
  return createHash("md5").update(value, "utf8").digest("hex");
}

export { safeEqual };
