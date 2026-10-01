import { telegramColorScheme, telegramThemeVars } from "./theme";

type ThemeVarsFn = typeof telegramThemeVars;
type SchemeFn = typeof telegramColorScheme;

/**
 * Runs in <head> before first paint. If Telegram launch params are present it marks <html data-tma>
 * (hides web-only chrome via the `tma:` variant) and applies the readable subset of the Telegram theme,
 * so a Mini App user never sees the LEVEL palette flash before the SDK loads.
 * MUST stay self-contained: it is serialized with toString(); helpers arrive as arguments.
 */
function bootTelegram(themeVars: ThemeVarsFn, colorScheme: SchemeFn): void {
  try {
    const root = document.documentElement;
    const { hash, search } = window.location;
    let stored: string | null = null;
    try {
      stored = window.sessionStorage.getItem("__telegram__initParams");
    } catch {
      stored = null;
    }
    const w = window as Window & { TelegramWebviewProxy?: unknown };
    const signal = hash.includes("tgWebApp") || search.includes("tgWebApp") || Boolean(w.TelegramWebviewProxy) || stored !== null;
    if (!signal) return;
    root.setAttribute("data-tma", "");

    let raw = new URLSearchParams(hash.slice(1)).get("tgWebAppThemeParams") ?? new URLSearchParams(search).get("tgWebAppThemeParams");
    if (!raw && stored) raw = (JSON.parse(stored) as { tgWebAppThemeParams?: string }).tgWebAppThemeParams ?? null;
    if (!raw) return;
    const params = JSON.parse(raw) as Parameters<ThemeVarsFn>[0];
    const vars = themeVars(params);
    for (const [name, value] of Object.entries(vars)) if (value) root.style.setProperty(name, value);
    const scheme = colorScheme(params?.bg_color);
    if (scheme) root.setAttribute("data-telegram-theme", scheme);
  } catch {
    // Never block rendering: the provider re-applies the theme once the SDK is ready.
  }
}

export const TELEGRAM_BOOT_SCRIPT = `(${bootTelegram.toString()})(${telegramThemeVars.toString()},${telegramColorScheme.toString()});`;
