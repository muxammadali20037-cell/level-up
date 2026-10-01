import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TmaBackButton } from "@/components/telegram/tma-buttons";
import { localeAlternates, pageOpenGraph } from "@/i18n/metadata";
import { routing } from "@/i18n/routing";

export type LegalDoc = "privacy" | "terms" | "help";

export async function legalMetadata(params: Promise<{ locale: string }>, doc: LegalDoc): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "common.footer" });
  return {
    title: t(doc),
    robots: { index: false, follow: true },
    alternates: localeAlternates(locale, `/${doc}`),
    openGraph: { ...pageOpenGraph(locale, `/${doc}`), title: t(doc) },
  };
}

/** Placeholder for the footer's Privacy / Terms / Help pages until the real documents are published. */
export async function LegalPlaceholder({ params, doc }: { params: Promise<{ locale: string }>; doc: LegalDoc }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [tf, t] = await Promise.all([
    getTranslations({ locale, namespace: "common.footer" }),
    getTranslations({ locale, namespace: "legal.pending" }),
  ]);
  return (
    <>
      <SiteHeader />
      <main id="main" className="container-flow py-10">
        <TmaBackButton href="/" />
        <h1 className="text-3xl font-extrabold tracking-tight text-balance">{tf(doc)}</h1>
        <h2 className="mt-6 text-lg font-semibold">{t("title")}</h2>
        <p className="mt-2 leading-relaxed text-muted-foreground">{t("text")}</p>
      </main>
      <SiteFooter />
    </>
  );
}
