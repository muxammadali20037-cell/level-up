"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown in a root layout ([locale] or admin), which their own error.tsx
 * cannot catch. Renders without i18n context, so the copy is trilingual and static.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="uz">
      <body>
        <main id="main" className="container-flow flex min-h-dvh flex-col justify-center gap-6 py-16">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Nimadir xato ketdi.</h1>
            <p lang="ru" className="text-lg text-muted-foreground">Что-то пошло не так.</p>
            <p lang="en" className="text-lg text-muted-foreground">Something went wrong.</p>
          </div>
          {error.digest && <p className="font-mono text-xs text-muted-foreground">#{error.digest}</p>}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="min-h-14 rounded-2xl bg-primary px-6 text-base font-semibold text-primary-foreground focus-ring"
            >
              Qayta urinish · Повторить · Try again
            </button>
            <Link href="/uz" className="flex min-h-12 items-center justify-center rounded-2xl font-semibold focus-ring">
              Bosh sahifa · Главная · Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
