import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/**
 * Doc §10 defines no accountant-specific context question; this one (decision) maps the user's main work area to a
 * specialization suggestion. skillBoosts affect routing only, never composite weights (doc §1, P1).
 * Total pre-test questions: 3 global + 1 = 4.
 */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "accountant_focus",
    prompt: {
      uz: "Ishingizda qaysi yoʻnalish asosiy?",
      ru: "Какое направление в вашей работе основное?",
      en: "Which area is the main focus of your work?",
    },
    options: [
      {
        key: "bookkeeping",
        label: { uz: "Hujjatlar va kundalik yozuvlar", ru: "Первичка и ежедневные проводки", en: "Documents and daily entries" },
        skillBoosts: { primary_documents: 1.3, double_entry_bookkeeping: 1.2 },
        suggestsSpecialization: "bookkeeping",
      },
      {
        key: "tax",
        label: { uz: "Soliqlar va hisobot topshirish", ru: "Налоги и сдача отчётности", en: "Taxes and filings" },
        skillBoosts: { taxation: 1.5 },
        suggestsSpecialization: "tax_accounting",
      },
      {
        key: "payroll",
        label: { uz: "Ish haqi hisob-kitobi", ru: "Расчёт зарплаты", en: "Payroll" },
        skillBoosts: { payroll: 1.6 },
        suggestsSpecialization: "payroll",
      },
      {
        key: "reporting",
        label: { uz: "Moliyaviy hisobotlar (IFRS)", ru: "Финансовая отчётность (МСФО)", en: "Financial reporting (IFRS)" },
        skillBoosts: { financial_statements: 1.4 },
        suggestsSpecialization: "financial_reporting",
      },
      {
        key: "analysis",
        label: { uz: "Tahlil, byudjet va tannarx", ru: "Анализ, бюджеты и себестоимость", en: "Analysis, budgets and costing" },
        skillBoosts: { management_accounting: 1.5 },
        suggestsSpecialization: "management_accounting",
      },
      {
        key: "learning",
        label: { uz: "Hali oʻrganyapman", ru: "Пока учусь", en: "Still learning" },
        skillBoosts: { accounting_principles: 1.3, double_entry_bookkeeping: 1.2 },
      },
    ],
  },
];
