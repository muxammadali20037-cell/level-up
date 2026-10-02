/**
 * Helpers for writing provider callbacks to `payment_events` through {@link PaymentStore.recordEvent}.
 *
 * Providers record an event AFTER applying it, with the final outcome. Recording is best effort: the authoritative
 * state lives in payments / provider_transactions, and an audit-write failure must never change the protocol reply
 * (a Click Complete answered with -7 after a successful capture would make Click reverse money we already counted).
 * The application pipeline (doc 08 §9.1) additionally stores the raw request before calling a handler.
 */
import { randomUUID } from "node:crypto";
import { type PaymentEventInput, type PaymentStore } from "./provider";

/** payment_events.error is limited to 2000 characters. */
export const EVENT_ERROR_MAX = 2000;

/**
 * Dedupe key for an unauthenticated request (doc 08 P8): a forged request must never occupy the
 * (provider, event_type, provider_event_id) key of a genuine callback.
 */
export function invalidEventId(): string {
  return `invalid:${randomUUID()}`;
}

export function errorText(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error);
  return text.slice(0, EVENT_ERROR_MAX);
}

/** Records an event; swallows storage errors (see module comment). Returns null when recording failed. */
export async function recordEventSafely(
  store: PaymentStore,
  input: PaymentEventInput,
): Promise<"new" | "duplicate" | null> {
  try {
    return await store.recordEvent({ ...input, error: input.error === undefined ? undefined : errorText(input.error) });
  } catch {
    return null;
  }
}
