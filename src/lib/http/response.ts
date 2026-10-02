import { NextResponse } from "next/server";
import { type ApiError } from "./errors";

/**
 * JSON envelope (01-architecture §5.1): success `{ data, meta? }`, error `{ error: { code, message, details?,
 * retryAfter?, requestId? } }`. Every API response is personal or volatile, so `no-store` is the default.
 */
export const NO_STORE_HEADERS: Readonly<Record<string, string>> = {
  "Cache-Control": "private, no-store",
};

export interface JsonInit {
  status?: number;
  headers?: Record<string, string>;
  meta?: Record<string, unknown>;
}

export function json<T>(data: T, init: JsonInit = {}): NextResponse {
  const body = init.meta ? { data, meta: init.meta } : { data };
  return NextResponse.json(body, {
    status: init.status ?? 200,
    headers: { ...NO_STORE_HEADERS, ...init.headers },
  });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204, headers: NO_STORE_HEADERS });
}

export interface ErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    retryAfter?: number;
    requestId?: string;
  };
}

/** Serializes an ApiError. Never includes stacks or causes. */
export function errorResponse(error: ApiError, requestId?: string): NextResponse {
  const body: ErrorBody = {
    error: {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: { ...error.details } } : {}),
      ...(error.retryAfter != null ? { retryAfter: error.retryAfter } : {}),
      ...(requestId ? { requestId } : {}),
    },
  };
  const headers: Record<string, string> = { ...NO_STORE_HEADERS };
  if (error.retryAfter != null) headers["Retry-After"] = String(error.retryAfter);
  if (requestId) headers["x-request-id"] = requestId;
  return NextResponse.json(body, { status: error.status, headers });
}
