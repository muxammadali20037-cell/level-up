"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]", className)}
      {...props}
    />
  );
}

export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  /** Accessible label for the corner close button; omit to hide the button. */
  closeLabel?: string;
};

/** Bottom sheet on phones, centered dialog from sm: up. */
export function DialogContent({ className, children, closeLabel, ...props }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto grid max-w-[30rem] gap-4 rounded-t-[1.75rem] border border-border",
          "max-h-[calc(100dvh-var(--safe-top)-1rem)] overflow-y-auto overscroll-contain",
          "bg-card p-6 pb-[calc(1.5rem+var(--safe-bottom))] text-card-foreground shadow-2xl outline-none",
          "sm:inset-x-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:max-h-[calc(100dvh-2rem)] sm:rounded-[1.75rem] sm:pb-6",
          className,
        )}
        {...props}
      >
        {children}
        {closeLabel && (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className="absolute right-2 top-2 flex size-12 items-center justify-center rounded-full text-muted-foreground transition-colors focus-ring hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 pr-10", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-xl font-bold leading-tight tracking-tight", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-base text-muted-foreground", className)}
      {...props}
    />
  );
}
