import { useTranslations } from "next-intl";
import { SectionHeading } from "./section-heading";

const STEPS = ["1", "2", "3"] as const;

export function HowItWorks() {
  const t = useTranslations("landing.how");

  return (
    <section aria-labelledby="how-title" className="container-wide py-10 md:py-20">
      <SectionHeading id="how-title">{t("title")}</SectionHeading>
      <ol className="relative mt-8 grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-3 md:gap-6">
        {STEPS.map((step) => (
          <li
            key={step}
            className="flex min-w-0 gap-4 rounded-card border border-border bg-card p-5 [overflow-wrap:anywhere] md:flex-col md:gap-5 md:p-7"
          >
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-base font-bold tabular-nums text-background"
            >
              {step}
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-snug">{t(`steps.${step}.title`)}</h3>
              <p className="mt-1 leading-relaxed text-muted-foreground">{t(`steps.${step}.text`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
