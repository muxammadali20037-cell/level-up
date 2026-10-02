import type { z } from "zod";
import type { professionContentSchema } from "../../schema";

type ProfessionInput = z.input<typeof professionContentSchema>;

/**
 * Marketing (category `marketing`, sort 4). Spec: docs/architecture/05-profession-skill-model.md §8.
 * Not regulated. Config uses platform defaults (experienceCaps {none: 4, lt1: 5} = default), so no override.
 */
export const meta = {
  slug: "marketing",
  category: "marketing",
  name: { uz: "Marketolog", ru: "Маркетолог", en: "Marketer" },
  description: {
    uz: "Auditoriya, xabar, kontent, reklama va analitika orqali barqaror talab yaratish.",
    ru: "Создание стабильного спроса через аудиторию, месседж, контент, рекламу и аналитику.",
    en: "Creating steady demand through audience, message, content, ads and analytics.",
  },
  sortOrder: 4,
  isRegulated: false,
} satisfies Pick<ProfessionInput, "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated">;
