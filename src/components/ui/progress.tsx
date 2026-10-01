import { type ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export type ProgressProps = Omit<ComponentProps<"div">, "children"> & {
  value: number;
  max?: number;
  /** Accessible name, e.g. "Question 3 of 12" or a skill name. */
  label?: string;
  /** Human-readable value, e.g. "72/100". */
  valueText?: string;
  indicatorClassName?: string;
};

/** Server-safe determinate progress bar (role="progressbar"). */
export function Progress({
  value,
  max = 100,
  label,
  valueText,
  className,
  indicatorClassName,
  ...props
}: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = (clamped / safeMax) * 100;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}
      aria-valuetext={valueText}
      aria-label={label}
      data-slot="progress"
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        data-slot="progress-indicator"
        className={cn("h-full w-full rounded-full bg-primary transition-transform duration-500 ease-out", indicatorClassName)}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </div>
  );
}
