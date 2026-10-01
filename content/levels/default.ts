import type { z } from "zod";
import type { levelSchema } from "../schema";

type LevelInput = z.input<typeof levelSchema>;

/**
 * Default LEVEL scheme (profession_id = NULL). Professions may override names/thresholds/requirements.
 * The English name doubles as the global tier label shown on badges and share cards (e.g. "LEVEL 4 · PRACTITIONER");
 * the localized name and meaning explain it in the user's language.
 * Thresholds follow the scoring scale: band edges at θ = (L − 5.5) × 0.7 → score = (θ + 3.5) / 7 × 100.
 */
export const DEFAULT_LEVELS: readonly LevelInput[] = [
  {
    number: 1,
    slug: "starter",
    name: { uz: "Boshlangʻich", ru: "Старт", en: "Starter" },
    shortDescription: {
      uz: "Sohaga endi qadam qoʻyyapsiz.",
      ru: "Вы делаете первые шаги в профессии.",
      en: "You are taking your first steps in the field.",
    },
    meaning: {
      uz: "Asosiy tushunchalar hali shakllanmoqda. Eng muhimi — toʻgʻri poydevordan boshlash.",
      ru: "Базовые понятия только формируются. Главное — начать с правильного фундамента.",
      en: "Core concepts are still forming. What matters most is starting from the right foundation.",
    },
    minComposite: 0,
    requiresVerification: false,
    requirements: [],
  },
  {
    number: 2,
    slug: "beginner",
    name: { uz: "Yangi boshlovchi", ru: "Начинающий", en: "Beginner" },
    shortDescription: {
      uz: "Asosiy tushunchalarni bilasiz, lekin amaliyot kam.",
      ru: "Вы знаете основы, но практики пока мало.",
      en: "You know the basics, but practice is still limited.",
    },
    meaning: {
      uz: "Oddiy vazifalarni yoʻl-yoʻriq bilan bajara olasiz. Keyingi qadam — mustaqil amaliyot.",
      ru: "Вы справляетесь с простыми задачами по инструкции. Следующий шаг — самостоятельная практика.",
      en: "You can handle simple tasks with guidance. The next step is independent practice.",
    },
    minComposite: 15,
    requiresVerification: false,
    requirements: [],
  },
  {
    number: 3,
    slug: "developing",
    name: { uz: "Rivojlanayotgan", ru: "Развивающийся", en: "Developing" },
    shortDescription: {
      uz: "Oddiy vazifalarni mustaqil bajarasiz.",
      ru: "Вы самостоятельно решаете типовые задачи.",
      en: "You handle routine tasks on your own.",
    },
    meaning: {
      uz: "Asosiy koʻnikmalar bor, ammo murakkab vaziyatlarda tizimli yondashuv hali yetishmaydi.",
      ru: "Основные навыки есть, но в сложных ситуациях пока не хватает системного подхода.",
      en: "Core skills are in place, but a systematic approach to complex situations is still missing.",
    },
    minComposite: 25,
    requiresVerification: false,
    requirements: [],
  },
  {
    number: 4,
    slug: "practitioner",
    name: { uz: "Amaliyotchi", ru: "Практик", en: "Practitioner" },
    shortDescription: {
      uz: "Real ishda natija berasiz.",
      ru: "Вы даёте результат в реальной работе.",
      en: "You deliver results in real work.",
    },
    meaning: {
      uz: "Kundalik ishni ishonchli bajarasiz. Keyingi darajaga chiqish uchun natijani tizimli va barqaror qilish kerak.",
      ru: "Вы надёжно справляетесь с повседневной работой. Для следующего уровня результат нужно сделать системным и стабильным.",
      en: "You reliably handle day-to-day work. To move up, your results need to become systematic and repeatable.",
    },
    minComposite: 35,
    requiresVerification: false,
    requirements: [],
  },
  {
    number: 5,
    slug: "professional",
    name: { uz: "Professional", ru: "Профессионал", en: "Professional" },
    shortDescription: {
      uz: "Mustaqil, barqaror va sifatli ishlaysiz.",
      ru: "Вы работаете самостоятельно, стабильно и качественно.",
      en: "You work independently, consistently and to a high standard.",
    },
    meaning: {
      uz: "Murakkab vazifalarni ham mustaqil hal qilasiz va qarorlaringizni asoslab bera olasiz.",
      ru: "Вы самостоятельно решаете сложные задачи и можете обосновать свои решения.",
      en: "You solve complex tasks independently and can justify your decisions.",
    },
    minComposite: 45,
    requiresVerification: false,
    requirements: [],
  },
  {
    number: 6,
    slug: "advanced",
    name: { uz: "Ilgʻor", ru: "Продвинутый", en: "Advanced" },
    shortDescription: {
      uz: "Murakkab vaziyatlarda ham kuchli qaror qabul qilasiz.",
      ru: "Вы принимаете сильные решения даже в сложных ситуациях.",
      en: "You make strong decisions even in complex situations.",
    },
    meaning: {
      uz: "Tizimlar va jarayonlarni yaxshilaysiz, boshqalarga yoʻnalish bera olasiz.",
      ru: "Вы улучшаете системы и процессы и можете направлять других.",
      en: "You improve systems and processes and can guide others.",
    },
    minComposite: 55,
    requiresVerification: false,
    requirements: [],
  },
  {
    number: 7,
    slug: "expert",
    name: { uz: "Ekspert", ru: "Эксперт", en: "Expert" },
    shortDescription: {
      uz: "Sohada chuqur bilim va keng tajriba.",
      ru: "Глубокие знания и широкий опыт в профессии.",
      en: "Deep knowledge and broad experience in the field.",
    },
    meaning: {
      uz: "Nostandart muammolarni hal qilasiz va boshqalar sizdan maslahat soʻraydi.",
      ru: "Вы решаете нестандартные задачи, и к вам обращаются за советом.",
      en: "You solve non-standard problems and others come to you for advice.",
    },
    minComposite: 65,
    requiresVerification: false,
    requirements: [],
  },
  {
    number: 8,
    slug: "leader",
    name: { uz: "Yetakchi", ru: "Лидер", en: "Leader" },
    shortDescription: {
      uz: "Jamoa va yoʻnalishga taʼsir qilasiz.",
      ru: "Вы влияете на команду и направление развития.",
      en: "You shape teams and direction.",
    },
    meaning: {
      uz: "Bu daraja faqat test orqali emas, real amaliy tasdiq orqali beriladi.",
      ru: "Этот уровень присваивается не только по тесту, но и по реальному практическому подтверждению.",
      en: "This level is granted only with real-world verification, not by the test alone.",
    },
    minComposite: 75,
    requiresVerification: true,
    requirements: [],
  },
  {
    number: 9,
    slug: "master",
    name: { uz: "Ustoz", ru: "Мастер", en: "Master" },
    shortDescription: {
      uz: "Sohani shakllantiradigan darajadagi mahorat.",
      ru: "Мастерство уровня, который формирует профессию.",
      en: "Mastery that shapes the field itself.",
    },
    meaning: {
      uz: "Bu daraja faqat real amaliy tasdiq orqali beriladi.",
      ru: "Этот уровень присваивается только по реальному практическому подтверждению.",
      en: "This level is granted only with real-world verification.",
    },
    minComposite: 85,
    requiresVerification: true,
    requirements: [],
  },
];
