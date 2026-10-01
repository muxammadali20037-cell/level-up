import type en from "@/i18n/messages/en";
import type { routing } from "@/i18n/routing";

// Strongly typed locales and message keys for next-intl (the en namespaces are the key reference;
// tests/unit/messages.test.ts keeps uz/ru in sync with them).
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
