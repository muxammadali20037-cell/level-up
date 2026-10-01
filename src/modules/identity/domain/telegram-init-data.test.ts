import { describe, expect, it } from "vitest";
import { signInitData, verifyTelegramInitData } from "./telegram-init-data";

const BOT_TOKEN = "123456:TEST-token";
const NOW = 1_790_000_000;

function makeInitData(fields: Record<string, string>, token = BOT_TOKEN): string {
  const params = new URLSearchParams(fields);
  params.set("hash", signInitData(params, token));
  return params.toString();
}

const user = JSON.stringify({ id: 42, first_name: "Aziz", username: "aziz", language_code: "uz" });

describe("verifyTelegramInitData", () => {
  it("accepts correctly signed data and returns the user and start_param", () => {
    const initData = makeInitData({ auth_date: String(NOW - 60), user, start_param: "ABC234", query_id: "q1" });
    const result = verifyTelegramInitData(initData, BOT_TOKEN, NOW);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.id).toBe(42);
      expect(result.user.firstName).toBe("Aziz");
      expect(result.startParam).toBe("ABC234");
    }
  });

  it("rejects data signed with another bot token", () => {
    const initData = makeInitData({ auth_date: String(NOW), user }, "999:other");
    expect(verifyTelegramInitData(initData, BOT_TOKEN, NOW)).toEqual({ ok: false, reason: "bad_hash" });
  });

  it("rejects tampered fields", () => {
    const initData = makeInitData({ auth_date: String(NOW), user }).replace("Aziz", "Admin");
    expect(verifyTelegramInitData(initData, BOT_TOKEN, NOW)).toEqual({ ok: false, reason: "bad_hash" });
  });

  it("rejects stale data", () => {
    const initData = makeInitData({ auth_date: String(NOW - 2 * 86_400), user });
    expect(verifyTelegramInitData(initData, BOT_TOKEN, NOW)).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects missing hash and missing user", () => {
    expect(verifyTelegramInitData(`auth_date=${NOW}`, BOT_TOKEN, NOW)).toEqual({ ok: false, reason: "missing_hash" });
    const noUser = makeInitData({ auth_date: String(NOW) });
    expect(verifyTelegramInitData(noUser, BOT_TOKEN, NOW)).toEqual({ ok: false, reason: "missing_user" });
  });

  it("includes the signature field in the data-check-string (only hash is excluded)", () => {
    const initData = makeInitData({ auth_date: String(NOW), user, signature: "abc" });
    expect(verifyTelegramInitData(initData, BOT_TOKEN, NOW).ok).toBe(true);
    const stripped = initData.replace(/&?signature=abc/, "");
    expect(verifyTelegramInitData(stripped, BOT_TOKEN, NOW)).toEqual({ ok: false, reason: "bad_hash" });
  });
});
