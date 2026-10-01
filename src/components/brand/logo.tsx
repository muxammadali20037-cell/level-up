import { type ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * LEVEL mark: one solid "L" plus a raised block past its foot. Read left to right the eye steps up from
 * the foot to the block: the next level. One tone, no fade, so it holds at 16px and on any host color.
 * Same geometry as src/app/icon.svg and public/brand/logo.svg.
 */
export function LogoMark({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("size-7", className)}
      {...props}
    >
      <path d="M4.5 3h3A1.5 1.5 0 0 1 9 4.5V15h4.5A1.5 1.5 0 0 1 15 16.5v3A1.5 1.5 0 0 1 13.5 21h-9A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3z" />
      <rect x="16" y="9" width="5" height="5" rx="1.5" />
    </svg>
  );
}

/** Geometric "LEVEL" wordmark drawn as shapes (renders identically without any web font). */
export function Wordmark({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 74.5 18"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("h-4 w-auto", className)}
      {...props}
    >
      <path d="M0 0h4v14h7v4H0z" />
      <path d="M15 0h11v4h-7v3h5.5v4H19v3h7v4H15z" />
      <path d="M30 0h4.4l2.85 11.6L40.1 0h4.4l-4.9 18h-4.7z" />
      <path d="M48.5 0h11v4h-7v3H58v4h-5.5v3h7v4h-11z" />
      <path d="M63.5 0h4v14h7v4h-11z" />
    </svg>
  );
}

export type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Accessible name; the wordmark is decorative SVG. */
  label?: string;
};

const LOGO_SIZES = {
  sm: { mark: "size-6", word: "h-3.5", gap: "gap-2" },
  md: { mark: "size-7", word: "h-4", gap: "gap-2.5" },
  lg: { mark: "size-10", word: "h-6", gap: "gap-3" },
} as const;

export function Logo({ className, size = "md", label = "LEVEL" }: LogoProps) {
  const s = LOGO_SIZES[size];
  return (
    <span role="img" aria-label={label} className={cn("inline-flex items-center text-foreground", s.gap, className)}>
      <LogoMark className={cn("text-brand", s.mark)} />
      <Wordmark className={s.word} />
    </span>
  );
}
