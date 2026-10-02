import type { z } from "zod";
import type { professionContentSchema } from "../../schema";

type ProfessionInput = z.input<typeof professionContentSchema>;

/** Profession 7 — designer (docs/architecture/05-profession-skill-model.md §11). Not regulated: no disclaimer. */
export const meta = {
  slug: "designer",
  category: "design",
  name: { uz: "Dizayner", ru: "Дизайнер", en: "Designer" },
  description: {
    uz: "Vizual asoslar, tipografika, UX, brend tizimlari va mijoz bilan ishlash boʻyicha darajangizni aniqlang.",
    ru: "Узнайте свой уровень в визуальных основах, типографике, UX, бренд-системах и работе с заказчиком.",
    en: "Find your level in visual fundamentals, typography, UX, brand systems and client work.",
  },
  sortOrder: 7,
  isRegulated: false,
  /**
   * Same values as the platform defaults (§2.2), stated explicitly as the doc lists them for designer (§11).
   * Band key is spelled `none` in content code (doc spells it `0`, see §17 A2).
   */
  config: {
    experienceCaps: { none: 4, lt1: 5 },
  },
} satisfies Pick<
  ProfessionInput,
  "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated" | "config"
>;
