"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ToastVariant = "default" | "success" | "danger";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss (default 5000, at least 6000 with a description). Paused on hover/focus. */
  duration?: number;
};

type ToastItem = ToastOptions & { id: number };

type ToastContextValue = {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const MAX_VISIBLE = 3;

function durationOf(item: ToastItem): number {
  const base = item.duration ?? 5000;
  return item.description ? Math.max(base, 6000) : base;
}

/**
 * Minimal toast system, max three toasts. Success/default toasts go to a polite status region; danger
 * toasts to an assertive alert region. Timers pause while a toast is hovered or focused (WCAG 2.2.1).
 * Errors that block the flow should stay in-page (03-user-flows); toasts are for transient feedback.
 */
export function ToastProvider({ children, dismissLabel = "Close" }: { children: ReactNode; dismissLabel?: string }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    nextId.current += 1;
    const id = nextId.current;
    setItems((current) => [...current.slice(-(MAX_VISIBLE - 1)), { ...options, id }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const render = (item: ToastItem) => (
    <ToastCard key={item.id} item={item} dismissLabel={dismissLabel} onDismiss={dismiss} />
  );

  return (
    <ToastContext value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-[calc(1rem+var(--safe-bottom))]">
        <div role="alert" aria-live="assertive" className="flex w-full flex-col items-center gap-2">
          {items.filter((item) => item.variant === "danger").map(render)}
        </div>
        <div role="status" aria-live="polite" className="flex w-full flex-col items-center gap-2">
          {items.filter((item) => item.variant !== "danger").map(render)}
        </div>
      </div>
    </ToastContext>
  );
}

function ToastCard({
  item,
  dismissLabel,
  onDismiss,
}: {
  item: ToastItem;
  dismissLabel: string;
  onDismiss: (id: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const duration = durationOf(item);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => onDismiss(item.id), duration);
    return () => window.clearTimeout(timer);
  }, [paused, duration, item.id, onDismiss]);

  return (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      className={cn(
        "pointer-events-auto flex w-full max-w-[28rem] items-start gap-3 rounded-2xl border border-border",
        "bg-card p-4 text-card-foreground shadow-xl",
      )}
    >
      {item.variant === "success" && <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success" />}
      {item.variant === "danger" && <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-danger" />}
      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-semibold leading-snug">{item.title}</p>
        {item.description && <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label={dismissLabel}
        className="-my-3 -mr-3 flex size-12 shrink-0 items-center justify-center rounded-full text-muted-foreground focus-ring hover:bg-muted"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const context = use(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
