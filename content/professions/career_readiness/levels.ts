import type { z } from "zod";
import { DEFAULT_LEVELS } from "../../levels/default";
import type { levelSchema, requirementSchema } from "../../schema";

type LevelInput = z.input<typeof levelSchema>;
type RequirementInput = z.input<typeof requirementSchema>;
type I18nText = LevelInput["name"];

/**
 * 05 §12.4 — readiness wording instead of professional wording; default thresholds and verification flags.
 * "Ready" = competency readiness measured by LEVEL, never a guarantee of being hired (stated in L4/L5 meaning).
 */
type LevelOverride = Pick<LevelInput, "slug" | "name" | "shortDescription" | "meaning">;

const OVERRIDES: Record<number, LevelOverride> = {
  2: {
    slug: "explorer",
    name: { uz: "Izlanuvchi", ru: "Исследующий", en: "Explorer" },
    shortDescription: {
      uz: "Yoʻnalish va asosiy koʻnikmalarni oʻrganyapsiz.",
      ru: "Вы изучаете направления и базовые навыки.",
      en: "You are exploring directions and basic skills.",
    },
    meaning: {
      uz: "Asosiy tushunchalar bor, lekin maqsad va amaliyot hali aniq emas. Keyingi qadam — bitta yoʻnalishni tanlab, kichik mashqlardan boshlash.",
      ru: "Базовые представления есть, но цель и практика пока не определены. Следующий шаг — выбрать одно направление и начать с небольших упражнений.",
      en: "The basics are there, but your target and practice are not yet clear. Next step: pick one direction and start with small exercises.",
    },
  },
  3: {
    slug: "preparing",
    name: { uz: "Tayyorlanayotgan", ru: "Готовящийся", en: "Preparing" },
    shortDescription: {
      uz: "Maqsad sari tizimli tayyorlanyapsiz.",
      ru: "Вы системно готовитесь к своей цели.",
      en: "You are preparing for your target in a structured way.",
    },
    meaning: {
      uz: "Asosiy koʻnikmalar shakllanmoqda. Endi ularni real vazifalarda — loyiha, tanlov yoki koʻngillilik ishida sinash kerak.",
      ru: "Основные навыки формируются. Теперь их нужно проверить на реальных задачах — в проекте, конкурсе или волонтёрстве.",
      en: "Core skills are forming. Now they need testing on real tasks — a project, a competition or volunteering.",
    },
  },
  4: {
    slug: "internship_ready",
    name: { uz: "Amaliyotga tayyor", ru: "Готов к стажировке", en: "Internship-ready" },
    shortDescription: {
      uz: "Amaliyot (stajirovka) uchun yetarli asos bor.",
      ru: "У вас достаточно базы для стажировки.",
      en: "You have a solid enough base for an internship.",
    },
    meaning: {
      uz: "Yoʻl-yoʻriq bilan real vazifalarni bajara olasiz va oʻrganishga tayyorsiz. Bu ishga qabul qilinish kafolati emas.",
      ru: "Вы справляетесь с реальными задачами под руководством и готовы учиться. Это не гарантия трудоустройства.",
      en: "You can handle real tasks with guidance and are ready to learn. This is not a guarantee of being hired.",
    },
  },
  5: {
    slug: "job_ready",
    name: { uz: "Ishga tayyor", ru: "Готов к работе", en: "Job-ready" },
    shortDescription: {
      uz: "Boshlangʻich lavozimda ishlashga tayyorsiz.",
      ru: "Вы готовы к работе на начальной позиции.",
      en: "You are ready for an entry-level job.",
    },
    meaning: {
      uz: "Rezyume, suhbat va kundalik ish koʻnikmalaringiz boshlangʻich lavozim talablariga mos. Bu ishga qabul qilinish kafolati emas.",
      ru: "Резюме, собеседование и рабочие навыки соответствуют ожиданиям от начальной позиции. Это не гарантия трудоустройства.",
      en: "Your CV, interview and everyday work skills match entry-level expectations. This is not a guarantee of being hired.",
    },
  },
  6: {
    slug: "strong_candidate",
    name: { uz: "Kuchli nomzod", ru: "Сильный кандидат", en: "Strong Candidate" },
    shortDescription: {
      uz: "Nomzodlar orasida ishonchli koʻrinasiz.",
      ru: "Вы уверенно смотритесь среди кандидатов.",
      en: "You come across as a solid candidate.",
    },
    meaning: {
      uz: "Koʻnikmalaringizni aniq misollar bilan isbotlay olasiz va yangi muhitga tez moslashasiz.",
      ru: "Вы подтверждаете навыки конкретными примерами и быстро адаптируетесь к новой среде.",
      en: "You back up your skills with concrete examples and adapt quickly to new settings.",
    },
  },
  7: {
    slug: "standout_candidate",
    name: { uz: "Ajralib turuvchi nomzod", ru: "Выдающийся кандидат", en: "Standout Candidate" },
    shortDescription: {
      uz: "Boshqa nomzodlardan ajralib turasiz.",
      ru: "Вы выделяетесь среди других кандидатов.",
      en: "You stand out among other candidates.",
    },
    meaning: {
      uz: "Murakkab vaziyatlarda ham aniq fikrlaysiz, jamoada tashabbus koʻrsatasiz va natijalaringizni dalillar bilan koʻrsatasiz.",
      ru: "Вы ясно мыслите даже в сложных ситуациях, проявляете инициативу в команде и подтверждаете результаты фактами.",
      en: "You think clearly in complex situations, take initiative in a team and show your results with evidence.",
    },
  },
  8: {
    slug: "proven_candidate",
    name: { uz: "Isbotlangan nomzod", ru: "Подтверждённый кандидат", en: "Proven Candidate" },
    shortDescription: {
      uz: "Tayyorligingiz real tajriba bilan tasdiqlangan.",
      ru: "Ваша готовность подтверждена реальным опытом.",
      en: "Your readiness is backed by real experience.",
    },
    meaning: {
      uz: "Bu daraja faqat test orqali emas, real amaliy tasdiq orqali beriladi.",
      ru: "Этот уровень присваивается не только по тесту, но и по реальному практическому подтверждению.",
      en: "This level is granted only with real-world verification, not by the test alone.",
    },
  },
  9: {
    slug: "peer_mentor",
    name: { uz: "Tengdoshlar ustozi", ru: "Наставник для сверстников", en: "Peer Mentor" },
    shortDescription: {
      uz: "Tengdoshlaringizga ishga tayyorlanishda yordam berasiz.",
      ru: "Вы помогаете сверстникам готовиться к работе.",
      en: "You help peers get ready for work.",
    },
    meaning: {
      uz: "Bu daraja faqat real amaliy tasdiq orqali beriladi.",
      ru: "Этот уровень присваивается только по реальному практическому подтверждению.",
      en: "This level is granted only with real-world verification.",
    },
  },
};

