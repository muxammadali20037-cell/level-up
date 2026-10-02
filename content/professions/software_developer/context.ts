import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/**
 * Doc 05 §6 defines no profession-specific context question; this one is an author decision.
 * It only re-orders routing coverage (skillBoosts never change composite weights — doc §1, P1).
 * Specialization is picked separately, so no suggestsSpecialization here. Total pre-test questions: 3 global + 1 = 4.
 */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "work_setting",
    prompt: {
      uz: "Asosan qanday sharoitda kod yozasiz?",
      ru: "В каком формате вы в основном пишете код?",
      en: "Where do you mostly write code?",
    },
    options: [
      {
        key: "learning",
        label: { uz: "Kurs yoki mustaqil oʻqish", ru: "Курсы или самообучение", en: "Courses or self-study" },
        skillBoosts: { programming_fundamentals: 1.3, debugging: 1.2 },
      },
      {
        key: "solo_projects",
        label: { uz: "Shaxsiy loyihalar yoki frilans", ru: "Свои проекты или фриланс", en: "Own projects or freelance" },
        skillBoosts: { deployment_ops: 1.2, api_design: 1.2, security_basics: 1.2 },
      },
      {
        key: "team",
        label: { uz: "Kompaniyadagi jamoada", ru: "В команде в компании", en: "In a team at a company" },
        skillBoosts: { version_control: 1.2, testing_quality: 1.2, collaboration: 1.2 },
      },
      {
        key: "leading",
        label: { uz: "Jamoaga texnik rahbarlik qilaman", ru: "Руковожу командой технически", en: "I lead a team technically" },
        skillBoosts: { system_design: 1.3, collaboration: 1.3, testing_quality: 1.2 },
      },
    ],
  },
];
