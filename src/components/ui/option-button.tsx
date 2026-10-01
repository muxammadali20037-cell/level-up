"use client";

import { Check } from "lucide-react";
import { createContext, use, useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type OptionGroupContextValue = {
  value: string | null;
  onValueChange: (value: string) => void;
  /** Value of the option that gets tabIndex 0 while nothing is selected (first enabled option). */
  firstValue: string | null;
};

const OptionGroupContext = createContext<OptionGroupContextValue | null>(null);

const NEXT_KEYS = new Set(["ArrowDown", "ArrowRight"]);
const PREV_KEYS = new Set(["ArrowUp", "ArrowLeft"]);

export type OptionGroupProps = Omit<ComponentProps<"div">, "onChange" | "defaultValue" | "aria-labelledby"> & {
  value: string | null;
  onValueChange: (value: string) => void;
  /** Id of the question heading: every radiogroup must have an accessible name. */
  "aria-labelledby": string;
  /** Value of the first enabled option; it is the single tab stop while nothing is selected (APG radio). */
  firstValue: string | null;
  /** Id of visually hidden hint text, e.g. "Arrows move between answers, Space selects". */
  hintId?: string;
};

/**
 * Single-choice answer list (role="radiogroup"). One tab stop: the selected option, else the first one.
 * Arrow keys / Home / End move focus only; Space or Enter selects. This deliberately differs from native
 * radios (which check on arrow) so a keyboard user can't answer a test question by accident; pass `hintId`
 * pointing at hint text so screen-reader users learn the model.
 */
export function OptionGroup({
  value,
  onValueChange,
  firstValue,
  hintId,
  className,
  children,
  onKeyDown,
  ...props
}: OptionGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const isNext = NEXT_KEYS.has(event.key);
    const isPrev = PREV_KEYS.has(event.key);
    if (!isNext && !isPrev && event.key !== "Home" && event.key !== "End") return;
    const items = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [],
    );
    if (items.length === 0) return;
    event.preventDefault();
    const current = items.findIndex((item) => item === document.activeElement);
    let next = 0;
    if (event.key === "End") next = items.length - 1;
    else if (isNext) next = current < 0 ? 0 : (current + 1) % items.length;
    else if (isPrev) next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
    items[next]?.focus();
  }

  return (
    <OptionGroupContext value={{ value, onValueChange, firstValue }}>
      <div
        ref={ref}
        role="radiogroup"
        aria-describedby={hintId}
        data-slot="option-group"
        className={cn("flex flex-col gap-3", className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </OptionGroupContext>
  );
}

export type OptionButtonProps = Omit<ComponentProps<"button">, "value" | "onSelect"> & {
  value: string;
  /** Used only outside an OptionGroup (toggle mode, aria-pressed). */
  selected?: boolean;
  onSelect?: (value: string) => void;
  /** Leading marker such as "A", "B", or an icon. */
  marker?: ReactNode;
  description?: ReactNode;
};

function isTabStop(group: OptionGroupContextValue, value: string): boolean {
  return group.value !== null ? group.value === value : group.firstValue === value;
}

/** Large, thumb-friendly answer card. Radio semantics inside OptionGroup, toggle (aria-pressed) otherwise. */
export function OptionButton({
  value,
  selected: selectedProp,
  onSelect,
  marker,
  description,
  className,
  children,
  onClick,
  ...props
}: OptionButtonProps) {
  const group = use(OptionGroupContext);
  const inGroup = group !== null;
  const selected = inGroup ? group.value === value : Boolean(selectedProp);

  return (
    <button
      type="button"
      role={inGroup ? "radio" : undefined}
      aria-checked={inGroup ? selected : undefined}
      aria-pressed={inGroup ? undefined : selected}
      tabIndex={inGroup ? (isTabStop(group, value) ? 0 : -1) : undefined}
      data-slot="option-button"
      data-state={selected ? "checked" : "unchecked"}
      data-value={value}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        group?.onValueChange(value);
        onSelect?.(value);
      }}
      className={cn(
        "group/option flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3.5 text-left",
        "text-base leading-snug transition-[border-color,background-color,box-shadow] duration-150",
        "focus-ring disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-primary bg-primary/5 shadow-[0_0_0_1px_var(--primary)_inset]"
          : "border-control-border/60 hover:border-control-border active:bg-muted",
        className,
      )}
      {...props}
    >
      {marker != null && (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors",
            selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {marker}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{children}</span>
        {description != null && <span className="mt-1 block text-sm text-muted-foreground">{description}</span>}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-control-border",
        )}
      >
        {selected && <Check className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  );
}
