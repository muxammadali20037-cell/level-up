import { DoorOpen, GraduationCap, ShieldCheck, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

const ITEMS: ReadonlyArray<{ key: "noSignup" | "educational" | "honest"; icon: LucideIcon }> = [
  { key: "noSignup", icon: DoorOpen },
  { key: "educational", icon: GraduationCap },
  { key: "honest", icon: ShieldCheck },
];

/** Compact trust strip shown directly under the hero CTA. */
export function TrustRow({ className }: { className?: string }) {
  const t = useTranslations("landing.trust.items");

  return (
    <ul className={cn("flex flex-col gap-2 text-sm font-medium text-foreground/85", className)}>
      {ITEMS.map(({ key, icon: Icon }) => (
        <li key={key} className="flex items-start gap-2.5">
          <Icon className="mt-0.5 size-4 shrink-0 text-success-foreground" aria-hidden="true" />
          <span className="min-w-0">{t(key)}</span>
        </li>
      ))}
    </ul>
  );
}
