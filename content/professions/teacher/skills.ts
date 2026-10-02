import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** Gate skills: K1 lesson_planning · K2 assessment_feedback · K3 instructional_methods (05 §13). */
export const skills: SkillInput[] = [
  {
    slug: "subject_mastery",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: { uz: "Fanni bilish", ru: "Владение предметом", en: "Subject mastery" },
    description: {
      uz: "Fanni aniq va chuqur bilish, oʻquvchilarda koʻp uchraydigan notoʻgʻri tushunchalarni ham.",
      ru: "Точное и глубокое знание предмета, включая типичные ошибочные представления учеников.",
      en: "Accurate, deep knowledge of the subject taught, including common misconceptions.",
    },
  },
  {
    slug: "lesson_planning",
    globalSkillKey: "planning",
    kind: "hard",
    importance: 0.13,
    name: { uz: "Dars rejalashtirish", ru: "Планирование урока", en: "Lesson planning" },
    description: {
      uz: "Faoliyatlar ketma-ketligi, vaqt va materiallarni dars maqsadiga qarab rejalashtirish.",
      ru: "Последовательность заданий, тайминг и материалы, выстроенные под цель урока.",
      en: "Sequencing activities, timing and materials toward an objective.",
    },
  },
  {
    slug: "learning_objectives",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Oʻquv maqsadlari", ru: "Учебные цели", en: "Learning objectives" },
    description: {
      uz: "Har bir dars uchun kuzatiladigan va oʻquvchilar darajasiga mos maqsadlar yozish.",
      ru: "Формулировка наблюдаемых целей урока, соответствующих уровню учеников.",
      en: "Writing observable, level-appropriate objectives for each lesson.",
    },
  },
  {
    slug: "instructional_methods",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.12,
    name: { uz: "Oʻqitish metodlari", ru: "Методы обучения", en: "Instructional methods" },
    description: {
      uz: "Tushuntirish, namuna koʻrsatish, yordam bilan va mustaqil mashq, faol oʻqitish.",
      ru: "Объяснение, показ образца, практика с поддержкой и самостоятельная, активное обучение.",
      en: "Explaining, modelling, guided and independent practice, active learning.",
    },
  },
  {
    slug: "classroom_management",
    globalSkillKey: null,
    kind: "soft",
    importance: 0.11,
    name: { uz: "Sinfni boshqarish", ru: "Управление классом", en: "Classroom management" },
    description: {
      uz: "Tartib-qoidalar, aniq talablar va intizom buzilishiga xotirjam munosabat.",
      ru: "Рутины, ясные ожидания и спокойная реакция на нарушения дисциплины.",
      en: "Routines, clear expectations and calm responses to disruption.",
    },
  },
  {
    slug: "assessment_feedback",
    globalSkillKey: "feedback",
    kind: "hard",
    importance: 0.12,
    name: { uz: "Baholash va fikr-mulohaza", ru: "Оценивание и обратная связь", en: "Assessment & feedback" },
    description: {
      uz: "Dars davomida va undan keyin tushunishni tekshirish hamda aniq, amaliy fikr-mulohaza berish.",
      ru: "Проверка понимания во время и после обучения и обратная связь, с которой можно работать.",
      en: "Checking understanding during and after learning and giving actionable feedback.",
    },
  },
  {
    slug: "differentiation",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Tabaqalashtirilgan yondashuv", ru: "Дифференцированное обучение", en: "Differentiation" },
    description: {
      uz: "Topshiriq va yordamni oʻquvchilarning turli darajasi va ehtiyojlariga moslashtirish.",
      ru: "Адаптация заданий и поддержки под разный уровень и потребности учеников.",
      en: "Adapting tasks and support to different levels and needs.",
    },
  },
  {
    slug: "student_motivation",
    globalSkillKey: null,
    kind: "soft",
    importance: 0.09,
    name: { uz: "Motivatsiya va munosabat", ru: "Мотивация и отношения", en: "Motivation & relationships" },
    description: {
      uz: "Oʻquvchilar harakat qilishda davom etishi uchun ishonch va qiziqish uygʻotish.",
      ru: "Доверие и вовлечённость, благодаря которым ученики продолжают стараться.",
      en: "Building trust and engagement so students keep trying.",
    },
  },
  {
    slug: "communication_parents",
    globalSkillKey: "communication",
    kind: "soft",
    importance: 0.07,
    name: {
      uz: "Ota-onalar va hamkasblar bilan muloqot",
      ru: "Работа с родителями и коллегами",
      en: "Parents & colleagues",
    },
    description: {
      uz: "Oʻzlashtirish va muammolar haqida aniq va hurmat bilan muloqot qilish.",
      ru: "Ясная и уважительная коммуникация об успехах и проблемах ученика.",
      en: "Clear, respectful communication about progress and issues.",
    },
  },
  {
    slug: "reflective_practice",
    globalSkillKey: "learning_agility",
    kind: "meta",
    importance: 0.08,
    name: { uz: "Refleksiya va oʻz ustida ishlash", ru: "Рефлексия и профессиональный рост", en: "Reflective practice" },
    description: {
      uz: "Oʻz darslarini dalillar asosida tahlil qilish va ongli ravishda yaxshilab borish.",
      ru: "Анализ своих уроков на основе фактов и осознанное улучшение.",
      en: "Reviewing own lessons with evidence and improving deliberately.",
    },
  },
];

