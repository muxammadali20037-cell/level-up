import type { z } from "zod";
import type { contextQuestionSchema } from "../../schema";

type ContextQuestionInput = z.input<typeof contextQuestionSchema>;

/**
 * One profession-specific question (3 global + 1 = 4 pre-test questions). §11 defines no designer context
 * question; this one only suggests a specialization (no skillBoosts — routing already follows the chosen
 * specialization's weights).
 */
export const contextQuestions: ContextQuestionInput[] = [
  {
    key: "design_focus",
    prompt: {
      uz: "Asosan qanday dizayn bilan shugʻullanasiz?",
      ru: "Каким дизайном вы в основном занимаетесь?",
      en: "What kind of design do you mostly do?",
    },
    options: [
      {
        key: "graphic",
        label: { uz: "Grafik: poligrafiya, SMM vizuallar", ru: "Графика: полиграфия, визуалы для SMM", en: "Graphic: print, social media visuals" },
        suggestsSpecialization: "graphic",
      },
      {
        key: "ui_ux",
        label: { uz: "Ilova va sayt interfeyslari (UI/UX)", ru: "Интерфейсы приложений и сайтов (UI/UX)", en: "App and website interfaces (UI/UX)" },
        suggestsSpecialization: "ui_ux",
      },
      {
        key: "brand_identity",
        label: { uz: "Logotip va firma uslubi", ru: "Логотипы и фирменный стиль", en: "Logos and brand identity" },
        suggestsSpecialization: "brand_identity",
      },
      {
        key: "motion",
        label: { uz: "Animatsiya va motion", ru: "Анимация и моушн", en: "Animation and motion" },
        suggestsSpecialization: "motion",
      },
      {
        key: "mixed",
        label: { uz: "Hammasidan biroz / hali aniqlamadim", ru: "Всего понемногу / пока сложно сказать", en: "A bit of everything / not sure yet" },
      },
    ],
  },
];
