import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/**
 * One profession-specific question (doc §9 lists none — decision: ask what the person manages, to suggest a
 * specialization). Total pre-test questions = 3 global + 1 = 4. skillBoosts affect routing only (P1).
 */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "managing_scope",
    prompt: {
      uz: "Hozir asosan nimani boshqarasiz?",
      ru: "Чем вы сейчас в основном руководите?",
      en: "What do you mainly manage right now?",
    },
    options: [
      {
        key: "one_team",
        label: { uz: "Bitta jamoani", ru: "Одной командой", en: "One team" },
        suggestsSpecialization: "team_lead",
      },
      {
        key: "several_teams",
        label: {
          uz: "Bir nechta jamoa yoki rahbarlarni",
          ru: "Несколькими командами или руководителями",
          en: "Several teams or managers",
        },
        suggestsSpecialization: "middle_manager",
      },
      {
        key: "projects",
        label: { uz: "Loyihalarni", ru: "Проектами", en: "Projects" },
        suggestsSpecialization: "project_manager",
      },
      {
        key: "operations",
        label: {
          uz: "Kundalik jarayonlarni",
          ru: "Ежедневными процессами",
          en: "Day-to-day operations",
        },
        suggestsSpecialization: "operations_manager",
      },
      {
        key: "not_yet",
        label: {
          uz: "Hali hech kimni — rahbar boʻlishga tayyorlanyapman",
          ru: "Пока никем — готовлюсь стать руководителем",
          en: "Nobody yet — preparing to become a manager",
        },
        skillBoosts: { self_management: 1.2, communication: 1.2 },
      },
    ],
  },
];
