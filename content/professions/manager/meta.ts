import type { z } from "zod";
import type { professionContentSchema } from "../../schema";

type ProfessionInput = z.input<typeof professionContentSchema>;

/**
 * Profession 5 — manager (docs/architecture/05-profession-skill-model.md §9).
 * Not regulated. Config uses platform defaults (experienceCaps {"0": 4, "lt1": 5}, where "experience" means
 * experience managing people or projects), so no override is authored here.
 */
export const meta = {
  slug: "manager",
  category: "management",
  name: { uz: "Menejer (rahbar)", ru: "Менеджер (руководитель)", en: "Manager" },
  description: {
    uz: "Jamoa, loyiha yoki jarayonlarni boshqaradiganlar uchun: maqsad, vakolat, fikr-mulohaza va natija.",
    ru: "Для тех, кто руководит командой, проектами или процессами: цели, делегирование, обратная связь и результат.",
    en: "For people who lead teams, projects or operations: goals, delegation, feedback and results.",
  },
  sortOrder: 5,
  isRegulated: false,
} satisfies Pick<ProfessionInput, "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated">;