export const edges: EdgeInput[] = [
  {
    from: "learning_objectives",
    to: "lesson_planning",
    relation: "prerequisite",
    strength: 0.9,
    rationale: {
      uz: "Reja oʻquvchilar dars oxirida nimani qila olishi kerakligidan boshlab quriladi.",
      ru: "План строится от того, что ученики должны уметь к концу урока.",
      en: "A plan is built backwards from what students should be able to do.",
    },
  },
  {
    from: "learning_objectives",
    to: "assessment_feedback",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Baholash siz qoʻygan maqsadga qarab olib boriladi — maqsad aniq boʻlmasa, baho ham aniq boʻlmaydi.",
      ru: "Оценивают по поставленной цели: если цель размыта, оценка тоже размыта.",
      en: "You assess against the objective you set.",
    },
  },
  {
    from: "assessment_feedback",
    to: "differentiation",
    relation: "prerequisite",
    strength: 0.5,
    rationale: {
      uz: "Har bir oʻquvchi qayerda turganini bilgandan keyingina topshiriqni moslashtirish mumkin.",
      ru: "Адаптировать задания можно, только зная, где сейчас находится каждый ученик.",
      en: "You adapt for students once you know where each one is.",
    },
  },
  {
    from: "classroom_management",
    to: "instructional_methods",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Metodlar kuchli, lekin sinfda tartib boʻlmasa, ular natija bermaydi.",
      ru: "Методы сильные, но в классе без порядка они не дают результата.",
      en: "Strong methods do not work in a disrupted class.",
    },
  },
  {
    from: "subject_mastery",
    to: "instructional_methods",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Mazmunda xato boʻlsa, qiziqarli metodlar notoʻgʻri tushunchani faqat tezroq tarqatadi.",
      ru: "Если в содержании есть ошибки, увлекательные методы лишь быстрее их распространяют.",
      en: "Engaging methods spread misconceptions if the content is wrong.",
    },
  },
  {
    from: "lesson_planning",
    to: "classroom_management",
    relation: "limits",
    strength: 0.3,
    rationale: {
      uz: "Tartib-qoidalar bor, lekin rejalashtirilmagan oʻtishlar darsda tartib buzilishiga yoʻl ochadi.",
      ru: "Правила есть, но незапланированные переходы между этапами провоцируют беспорядок.",
      en: "Unplanned transitions invite disruption.",
    },
  },
  {
    from: "student_motivation",
    to: "classroom_management",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Oʻqituvchiga ishongan oʻquvchilar tartib-qoidalarga osonroq amal qiladi.",
      ru: "Ученики, которые доверяют учителю, охотнее соблюдают правила.",
      en: "Students who trust the teacher cooperate with routines.",
    },
  },
  {
    from: "reflective_practice",
    to: "instructional_methods",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Metodlar nima ishlagani va nima ishlamaganini tahlil qilish orqali yaxshilanadi.",
      ru: "Методы совершенствуются через разбор того, что сработало, а что нет.",
      en: "Methods improve through reviewing what worked.",
    },
  },
  {
    from: "communication_parents",
    to: "student_motivation",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Uydagi qoʻllab-quvvatlash maktab bilan uygʻun boʻlsa, oʻquvchining harakati saqlanib qoladi.",
      ru: "Согласованная поддержка дома помогает ученику не сбавлять усилий.",
      en: "Aligned home support sustains effort.",
    },
  },
];

export const specializations: SpecializationInput[] = [
  {
    slug: "school_teacher",
    name: { uz: "Maktab oʻqituvchisi", ru: "Школьный учитель", en: "School teacher" },
    description: {
      uz: "Umumtaʼlim maktabida sinf bilan ishlash",
      ru: "Работа с классом в общеобразовательной школе",
      en: "Teaching a class in a general education school",
    },
    skillWeights: { classroom_management: 1.3, communication_parents: 1.3 },
  },
  {
    slug: "language_teacher",
    name: { uz: "Til oʻqituvchisi", ru: "Преподаватель языка", en: "Language teacher" },
    description: {
      uz: "Maktab, oʻquv markazi yoki kurslarda til oʻqitish",
      ru: "Преподавание языка в школе, учебном центре или на курсах",
      en: "Teaching a language at a school, learning centre or course",
    },
    skillWeights: { instructional_methods: 1.3, differentiation: 1.2, communication_parents: 0.7 },
  },
  {
    slug: "private_tutor",
    name: { uz: "Repetitor", ru: "Репетитор", en: "Private tutor" },
    description: {
      uz: "Yakka tartibda yoki kichik guruh bilan dars berish",
      ru: "Индивидуальные занятия или работа с небольшими группами",
      en: "One-to-one or small-group tutoring",
    },
    skillWeights: {
      differentiation: 1.5,
      student_motivation: 1.3,
      communication_parents: 1.2,
      classroom_management: 0.4,
    },
  },
  {
    slug: "online_instructor",
    name: { uz: "Onlayn oʻqituvchi", ru: "Онлайн-преподаватель", en: "Online instructor" },
    description: {
      uz: "Onlayn dars va kurslar olib borish",
      ru: "Проведение онлайн-уроков и курсов",
      en: "Teaching live online lessons and courses",
    },
    skillWeights: {
      student_motivation: 1.4,
      instructional_methods: 1.3,
      assessment_feedback: 1.2,
      classroom_management: 0.5,
      communication_parents: 0.4,
    },
  },
];
