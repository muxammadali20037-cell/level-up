/**
 * Click SHOP API merchant handlers (Prepare / Complete) over an injected {@link PaymentStore}. Wire format and signing
 * live in ./click-protocol. Every reply is HTTP 200 JSON (business errors are codes, never 5xx — doc 08 §9.2).
 * Handlers never throw for protocol input; unexpected store failures become -7.
 */
import { errorText, invalidEventId, recordEventSafely } from "../events";
import {
  type CheckoutResult,
  type Clock,
  isExpired,
  isPaymentRef,
  type PaymentEventOutcome,
  type PaymentRecord,
  type PaymentStore,
  type ProviderTxnRecord,
  systemClock,
  TXN_STATE,
} from "../provider";
import { isOpen } from "../state";
import {
  buildClickCheckoutUrl,
  CLICK_ACTION,
  CLICK_ERROR,
  CLICK_ERROR_NOTE,
  type ClickConfig,
  clickFields,
  type ClickErrorCode,
  type ClickParams,
  type ClickRawParams,
  parseClickParams,
  verifyCompleteSign,
  verifyPrepareSign,
} from "./click-protocol";

/** provider_transactions.reason for a state-1 txn replaced by a newer Prepare of the same payment (doc 08 §10.7). */
export const CLICK_REASON_SUPERSEDED = 0;

interface ClickReplyBase {
  /** Echo; a number when it is a safe integer (VERIFY: Click accepts the echo as a JSON number). */
  readonly click_trans_id: number | string | null;
  readonly merchant_trans_id: string | null;
  readonly error: ClickErrorCode;
  readonly error_note: string;
}
export interface ClickPrepareReply extends ClickReplyBase {
  /** VERIFY: null on errors is accepted by Click (some integrations omit the field instead). */
  readonly merchant_prepare_id: number | null;
}
export interface ClickCompleteReply extends ClickReplyBase {
  readonly merchant_confirm_id: number | null;
}

interface Outcome {
  readonly code: ClickErrorCode;
  readonly outcome: PaymentEventOutcome;
  readonly paymentId: string | null;
  readonly merchantRef?: number | null;
  readonly error?: string;
}

const ok = (paymentId: string, merchantRef: number | null, duplicate = false): Outcome => ({
  code: CLICK_ERROR.success,
  outcome: duplicate ? "duplicate" : "applied",
  paymentId,
  merchantRef,
});
const reject = (code: ClickErrorCode, paymentId: string | null, error: string): Outcome => ({
  code,
  outcome: "rejected",
  paymentId,
  error,
});

export function buildCheckoutUrl(payment: PaymentRecord, config: ClickConfig, returnUrl: string): CheckoutResult {
  if (payment.provider !== "click") throw new Error(`payment ${payment.id} is not a Click payment`);
  if (payment.currency !== "UZS") throw new Error(`Click charges UZS only, payment ${payment.id} is ${payment.currency}`);
  return {
    kind: "redirect",
    url: buildClickCheckoutUrl({ config, amountTiyin: payment.amountMinor, paymentId: payment.id, returnUrl }),
  };
}

async function findClickPayment(store: PaymentStore, merchantTransId: string): Promise<PaymentRecord | null> {
  if (!isPaymentRef(merchantTransId)) return null;
  const payment = await store.getPayment(merchantTransId);
  return payment && payment.provider === "click" ? payment : null;
}

function amountMatches(p: ClickParams, payment: PaymentRecord): boolean {
  return p.amountTiyin !== null && payment.currency === "UZS" && p.amountTiyin === payment.amountMinor;
}

async function cancelTxn(store: PaymentStore, txn: ProviderTxnRecord, now: number, reason: number): Promise<void> {
  await store.updateProviderTxn(txn.id, { state: TXN_STATE.cancelled, cancelTime: now, reason });
}

