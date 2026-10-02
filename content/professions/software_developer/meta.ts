import type { z } from "zod";
import type { professionContentSchema } from "../../schema";

type ProfessionInput = z.input<typeof professionContentSchema>;

export const meta = {
  slug: "software_developer",
  category: "technology",
  name: { uz: "Dasturchi", ru: "Разработчик ПО", en: "Software developer" },
  description: {
    uz: "Kod yozish, xatolarni topish, testlash, maʼlumotlar bazasi, API va tizim dizayni boʻyicha darajangizni aniqlang.",
    ru: "Узнайте свой уровень в коде, отладке, тестировании, базах данных, API и системном дизайне.",
    en: "Find your level in coding, debugging, testing, databases, APIs and system design.",
  },
  sortOrder: 2,
  isRegulated: false,
  config: {
    // Doc §6 / §3.4 caps {"0": 4, "lt1": 5}; content code spells band "0" as "none" (doc §17 A2).
    // zod 4 records keyed by an enum are exhaustive, so uncapped bands are written as 9 (= no cap).
    experienceCaps: { none: 4, lt1: 5, "1to3": 9, "3to5": 9, "5plus": 9 },
  },
} satisfies Pick<ProfessionInput, "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated" | "config">;
