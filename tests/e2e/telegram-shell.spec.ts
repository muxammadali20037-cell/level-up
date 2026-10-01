import { expect, test } from "@playwright/test";
import { seriousViolations } from "./helpers/axe";
import { launchHash, stubTelegram, type TelegramWindow } from "./helpers/telegram";

const DARK = { bg_color: "#101014", text_color: "#f5f5f5", button_color: "#3390ec", button_text_color: "#ffffff" };
/** Telegram's default Android light theme: hint and button colors fail AA on white. */
const ANDROID_LIGHT = {
  bg_color: "#ffffff",
  text_color: "#222222",
  hint_color: "#a8a8a8",
  link_color: "#2678b6",
  button_color: "#50a8eb",
  button_text_color: "#ffffff",
  secondary_bg_color: "#f0f0f0",
  section_bg_color: "#ffffff",
};

test("Mini App shell: ready/expand, readable theme subset, safe areas, native buttons", async ({ page }) => {
  await stubTelegram(page, { colorScheme: "dark", themeParams: DARK });
  await page.goto(`/uz${launchHash(DARK)}`);
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-tma", "");
  await expect(html).toHaveAttribute("data-telegram-theme", "dark");
  await expect(html).toHaveAttribute("data-telegram-platform", "android");

  const state = await page.evaluate(() => {
    const style = document.documentElement.style;
    return {
      background: style.getPropertyValue("--background"),
      primary: style.getPropertyValue("--primary"),
      contentSafeTop: style.getPropertyValue("--tg-content-safe-top"),
      bodyPaddingTop: getComputedStyle(document.body).paddingTop,
      calls: (window as unknown as TelegramWindow).__tgCalls,
    };
  });
  expect(state.background).toBe("#101014");
  // White on #3390ec is 3.6:1, so LEVEL's own primary stays.
  expect(state.primary).toBe("");
  expect(state.contentSafeTop).toBe("46px");
  expect(state.bodyPaddingTop).toBe("70px");
  expect(state.calls).toEqual(expect.arrayContaining(["ready", "expand", "disableVerticalSwipes", "header:bg_color"]));

  // TMA: no web logo, in-page CTA replaced by the native MainButton; the language pill stays.
  await expect(page.getByTestId("hero-cta")).toBeHidden();
  await expect(page.getByRole("banner").getByRole("img", { name: "LEVEL" })).toBeHidden();
  await expect(page.getByTestId("lang-ru")).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as unknown as TelegramWindow).__tgCalls)).toEqual(
    expect.arrayContaining(["setText:LEVELIMNI ANIQLASH", "show"]),
  );
});

test("theme is applied before first paint from the launch hash (no LEVEL palette flash)", async ({ page }) => {
  // The SDK request never completes here, so only the inline boot script can have set these.
  await page.route("https://telegram.org/js/telegram-web-app.js", () => undefined);
  await page.goto(`/uz${launchHash(DARK)}`, { waitUntil: "commit" });
  await page.waitForSelector("body");
  const background = await page.evaluate(() => document.documentElement.style.getPropertyValue("--background"));
  expect(background).toBe("#101014");
});

test("Telegram Android light theme keeps text readable (axe color-contrast)", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await stubTelegram(page, { colorScheme: "light", themeParams: ANDROID_LIGHT });
  for (const path of ["/uz", "/uz/start"]) {
    await page.goto(`${path}${launchHash(ANDROID_LIGHT)}`);
    await expect(page.locator("html")).toHaveAttribute("data-telegram-platform", "android");
    expect(await seriousViolations(page, ["color-contrast"]), path).toEqual([]);
  }
});

test("regular browsers never load the Telegram SDK", async ({ page }) => {
  const sdkRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("telegram-web-app.js")) sdkRequests.push(request.url());
  });
  await page.goto("/uz");
  await expect(page.getByTestId("hero-cta")).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(sdkRequests).toEqual([]);
  await expect(page.locator("html")).not.toHaveAttribute("data-telegram-theme", /.+/);
  await expect(page.locator("html")).not.toHaveAttribute("data-tma", /.*/);
});
