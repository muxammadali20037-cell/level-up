import type { z } from "zod";
import type { professionContentSchema } from "../../schema";

type ProfessionInput = z.input<typeof professionContentSchema>;

/**
 * driving_instructor — canonical spec: docs/architecture/05-profession-skill-model.md §14.
 * Regulated (safety-critical, licensed activity): the disclaimer is shown on the start screen, in the report footer and
 * on every verification task screen.
 */
export const meta = {
  slug: "driving_instructor",
  category: "driving",
  name: {
    uz: "Haydovchilik yoʻriqchisi",
    ru: "Инструктор по вождению",
    en: "Driving instructor",
  },
  description: {
    uz: "Oʻquvchilarga xavfsiz haydashni oʻrgatish: xavfni boshqarish, aniq koʻrsatmalar va bosqichma-bosqich mashgʻulotlar.",
    ru: "Обучение безопасному вождению: управление рисками, чёткие команды и последовательные занятия.",
    en: "Teaching learners to drive safely: risk management, clear commands and step-by-step lessons.",
  },
  sortOrder: 10,
  isRegulated: true,
  disclaimer: {
    uz: "Bu taʼlimiy baholash. LEVEL natijasi haydovchilik guvohnomasi, yoʻriqchilik huquqi yoki rasmiy malaka hujjati emas. Amaliy mashgʻulotlarni faqat qonunchilikka muvofiq ruxsatga ega shaxslar oʻtkazadi.",
    ru: "Это образовательная оценка. Результат LEVEL не является водительским удостоверением, правом на инструкторскую деятельность или официальным документом о квалификации. Практические занятия проводят только лица, имеющие допуск по закону.",
    en: "This is an educational assessment. A LEVEL result is not a driving licence, an instructor licence or an official qualification. Practical lessons may only be given by people authorized under the law.",
  },
  config: {
    // §14.6: {"0": 3, "lt1": 5}; "experience" = experience instructing learners. The schema's record over the
    // experience enum is exhaustive (zod 4), so the remaining bands are listed as 9 = no extra cap (the
    // requires_verification cap still limits ASSESSED to 7).
    experienceCaps: { none: 3, lt1: 5, "1to3": 9, "3to5": 9, "5plus": 9 },
  },
} satisfies Pick<
  ProfessionInput,
  "slug" | "category" | "name" | "description" | "sortOrder" | "isRegulated" | "disclaimer" | "config"
>;
