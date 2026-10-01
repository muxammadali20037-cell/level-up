"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Toggle switch (52×32). The unchecked track uses --control-border (≥ 3:1 on card) so state is visible.
 * Prefer SwitchField, which supplies the accessible name and a ≥ 48px hit area.
 */
export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-8 w-[3.25rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "bg-control-border transition-colors focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-7 rounded-full bg-white shadow-md ring-0 transition-transform duration-200",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export type SwitchFieldProps = Omit<ComponentProps<typeof SwitchPrimitive.Root>, "id"> & {
  label: ReactNode;
  description?: ReactNode;
};

/** Switch plus its label in one ≥ 48px-tall <label> row: the whole row toggles and names the control. */
export function SwitchField({ label, description, className, ...props }: SwitchFieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  return (
    <label
      htmlFor={id}
      data-slot="switch-field"
      className={cn("flex min-h-12 cursor-pointer items-center justify-between gap-4 py-2", className)}
    >
      <span className="min-w-0">
        <span className="block font-medium leading-snug">{label}</span>
        {description != null && (
          <span id={descriptionId} className="mt-0.5 block text-sm text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      <Switch id={id} aria-describedby={description != null ? descriptionId : undefined} {...props} />
    </label>
  );
}
