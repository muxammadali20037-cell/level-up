/**
 * API errors with stable, machine-readable codes. The client maps `code` to a UI state and never shows raw
 * technical text; `message` is a short English developer hint (no PII, no stack traces).
 */
export const API_ERROR_STATUS = {
  bad_request: 400,
  unauthorized: 401,
  payment_required: 402,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  gone: 410,
  payload_too_large: 413,
  rate_limited: 429,
  internal: 500,
  unavailable: 503,
} as const;

export type ApiErrorCode = keyof typeof API_ERROR_STATUS;

export type ApiErrorDetails = Readonly<Record<string, unknown>>;

export class ApiError extends Error {
  override readonly name = "ApiError";

  constructor(
    readonly code: ApiErrorCode,
    readonly status: number,
    message: string,
    readonly details?: ApiErrorDetails,
    /** Seconds; sent as `Retry-After` header and `retryAfter` in the body (429). */
    readonly retryAfter?: number,
  ) {
    super(message);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

const make =
  (code: ApiErrorCode, fallback: string) =>
  (message: string = fallback, details?: ApiErrorDetails): ApiError =>
    new ApiError(code, API_ERROR_STATUS[code], message, details);

export const badRequest = make("bad_request", "Bad request");
export const unauthorized = make("unauthorized", "Authentication required");
export const paymentRequired = make("payment_required", "Payment required");
export const forbidden = make("forbidden", "Forbidden");
export const notFound = make("not_found", "Not found");
export const conflict = make("conflict", "Conflict");
export const gone = make("gone", "Gone");
export const payloadTooLarge = make("payload_too_large", "Request body too large");
export const internalError = make("internal", "Internal error");
export const unavailable = make("unavailable", "Service unavailable");

export function rateLimited(retryAfterSeconds: number, details?: ApiErrorDetails): ApiError {
  const retryAfter = Math.max(1, Math.ceil(retryAfterSeconds));
  return new ApiError("rate_limited", API_ERROR_STATUS.rate_limited, "Too many requests", details, retryAfter);
}
