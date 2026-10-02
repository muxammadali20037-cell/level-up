import type { z } from "zod";
import type { professionContentSchema } from "../../schema";

type ProfessionInput = z.input<typeof professionContentSchema>;
type MetaInput = Pick<ProfessionInput, "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated" | "config">;

/** docs/architecture/05-profession-skill-model.md §5. Not regulated → no disclaimer. */
export const meta = {
  slug: "entrepreneur",
  category: "business",
  name: { uz: "Tadbirkor", ru: "Предприниматель", en: "Entrepreneur" },
  description: {
    uz: "Savdo, moliya, jarayonlar va jamoa — biznesni boshlash, boshqarish va oʻstirish koʻnikmalari.",
    ru: "Продажи, финансы, процессы и команда — навыки запуска, управления и роста бизнеса.",
    en: "Sales, finance, processes and people — the skills to start, run and grow a business.",
  },
  sortOrder: 1,
  isRegulated: false,
  // Equals the platform default (§2.2, §5); kept explicit so the cap is visible next to the content.
  // Band "none" = brief/DB "0" (alignment note A2).
  config: { experienceCaps: { none: 4, lt1: 5 } },
} satisfies MetaInput;
