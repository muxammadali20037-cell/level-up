import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 select-none items-center justify-center gap-2 rounded-2xl font-semibold",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out",
    "focus-ring active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_1px_0_rgb(255_255_255/0.12)_inset,0_8px_20px_-8px_color-mix(in_oklab,var(--primary)_70%,transparent)] hover:bg-primary/90",
        secondary: "bg-muted text-foreground hover:bg-muted/70",
        outline: "border border-border bg-card text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        link: "h-auto px-0 text-primary underline-offset-4 hover:underline",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
      },
      size: {
        sm: "h-10 rounded-xl px-4 text-sm",
        md: "h-12 px-5 text-base",
        lg: "min-h-14 px-6 py-3 text-base leading-tight tracking-wide",
        icon: "size-12",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the single child element (e.g. a Link) with button styles instead of a <button>. */
    asChild?: boolean;
  };

export function Button({ className, variant, size, block, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}
