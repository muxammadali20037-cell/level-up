import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/**
 * One profession-specific question (3 global + 1 = 4 pre-test questions). §14 defines none; this one routes to a
 * specialization and re-orders coverage only (skillBoosts never change composite weights, §1 P1).
 */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "teaching_focus",
    prompt: {
      uz: "Asosan nimani oʻrgatasiz yoki oʻrgatmoqchisiz?",
      ru: "Чему вы в основном обучаете или хотите обучать?",
      en: "What do you mainly teach, or plan to teach?",
    },
    options: [
      {
        key: "practical",
        label: { uz: "Avtomobilda amaliy haydash", ru: "Практическое вождение в машине", en: "In-car practical driving" },
        suggestsSpecialization: "practical_instructor",
        skillBoosts: { vehicle_control_demonstration: 1.3, clear_commands: 1.2 },
      },
      {
        key: "theory",
        label: { uz: "Nazariya va yoʻl qoidalari", ru: "Теория и ПДД", en: "Theory and traffic rules" },
        suggestsSpecialization: "theory_instructor",
        skillBoosts: { traffic_rules_knowledge: 1.4, instruction_structure: 1.2 },
      },
      {
        key: "corporate",
        label: { uz: "Kompaniya haydovchilari", ru: "Водители компании", en: "Company drivers" },
        suggestsSpecialization: "corporate_driver_trainer",
        skillBoosts: { safety_risk_management: 1.3, hazard_perception: 1.3 },
      },
      {
        key: "mixed",
        label: { uz: "Hammasi aralash", ru: "Всё понемногу", en: "A mix of everything" },
      },
    ],
  },
];
