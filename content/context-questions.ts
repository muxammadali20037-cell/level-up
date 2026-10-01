import type { I18n } from "./schema";

/**
 * The three global quick-context questions asked before every assessment (max 3–5 in total, including up to two
 * profession-specific ones). Option keys map 1:1 to ExperienceBand / WorkingStatus / GoalType.
 */
export interface GlobalContextQuestion {
  readonly key: "experience" | "working" | "goal";
  readonly prompt: I18n;
  readonly options: readonly { readonly key: string; readonly label: I18n }[];
}

export const GLOBAL_CONTEXT_QUESTIONS: readonly GlobalContextQuestion[] = [
  {
    key: "experience",
    prompt: {
      uz: "Bu sohada qancha tajribangiz bor?",
      ru: "Сколько у вас опыта в этой сфере?",
      en: "How much experience do you have in this field?",
    },
    options: [
      { key: "none", label: { uz: "Tajribam yoʻq", ru: "Нет опыта", en: "None yet" } },
      { key: "lt1", label: { uz: "1 yildan kam", ru: "Меньше 1 года", en: "Less than 1 year" } },
      { key: "1to3", label: { uz: "1–3 yil", ru: "1–3 года", en: "1–3 years" } },
      { key: "3to5", label: { uz: "3–5 yil", ru: "3–5 лет", en: "3–5 years" } },
      { key: "5plus", label: { uz: "5 yildan koʻp", ru: "Больше 5 лет", en: "5+ years" } },
    ],
  },
  {
    key: "working",
    prompt: {
      uz: "Hozir bu sohada ishlaysizmi?",
      ru: "Вы сейчас работаете в этой сфере?",
      en: "Do you currently work in this field?",
    },
    options: [
      { key: "yes", label: { uz: "Ha", ru: "Да", en: "Yes" } },
      { key: "no", label: { uz: "Yoʻq", ru: "Нет", en: "No" } },
      { key: "learning", label: { uz: "Oʻrganyapman", ru: "Учусь", en: "I'm learning" } },
    ],
  },
  {
    key: "goal",
    prompt: {
      uz: "Asosiy maqsadingiz qanday?",
      ru: "Какая у вас главная цель?",
      en: "What is your main goal?",
    },
    options: [
      { key: "start", label: { uz: "Boshlash", ru: "Начать", en: "Get started" } },
      { key: "find_job", label: { uz: "Ish topish", ru: "Найти работу", en: "Find a job" } },
      { key: "professional", label: { uz: "Professional boʻlish", ru: "Стать профессионалом", en: "Become a professional" } },
      { key: "increase_income", label: { uz: "Daromadni oshirish", ru: "Увеличить доход", en: "Increase income" } },
      { key: "lead", label: { uz: "Rahbar boʻlish", ru: "Стать руководителем", en: "Become a leader" } },
      { key: "expert", label: { uz: "Ekspert boʻlish", ru: "Стать экспертом", en: "Become an expert" } },
    ],
  },
];
