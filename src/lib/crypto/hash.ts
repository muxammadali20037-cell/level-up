import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** Salted one-way hash for IPs / user agents / device ids. Never store raw values. */
export function saltedHash(value: string, salt: string): string {
  return createHmac("sha256", salt).update(value).digest("hex").slice(0, 32);
}

export function sha256Hex(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Constant-time string comparison (different lengths → false without early timing leak on content). */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}