async function prepare(p: ClickParams, store: PaymentStore, now: number): Promise<Outcome> {
  if (p.action !== CLICK_ACTION.prepare) return reject(CLICK_ERROR.actionNotFound, null, `action ${p.actionRaw}`);
  const payment = await findClickPayment(store, p.merchantTransId);
  if (!payment) return reject(CLICK_ERROR.orderNotFound, null, "payment_not_found");
  if (!amountMatches(p, payment)) return reject(CLICK_ERROR.incorrectAmount, payment.id, "amount_mismatch");
  const existing = await store.getProviderTxn("click", p.clickTransId);
  if (existing && existing.paymentId !== payment.id) {
    return reject(CLICK_ERROR.transactionNotFound, payment.id, "click_trans_id belongs to another payment");
  }
  if (payment.status === "paid") return reject(CLICK_ERROR.alreadyPaid, payment.id, "already_paid");
  if (!isOpen(payment.status)) return reject(CLICK_ERROR.transactionCancelled, payment.id, `status ${payment.status}`);
  if (existing) {
    // Redelivered Prepare: same answer, same merchant_prepare_id.
    if (existing.state !== TXN_STATE.created) return reject(CLICK_ERROR.transactionCancelled, payment.id, "txn_cancelled");
    await store.markPending(payment.id);
    return ok(payment.id, existing.merchantRef, true);
  }
  if (isExpired(payment, now)) return reject(CLICK_ERROR.transactionCancelled, payment.id, "expired");
  if (await store.isTargetUnlocked(payment.id)) return reject(CLICK_ERROR.alreadyPaid, payment.id, "target_unlocked");
  // The buyer retried on Click's page: the older live txn can no longer complete (Complete requires state 1).
  const live = await store.getActiveProviderTxnForPayment(payment.id, "click");
  if (live) await cancelTxn(store, live, now, CLICK_REASON_SUPERSEDED);
  const txn = await store.createProviderTxn({
    paymentId: payment.id,
    provider: "click",
    providerTxnId: p.clickTransId,
    state: TXN_STATE.created,
    amountMinor: payment.amountMinor,
    createTime: now,
    raw: { click_paydoc_id: p.clickPaydocId, amount: p.amount, sign_time: p.signTime },
  });
  await store.markPending(payment.id);
  return ok(payment.id, txn.merchantRef);
}

async function complete(p: ClickParams, store: PaymentStore, now: number): Promise<Outcome> {
  if (p.action !== CLICK_ACTION.complete) return reject(CLICK_ERROR.actionNotFound, null, `action ${p.actionRaw}`);
  const payment = await findClickPayment(store, p.merchantTransId);
  if (!payment) return reject(CLICK_ERROR.orderNotFound, null, "payment_not_found");
  const txn = await store.getProviderTxn("click", p.clickTransId);
  if (!txn || txn.paymentId !== payment.id || txn.merchantRef === null || String(txn.merchantRef) !== p.merchantPrepareId) {
    return reject(CLICK_ERROR.transactionNotFound, payment.id, "txn_not_found");
  }
  if (!amountMatches(p, payment)) return reject(CLICK_ERROR.incorrectAmount, payment.id, "amount_mismatch");
  const ref = txn.merchantRef;
  if (p.error < 0) {
    // Click reports the payment failed/was cancelled on its side.
    if (txn.state === TXN_STATE.cancelled) {
      return { code: CLICK_ERROR.transactionCancelled, outcome: "duplicate", paymentId: payment.id };
    }
    if (txn.state !== TXN_STATE.created) {
      // VERIFY: cannot happen by protocol (Complete succeeds once); we keep the capture and alert via the event.
      return reject(CLICK_ERROR.alreadyPaid, payment.id, `click error ${p.error} on performed txn`);
    }
    await cancelTxn(store, txn, now, p.error);
    if (isOpen(payment.status)) await store.markFailed(payment.id, "provider_cancelled");
    return { code: CLICK_ERROR.transactionCancelled, outcome: "applied", paymentId: payment.id, merchantRef: ref };
  }
  const paidByThisTxn = payment.status === "paid" && payment.providerPaymentId === p.clickTransId;
  if (txn.state === TXN_STATE.performed) {
    // VERIFY: idempotent repeat answers 0 + same merchant_confirm_id (some integrations expect -4).
    if (paidByThisTxn) return ok(payment.id, ref, true);
    return reject(CLICK_ERROR.transactionCancelled, payment.id, `status ${payment.status}`);
  }
  if (txn.state !== TXN_STATE.created) return reject(CLICK_ERROR.transactionCancelled, payment.id, "txn_cancelled");
  if (paidByThisTxn) {
    // A previous attempt marked the payment paid but failed before updating the txn: finish it.
    await store.updateProviderTxn(txn.id, { state: TXN_STATE.performed, performTime: now });
    return ok(payment.id, ref, true);
  }
  if (payment.status === "paid") {
    await cancelTxn(store, txn, now, CLICK_ERROR.alreadyPaid);
    return reject(CLICK_ERROR.alreadyPaid, payment.id, "paid_by_other_txn");
  }
  if (!isOpen(payment.status)) {
    await cancelTxn(store, txn, now, CLICK_ERROR.transactionCancelled);
    return reject(CLICK_ERROR.transactionCancelled, payment.id, `status ${payment.status}`);
  }
  if (await store.isTargetUnlocked(payment.id)) {
    // VERIFY: Click does not capture after -4 on Complete.
    await cancelTxn(store, txn, now, CLICK_ERROR.alreadyPaid);
    await store.markFailed(payment.id, "target_unlocked");
    return reject(CLICK_ERROR.alreadyPaid, payment.id, "target_unlocked");
  }
  const result = await store.markPaid(payment.id, { providerPaymentId: p.clickTransId, at: now });
  await store.updateProviderTxn(txn.id, { state: TXN_STATE.performed, performTime: now });
  return ok(payment.id, ref, result === "already_paid");
}

