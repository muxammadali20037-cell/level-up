import { type ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export type MeterProps = Omit<ComponentProps<"div">, "children"> & {
  value: number;
  min?: number;
  max?: number;
  /** Accessible name, e.g. the skill name. */
  label: string;
  /** Human-readable value, e.g. "72 / 100". */
  valueText?: string;
  indicatorClassName?: string;
};

/**
 * Server-safe scalar measurement within a known range (role="meter"), e.g. a skill score (02-mvp-spec
 * AC-F11-01). Use Progress only for task progress such as the question counter.
 */
export function Meter({ value, min = 0, max = 100, label, valueText, className, indicatorClassName, ...props }: MeterProps) {
  const span = max > min ? max - min : 100;
  const clamped = Math.min(Math.max(value, min), min + span);
  const percent = ((clamped - min) / span) * 100;
  return (
    <div
      role="meter"
      aria-valuemin={min}
      aria-valuemax={min + span}
      aria-valuenow={clamped}
      aria-valuetext={valueText}
      aria-label={label}
      data-slot="meter"
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        data-slot="meter-indicator"
        className={cn("h-full rounded-full bg-primary", indicatorClassName)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
