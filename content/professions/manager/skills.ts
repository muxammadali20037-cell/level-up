import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** Gate skills: K1 goal_setting_planning · K2 feedback_coaching · K3 delegation (doc §9). Σ importance = 1.00. */
export const skills: SkillInput[] = [
  {
    slug: "goal_setting_planning",
    globalSkillKey: "planning",
    kind: "hard",
    importance: 0.12,
    name: {
      uz: "Maqsad qoʻyish va rejalashtirish",
      ru: "Постановка целей и планирование",
      en: "Goal-setting & planning",
    },
    description: {
      uz: "Yoʻnalishni oʻlchanadigan maqsadlar, bosqichlar va masʼul shaxslarga aylantirish.",
      ru: "Превращать направление в измеримые цели, этапы и ответственных.",
      en: "Turning direction into measurable goals, milestones and owners.",
    },
  },
  {
    slug: "delegation",
    globalSkillKey: null,
    kind: "soft",
    importance: 0.11,
    name: { uz: "Vakolat berish", ru: "Делегирование", en: "Delegation" },
    description: {
      uz: "Natijani kontekst, vakolat va oraliq nazorat nuqtalari bilan topshirish.",
      ru: "Передавать результат вместе с контекстом, полномочиями и точками сверки.",
      en: "Handing over outcomes with context, authority and check-in points.",
    },
  },
  {
    slug: "feedback_coaching",
    globalSkillKey: "feedback",
    kind: "soft",
    importance: 0.11,
    name: {
      uz: "Fikr-mulohaza va murabbiylik",
      ru: "Обратная связь и коучинг",
      en: "Feedback & coaching",
    },
    description: {
      uz: "Aniq va oʻz vaqtida fikr-mulohaza berish hamda xodimlarning salohiyatini oshirish.",
      ru: "Давать конкретную и своевременную обратную связь и развивать способности людей.",
      en: "Specific, timely feedback and growing people's capability.",
    },
  },
  {
    slug: "communication",
    globalSkillKey: "communication",
    kind: "soft",
    importance: 0.1,
    name: { uz: "Muloqot", ru: "Коммуникация", en: "Communication" },
    description: {
      uz: "Rahbariyat, jamoa va hamkasblar bilan aniq axborot almashish, kutilmalarni tushuntirish va tinglash.",
      ru: "Чётко информировать, проговаривать ожидания и слушать — вверх, вниз и по горизонтали.",
      en: "Clear updates, expectations and listening up, down and across.",
    },
  },
  {
    slug: "decision_making",
    globalSkillKey: "decision_making",
    kind: "meta",
    importance: 0.1,
    name: { uz: "Qaror qabul qilish", ru: "Принятие решений", en: "Decision-making" },
    description: {
      uz: "Oʻz vaqtida, asosli qaror qabul qilish va uning oqibatlari uchun javobgarlikni olish.",
      ru: "Принимать своевременные обоснованные решения и отвечать за их последствия.",
      en: "Making timely, reasoned decisions and owning their consequences.",
    },
  },
  {
    slug: "performance_management",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: {
      uz: "Samaradorlikni boshqarish",
      ru: "Управление эффективностью",
      en: "Performance management",
    },
    description: {
      uz: "Standartlar belgilash, natijani kuzatish va past natija bilan adolatli ishlash.",
      ru: "Задавать стандарты, отслеживать результаты и справедливо работать с низкой результативностью.",
      en: "Setting standards, tracking results and addressing underperformance fairly.",
    },
  },
  {
    slug: "hiring_onboarding",
    globalSkillKey: "hiring",
    kind: "hard",
    importance: 0.08,
    name: { uz: "Ishga olish va moslashtirish", ru: "Найм и адаптация", en: "Hiring & onboarding" },
    description: {
      uz: "Lavozimni aniqlash, tuzilmali suhbat oʻtkazish va yangi xodimni dastlabki 90 kunda moslashtirish.",
      ru: "Описывать роль, проводить структурированные интервью и адаптировать новичка в первые 90 дней.",
      en: "Defining roles, structured interviews and first-90-days onboarding.",
    },
  },
  {
    slug: "process_improvement",
    globalSkillKey: "operations",
    kind: "hard",
    importance: 0.09,
    name: {
      uz: "Jarayonlarni takomillashtirish",
      ru: "Улучшение процессов",
      en: "Process improvement",
    },
    description: {
      uz: "Isrof va tor joylarni topish hamda ishni takrorlanuvchan qilish.",
      ru: "Находить потери и узкие места и делать работу воспроизводимой.",
      en: "Finding waste and bottlenecks and making work repeatable.",
    },
  },
  {
    slug: "conflict_resolution",
    globalSkillKey: null,
    kind: "soft",
    importance: 0.09,
    name: { uz: "Nizolarni hal qilish", ru: "Разрешение конфликтов", en: "Conflict resolution" },
    description: {
      uz: "Kelishmovchiliklarni erta aniqlash va ularni pozitsiyalar emas, manfaatlar asosida hal qilish.",
      ru: "Рано выявлять разногласия и решать их через интересы, а не позиции.",
      en: "Surfacing disagreements early and resolving them on interests, not positions.",
    },
  },
  {
    slug: "self_management",
    globalSkillKey: "self_management",
    kind: "meta",
    importance: 0.1,
    name: {
      uz: "Oʻzini boshqarish va ustuvorliklar",
      ru: "Самоменеджмент и приоритеты",
      en: "Self-management & priorities",
    },
    description: {
      uz: "Oʻz vaqtingiz, kuchingiz va ustuvorliklaringizni boshqarib, jamoaga namuna boʻlish.",
      ru: "Управлять своим временем, энергией и приоритетами, подавая пример команде.",
      en: "Managing own time, energy and priorities as a role model.",
    },
  },
];

