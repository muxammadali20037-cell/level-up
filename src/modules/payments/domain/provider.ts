/**
 * Provider-agnostic contracts. Providers are pure functions over an injected {@link PaymentStore} so they can be
 * unit-tested in memory and wired to SQL repositories (payments, provider_transactions, payment_events) later.
 */
import { type CurrencyCode } from "./money";
import { type PaymentProviderKey, type PaymentStatus } from "./state";

export interface PaymentRecord {
  readonly id: string;
  readonly userId: string;
  /** From the server price row; never from a client or a webhook. */
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
  readonly status: PaymentStatus;
  readonly provider: PaymentProviderKey;
  /** Epoch ms. */
  readonly createdAt: number;
  /** payments.provider_payment_id (write-once); null until captured. */
  readonly providerPaymentId?: string | null;
}

/**
 * Provider transaction states (provider_transactions.state). Payme's own numbering is reused for every provider:
 * 1 created/prepared (awaiting capture), 2 performed, -1 cancelled before perform, -2 cancelled after perform.
 */
export const TXN_STATE = {
  created: 1,
  performed: 2,
  cancelled: -1,
  cancelledAfterPerform: -2,
} as const;
export type TxnState = (typeof TXN_STATE)[keyof typeof TXN_STATE];

export interface ProviderTxnRecord {
  /** Our provider_transactions.id. */
  readonly id: string;
  readonly paymentId: string;
  readonly provider: PaymentProviderKey;
  /** The provider's transaction id (Payme `id`, Click `click_trans_id`). */
  readonly providerTxnId: string;
  readonly state: TxnState;
  readonly amountMinor: number;
  /** Epoch ms; null when not reached. */
  readonly createTime: number | null;
  readonly performTime: number | null;
  readonly cancelTime: number | null;
  readonly reason: number | null;
  readonly raw: Readonly<Record<string, unknown>>;
}

export interface NewProviderTxn {
  readonly paymentId: string;
  readonly provider: PaymentProviderKey;
  readonly providerTxnId: string;
  readonly state: TxnState;
  readonly amountMinor: number;
  readonly createTime: number;
  readonly raw?: Readonly<Record<string, unknown>>;
}

export interface ProviderTxnPatch {
  readonly state?: TxnState;
  readonly performTime?: number | null;
  readonly cancelTime?: number | null;
  readonly reason?: number | null;
}

export type PaymentEventOutcome = "applied" | "duplicate" | "rejected" | "error";

/** One provider callback (payment_events row; unique per provider + eventType + providerEventId). */
export interface PaymentEventInput {
  readonly paymentId: string | null;
  readonly provider: PaymentProviderKey;
  readonly eventType: string;
  readonly providerEventId: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly signatureValid: boolean;
  readonly outcome: PaymentEventOutcome;
  readonly error?: string;
}

export interface MarkPaidInput {
  readonly providerPaymentId: string;
  /** Epoch ms. */
  readonly at: number;
}

export type MarkPaidResult = "applied" | "already_paid";

/**
 * Persistence port. Implementations must apply each method atomically. `markPaid` must also write the
 * result_unlocks / entitlements rows in the same DB transaction as the PAID transition (see brief §9).
 * Methods that would break {@link canTransition} throw; providers translate throws into provider error codes.
 */
export interface PaymentStore {
  getPayment(paymentId: string): Promise<PaymentRecord | null>;
  getProviderTxn(provider: PaymentProviderKey, providerTxnId: string): Promise<ProviderTxnRecord | null>;
  /** The transaction of this payment/provider in state 1 (created), if any. */
  getActiveProviderTxnForPayment(paymentId: string, provider: PaymentProviderKey): Promise<ProviderTxnRecord | null>;
  createProviderTxn(input: NewProviderTxn): Promise<ProviderTxnRecord>;
  updateProviderTxn(id: string, patch: ProviderTxnPatch): Promise<ProviderTxnRecord>;
  /** created → pending; no-op when already pending. */
  markPending(paymentId: string): Promise<void>;
  /** created|pending → paid (idempotent: 'already_paid' when it is already paid). Throws from failed/refunded. */
  markPaid(paymentId: string, input: MarkPaidInput): Promise<MarkPaidResult>;
  /** created|pending → failed; no-op when already failed. Throws from paid/refunded. */
  markFailed(paymentId: string, reason: string): Promise<void>;
  /** paid → refunded (removes payment-sourced unlocks in the same transaction); no-op when already refunded. */
  markRefunded(paymentId: string, reason: string): Promise<void>;
  /** Stores a provider callback; 'duplicate' when the (provider, eventType, providerEventId) was seen before. */
  recordEvent(input: PaymentEventInput): Promise<"new" | "duplicate">;
  /** Transactions whose createTime is within [fromMs, toMs] inclusive, ordered by createTime. */
  listTxnsBetween(provider: PaymentProviderKey, fromMs: number, toMs: number): Promise<ProviderTxnRecord[]>;
}

export interface Clock {
  nowMs(): number;
}

export const systemClock: Clock = { nowMs: () => Date.now() };

export interface CheckoutRequest {
  readonly payment: PaymentRecord;
  /** Where the provider sends the buyer back (web) — absolute URL. */
  readonly returnUrl: string;
  readonly title?: string;
  readonly description?: string;
}

export type CheckoutResult =
  | { readonly kind: "redirect"; readonly url: string }
  | { readonly kind: "telegram_invoice"; readonly params: TelegramInvoiceParams };

/** Bot API createInvoiceLink parameters (Telegram Stars). */
export interface TelegramInvoiceParams {
  readonly title: string;
  readonly description: string;
  readonly payload: string;
  readonly provider_token: "";
  readonly currency: "XTR";
  readonly prices: readonly { readonly label: string; readonly amount: number }[];
}
