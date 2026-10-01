import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Text colors use *-foreground tokens tuned for ≥ 4.5:1 on their tinted background. Badges wrap instead of
 * overflowing at large OS text sizes.
 */
export const badgeVariants = cva(
  "inline-flex w-fit max-w-full items-center gap-1.5 whitespace-normal rounded-full font-semibold text-balance [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-primary",
        neutral: "bg-muted text-muted-foreground",
        outline: "border border-border bg-card text-muted-foreground",
        success: "bg-success/12 text-success-foreground",
        warning: "bg-warning/12 text-warning-foreground",
        danger: "bg-danger/10 text-danger",
        accent: "bg-accent/25 text-accent-foreground",
        solid: "bg-foreground text-background",
      },
      size: {
        sm: "px-2 py-0.5 text-xs leading-snug tracking-wide",
        md: "px-2.5 py-1 text-xs leading-snug",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  },
);

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
