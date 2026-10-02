import type { ProfessionContent } from "../../schema";

/**
 * career_readiness — Student (career readiness). Spec: docs/architecture/05-profession-skill-model.md §12.
 * Audience 14+: no age question; "experience" means any work, internship or volunteering experience.
 * experienceCaps uses the content-code band spelling `none` (= brief/DB `0`, see 05 §17 A2).
 */
export const meta = {
  slug: "career_readiness",
  category: "career",
  name: {
    uz: "Talaba (ishga tayyorlik)",
    ru: "Студент (готовность к карьере)",
    en: "Student (career readiness)",
  },
  description: {
    uz: "Ish yoki amaliyotga qanchalik tayyorligingizni bilib oling: yoʻnalish, muloqot, rezyume, suhbat va oʻrganish.",
    ru: "Узнайте, насколько вы готовы к стажировке или работе: направление, общение, резюме, собеседование и учёба.",
    en: "Find out how ready you are for an internship or job: direction, communication, CV, interviews and learning.",
  },
  sortOrder: 8,
  isRegulated: false,
  config: {
    experienceCaps: { none: 5, lt1: 6 },
  },
} satisfies Pick<ProfessionContent, "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated" | "config">;
