import "../globals.css";
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { ToastProvider } from "@/components/ui/toast";
import { pageOpenGraph } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import { TELEGRAM_BOOT_SCRIPT } from "@/lib/telegram/boot-script";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "landing.meta" });
  const { url: _url, ...openGraph } = pageOpenGraph(locale);
  return {
    metadataBase: siteUrl(),
    title: { default: t("title"), template: "%s · LEVEL" },
    description: t("description"),
    applicationName: "LEVEL",
    formatDetection: { telephone: false, email: false, address: false },
    openGraph,
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f17" },
  ],
};

/**
 * Root layout. An unknown first segment (/r/x, /admin/x, /foo.txt …) still renders this layout in the
 * default locale and lets the page call notFound(), so the styled, localized [locale]/not-found.tsx
 * answers with 404 instead of Next's bare error document (notFound() here would sit above every boundary).
 */
export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const [messages, t] = await Promise.all([getMessages(), getTranslations({ locale, namespace: "common" })]);
  // Client components only need shared UI strings; page copy stays on the server.
  const clientMessages = { common: messages.common, errors: messages.errors };

  return (
    // The Telegram boot script and SDK write data-* attributes and theme vars on <html> before hydration.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: TELEGRAM_BOOT_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-card focus:px-4 focus:py-3 focus:shadow-lg"
        >
          {t("nav.skipToContent")}
        </a>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <ToastProvider dismissLabel={t("buttons.close")}>{children}</ToastProvider>
          <TelegramProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
