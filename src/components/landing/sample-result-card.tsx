import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { LevelBadge } from "@/components/brand/level-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { cn } from "@/lib/utils/cn";

type Tone = "strong" | "bottleneck" | "neutral";

/** Illustrative numbers only — the card is always labelled as a sample. */
const SAMPLE_SKILLS: ReadonlyArray<{ key: "sales" | "marketing" | "team" | "finance" | "processes"; score: number; tone: Tone }> = [
  { key: "sales", score: 72, tone: "strong" },
  { key: "marketing", score: 58, tone: "neutral" },
  { key: "team", score: 47, tone: "neutral" },
  { key: "finance", score: 41, tone: "neutral" },
  { key: "processes", score: 34, tone: "bottleneck" },
];

const BAR_TONE: Record<Tone, string> = {
  strong: "bg-success",
  bottleneck: "bg-warning",
  neutral: "bg-primary/60",
};

export function SampleResultCard({ className }: { className?: string }) {
  const t = useTranslations("landing.preview");
  const tc = useTranslations("common");

  return (
    <figure aria-label={t("label")} className={cn("relative mx-auto w-full max-w-[26rem]", className)}>
      <div
        aria-hidden="true"
        className="absolute -inset-y-6 inset-x-0 -z-10 rounded-[3rem] opacity-90 blur-2xl md:-inset-x-6"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 35%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 75%)",
        }}
      />
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-5 py-3">
          <span className="min-w-0 text-sm font-semibold">{t("profession")}</span>
          <Badge variant="outline" size="sm" className="uppercase">
            {tc("sample")}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-4 px-5 pt-5">
          <LevelBadge level={4} size="lg" showText={false} decorative />
          <div className="flex min-w-0 flex-col items-start gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {tc("levelLabel", { level: 4 })}
            </span>
            <span className="max-w-full text-xl font-bold leading-tight [overflow-wrap:anywhere]">{tc("levels.4")}</span>
            <Badge variant="primary" size="sm" className="mt-0.5">
              {t("confidence")}
            </Badge>
          </div>
        </div>

        <ul className="flex flex-col gap-3.5 px-5 py-5">
          {SAMPLE_SKILLS.map(({ key, score, tone }) => {
            const name = t(`skills.${key}`);
            return (
              <li key={key}>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium">{name}</span>
                    {tone === "strong" && (
                      <Badge variant="success" size="sm">
                        {t("strongest")}
                      </Badge>
                    )}
                    {tone === "bottleneck" && (
                      <Badge variant="warning" size="sm">
                        {t("bottleneck")}
                      </Badge>
                    )}
                  </span>
                  <span aria-hidden="true" className="font-semibold tabular-nums">
                    {score}
                  </span>
                </div>
                <Meter
                  value={score}
                  label={name}
                  valueText={`${score} / 100`}
                  className="mt-2 h-1.5"
                  indicatorClassName={BAR_TONE[tone]}
                />
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
          <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <TrendingUp className="size-4 shrink-0" aria-hidden="true" />
            <span>{t("nextLevel")}</span>
          </span>
          <LevelBadge level={5} name={tc("levels.5")} size="sm" className="min-w-0" />
        </div>
      </Card>
      <figcaption className="mt-3 px-2 text-center text-xs text-muted-foreground">{t("caption")}</figcaption>
    </figure>
  );
}
