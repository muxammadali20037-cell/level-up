import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <h2 id={id} className={cn("text-2xl font-bold tracking-tight text-balance md:text-4xl", className)}>
      {children}
    </h2>
  );
}
