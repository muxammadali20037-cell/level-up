import type { Page } from "@playwright/test";

export type TelegramWindow = { __tgCalls: string[]; Telegram: unknown };

/** Stubs a Telegram client: WebApp object + empty SDK response. Navigate with a `#tgWebApp…` hash afterwards. */
export async function stubTelegram(
  page: Page,
  options: { colorScheme: "light" | "dark"; themeParams: Record<string, string>; platform?: string },
): Promise<void> {
  await page.route("https://telegram.org/js/telegram-web-app.js", (route) =>
    route.fulfill({ contentType: "text/javascript", body: "" }),
  );
  await page.addInitScript((opts) => {
    const w = window as unknown as TelegramWindow;
    const calls: string[] = [];
    const record = (name: string) => (...args: unknown[]) => {
      calls.push(args.length && typeof args[0] === "string" ? `${name}:${args[0]}` : name);
      return button;
    };
    const button: Record<string, unknown> = new Proxy({}, { get: (_t, key) => record(String(key)) });
    w.__tgCalls = calls;
    w.Telegram = {
      WebApp: {
        initData: "query_id=AAA&user=%7B%22id%22%3A1%7D&auth_date=1&hash=abc",
        initDataUnsafe: { start_param: "REF123" },
        version: "8.0",
        platform: opts.platform ?? "android",
        colorScheme: opts.colorScheme,
        themeParams: opts.themeParams,
        isExpanded: false,
        viewportStableHeight: 700,
        safeAreaInset: { top: 24, bottom: 16, left: 0, right: 0 },
        contentSafeAreaInset: { top: 46, bottom: 0, left: 0, right: 0 },
        BackButton: button,
        MainButton: button,
        HapticFeedback: button,
        ready: () => calls.push("ready"),
        expand: () => calls.push("expand"),
        close: () => calls.push("close"),
        isVersionAtLeast: () => true,
        setHeaderColor: (c: string) => calls.push(`header:${c}`),
        setBackgroundColor: (c: string) => calls.push(`background:${c}`),
        disableVerticalSwipes: () => calls.push("disableVerticalSwipes"),
        onEvent: () => undefined,
        offEvent: () => undefined,
        openLink: () => undefined,
        openTelegramLink: () => undefined,
      },
    };
  }, options);
}

export function launchHash(themeParams: Record<string, string>): string {
  return `#tgWebAppData=x&tgWebAppVersion=8.0&tgWebAppPlatform=android&tgWebAppThemeParams=${encodeURIComponent(JSON.stringify(themeParams))}`;
}