/** All 9 levels: L1 is the default verbatim; L2–L9 renamed (thresholds and requiresVerification unchanged). */
export const levels: LevelInput[] = DEFAULT_LEVELS.map((level) => ({ ...level, ...OVERRIDES[level.number] }));

const SKILL_NAMES: Record<"communication" | "learning_skills" | "job_search", I18nText> = {
  communication: { uz: "Muloqot", ru: "Коммуникация", en: "Communication" },
  learning_skills: { uz: "Oʻrganishni bilish", ru: "Умение учиться", en: "Learning how to learn" },
  job_search: { uz: "Rezyume va ish izlash", ru: "Резюме и поиск работы", en: "CV & job search" },
};

function skillMin(skill: keyof typeof SKILL_NAMES, threshold: number): RequirementInput {
  const n = SKILL_NAMES[skill];
  return {
    type: "skill_min",
    skill,
    threshold,
    gatesAssessed: true,
    description: {
      uz: `«${n.uz}» koʻnikmasi kamida ${threshold} ball`,
      ru: `Навык «${n.ru}» не ниже ${threshold}`,
      en: `${n.en} at least ${threshold}`,
    },
  };
}

function scenario(detail: I18nText): RequirementInput {
  return {
    type: "verified_scenario",
    threshold: null,
    gatesAssessed: false,
    description: {
      uz: `Amaliy vaziyatni real topshiriqda tasdiqlash (${detail.uz})`,
      ru: `Подтвердить навык в практическом сценарии (${detail.ru})`,
      en: `Prove it in a practical scenario (${detail.en})`,
    },
  };
}

function evidence(detail: I18nText): RequirementInput {
  return {
    type: "practical_action",
    threshold: null,
    gatesAssessed: false,
    description: {
      uz: `Real ishdan dalil taqdim etish (${detail.uz})`,
      ru: `Предоставить подтверждение из реальной работы (${detail.ru})`,
      en: `Provide evidence from real work (${detail.en})`,
    },
  };
}

/**
 * 05 §12.5 — standard template (K1 = min_composite − 5, K2/K3 = min_composite − 10). composite_min rows are
 * generated by the seeder (05 §3.2) and therefore not authored. Verification rows never gate ASSESSED (05 §3.2);
 * levels 8–9 are already capped by requiresVerification.
 * Verification task slugs: L5 v5_scenario_mock_interview, L7 v7_scenario_group_case, L8 v8_scenario_panel_interview +
 * v8_portfolio_internship_evidence, L9 v9_scenario_mentoring_session + v9_portfolio_mentoring_evidence.
 */
export const levelRequirements: Record<string, RequirementInput[]> = {
  "2": [skillMin("communication", 10)],
  "3": [skillMin("communication", 20)],
  "4": [skillMin("communication", 30), skillMin("learning_skills", 25)],
  "5": [
    skillMin("communication", 40),
    skillMin("learning_skills", 35),
    scenario({ uz: "suhbat mashqi", ru: "пробное собеседование", en: "mock interview" }),
  ],
  "6": [skillMin("communication", 50), skillMin("learning_skills", 45), skillMin("job_search", 45)],
  "7": [
    skillMin("communication", 60),
    skillMin("learning_skills", 55),
    skillMin("job_search", 55),
    scenario({ uz: "guruhli keys", ru: "групповой кейс", en: "group case" }),
  ],
  "8": [
    skillMin("communication", 70),
    skillMin("learning_skills", 65),
    skillMin("job_search", 65),
    scenario({ uz: "bir nechta suhbatdosh bilan suhbat", ru: "панельное собеседование", en: "panel interview" }),
    evidence({ uz: "amaliyot, koʻngillilik yoki loyiha", ru: "стажировка, волонтёрство или проект", en: "internship, volunteering or project" }),
  ],
  "9": [
    skillMin("communication", 80),
    skillMin("learning_skills", 75),
    skillMin("job_search", 75),
    scenario({ uz: "tengdoshga mentorlik mashgʻuloti", ru: "наставническая сессия для сверстника", en: "peer mentoring session" }),
    evidence({ uz: "tengdoshlarga mentorlik qilganingiz", ru: "опыт наставничества сверстников", en: "mentoring peers" }),
  ],
};
