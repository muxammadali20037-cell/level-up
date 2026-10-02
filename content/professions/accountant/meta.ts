import type { z } from "zod";
import type { professionContentSchema } from "../../schema";

type ProfessionInput = z.input<typeof professionContentSchema>;
type MetaInput = Pick<
  ProfessionInput,
  "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated" | "disclaimer" | "config"
>;

/** Accountant — canonical spec: docs/architecture/05-profession-skill-model.md §10. */
export const meta = {
  slug: "accountant",
  category: "finance",
  name: { uz: "Buxgalter", ru: "Бухгалтер", en: "Accountant" },
  description: {
    uz: "Hisob yuritish, soliqlar, ish haqi va moliyaviy hisobotlar boʻyicha amaliy bilimingizni baholang.",
    ru: "Оцените практические знания в учёте, налогах, зарплате и финансовой отчётности.",
    en: "Assess your practical skills in bookkeeping, tax, payroll and financial reporting.",
  },
  sortOrder: 6,
  isRegulated: true,
  disclaimer: {
    uz: "Bu taʼlimiy baholash. U buxgalterlik malakasini tasdiqlovchi sertifikat emas va moliyaviy, soliq yoki huquqiy maslahat hisoblanmaydi. Soliq stavkalari va qoidalar oʻzgarib turadi — amaldagi qonunchilikni rasmiy manbalardan tekshiring.",
    ru: "Это образовательная оценка. Она не является сертификатом квалификации бухгалтера и не является финансовой, налоговой или юридической консультацией. Ставки и правила меняются — проверяйте действующее законодательство по официальным источникам.",
    en: "This is an educational assessment. It is not an accounting qualification certificate and not financial, tax or legal advice. Tax rates and rules change — check current legislation in official sources.",
  },
  config: {
    // Doc §10 writes {"0": 4, "lt1": 5}; content code spells the first band "none" (doc §17 A2).
    experienceCaps: { none: 4, lt1: 5 },
  },
} satisfies MetaInput;