type Kind = "prepare" | "complete";

const ECHO_INT_RE = /^\d{1,15}$/;

async function handle(kind: Kind, raw: ClickRawParams, store: PaymentStore, config: ClickConfig, clock: Clock) {
  const parsed = parseClickParams(raw, kind === "complete");
  const fields = clickFields(raw);
  const echoId = fields.click_trans_id ?? null;
  const echo = {
    click_trans_id: echoId !== null && ECHO_INT_RE.test(echoId) ? Number(echoId) : echoId,
    merchant_trans_id: fields.merchant_trans_id ?? null,
  };
  const reply = (o: Outcome) => ({ echo, code: o.code, merchantRef: o.code === 0 ? (o.merchantRef ?? null) : null });
  const rejectUnauthenticated = async (code: ClickErrorCode, error: string) => {
    await recordEventSafely(store, {
      paymentId: null, provider: "click", eventType: kind, providerEventId: invalidEventId(),
      payload: fields, signatureValid: false, outcome: "rejected", error,
    });
    return reply(reject(code, null, error));
  };
  if (!parsed.ok) return rejectUnauthenticated(CLICK_ERROR.badRequest, parsed.reason);
  const p = parsed.params;
  const signOk = (kind === "prepare" ? verifyPrepareSign : verifyCompleteSign)(p, config.secretKey);
  if (!signOk) return rejectUnauthenticated(CLICK_ERROR.signFailed, "bad_signature");
  if (p.serviceId !== config.serviceId) return rejectUnauthenticated(CLICK_ERROR.signFailed, "service_id mismatch");
  let out: Outcome;
  try {
    out = await (kind === "prepare" ? prepare : complete)(p, store, clock.nowMs());
  } catch (error) {
    out = { code: CLICK_ERROR.failedToUpdate, outcome: "error", paymentId: null, error: errorText(error) };
  }
  // Dedupe key (doc 08 §9.3): click_trans_id; a Complete carrying Click's error < 0 is a distinct ":err" event.
  await recordEventSafely(store, {
    paymentId: out.paymentId, provider: "click", eventType: kind,
    providerEventId: kind === "complete" && p.error < 0 ? `${p.clickTransId}:err` : p.clickTransId,
    payload: fields, signatureValid: true, outcome: out.outcome, error: out.error,
  });
  return reply(out);
}

export async function handlePrepare(
  raw: ClickRawParams, store: PaymentStore, config: ClickConfig, clock: Clock = systemClock,
): Promise<ClickPrepareReply> {
  const r = await handle("prepare", raw, store, config, clock);
  return { ...r.echo, merchant_prepare_id: r.merchantRef, error: r.code, error_note: CLICK_ERROR_NOTE[r.code] };
}

export async function handleComplete(
  raw: ClickRawParams, store: PaymentStore, config: ClickConfig, clock: Clock = systemClock,
): Promise<ClickCompleteReply> {
  const r = await handle("complete", raw, store, config, clock);
  return { ...r.echo, merchant_confirm_id: r.merchantRef, error: r.code, error_note: CLICK_ERROR_NOTE[r.code] };
}
