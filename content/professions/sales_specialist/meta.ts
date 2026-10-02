import type { z } from "zod";
import type { professionContentSchema } from "../../schema";

type ProfessionInput = z.input<typeof professionContentSchema>;

/** Profession-level fields for sales_specialist (docs/architecture/05-profession-skill-model.md §7). */
export const meta = {
  slug: "sales_specialist",
  category: "sales",
  name: {
    uz: "Sotuv mutaxassisi",
    ru: "Специалист по продажам",
    en: "Sales specialist",
  },
  description: {
    uz: "Mijoz izlashdan bitimni yopish va mijozni saqlab qolishgacha boʻlgan savdo koʻnikmalari.",
    ru: "Навыки продаж: от поиска клиентов до закрытия сделки и удержания клиента.",
    en: "Sales skills from finding buyers to closing the deal and keeping the customer.",
  },
  sortOrder: 3,
  isRegulated: false,
  config: {
    // Doc §7: defaults; caps {"0": 4, "lt1": 5}. Content schema spells the "0" band as "none" (doc §17 A2).
    experienceCaps: { none: 4, lt1: 5 },
  },
} satisfies Pick<ProfessionInput, "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated" | "config">;