/** Dependency graph (doc §9.3). Rationales are user-facing explanation templates about the work, not the person. */
export const edges: EdgeInput[] = [
  {
    from: "goal_setting_planning",
    to: "delegation",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Faqat aniq belgilangan natijani topshirish mumkin — maqsad noaniq boʻlsa, vakolat berish ham ishlamaydi.",
      ru: "Передать можно только чётко определённый результат: без ясной цели делегирование не работает.",
      en: "You can only hand over an outcome that is clearly defined — without a clear goal, delegation fails.",
    },
  },
  {
    from: "goal_setting_planning",
    to: "performance_management",
    relation: "prerequisite",
    strength: 0.9,
    rationale: {
      uz: "Natija oldindan qoʻyilgan maqsadga qarab baholanadi — maqsad boʻlmasa, baholash subyektiv boʻlib qoladi.",
      ru: "Результат оценивают по заранее поставленным целям — без них оценка становится субъективной.",
      en: "Performance is judged against goals set in advance — without them, evaluation becomes subjective.",
    },
  },
  {
    from: "feedback_coaching",
    to: "performance_management",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Muammolar oʻlchanadi, lekin xodimlar qanday yaxshilanishni bilmaydi — shuning uchun natija oʻsmaydi.",
      ru: "Проблемы измеряются, но люди не понимают, как стать лучше, — поэтому результат не растёт.",
      en: "Problems get measured, but people don't learn how to improve — so results don't grow.",
    },
  },
  {
    from: "communication",
    to: "feedback_coaching",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Fikr-mulohaza noaniq yoki noqulay vaqtda aytilsa, u yetib bormaydi va oʻzgarish boʻlmaydi.",
      ru: "Нечёткая или несвоевременная обратная связь не доходит до человека и ничего не меняет.",
      en: "Feedback that is unclear or badly timed doesn't land, so nothing changes.",
    },
  },
  {
    from: "delegation",
    to: "process_improvement",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Jarayonlar yaxshilangan, lekin ularga hech kim egalik qilmaydi — hammasi baribir rahbarga bogʻliq qoladi.",
      ru: "Процессы улучшены, но у них нет владельцев, — всё по-прежнему держится на руководителе.",
      en: "Processes are improved, but nobody else owns them — everything still depends on the manager.",
    },
  },
  {
    from: "self_management",
    to: "delegation",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Ish yuki haddan oshganda vazifalar kech va kontekstsiz topshiriladi — vakolat berish samarasi pasayadi.",
      ru: "При перегрузке задачи передаются поздно и без контекста — делегирование теряет эффект.",
      en: "Under overload, work is handed over late and without context — so delegation loses its effect.",
    },
  },
  {
    from: "communication",
    to: "conflict_resolution",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Tinglash va eshitganini oʻz soʻzi bilan qaytarish nizolarni hal qilish mumkin boʻlgan holga keltiradi.",
      ru: "Умение слушать и пересказывать услышанное делает конфликты решаемыми.",
      en: "Listening and restating what you heard make conflicts solvable.",
    },
  },
  {
    from: "hiring_onboarding",
    to: "delegation",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Yaxshi moslashtirilgan xodimlar koʻproq masʼuliyatni oʻz zimmasiga ola oladi.",
      ru: "Хорошо адаптированные сотрудники способны брать на себя больше ответственности.",
      en: "Well-onboarded people can take on more ownership.",
    },
  },
  {
    from: "decision_making",
    to: "goal_setting_planning",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Reja tuzish variantlar orasidan tanlashni talab qiladi — qaror qabul qilish rejani aniqroq qiladi.",
      ru: "Планирование требует выбора между вариантами — умение решать делает план чётче.",
      en: "Plans require choosing between options — good decisions make plans sharper.",
    },
  },
];

