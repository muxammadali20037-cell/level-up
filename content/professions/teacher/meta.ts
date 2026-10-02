import type { ProfessionContent } from "../../schema";

/**
 * Teacher — profession fields (docs/architecture/05-profession-skill-model.md §13).
 * Not regulated (P20), but shows a non-certification note in the disclaimer slot.
 */
export const meta = {
  slug: "teacher",
  category: "education",
  name: { uz: "Oʻqituvchi", ru: "Преподаватель", en: "Teacher" },
  description: {
    uz: "Dars rejalashtirish, tushuntirish, baholash va oʻquvchilar bilan ishlash",
    ru: "Планирование уроков, объяснение, оценивание и работа с учениками",
    en: "Lesson planning, teaching, assessment and working with students",
  },
  sortOrder: 9,
  isRegulated: false,
  disclaimer: {
    uz: "Natija pedagogik attestatsiya yoki toifa oʻrnini bosmaydi.",
    ru: "Результат не заменяет педагогическую аттестацию или категорию.",
    en: "The result does not replace official teacher certification or grading.",
  },
  // Same as the defaults (§13 table); written explicitly so the cap is visible next to the content.
  // Schema spells the no-experience band "none" (doc writes "0", see 05 §17 A2).
  config: { experienceCaps: { none: 4, lt1: 5 } },
} satisfies Pick<
  ProfessionContent,
  "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated" | "disclaimer" | "config"
>;
