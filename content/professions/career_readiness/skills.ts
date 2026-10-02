import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** 05 §12.2 — importance sums to 1.00. Gate skills: K1 communication, K2 learning_skills, K3 job_search. */
export const skills: SkillInput[] = [
  {
    slug: "self_awareness_direction",
    globalSkillKey: null,
    kind: "meta",
    importance: 0.1,
    name: { uz: "Yoʻnalishni aniqlash", ru: "Профориентация", en: "Career direction" },
    description: {
      uz: "Oʻz qiziqish va kuchli tomonlaringizni bilish hamda birinchi ish uchun real maqsad lavozimni tanlash.",
      ru: "Понимание своих интересов и сильных сторон и выбор реалистичной первой целевой роли.",
      en: "Knowing your interests and strengths and choosing a realistic first target role.",
    },
  },
  {
    slug: "learning_skills",
    globalSkillKey: "learning_agility",
    kind: "meta",
    importance: 0.11,
    name: { uz: "Oʻrganishni bilish", ru: "Умение учиться", en: "Learning how to learn" },
    description: {
      uz: "Oʻqishni rejalashtirish, ongli mashq qilish va tushunganingizni tekshirish.",
      ru: "Планирование учёбы, осознанная практика и проверка понимания.",
      en: "Planning study, practising deliberately and checking your understanding.",
    },
  },
  {
    slug: "communication",
    globalSkillKey: "communication",
    kind: "soft",
    importance: 0.11,
    name: { uz: "Muloqot", ru: "Коммуникация", en: "Communication" },
    description: {
      uz: "Fikrni aniq tushuntirish, tinglash va oʻrinli savollar berish.",
      ru: "Ясно объяснять мысли, слушать и задавать хорошие вопросы.",
      en: "Explaining ideas clearly, listening and asking good questions.",
    },
  },
  {
    slug: "written_communication",
    globalSkillKey: "writing",
    kind: "soft",
    importance: 0.08,
    name: { uz: "Yozma muloqot", ru: "Письменная коммуникация", en: "Writing & email etiquette" },
    description: {
      uz: "Professional ohangda aniq xabar, email va qisqa hujjatlar yozish.",
      ru: "Понятные сообщения, письма и короткие документы в деловом тоне.",
      en: "Clear messages, emails and short documents with a professional tone.",
    },
  },
  {
    slug: "digital_literacy",
    globalSkillKey: "digital_tools",
    kind: "hard",
    importance: 0.09,
    name: { uz: "Raqamli va AI vositalar", ru: "Цифровые и AI-инструменты", en: "Digital & AI tools" },
    description: {
      uz: "Hujjatlar, jadvallar, onlayn hamkorlik va AI vositalaridan masʼuliyat bilan foydalanish.",
      ru: "Ответственная работа с документами, таблицами, онлайн-сервисами для совместной работы и AI.",
      en: "Using documents, spreadsheets, online collaboration and AI tools responsibly.",
    },
  },
  {
    slug: "problem_solving",
    globalSkillKey: "problem_solving",
    kind: "meta",
    importance: 0.1,
    name: { uz: "Muammo yechish", ru: "Решение задач", en: "Problem solving" },
    description: {
      uz: "Muammoni qismlarga ajratish, variantlarni sinab koʻrish va asosli yechim tanlash.",
      ru: "Разбивать задачу на части, проверять варианты и выбирать обоснованное решение.",
      en: "Breaking a problem down, testing options and choosing a reasoned solution.",
    },
  },
  {
    slug: "teamwork",
    globalSkillKey: "teamwork",
    kind: "soft",
    importance: 0.09,
    name: { uz: "Jamoada ishlash", ru: "Работа в команде", en: "Teamwork" },
    description: {
      uz: "Ishni taqsimlash, vaʼdani bajarish va guruhdagi kelishmovchiliklarni hal qilish.",
      ru: "Распределять работу, выполнять обещанное и решать разногласия в группе.",
      en: "Sharing work, keeping commitments and handling disagreement in a group.",
    },
  },
  {
    slug: "time_management",
    globalSkillKey: "self_management",
    kind: "meta",
    importance: 0.1,
    name: {
      uz: "Vaqtni boshqarish va masʼuliyat",
      ru: "Тайм-менеджмент и ответственность",
      en: "Time management & reliability",
    },
    description: {
      uz: "Muddatlarga rioya qilish, ustuvorliklarni belgilash va ishonchli boʻlish.",
      ru: "Соблюдать сроки, расставлять приоритеты и быть надёжным.",
      en: "Meeting deadlines, prioritizing and being reliable.",
    },
  },
  {
    slug: "job_search",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.11,
    name: { uz: "Rezyume va ish izlash", ru: "Резюме и поиск работы", en: "CV & job search" },
    description: {
      uz: "Maqsadli rezyume yozish, mos vakansiyalarni topish va ularga ariza topshirish.",
      ru: "Составлять целевое резюме, находить подходящие вакансии и откликаться на них.",
      en: "Writing a targeted CV and finding and applying to suitable openings.",
    },
  },
  {
    slug: "interview_skills",
    globalSkillKey: null,
    kind: "soft",
    importance: 0.11,
    name: { uz: "Suhbatdan oʻtish", ru: "Прохождение собеседования", en: "Interview skills" },
    description: {
      uz: "Suhbatga tayyorlanish va savollarga aniq misollar bilan javob berish.",
      ru: "Готовиться к собеседованию и отвечать на вопросы конкретными примерами.",
      en: "Preparing for interviews and answering with concrete examples.",
    },
  },
];

