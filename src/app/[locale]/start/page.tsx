import { ArrowLeft, Compass } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { TmaBackButton } from "@/components/telegram/tma-buttons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { localeAlternates, pageOpenGraph } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/start">): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "start.meta" });
  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/start"),
    openGraph: { ...pageOpenGraph(locale, "/start"), title: t("title") },
  };
}

/** Placeholder until the profession picker ships; keeps the landing CTA working. */
export default async function StartPage({ params }: PageProps<"/[locale]/start">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, tc] = await Promise.all([
    getTranslations({ locale, namespace: "start" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  return (
    <>
      <SiteHeader />
      <main id="main" className="container-flow pb-16 pt-2">
        {/* In Telegram the native BackButton replaces this link. */}
        <Button asChild variant="ghost" className="-ml-3 px-3 tma:hidden">
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            {tc("buttons.back")}
          </Link>
        </Button>
        <TmaBackButton href="/" />
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-balance">
          {t("profession.title")}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground text-pretty">{t("profession.subtitle")}</p>
        <Card className="mt-8">
          <CardContent className="flex flex-col items-start gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Compass className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">{t("comingSoon.title")}</h2>
              <p className="mt-1 leading-relaxed text-muted-foreground">{t("comingSoon.text")}</p>
            </div>
            <Button asChild variant="outline" block>
              <Link href="/">{t("comingSoon.back")}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
