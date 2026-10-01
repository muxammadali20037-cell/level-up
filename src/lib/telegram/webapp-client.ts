import "client-only";

import { TELEGRAM_THEME_VARS, telegramColorScheme, telegramThemeVars } from "./theme";
import type { TelegramInset, TelegramWebApp } from "./types";

export type { TelegramWebApp } from "./types";

export const TELEGRAM_SDK_URL = "https://telegram.org/js/telegram-web-app.js";

export function getWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

/** True only inside a real Telegram client (the SDK also defines WebApp in normal browsers). */
export function isTelegramWebApp(): boolean {
  const webApp = getWebApp();
  return Boolean(webApp && (webApp.initData.length > 0 || (webApp.platform && webApp.platform !== "unknown")));
}

/**
 * Cheap pre-SDK check so normal web visitors never download telegram-web-app.js.
 * Telegram passes launch params in the URL hash; the SDK keeps them in sessionStorage across reloads.
 */
export function hasTelegramLaunchSignal(): boolean {
  if (typeof window === "undefined") return false;
  if (window.Telegram?.WebApp || window.TelegramWebviewProxy) return true;
  if (window.location.hash.includes("tgWebApp") || window.location.search.includes("tgWebApp")) return true;
  try {
    return window.sessionStorage.getItem("__telegram__initParams") !== null;
  } catch {
    return false;
  }
}

function supports(webApp: TelegramWebApp, version: string): boolean {
  try {
    return webApp.isVersionAtLeast(version);
  } catch {
    return false;
  }
}

export function ready(): void {
  getWebApp()?.ready();
}

export function expand(): void {
  const webApp = getWebApp();
  if (webApp && !webApp.isExpanded) webApp.expand();
}

/**
 * Applies the readable subset of Telegram's theme (see theme.ts) as CSS variables and sets
 * data-telegram-theme="light|dark" on <html>. Variables Telegram no longer provides are removed.
 */
export function applyThemeParams(webApp: TelegramWebApp | null = getWebApp()): void {
  if (!webApp || typeof document === "undefined") return;
  const root = document.documentElement;
  const vars = telegramThemeVars(webApp.themeParams);
  for (const name of TELEGRAM_THEME_VARS) {
    const value = vars[name];
    if (value) root.style.setProperty(name, value);
    else root.style.removeProperty(name);
  }
  const scheme = webApp.colorScheme ?? telegramColorScheme(webApp.themeParams?.bg_color);
  root.dataset.telegramTheme = scheme === "dark" ? "dark" : "light";
  if (supports(webApp, "6.1")) {
    try {
      webApp.setHeaderColor("bg_color");
      webApp.setBackgroundColor("bg_color");
    } catch {
      // Older clients reject color keys; the page still renders with our tokens.
    }
  }
}

/** Undo the pre-paint boot script when the launch signal turned out not to be a Telegram client. */
export function resetTelegramShell(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const name of TELEGRAM_THEME_VARS) root.style.removeProperty(name);
  delete root.dataset.tma;
  delete root.dataset.telegramTheme;
}

const READY_EVENT = "level:telegram-ready";
let telegramReady = false;

/** Called once the SDK is initialised inside a real Telegram client. */
export function markTelegramReady(): void {
  telegramReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

export function isTelegramReady(): boolean {
  return telegramReady;
}

export function subscribeTelegramReady(callback: () => void): () => void {
  window.addEventListener(READY_EVENT, callback);
  return () => window.removeEventListener(READY_EVENT, callback);
}

function setInsetVars(prefix: string, inset: TelegramInset | undefined): void {
  const style = document.documentElement.style;
  for (const side of ["top", "right", "bottom", "left"] as const) {
    style.setProperty(`${prefix}-${side}`, `${inset?.[side] ?? 0}px`);
  }
}

/** Telegram safe areas (Bot API 8.0+) feed --safe-* in globals.css together with env(safe-area-inset-*). */
export function applySafeAreaInsets(webApp: TelegramWebApp | null = getWebApp()): void {
  if (!webApp || typeof document === "undefined") return;
  setInsetVars("--tg-safe", webApp.safeAreaInset);
  setInsetVars("--tg-content-safe", webApp.contentSafeAreaInset);
}

/** Shows Telegram's native back button. Returns a cleanup that removes the handler and hides it. */
export function showBackButton(onClick: () => void): () => void {
  const webApp = getWebApp();
  if (!webApp || !isTelegramWebApp() || !supports(webApp, "6.1")) return () => {};
  webApp.BackButton.onClick(onClick);
  webApp.BackButton.show();
  return () => {
    webApp.BackButton.offClick(onClick);
    webApp.BackButton.hide();
  };
}

export type MainButtonOptions = { text: string; onClick: () => void; disabled?: boolean; loading?: boolean };

/** Configures Telegram's bottom MainButton. Returns a cleanup that detaches and hides it. */
export function setMainButton({ text, onClick, disabled = false, loading = false }: MainButtonOptions): () => void {
  const webApp = getWebApp();
  if (!webApp || !isTelegramWebApp()) return () => {};
  const button = webApp.MainButton;
  button.setText(text);
  if (disabled) button.disable();
  else button.enable();
  if (loading) button.showProgress(false);
  else button.hideProgress();
  button.onClick(onClick);
  button.show();
  return () => {
    button.offClick(onClick);
    button.hideProgress();
    button.hide();
  };
}

export type HapticKind = "light" | "success" | "error";

export function haptic(kind: HapticKind): void {
  const webApp = getWebApp();
  if (!webApp || !isTelegramWebApp() || !supports(webApp, "6.1")) return;
  try {
    if (kind === "light") webApp.HapticFeedback.impactOccurred("light");
    else webApp.HapticFeedback.notificationOccurred(kind);
  } catch {
    // Haptics are best-effort.
  }
}

/** Signed init data for server-side verification ("" outside Telegram). */
export function getInitData(): string {
  return getWebApp()?.initData ?? "";
}

/** startapp parameter (referral code / deep link), from init data or the launch URL. */
export function getStartParam(): string | null {
  const fromInitData = getWebApp()?.initDataUnsafe?.start_param;
  if (fromInitData) return fromInitData;
  if (typeof window === "undefined") return null;
  const fromQuery = new URLSearchParams(window.location.search).get("tgWebAppStartParam");
  if (fromQuery) return fromQuery;
  const fromHash = new URLSearchParams(window.location.hash.slice(1)).get("tgWebAppStartParam");
  return fromHash || null;
}
