import { Logo } from "@/components/brand/logo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { LanguageSwitcher } from "./language-switcher";

/**
 * Web header: logo + language pill. In the Telegram Mini App, Telegram draws its own header, so only the
 * language pill remains (03-user-flows §0.3). Wraps instead of overflowing at large OS text sizes.
 */
export function SiteHeader({ wide = false }: { wide?: boolean }) {
  return (
    <header className="relative z-30">
      <div
        className={cn(
          wide ? "container-wide" : "container-flow",
          "flex min-h-[4.5rem] flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 tma:min-h-0 tma:justify-end tma:py-2",
        )}
      >
        <Link href="/" className="-mx-2 flex min-h-12 items-center rounded-xl px-2 focus-ring tma:hidden">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
