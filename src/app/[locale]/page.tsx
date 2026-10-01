import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TmaMainButton } from "@/components/telegram/tma-buttons";
import { localeAlternates, pageOpenGraph } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "landing.meta" });
  return {
    title: { absolute: t("title") },
    alternates: localeAlternates(locale),
    openGraph: { ...pageOpenGraph(locale), title: t("title"), description: t("description") },
  };
}

/** Static landing: no cookies/headers/DB. Value must be clear within 3–5 seconds. */
export default async function LandingPage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "landing" });

  return (
    <div className="relative isolate">
      {/* Decorative glow only; it never overflows horizontally, so real overflow stays scrollable. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 0%, color-mix(in oklab, var(--primary) 9%, transparent), transparent 72%)",
        }}
      />
      <SiteHeader wide />
      <main id="main">
        <Hero />
        <HowItWorks />
        <FinalCta />
      </main>
      <SiteFooter wide />
      <TmaMainButton text={t("cta")} href="/start" />
    </div>
  );
}
