import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/** One profession-specific question (3 global + 1 = 4 pre-test questions). Suggests a specialization only. */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "teaching_setting",
    prompt: {
      uz: "Asosan qayerda dars berasiz?",
      ru: "Где вы в основном преподаёте?",
      en: "Where do you mainly teach?",
    },
    options: [
      {
        key: "school",
        label: { uz: "Maktabda", ru: "В школе", en: "At a school" },
        suggestsSpecialization: "school_teacher",
      },
      {
        key: "learning_center",
        label: { uz: "Oʻquv markazi yoki kursda", ru: "В учебном центре или на курсах", en: "At a learning centre or course" },
      },
      {
        key: "private",
        label: { uz: "Yakka tartibda (repetitor)", ru: "Индивидуально (репетитор)", en: "One-to-one (tutoring)" },
        suggestsSpecialization: "private_tutor",
      },
      {
        key: "online",
        label: { uz: "Onlayn", ru: "Онлайн", en: "Online" },
        suggestsSpecialization: "online_instructor",
      },
      {
        key: "not_yet",
        label: { uz: "Hozircha dars bermayman", ru: "Пока не преподаю", en: "Not teaching yet" },
      },
    ],
  },
];
