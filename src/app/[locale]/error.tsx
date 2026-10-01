"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function LocaleError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useTranslations("errors.generic");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="container-flow flex min-h-[60dvh] flex-col items-start justify-center py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-balance">{t("title")}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t("text")}</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-muted-foreground">#{error.digest}</p>}
      <Button size="lg" block className="mt-8" onClick={() => retry()}>
        <RotateCcw aria-hidden="true" />
        {t("retry")}
      </Button>
    </main>
  );
}
