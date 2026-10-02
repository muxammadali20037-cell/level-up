import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/**
 * One profession-specific question (3 global + 1 = 4 pre-test questions). The doc (§5) defines none, so this is an
 * authoring decision: business stage suggests a specialization; skillBoosts re-order routing only (P1).
 */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "business_stage",
    prompt: {
      uz: "Biznesingiz hozir qaysi bosqichda?",
      ru: "На каком этапе сейчас ваш бизнес?",
      en: "What stage is your business at?",
    },
    options: [
      {
        key: "idea",
        label: { uz: "Gʻoya yoki birinchi mijozlar", ru: "Идея или первые клиенты", en: "Idea or first customers" },
        suggestsSpecialization: "beginner_founder",
        skillBoosts: { customer_product: 1.3, sales: 1.2 },
      },
      {
        key: "small_stable",
        label: { uz: "Kichik biznes, barqaror ishlayapti", ru: "Малый бизнес, работает стабильно", en: "Small business, running steadily" },
        suggestsSpecialization: "small_business_owner",
      },
      {
        key: "growing",
        label: { uz: "Tez oʻsyapmiz, kengaymoqchimiz", ru: "Быстро растём, хотим масштабироваться", en: "Growing fast, want to scale" },
        suggestsSpecialization: "growth_founder",
        skillBoosts: { unit_economics: 1.3 },
      },
      {
        key: "branches",
        label: { uz: "Bir nechta filial yoki nuqta", ru: "Несколько филиалов или точек", en: "Several branches or locations" },
        suggestsSpecialization: "multi_branch_owner",
        skillBoosts: { operations: 1.3 },
      },
      {
        key: "startup",
        label: { uz: "Yangi mahsulotli startap", ru: "Стартап с новым продуктом", en: "Startup with a new product" },
        suggestsSpecialization: "startup_founder",
      },
      {
        key: "company",
        label: { uz: "Rahbarlar jamoasi bor kompaniya", ru: "Компания с командой руководителей", en: "Company with a management team" },
        suggestsSpecialization: "company_ceo",
        skillBoosts: { strategy: 1.3, leadership: 1.2 },
      },
    ],
  },
];
