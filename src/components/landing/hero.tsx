import { ArrowRight, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { BrandText } from "@/components/brand/brand-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { FULL_REPORT_DISPLAY_PRICE, formatMajorAmount } from "@/lib/pricing/display-price";
import { SampleResultCard } from "./sample-result-card";
import { TrustRow } from "./trust-row";

export function Hero() {
  const t = useTranslations("landing");
  const tm = useTranslations("money");
  const locale = useLocale();
  const { amountMinor, minorUnits } = FULL_REPORT_DISPLAY_PRICE;
  const price = tm("UZS", { amount: formatMajorAmount(locale, amountMinor, minorUnits) });

  return (
    <section
      aria-labelledby="hero-title"
      className="container-wide grid grid-cols-1 items-center gap-12 pb-14 pt-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-16 md:pb-24 md:pt-14"
    >
      <div className="flex min-w-0 flex-col items-start">
        <Badge variant="primary" className="mb-5">
          <Sparkles aria-hidden="true" />
          {t("hero.eyebrow")}
        </Badge>
        <h1
          id="hero-title"
          className="text-[clamp(1.75rem,8.5vw,2.375rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance [overflow-wrap:anywhere] hyphens-auto sm:text-5xl lg:text-6xl"
        >
          <BrandText text={t("hero.titleA")} />
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty md:mt-5 md:text-xl">
          {t("hero.subA")}
        </p>
        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto md:mt-8">
          {/* In Telegram the native MainButton carries this action (TmaMainButton on the page). */}
          <Button asChild size="lg" block className="sm:min-w-80 tma:hidden">
            <Link href="/start" data-testid="hero-cta">
              {t("cta")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <p data-testid="price-note" className="text-center text-sm text-muted-foreground text-pretty sm:text-left">
            {t("hero.priceNote", { price })}
          </p>
        </div>
        <TrustRow className="mt-6" />
      </div>
      <SampleResultCard />
    </section>
  );
}
