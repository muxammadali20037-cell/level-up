/**
 * Click SHOP API (merchant side) wire format: request parsing, MD5 sign_string checks and the checkout URL.
 * Reference: https://docs.click.uz/click-api-request/ — VERIFY every field against the current Click docs before
 * go-live.
 */
import { parseMajorToMinor, toMajorString } from "../money";
import { md5Hex, safeEqual } from "../signing";

export interface ClickConfig {
  readonly serviceId: string;
  readonly merchantId: string;
  /** Click SECRET_KEY (env only, never in payment_provider_configs.settings). */
  readonly secretKey: string;
  /** Optional merchant_user_id for the checkout URL. */
  readonly merchantUserId?: string;
}

export const CLICK_ACTION = { prepare: 0, complete: 1 } as const;

export const CLICK_ERROR = {
  success: 0,
  signFailed: -1,
  incorrectAmount: -2,
  actionNotFound: -3,
  alreadyPaid: -4,
  orderNotFound: -5,
  transactionNotFound: -6,
  failedToUpdate: -7,
  badRequest: -8,
  transactionCancelled: -9,
} as const;
export type ClickErrorCode = (typeof CLICK_ERROR)[keyof typeof CLICK_ERROR];

export const CLICK_ERROR_NOTE: Readonly<Record<ClickErrorCode, string>> = {
  0: "Success",
  [-1]: "SIGN CHECK FAILED!",
  [-2]: "Incorrect parameter amount",
  [-3]: "Action not found",
  [-4]: "Already paid",
  [-5]: "User does not exist",
  [-6]: "Transaction does not exist",
  [-7]: "Failed to update user",
  [-8]: "Error in request from click",
  [-9]: "Transaction cancelled",
};

/** Parsed Click callback. `amount` keeps the exact string Click sent: the sign is computed over it verbatim. */
export interface ClickParams {
  readonly clickTransId: string;
  readonly serviceId: string;
  readonly clickPaydocId: string;
  readonly merchantTransId: string;
  /** Present on Complete only. */
  readonly merchantPrepareId: string | null;
  readonly amount: string;
  /** Amount in tiyin, parsed without floating point ("1000" and "1000.00" → 100000). */
  readonly amountTiyin: number;
  readonly action: number;
  /** Click-side status: 0 ok, < 0 the payment failed/was cancelled at Click. */
  readonly error: number;
  readonly errorNote: string;
  readonly signTime: string;
  readonly signString: string;
}

export type ClickRawParams = string | URLSearchParams | Readonly<Record<string, string | string[] | undefined>>;

function toSearchParams(raw: ClickRawParams): URLSearchParams {
  if (typeof raw === "string") return new URLSearchParams(raw.replace(/^\?/, ""));
  if (raw instanceof URLSearchParams) return raw;
  const out = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) value.forEach((v) => out.append(key, v));
    else if (value !== undefined) out.append(key, value);
  }
  return out;
}

function single(params: URLSearchParams, key: string): string | null {
  const values = params.getAll(key);
  if (values.length !== 1) return null; // missing or ambiguous (repeated) parameter
  return (values[0] ?? "").trim();
}

const INT_RE = /^-?\d{1,18}$/;

export type ClickParseResult =
  | { readonly ok: true; readonly params: ClickParams }
  | { readonly ok: false; readonly partial: Readonly<Record<string, string>>; readonly reason: string };

/** Parses an x-www-form-urlencoded body (or an already-decoded record). Never throws. */
export function parseClickParams(raw: ClickRawParams, expectMerchantPrepareId: boolean): ClickParseResult {
  const params = toSearchParams(raw);
  const partial = Object.fromEntries(params.entries());
  const get = (key: string): string | null => single(params, key);
  const required = ["click_trans_id", "service_id", "merchant_trans_id", "amount", "action", "sign_time", "sign_string"];
  if (expectMerchantPrepareId) required.push("merchant_prepare_id");
  for (const key of required) {
    if (!get(key)) return { ok: false, partial, reason: `missing ${key}` };
  }
  const action = get("action") ?? "";
  const error = get("error") || "0";
  if (!INT_RE.test(action) || !INT_RE.test(error)) return { ok: false, partial, reason: "action/error not an integer" };
  if (!INT_RE.test(get("click_trans_id") ?? "")) return { ok: false, partial, reason: "click_trans_id not an integer" };
  const amount = get("amount") ?? "";
  const amountTiyin = parseMajorToMinor(amount, 2);
  if (amountTiyin === null) return { ok: false, partial, reason: "amount is not a decimal number" };
  return {
    ok: true,
    params: {
      clickTransId: get("click_trans_id") ?? "",
      serviceId: get("service_id") ?? "",
      clickPaydocId: get("click_paydoc_id") ?? "",
      merchantTransId: get("merchant_trans_id") ?? "",
      merchantPrepareId: expectMerchantPrepareId ? get("merchant_prepare_id") : null,
      amount,
      amountTiyin,
      action: Number(action),
      error: Number(error),
      errorNote: get("error_note") ?? "",
      signTime: get("sign_time") ?? "",
      signString: (get("sign_string") ?? "").toLowerCase(),
    },
  };
}

/**
 * Prepare (action 0): md5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + amount + action + sign_time)
 * Complete (action 1): md5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + merchant_prepare_id + amount
 *                          + action + sign_time)
 * The `action` used is the one Click sent (signed), so an action mismatch is reported as -3, not -1.
 */
export function computeClickSign(params: ClickParams, secretKey: string): string {
  const prepareId = params.merchantPrepareId ?? "";
  return md5Hex(
    `${params.clickTransId}${params.serviceId}${secretKey}${params.merchantTransId}${prepareId}` +
      `${params.amount}${params.action}${params.signTime}`,
  );
}

export function verifyPrepareSign(params: ClickParams, secretKey: string): boolean {
  return params.merchantPrepareId === null && safeEqual(computeClickSign(params, secretKey), params.signString);
}

export function verifyCompleteSign(params: ClickParams, secretKey: string): boolean {
  return params.merchantPrepareId !== null && safeEqual(computeClickSign(params, secretKey), params.signString);
}

/**
 * https://my.click.uz/services/pay?service_id=…&merchant_id=…&amount=1000.00&transaction_param=<paymentId>&return_url=…
 * VERIFY: Click accepts amount with 2 decimals ("1000.00"); docs examples sometimes show integers.
 */
export function buildClickCheckoutUrl(input: {
  readonly config: ClickConfig;
  readonly amountTiyin: number;
  readonly paymentId: string;
  readonly returnUrl: string;
}): string {
  const url = new URL("https://my.click.uz/services/pay");
  url.searchParams.set("service_id", input.config.serviceId);
  url.searchParams.set("merchant_id", input.config.merchantId);
  if (input.config.merchantUserId) url.searchParams.set("merchant_user_id", input.config.merchantUserId);
  url.searchParams.set("amount", toMajorString(input.amountTiyin, 2));
  url.searchParams.set("transaction_param", input.paymentId);
  url.searchParams.set("return_url", input.returnUrl);
  return url.toString();
}
