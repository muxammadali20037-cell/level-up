"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import {
  TELEGRAM_SDK_URL,
  applySafeAreaInsets,
  applyThemeParams,
  expand,
  getWebApp,
  hasTelegramLaunchSignal,
  isTelegramWebApp,
  markTelegramReady,
  ready,
  resetTelegramShell,
} from "@/lib/telegram/webapp-client";

const subscribeNoop = () => () => {};
const serverSnapshot = () => false;

let initialized = false;

/** Idempotent: safe to call from both the effect (SDK already present) and Script onReady (late load). */
function initTelegram(): void {
  const webApp = getWebApp();
  if (initialized || !webApp) return;
  if (!isTelegramWebApp()) {
    // A stale launch signal in a normal browser: give the web chrome back.
    resetTelegramShell();
    return;
  }
  initialized = true;
  document.documentElement.dataset.telegramPlatform = webApp.platform;
  applyThemeParams(webApp);
  applySafeAreaInsets(webApp);
  webApp.onEvent("themeChanged", () => applyThemeParams(webApp));
  webApp.onEvent("safeAreaChanged", () => applySafeAreaInsets(webApp));
  webApp.onEvent("contentSafeAreaChanged", () => applySafeAreaInsets(webApp));
  try {
    // Keeps a scroll gesture during the test from minimizing the Mini App.
    if (webApp.isVersionAtLeast("7.7")) webApp.disableVerticalSwipes?.();
  } catch {
    // Best-effort on old clients.
  }
  ready();
  expand();
  markTelegramReady();
}

/**
 * Telegram Mini App shell. Loads telegram-web-app.js only when a Telegram launch signal exists,
 * so regular web visitors never pay for it. The pre-paint boot script (layout <head>) has already
 * applied data-tma and the theme; this re-applies them from the SDK and wires native buttons.
 */
export function TelegramProvider() {
  const shouldLoad = useSyncExternalStore(subscribeNoop, hasTelegramLaunchSignal, serverSnapshot);

  useEffect(() => {
    if (shouldLoad) initTelegram();
  }, [shouldLoad]);

  if (!shouldLoad) return null;
  return (
    <Script
      id="telegram-web-app"
      src={TELEGRAM_SDK_URL}
      strategy="afterInteractive"
      onReady={initTelegram}
      onError={resetTelegramShell}
    />
  );
}
