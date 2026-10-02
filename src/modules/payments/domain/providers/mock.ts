/**
 * Mock provider — DEVELOPMENT AND TESTS ONLY. Never enable in production ({@link assertMockAllowed}).
 *
 * Checkout redirects to `/pay/mock/[paymentId]?token=…`. The token binds the payment id, amount, currency and an
 * expiry with HMAC-SHA256, so the mock confirm endpoint cannot be forged for another payment or another amount.
 */
import { type Clock, type PaymentRecord, type PaymentStore, systemClock } from "../provider";
import { hmacBase64Url, verifyHmacBase64Url } from "../signing";

export interface MockProviderConfig {
  /** Absolute app origin, e.g. "http://localhost:3000". */
  readonly baseUrl: string;
  /** HMAC secret (≥ 16 chars), from env. */
  readonly secret: string;
  /** Token lifetime; default 30 minutes. */
  readonly tokenTtlMs?: number;
}

export const MOCK_TOKEN_TTL_MS = 30 * 60 * 1000;

export function assertMockAllowed(env: { readonly nodeEnv?: string; readonly appEnv?: string }): void {
  if (env.nodeEnv === "production" || env.appEnv === "production") {
    throw new Error("mock payment provider is disabled in production");
  }
}

function tokenMessage(payment: Pick<PaymentRecord, "id" | "amountMinor" | "currency">, expiresAt: number): string {
  return `mock-confirm:v1:${payment.id}:${payment.amountMinor}:${payment.currency}:${expiresAt}`;
}

export function signMockConfirmToken(payment: PaymentRecord, secret: string, expiresAt: number): string {
  return `${expiresAt}.${hmacBase64Url(secret, tokenMessage(payment, expiresAt))}`;
}

export type MockTokenCheck = "valid" | "malformed" | "bad_signature" | "expired";

export function verifyMockConfirmToken(payment: PaymentRecord, token: string, secret: string, nowMs: number): MockTokenCheck {
  const match = /^(\d{1,16})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return "malformed";
  const expiresAt = Number(match[1]);
  if (!verifyHmacBase64Url(secret, tokenMessage(payment, expiresAt), match[2] ?? "")) return "bad_signature";
  if (nowMs >= expiresAt) return "expired";
  return "valid";
}

export function buildMockCheckout(
  payment: PaymentRecord,
  config: MockProviderConfig,
  clock: Clock = systemClock,
): { readonly kind: "redirect"; readonly url: string; readonly token: string } {
  if (payment.provider !== "mock") throw new Error(`payment ${payment.id} is not a mock payment`);
  const expiresAt = clock.nowMs() + (config.tokenTtlMs ?? MOCK_TOKEN_TTL_MS);
  const token = signMockConfirmToken(payment, config.secret, expiresAt);
  const url = new URL(`/pay/mock/${encodeURIComponent(payment.id)}`, config.baseUrl);
  url.searchParams.set("token", token);
  return { kind: "redirect", url: url.toString(), token };
}

export interface MockConfirmInput {
  readonly paymentId: string;
  readonly token: string;
  readonly outcome: "paid" | "failed";
}

export type MockConfirmResult =
  | { readonly ok: true; readonly status: "paid" | "already_paid" | "failed" }
  | { readonly ok: false; readonly error: "not_found" | "forbidden" | "expired" | "not_payable" };

/** Handles the mock confirm endpoint. Idempotent for repeated "paid" confirmations. */
export async function handleMockConfirm(
  input: MockConfirmInput,
  store: PaymentStore,
  config: MockProviderConfig,
  clock: Clock = systemClock,
): Promise<MockConfirmResult> {
  const payment = await store.getPayment(input.paymentId);
  if (!payment || payment.provider !== "mock") return { ok: false, error: "not_found" };
  const check = verifyMockConfirmToken(payment, input.token, config.secret, clock.nowMs());
  const signatureValid = check === "valid" || check === "expired";
  const record = async (outcome: "applied" | "duplicate" | "rejected", error?: string): Promise<void> => {
    await store.recordEvent({
      paymentId: payment.id,
      provider: "mock",
      eventType: `mock.${input.outcome}`,
      providerEventId: payment.id,
      payload: { outcome: input.outcome },
      signatureValid,
      outcome,
      error,
    });
  };
  if (check !== "valid") {
    await record("rejected", check);
    return { ok: false, error: check === "expired" ? "expired" : "forbidden" };
  }
  if (input.outcome === "failed") {
    if (payment.status !== "created" && payment.status !== "pending" && payment.status !== "failed") {
      await record("rejected", `status ${payment.status}`);
      return { ok: false, error: "not_payable" };
    }
    await store.markFailed(payment.id, "mock_declined");
    await record("applied");
    return { ok: true, status: "failed" };
  }
  if (payment.status === "failed" || payment.status === "refunded") {
    await record("rejected", `status ${payment.status}`);
    return { ok: false, error: "not_payable" };
  }
  const result = await store.markPaid(payment.id, { providerPaymentId: `mock_${payment.id}`, at: clock.nowMs() });
  await record(result === "applied" ? "applied" : "duplicate");
  return { ok: true, status: result === "applied" ? "paid" : "already_paid" };
}