/** 05 §12.3 — rationales are user-facing explanation templates about the work, never about the person. */
export const edges: EdgeInput[] = [
  {
    from: "self_awareness_direction",
    to: "job_search",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Rezyume va arizalar aniq tanlangan maqsad lavozimga qaratilgandagina natija beradi.",
      ru: "Резюме и отклики работают, только когда нацелены на выбранную роль.",
      en: "A CV and applications only work when they aim at a chosen target role.",
    },
  },
  {
    from: "communication",
    to: "interview_skills",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Suhbatga tayyorgarlik bor, lekin javoblar tushunarsiz boʻlsa, u koʻrinmay qoladi.",
      ru: "Подготовка к собеседованию есть, но её не видно, когда ответы звучат неясно.",
      en: "Interview preparation is there, but it does not show when answers are unclear.",
    },
  },
  {
    from: "written_communication",
    to: "job_search",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Arizalar yuboriladi, lekin rezyume va xat sifati tufayli saralashdan oʻtmaydi.",
      ru: "Отклики отправляются, но отсеиваются из-за качества резюме и писем.",
      en: "Applications go out, but they are filtered out because of CV and message quality.",
    },
  },
  {
    from: "time_management",
    to: "learning_skills",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Oʻqish usullari bor, lekin muntazam vaqt ajratilmasa, ular natija bermaydi.",
      ru: "Методы учёбы есть, но без регулярного времени они не дают результата.",
      en: "Good study methods are there, but without consistent time they do not pay off.",
    },
  },
  {
    from: "learning_skills",
    to: "digital_literacy",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Oʻrganish usuli boʻlsa, yangi vositalar tezroq oʻzlashtiriladi.",
      ru: "С методом обучения новые инструменты осваиваются быстрее.",
      en: "With a learning method, new tools are picked up faster.",
    },
  },
  {
    from: "communication",
    to: "teamwork",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Jamoaviy ish aniq muloqotga tayanadi.",
      ru: "Работа в команде держится на ясной коммуникации.",
      en: "Teamwork depends on clear communication.",
    },
  },
  {
    from: "problem_solving",
    to: "interview_skills",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Keys shaklidagi suhbat savollari muammo yechishni bevosita tekshiradi.",
      ru: "Кейсовые вопросы на собеседовании напрямую проверяют умение решать задачи.",
      en: "Case-style interview questions test problem solving directly.",
    },
  },
];

/** 05 §12.1 — gate skills (communication, learning_skills, job_search) keep weight ≥ 0.5 everywhere. */
export const specializations: SpecializationInput[] = [
  {
    slug: "school_student",
    name: { uz: "Maktab oʻquvchisi", ru: "Школьник", en: "School student" },
    description: {
      uz: "Maktabda oʻqiyapsiz va kelajakdagi yoʻnalishingizni tanlayapsiz.",
      ru: "Вы учитесь в школе и выбираете будущее направление.",
      en: "You are at school and choosing your future direction.",
    },
    skillWeights: { self_awareness_direction: 1.6, learning_skills: 1.4, job_search: 0.6, interview_skills: 0.5 },
  },
  {
    slug: "university_student",
    name: { uz: "Talaba", ru: "Студент вуза", en: "University student" },
    description: {
      uz: "Kollej yoki oliygohda oʻqiyapsiz va amaliyot yoki birinchi ishga tayyorlanyapsiz.",
      ru: "Вы учитесь в колледже или вузе и готовитесь к стажировке или первой работе.",
      en: "You study at college or university and are preparing for an internship or first job.",
    },
    skillWeights: { job_search: 1.2, interview_skills: 1.2, digital_literacy: 1.1 },
  },
  {
    slug: "recent_graduate",
    name: { uz: "Yangi bitiruvchi", ru: "Недавний выпускник", en: "Recent graduate" },
    description: {
      uz: "Yaqinda oʻqishni tamomladingiz va birinchi ishingizni izlayapsiz.",
      ru: "Вы недавно завершили учёбу и ищете первую работу.",
      en: "You recently graduated and are looking for your first job.",
    },
    skillWeights: { job_search: 1.6, interview_skills: 1.6, self_awareness_direction: 0.8 },
  },
  {
    slug: "career_changer",
    name: { uz: "Kasbini oʻzgartiruvchi", ru: "Смена профессии", en: "Career changer" },
    description: {
      uz: "Boshqa sohaga oʻtyapsiz va yangi yoʻnalishda boshlayapsiz.",
      ru: "Вы переходите в другую сферу и начинаете в новом направлении.",
      en: "You are moving into a new field and starting in a new direction.",
    },
    skillWeights: { self_awareness_direction: 1.4, learning_skills: 1.3, job_search: 1.3 },
  },
];
