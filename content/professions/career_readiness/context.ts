import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/**
 * One profession-specific question (3 global + 1 = 4 pre-test questions). Study stage, not age (05 §12: no age
 * question, data minimization). skillBoosts affect routing only, never composite weights (05 §1).
 */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "study_stage",
    prompt: {
      uz: "Hozir qaysi bosqichdasiz?",
      ru: "На каком этапе вы сейчас?",
      en: "Which stage are you at now?",
    },
    options: [
      {
        key: "school",
        label: { uz: "Maktabda oʻqiyapman", ru: "Учусь в школе", en: "I am at school" },
        suggestsSpecialization: "school_student",
      },
      {
        key: "early_years",
        label: { uz: "Kollej yoki oliygoh, 1–2-kurs", ru: "Колледж или вуз, 1–2 курс", en: "College or university, years 1–2" },
        suggestsSpecialization: "university_student",
      },
      {
        key: "final_years",
        label: { uz: "Oliygoh, yuqori kurs", ru: "Вуз, старшие курсы", en: "University, final years" },
        suggestsSpecialization: "university_student",
        skillBoosts: { job_search: 1.2, interview_skills: 1.2 },
      },
      {
        key: "graduated",
        label: { uz: "Oʻqishni tamomladim", ru: "Учёба уже завершена", en: "I have graduated" },
        suggestsSpecialization: "recent_graduate",
      },
      {
        key: "changing_career",
        label: { uz: "Kasbimni oʻzgartiryapman", ru: "Меняю профессию", en: "I am changing careers" },
        suggestsSpecialization: "career_changer",
      },
    ],
  },
];
