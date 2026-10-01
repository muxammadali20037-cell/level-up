import { type CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

const SIZES = {
  sm: { box: "size-7 rounded-lg text-sm", label: "text-[0.625rem]", name: "text-sm", gap: "gap-2" },
  md: { box: "size-10 rounded-xl text-lg", label: "text-[0.6875rem]", name: "text-base", gap: "gap-3" },
  lg: { box: "size-14 rounded-2xl text-2xl", label: "text-xs", name: "text-lg", gap: "gap-3.5" },
  xl: { box: "size-24 rounded-[1.75rem] text-5xl", label: "text-xs", name: "text-2xl", gap: "gap-4" },
} as const;

export type LevelBadgeProps = {
  /** Level number 1..9 (clamped). */
  level: number;
  /** Localized level name, e.g. "Amaliyotchi". */
  name?: string;
  size?: keyof typeof SIZES;
  /** Show "LEVEL N" + name next to the tile. */
  showText?: boolean;
  label?: string;
  /** Hide the whole badge from assistive tech when adjacent visible text already says "LEVEL N". */
  decorative?: boolean;
  className?: string;
};

/** Level tile colored from the --level-N ramp, optionally with "LEVEL N · name". */
export function LevelBadge({
  level,
  name,
  size = "md",
  showText = true,
  label = "LEVEL",
  decorative = false,
  className,
}: LevelBadgeProps) {
  const n = Math.min(9, Math.max(1, Math.round(level)));
  const s = SIZES[size];
  const style = { "--lv": `var(--level-${n})` } as CSSProperties;
  const accessibleName = `${label} ${n}${name ? ` — ${name}` : ""}`;

  return (
    <span
      data-slot="level-badge"
      data-level={n}
      aria-hidden={decorative || undefined}
      style={style}
      className={cn("inline-flex items-center", s.gap, className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative flex shrink-0 flex-col items-center justify-center bg-(--lv) font-extrabold leading-none tabular-nums",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_8px_18px_-8px_var(--lv)]",
          n >= 8 ? "text-level-ink" : "text-white",
          s.box,
        )}
      >
        {size === "xl" && (
          <span className="mb-1.5 text-[0.625rem] font-bold tracking-[0.24em] opacity-80">{label}</span>
        )}
        {n}
      </span>
      {showText ? (
        <span className="flex min-w-0 flex-col gap-0.5 leading-tight">
          <span className={cn("font-bold uppercase tracking-[0.18em] text-muted-foreground", s.label)}>
            {label} {n}
          </span>
          {name && <span className={cn("font-semibold text-foreground", s.name)}>{name}</span>}
        </span>
      ) : decorative ? null : (
        <span className="sr-only">{accessibleName}</span>
      )}
    </span>
  );
}
