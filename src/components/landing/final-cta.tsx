import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** Focus ring drawn in the panel's own colors so it stays visible on the inverted (light-mode) slab. */
const PANEL_FOCUS = { "--focus-ring": "var(--cta-panel-foreground)" } as CSSProperties;

export function FinalCta() {
  const t = useTranslations("landing");

  return (
    <section aria-labelledby="final-title" className="container-wide py-10 md:py-20 tma:pb-16">
      <div
        style={PANEL_FOCUS}
        className="relative overflow-hidden rounded-[2rem] border border-border bg-cta-panel px-6 py-10 text-cta-panel-foreground md:px-14 md:py-16"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(70% 90% at 100% 0%, color-mix(in oklab, var(--primary) 45%, transparent), transparent 70%)",
          }}
        />
        <div className="relative flex flex-col items-start gap-4 md:max-w-2xl">
          <h2 id="final-title" className="text-2xl font-bold tracking-tight text-balance md:text-4xl">
            {t("final.title")}
          </h2>
          <p className="text-base leading-relaxed opacity-80 md:text-lg">{t("final.text")}</p>
          <Button
            asChild
            size="lg"
            block
            className="mt-4 bg-cta-action text-cta-action-foreground shadow-none hover:bg-cta-action/90 sm:w-auto sm:min-w-80 tma:hidden"
          >
            <Link href="/start" data-testid="final-cta">
              {t("cta")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
