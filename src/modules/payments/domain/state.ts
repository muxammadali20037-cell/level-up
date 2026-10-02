/** Payment status machine. Mirrors `public.payments_guard_update()` (migration 0600) exactly. */

export const PAYMENT_STATUSES = ["created", "pending", "paid", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_PROVIDER_KEYS = ["click", "payme", "telegram_stars", "stripe", "mock"] as const;
export type PaymentProviderKey = (typeof PAYMENT_PROVIDER_KEYS)[number];

const TRANSITIONS: Readonly<Record<PaymentStatus, readonly PaymentStatus[]>> = {
  created: ["pending", "paid", "failed"],
  pending: ["paid", "failed"],
  paid: ["refunded"],
  failed: [],
  refunded: [],
};

/**
 * Legal transitions: created → pending|paid|failed; pending → paid|failed; paid → refunded.
 * failed and refunded are terminal. A same-status "transition" is allowed (idempotent webhook handling).
 */
export function canTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  return from === to || TRANSITIONS[from].includes(to);
}

export function isTerminal(status: PaymentStatus): boolean {
  return TRANSITIONS[status].length === 0;
}

/** A payment that may still be captured. */
export function isOpen(status: PaymentStatus): boolean {
  return status === "created" || status === "pending";
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === "string" && (PAYMENT_STATUSES as readonly string[]).includes(value);
}

export function isPaymentProviderKey(value: unknown): value is PaymentProviderKey {
  return typeof value === "string" && (PAYMENT_PROVIDER_KEYS as readonly string[]).includes(value);
}
