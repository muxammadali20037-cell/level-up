import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("errors.notFound");
  return (
    <>
      <SiteHeader />
      <main id="main" className="container-flow flex flex-col items-start py-16">
        <p className="text-sm font-bold tracking-[0.24em] text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-balance">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("text")}</p>
        <Button asChild size="lg" block className="mt-8">
          <Link href="/">{t("home")}</Link>
        </Button>
      </main>
    </>
  );
}
