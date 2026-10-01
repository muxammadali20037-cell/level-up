import { expect, test } from "@playwright/test";
import { horizontalOverflow, seriousViolations } from "./helpers/axe";

const LOCALES = [
  { locale: "uz", title: "Sen oʻz sohangda qaysi LEVELdasan?", cta: "LEVELIMNI ANIQLASH", price: /Toʻliq natija — 1\s000 soʻm/ },
  { locale: "ru", title: "На каком LEVEL ты в своей сфере?", cta: "УЗНАТЬ МОЙ LEVEL", price: /Полный результат — 1\s000 сум/ },
  { locale: "en", title: "What LEVEL are you at in your field?", cta: "FIND MY LEVEL", price: /Full result: UZS 1,000/ },
] as const;

for (const { locale, title, cta, price } of LOCALES) {
  test.describe(`landing /${locale}`, () => {
    test("renders hero, CTA and html lang", async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      const button = page.getByTestId("hero-cta");
      await expect(button).toBeVisible();
      await expect(button).toContainText(cta);
      await expect(page.getByText(/Namuna|Пример|Sample/).first()).toBeVisible();
    });

    test("states the price of the full result directly under the CTA (D3)", async ({ page }) => {
      await page.goto(`/${locale}`);
      const note = page.getByTestId("price-note");
      await expect(note).toHaveText(price);
      const [ctaBox, noteBox] = await Promise.all([page.getByTestId("hero-cta").boundingBox(), note.boundingBox()]);
      expect(noteBox!.y).toBeGreaterThan(ctaBox!.y + ctaBox!.height - 1);
      expect(noteBox!.y - (ctaBox!.y + ctaBox!.height)).toBeLessThan(32);
    });

    for (const colorScheme of ["light", "dark"] as const) {
      test(`has no serious axe violations (${colorScheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.setViewportSize({ width: 360, height: 780 });
        await page.goto(`/${locale}`);
        expect(await seriousViolations(page)).toEqual([]);
      });
    }

    test("survives 200% text size at 360px without clipping content", async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 740 });
      await page.goto(`/${locale}`);
      await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
      expect(await horizontalOverflow(page)).toEqual([]);
      for (const code of ["uz", "ru", "en"]) {
        const box = await page.getByTestId(`lang-${code}`).boundingBox();
        expect(box!.x + box!.width).toBeLessThanOrEqual(360);
      }
    });

    test("CTA navigates to the start step", async ({ page }) => {
      await page.goto(`/${locale}`);
      await page.getByTestId("hero-cta").click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/start$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("fits a 360px screen without horizontal scroll and has a ≥48px CTA", async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 780 });
      await page.goto(`/${locale}`);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
      // No real content (anything not aria-hidden) may stick out of the viewport.
      expect(await horizontalOverflow(page)).toEqual([]);
      const box = await page.getByTestId("hero-cta").boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
    });
  });
}

test("root redirects to a locale and the language switcher keeps the path", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(uz|ru|en)$/);
  await page.goto("/uz/start");
  await page.getByTestId("lang-ru").click();
  await expect(page).toHaveURL(/\/ru\/start$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
});

test("language links are 48px targets whose name starts with the visible code", async ({ page }) => {
  await page.goto("/uz");
  for (const code of ["uz", "ru", "en"]) {
    const link = page.getByTestId(`lang-${code}`);
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(48);
    expect(box!.width).toBeGreaterThanOrEqual(48);
    expect((await link.evaluate((el) => el.textContent ?? "")).toLowerCase().startsWith(code)).toBe(true);
  }
  await expect(page.getByRole("link", { name: /^ru\s*,\s*Русский$/i })).toBeVisible();
});

test("footer links reach the privacy, terms and help pages", async ({ page }) => {
  await page.goto("/en");
  const links = [["Privacy policy", "/en/privacy"], ["Terms of use", "/en/terms"], ["Help", "/en/help"]] as const;
  for (const [name, path] of links) {
    const link = page.getByRole("contentinfo").getByRole("link", { name });
    await expect(link).toHaveAttribute("href", path);
  }
  const response = await page.goto("/en/privacy");
  expect(response?.status()).toBe(200);
});

test("unknown paths render the localized 404", async ({ page }) => {
  const response = await page.goto("/en/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
});

test("unprefixed short links and unknown roots get a styled 404, not Next's bare error page", async ({ page }) => {
  for (const path of ["/s/unknown-slug", "/r/NOPE1234", "/admin/nope"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", /^(uz|ru|en)$/);
    await expect(page.getByRole("link", { name: /Bosh sahifa|главную|home page/i }).first()).toBeVisible();
  }
});

test("the admin console can never be framed", async ({ request }) => {
  const headers = (await request.get("/admin")).headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["x-frame-options"]).toBe("DENY");
});

test("sends security headers compatible with Telegram embedding", async ({ request }) => {
  const response = await request.get("/uz");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'self' https://web.telegram.org");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBeUndefined();
  expect(headers["x-powered-by"]).toBeUndefined();
});
