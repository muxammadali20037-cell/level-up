/** In-memory {@link PaymentStore} for unit tests and local experiments. Enforces {@link canTransition}. */
import { type CurrencyCode } from "../money";
import {
  type MarkPaidInput,
  type MarkPaidResult,
  type NewProviderTxn,
  type PaymentEventInput,
  type PaymentRecord,
  type PaymentStore,
  type ProviderTxnPatch,
  type ProviderTxnRecord,
  TXN_STATE,
} from "../provider";
import { canTransition, type PaymentProviderKey, type PaymentStatus } from "../state";

export interface StoredPayment extends PaymentRecord {
  readonly failureReason?: string;
  readonly paidAt?: number;
  /** payments.target_id (e.g. the assessment result); null for target-less purchases. */
  readonly targetId?: string | null;
}

export class MemoryPaymentStore implements PaymentStore {
  readonly payments = new Map<string, StoredPayment>();
  readonly txns = new Map<string, ProviderTxnRecord>();
  readonly events: PaymentEventInput[] = [];
  /** targetId → id of the payment (or a source label such as "admin") that unlocked it. */
  readonly unlocks = new Map<string, string>();
  private readonly eventKeys = new Set<string>();
  private seq = 0;
  private merchantSeq = 1000;

  addPayment(input: {
    id: string;
    amountMinor: number;
    currency: CurrencyCode;
    provider: PaymentProviderKey;
    status?: PaymentStatus;
    userId?: string;
    createdAt?: number;
    providerPaymentId?: string | null;
    expiresAt?: number | null;
    targetId?: string | null;
  }): StoredPayment {
    const payment: StoredPayment = {
      userId: "00000000-0000-4000-8000-000000000001",
      status: "created",
      createdAt: 0,
      providerPaymentId: null,
      ...input,
    };
    this.payments.set(payment.id, payment);
    return payment;
  }

  async getPayment(paymentId: string): Promise<PaymentRecord | null> {
    return this.payments.get(paymentId) ?? null;
  }

  async getProviderTxn(provider: PaymentProviderKey, providerTxnId: string): Promise<ProviderTxnRecord | null> {
    for (const txn of this.txns.values()) {
      if (txn.provider === provider && txn.providerTxnId === providerTxnId) return txn;
    }
    return null;
  }

  async getActiveProviderTxnForPayment(paymentId: string, provider: PaymentProviderKey): Promise<ProviderTxnRecord | null> {
    for (const txn of this.txns.values()) {
      if (txn.paymentId === paymentId && txn.provider === provider && txn.state === TXN_STATE.created) return txn;
    }
    return null;
  }

  async createProviderTxn(input: NewProviderTxn): Promise<ProviderTxnRecord> {
    if (await this.getProviderTxn(input.provider, input.providerTxnId)) throw new Error("unique (provider, provider_txn_id)");
    const payment = this.payments.get(input.paymentId);
    if (!payment || payment.provider !== input.provider || payment.amountMinor !== input.amountMinor) {
      throw new Error("provider_transactions_match_payment");
    }
    this.seq += 1;
    this.merchantSeq += 1;
    const txn: ProviderTxnRecord = {
      ...input,
      id: `00000000-0000-4000-a000-${String(this.seq).padStart(12, "0")}`,
      performTime: null,
      cancelTime: null,
      reason: null,
      merchantRef: this.merchantSeq,
      providerTime: input.providerTime ?? null,
      raw: input.raw ?? {},
    };
    this.txns.set(txn.id, txn);
    return txn;
  }

  async updateProviderTxn(id: string, patch: ProviderTxnPatch): Promise<ProviderTxnRecord> {
    const txn = this.txns.get(id);
    if (!txn) throw new Error(`txn ${id} not found`);
    const next: ProviderTxnRecord = { ...txn, ...patch };
    this.txns.set(id, next);
    return next;
  }

  private transition(paymentId: string, to: PaymentStatus, extra: Partial<StoredPayment> = {}): StoredPayment {
    const payment = this.payments.get(paymentId);
    if (!payment) throw new Error(`payment ${paymentId} not found`);
    if (!canTransition(payment.status, to)) throw new Error(`illegal transition ${payment.status} -> ${to}`);
    const next: StoredPayment = { ...payment, ...extra, status: to };
    this.payments.set(paymentId, next);
    return next;
  }

  async markPending(paymentId: string): Promise<void> {
    if (this.payments.get(paymentId)?.status === "created") this.transition(paymentId, "pending");
  }

  /** Marks a target as unlocked by something other than a payment of this store (e.g. an admin unlock). */
  unlockTarget(targetId: string, by = "admin"): void {
    this.unlocks.set(targetId, by);
  }

  async markPaid(paymentId: string, input: MarkPaidInput): Promise<MarkPaidResult> {
    const payment = this.payments.get(paymentId);
    if (payment?.status === "paid") return "already_paid";
    const targetId = payment?.targetId ?? null;
    if (targetId !== null) {
      for (const other of this.payments.values()) {
        // mirrors the partial unique index payments_one_paid_per_target
        if (other.id !== paymentId && other.targetId === targetId && other.status === "paid") {
          throw new Error("payments_one_paid_per_target");
        }
      }
    }
    this.transition(paymentId, "paid", { providerPaymentId: input.providerPaymentId, paidAt: input.at });
    if (targetId !== null && !this.unlocks.has(targetId)) this.unlocks.set(targetId, paymentId);
    return "applied";
  }

  async markFailed(paymentId: string, reason: string): Promise<void> {
    if (this.payments.get(paymentId)?.status === "failed") return;
    this.transition(paymentId, "failed", { failureReason: reason });
  }

  async markRefunded(paymentId: string, reason: string): Promise<void> {
    if (this.payments.get(paymentId)?.status === "refunded") return;
    const next = this.transition(paymentId, "refunded", { failureReason: reason });
    // the refund transaction deletes payment-sourced unlocks
    if (next.targetId && this.unlocks.get(next.targetId) === paymentId) this.unlocks.delete(next.targetId);
  }

  async isTargetUnlocked(paymentId: string): Promise<boolean> {
    const targetId = this.payments.get(paymentId)?.targetId ?? null;
    if (targetId === null) return false;
    const by = this.unlocks.get(targetId);
    return by !== undefined && by !== paymentId;
  }

  async recordEvent(input: PaymentEventInput): Promise<"new" | "duplicate"> {
    const key = `${input.provider}|${input.eventType}|${input.providerEventId}`;
    this.events.push(input);
    if (this.eventKeys.has(key)) return "duplicate";
    this.eventKeys.add(key);
    return "new";
  }

  async listTxnsBetween(provider: PaymentProviderKey, fromMs: number, toMs: number): Promise<ProviderTxnRecord[]> {
    return [...this.txns.values()]
      .filter((t) => t.provider === provider && t.createTime !== null && t.createTime >= fromMs && t.createTime <= toMs)
      .sort((a, b) => (a.createTime ?? 0) - (b.createTime ?? 0));
  }
}

export function fixedClock(start: number): { nowMs(): number; advance(ms: number): void; set(ms: number): void } {
  let now = start;
  return {
    nowMs: () => now,
    advance: (ms: number) => {
      now += ms;
    },
    set: (ms: number) => {
      now = ms;
    },
  };
}
