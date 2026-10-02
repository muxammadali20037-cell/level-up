import { type NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { ApiError, badRequest, forbidden, internalError, payloadTooLarge } from "./errors";
import { REQUEST_ID_HEADER, requestId as readRequestId } from "./request-meta";
import { errorResponse } from "./response";

/**
 * Route Handler wrapper: request id, CSRF (same-origin) check for mutating methods, body size limit for
 * `parseJson`, and error mapping (ApiError → its status, ZodError → 400, anything else → 500 with a logged
 * request id and no stack in the response).
 *
 * Handlers never call `cookies()`/`headers()` from next/headers: they read `request.cookies`/`request.headers` and set
 * cookies on the returned NextResponse, so they can be tested by calling the exported function with a NextRequest.
 */
export const DEFAULT_MAX_BODY_BYTES = 16 * 1024;

export interface RouteOptions {
  /** false only for provider webhooks (they are signature-verified instead). Default true. */
  csrf?: boolean;
  /** Body size limit enforced by parseJson. Default 16 KB (01-architecture §5.1). */
  maxBodyBytes?: number;
}

/** Second argument of a wrapped handler (Next's `{ params }` plus the request id). */
export interface HandlerContext<P> {
  params: Promise<P>;
  requestId: string;
}

export type RouteHandler<P> = (request: NextRequest, ctx: HandlerContext<P>) => Promise<Response>;

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const bodyLimits = new WeakMap<Request, number>();

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function withRoute<P = {}>(handler: RouteHandler<P>, opts: RouteOptions = {}) {
  return async (request: NextRequest, context: { params: Promise<P> }): Promise<Response> => {
    const requestId = readRequestId(request.headers);
    try {
      if (opts.csrf !== false && MUTATING.has(request.method)) assertSameOrigin(request);
      bodyLimits.set(request, opts.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES);
      const response = await handler(request, { params: context?.params ?? Promise.resolve({} as P), requestId });
      try {
        response.headers.set(REQUEST_ID_HEADER, requestId);
      } catch {
        // Immutable headers (e.g. Response.redirect): the id is still in the logs.
      }
      return response;
    } catch (error) {
      return toErrorResponse(error, request, requestId);
    }
  };
}

export function toErrorResponse(error: unknown, request: Request, requestId: string): Response {
  if (error instanceof ApiError) return errorResponse(error, requestId);
  if (error instanceof z.ZodError) {
    // Paths and issue codes only: never echo submitted values back.
    const issues = error.issues.map((issue) => ({ path: issue.path.map(String).join("."), code: issue.code }));
    return errorResponse(badRequest("Validation failed", { issues }), requestId);
  }
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    JSON.stringify({
      level: "error",
      msg: "unhandled_route_error",
      requestId,
      method: request.method,
      route: new URL(request.url).pathname,
      error: message.slice(0, 500),
    }),
  );
  return errorResponse(internalError("Internal error"), requestId);
}

function bearerPresent(request: Request): boolean {
  return /^Bearer\s+\S+/i.test(request.headers.get("authorization") ?? "");
}

function requestHost(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  return (forwarded || request.headers.get("host") || request.nextUrl.host || null)?.toLowerCase() ?? null;
}

function appHost(): string | null {
  try {
    return new URL(env().APP_URL).host.toLowerCase();
  } catch {
    return null;
  }
}

function hostOf(url: string | null): string | null {
  if (!url || url === "null") return null;
  try {
    return new URL(url).host.toLowerCase() || null;
  } catch {
    return null;
  }
}

/**
 * Cookie-authenticated mutations must come from our own origin. Bearer requests are exempt (a cross-site page
 * cannot attach an Authorization header without a CORS preflight we never allow). The Origin header is checked
 * (Referer when Origin is absent) against APP_URL's host and the request's own host. Requests with neither Origin,
 * Referer nor a cross-site Sec-Fetch-Site are non-browser clients, which cannot ride a victim's cookies, so they pass.
 */
export function assertSameOrigin(request: NextRequest): void {
  if (bearerPresent(request)) return;
  const allowed = new Set([appHost(), requestHost(request)].filter((h): h is string => Boolean(h)));
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  if (origin !== null || referer) {
    const host = origin !== null ? hostOf(origin) : hostOf(referer);
    if (!host || !allowed.has(host)) throw forbidden("Cross-origin request rejected", { reason: "csrf" });
    return;
  }
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    throw forbidden("Cross-origin request rejected", { reason: "csrf" });
  }
}

/** Reads the body with the route's size limit (streamed, so a lying Content-Length cannot bypass it). */
export async function readBodyText(request: Request, maxBytes?: number): Promise<string> {
  const limit = maxBytes ?? bodyLimits.get(request) ?? DEFAULT_MAX_BODY_BYTES;
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > limit) throw payloadTooLarge();
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel().catch(() => undefined);
      throw payloadTooLarge();
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

/**
 * Parses a JSON body against a zod schema. An empty body is treated as `{}` so all-optional schemas work for
 * body-less POSTs. Non-JSON content types are rejected (also blocks form-based CSRF).
 */
export async function parseJson<S extends z.ZodType>(
  request: Request,
  schema: S,
  opts: { maxBytes?: number } = {},
): Promise<z.output<S>> {
  const text = await readBodyText(request, opts.maxBytes);
  let value: unknown = {};
  if (text.trim().length > 0) {
    const type = request.headers.get("content-type") ?? "";
    if (!/^application\/(?:[\w.+-]+\+)?json\b/i.test(type)) {
      throw badRequest("Content-Type must be application/json", { reason: "content_type" });
    }
    try {
      value = JSON.parse(text);
    } catch {
      throw badRequest("Malformed JSON body", { reason: "malformed_json" });
    }
  }
  return schema.parse(value);
}

/** Parses query parameters (first value of each key) against a zod schema. */
export function parseQuery<S extends z.ZodType>(request: NextRequest | Request, schema: S): z.output<S> {
  const params = new URL(request.url).searchParams;
  const record: Record<string, string> = {};
  for (const [key, value] of params) if (!(key in record)) record[key] = value;
  return schema.parse(record);
}
