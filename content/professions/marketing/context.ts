import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/**
 * One profession-specific question (3 global + 1 = 4 pre-test questions). The spec (§8) defines none; this is an
 * author decision: the main work focus suggests a specialization when the user picked "General". skillBoosts affect
 * routing only (spec P1).
 */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "marketing_focus",
    prompt: {
      uz: "Ishingizda qaysi yoʻnalish asosiy oʻrinda?",
      ru: "Какое направление главное в вашей работе?",
      en: "What is the main focus of your work?",
    },
    options: [
      {
        key: "social_media",
        label: { uz: "Ijtimoiy tarmoqlar (SMM)", ru: "Соцсети (SMM)", en: "Social media (SMM)" },
        suggestsSpecialization: "smm",
      },
      {
        key: "paid_ads",
        label: { uz: "Pullik reklama va natijalar", ru: "Платная реклама и результаты", en: "Paid ads and results" },
        suggestsSpecialization: "performance",
      },
      {
        key: "content",
        label: { uz: "Kontent va matnlar", ru: "Контент и тексты", en: "Content and copy" },
        suggestsSpecialization: "content",
      },
      {
        key: "search",
        label: { uz: "Qidiruv va sayt (SEO)", ru: "Поиск и сайт (SEO)", en: "Search and website (SEO)" },
        suggestsSpecialization: "seo",
      },
      {
        key: "brand_strategy",
        label: { uz: "Brend va strategiya", ru: "Бренд и стратегия", en: "Brand and strategy" },
        suggestsSpecialization: "brand",
        skillBoosts: { budget_planning: 1.2 },
      },
      {
        key: "mixed",
        label: { uz: "Hammasidan ozgina", ru: "Всего понемногу", en: "A bit of everything" },
      },
    ],
  },
];