/** Specializations (doc §9.1). Only non-1.0 weights are listed; gate skills stay ≥ 0.5 everywhere. */
export const specializations: SpecializationInput[] = [
  {
    slug: "team_lead",
    name: { uz: "Jamoa rahbari", ru: "Тимлид", en: "Team lead" },
    description: {
      uz: "Kichik jamoani bevosita boshqarasiz va oʻzingiz ham ish bajarasiz.",
      ru: "Вы напрямую руководите небольшой командой и сами участвуете в работе.",
      en: "You lead a small team directly and still do hands-on work.",
    },
    skillWeights: {
      feedback_coaching: 1.3,
      delegation: 1.2,
      communication: 1.2,
      hiring_onboarding: 0.8,
      process_improvement: 0.8,
    },
  },
  {
    slug: "middle_manager",
    name: {
      uz: "Oʻrta boʻgʻin rahbari",
      ru: "Руководитель среднего звена",
      en: "Middle manager",
    },
    description: {
      uz: "Bir nechta jamoa yoki rahbarlarni boshqarasiz va strategiyani ijroga aylantirasiz.",
      ru: "Вы руководите несколькими командами или руководителями и превращаете стратегию в исполнение.",
      en: "You manage several teams or managers and turn strategy into execution.",
    },
    skillWeights: {
      performance_management: 1.3,
      decision_making: 1.2,
      hiring_onboarding: 1.2,
      conflict_resolution: 1.1,
    },
  },
  {
    slug: "project_manager",
    name: { uz: "Loyiha menejeri", ru: "Менеджер проектов", en: "Project manager" },
    description: {
      uz: "Muddat, resurs va natijaga javob berasiz, odatda bevosita boʻysunuvchilarsiz.",
      ru: "Вы отвечаете за сроки, ресурсы и результат, часто без прямых подчинённых.",
      en: "You own scope, timelines and delivery, often without direct reports.",
    },
    skillWeights: {
      goal_setting_planning: 1.6,
      communication: 1.3,
      process_improvement: 1.1,
      feedback_coaching: 0.8,
      hiring_onboarding: 0.5,
    },
  },
  {
    slug: "operations_manager",
    name: { uz: "Operatsion menejer", ru: "Операционный менеджер", en: "Operations manager" },
    description: {
      uz: "Kundalik jarayonlarning barqaror, tez va sifatli ishlashiga javob berasiz.",
      ru: "Вы отвечаете за стабильную, быструю и качественную работу ежедневных процессов.",
      en: "You keep day-to-day operations stable, fast and high-quality.",
    },
    skillWeights: {
      process_improvement: 1.8,
      performance_management: 1.2,
      conflict_resolution: 0.9,
    },
  },
];
