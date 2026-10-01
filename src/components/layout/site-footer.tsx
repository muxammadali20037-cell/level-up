import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/logo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

const LINKS = ["privacy", "terms", "help"] as const;

export function SiteFooter({ wide = false }: { wide?: boolean }) {
  const t = useTranslations("common");
  return (
    <footer className="mt-8 border-t border-border">
      <div
        className={cn(
          wide ? "container-wide" : "container-flow",
          "flex flex-col gap-6 py-10 md:flex-row md:items-start md:justify-between",
        )}
      >
        <div className="flex flex-col gap-3">
          <Logo size="sm" />
          <p className="max-w-xs text-sm font-medium leading-relaxed text-foreground/80">
            <span className="block">{t("taglineParts.where")}</span>
            <span className="block">{t("taglineParts.next")}</span>
            <span className="block">{t("taglineParts.prove")}</span>
          </p>
        </div>
        <div className="flex max-w-md flex-col gap-4 md:items-end">
          <nav aria-label={t("footer.label")}>
            <ul className="-mx-2 flex flex-wrap gap-x-1 md:justify-end">
              {LINKS.map((key) => (
                <li key={key}>
                  <Link
                    href={`/${key}`}
                    className="flex min-h-12 items-center rounded-lg px-2 text-sm font-medium text-foreground/85 underline-offset-4 focus-ring hover:underline"
                  >
                    {t(`footer.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-1.5 text-xs leading-relaxed text-muted-foreground md:text-right">
            <p>{t("disclaimer.educational")}</p>
            <p>{t("disclaimer.dignity")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
