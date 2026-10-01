import "../globals.css";
import type { Metadata } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Admin · LEVEL", template: "%s · LEVEL Admin" },
  robots: { index: false, follow: false },
};

/** Separate root layout for the internal admin console (English only, not locale-routed). */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
