import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware navigation APIs. Use these instead of next/link and next/navigation inside [locale]. */
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
