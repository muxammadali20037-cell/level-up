"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

/**
 * Segmented UZ / RU / EN switch that keeps the current path. 48×48 targets; each link's accessible name
 * starts with its visible code ("RU, Русский") so voice control ("tap RU") matches (WCAG 2.5.3).
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common.languages");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("label")}
      className={cn("inline-flex max-w-full items-center rounded-full border border-border bg-card shadow-xs", className)}
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            hrefLang={code}
            aria-current={active ? "true" : undefined}
            scroll={false}
            data-testid={`lang-${code}`}
            className={cn(
              "flex h-12 min-w-12 items-center justify-center rounded-full px-3 text-[0.8125rem] font-bold uppercase tracking-wider",
              "transition-colors focus-ring",
              active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {code}
            <span className="sr-only" lang={code}>
              , {t(code)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
