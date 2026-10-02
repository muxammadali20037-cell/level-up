import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** §14.3 — importances sum to exactly 1.00. Gate skills: K1 safety_risk_management, K2 clear_commands, K3 traffic_rules_knowledge. */
export const skills: SkillInput[] = [
  {
    slug: "traffic_rules_knowledge",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.12,
    name: { uz: "Yoʻl harakati qoidalarini bilish", ru: "Знание ПДД", en: "Traffic rules knowledge" },
    description: {
      uz: "Qoidalar, belgilar va yoʻl berish tartibini aniq bilish hamda ularni tushunarli tushuntira olish.",
      ru: "Точное знание правил, знаков и очерёдности проезда и умение понятно их объяснить.",
      en: "Accurate knowledge of rules, signs and right-of-way, and explaining them clearly.",
    },
  },
  {
    slug: "safety_risk_management",
    globalSkillKey: "safety",
    kind: "hard",
    importance: 0.15,
    name: { uz: "Xavfsizlik va xavfni boshqarish", ru: "Безопасность и управление рисками", en: "Safety & risk management" },
    description: {
      uz: "Marshrut, vaqt va aralashuvni (shu jumladan qoʻshimcha pedalni) shunday tanlashki, mashgʻulot xavfsiz oʻtsin.",
      ru: "Выбор маршрута, времени и вмешательства (включая дублирующие педали), чтобы занятие оставалось безопасным.",
      en: "Choosing routes, timing and interventions (incl. dual controls) so lessons stay safe.",
    },
  },
  {
    slug: "hazard_perception",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: { uz: "Xavfni oldindan koʻrishni oʻrgatish", ru: "Обучение восприятию опасности", en: "Hazard perception teaching" },
    description: {
      uz: "Oʻquvchini yoʻlni kuzatishga, xavfni oldindan sezishga va unga erta javob berishga oʻrgatish.",
      ru: "Обучение ученика сканировать дорогу, предвидеть опасность и реагировать на неё заранее.",
      en: "Teaching learners to scan, anticipate and respond to hazards early.",
    },
  },
  {
    slug: "vehicle_control_demonstration",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Avtomobilni boshqarish va namoyish", ru: "Управление и демонстрация", en: "Vehicle control & demonstration" },
    description: {
      uz: "Manyovrlarni toʻgʻri namoyish qilish va ularni oʻrganish oson boʻlgan qadamlarga boʻlish.",
      ru: "Правильная демонстрация манёвров и разбиение их на понятные для обучения шаги.",
      en: "Demonstrating manoeuvres correctly and breaking them into teachable steps.",
    },
  },
  {
    slug: "instruction_structure",
    globalSkillKey: "planning",
    kind: "hard",
    importance: 0.11,
    name: { uz: "Mashgʻulot tuzilmasi va bosqichlar", ru: "Структура и последовательность занятий", en: "Lesson structure & progression" },
    description: {
      uz: "Mashgʻulotlarni aniq maqsad bilan oddiy muhitdan murakkab muhitga qarab ketma-ket qurish.",
      ru: "Выстраивание занятий от простой обстановки к сложной с чёткими целями.",
      en: "Sequencing lessons from simple to complex environments with clear goals.",
    },
  },
  {
    slug: "clear_commands",
    globalSkillKey: "communication",
    kind: "soft",
    importance: 0.11,
    name: { uz: "Aniq koʻrsatmalar berish", ru: "Чёткие команды в машине", en: "Clear in-car commands" },
    description: {
      uz: "Qisqa, oʻz vaqtida va bir maʼnoli koʻrsatmalar: qayerda, qachon, nima qilish.",
      ru: "Короткие, своевременные и однозначные указания: где, когда, что делать.",
      en: "Short, early, unambiguous directions: where, when, what.",
    },
  },
  {
    slug: "learner_psychology",
    globalSkillKey: null,
    kind: "soft",
    importance: 0.09,
    name: { uz: "Oʻquvchi psixologiyasi va hayajon", ru: "Психология ученика и тревожность", en: "Learner psychology & anxiety" },
    description: {
      uz: "Oʻquvchidagi stress va haddan tashqari yuklamani sezib, surʼat va ohangni moslashtirish.",
      ru: "Умение распознать стресс и перегрузку ученика и подстроить темп и тон.",
      en: "Recognizing stress and overload and adjusting pace and tone.",
    },
  },
  {
    slug: "error_correction_feedback",
    globalSkillKey: "feedback",
    kind: "soft",
    importance: 0.1,
    name: { uz: "Xatoni tuzatish va fikr-mulohaza", ru: "Исправление ошибок и обратная связь", en: "Error correction & feedback" },
    description: {
      uz: "Xatoni oʻsha zahoti xavfsiz tuzatish va mashgʻulotdan keyin uni birga tahlil qilish.",
      ru: "Безопасное исправление ошибок в моменте и их разбор после занятия.",
      en: "Correcting faults safely in the moment and debriefing them after.",
    },
  },
  {
    slug: "assessment_readiness",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.07,
    name: { uz: "Rivojni baholash va imtihonga tayyorlik", ru: "Оценка прогресса и готовность к экзамену", en: "Progress & exam readiness" },
    description: {
      uz: "Oʻquvchi mustaqil haydashga yoki imtihonga qachon tayyor ekanini xolis baholash.",
      ru: "Объективная оценка того, когда ученик готов к самостоятельному вождению или экзамену.",
      en: "Judging objectively when a learner is ready for independent driving or the exam.",
    },
  },
  {
    slug: "professional_conduct",
    globalSkillKey: "ethics_compliance",
    kind: "meta",
    importance: 0.06,
    name: { uz: "Kasbiy odob va etika", ru: "Профессиональное поведение и этика", en: "Professional conduct & ethics" },
    description: {
      uz: "Hurmat, chegaralarga rioya qilish, tayyorlik haqida rostgoʻylik va qoidalarni chetlab oʻtmaslik.",
      ru: "Уважение, соблюдение границ, честность о готовности и никаких обходов правил.",
      en: "Respect, boundaries, honesty about readiness, no shortcuts on rules.",
    },
  },
];

/** §14.4 — rationales are user-facing explanation templates, phrased about the work, never about the person. */
export const edges: EdgeInput[] = [
  {
    from: "safety_risk_management",
    to: "instruction_structure",
    relation: "limits",
    strength: 0.9,
    rationale: {
      uz: "Mashgʻulot yaxshi tuzilgan, lekin xavf nazorat qilinmasa — u baribir xavfli boʻlib qoladi.",
      ru: "Хорошо выстроенное занятие остаётся опасным, если риски не под контролем.",
      en: "A well-structured lesson is still unsafe when risk is not under control.",
    },
  },
  {
    from: "safety_risk_management",
    to: "vehicle_control_demonstration",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Mahorat bilan koʻrsatilgan manyovr ham xavfli sharoitda oʻquvchini himoya qilmaydi.",
      ru: "Даже мастерская демонстрация манёвра не защищает ученика в небезопасной обстановке.",
      en: "Even a skilful demonstration does not protect a learner in an unsafe setting.",
    },
  },
  {
    from: "clear_commands",
    to: "safety_risk_management",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Xavfsizlik boʻyicha bilim bor, lekin koʻrsatma kech yoki noaniq berilsa — u ishlamaydi.",
      ru: "Знания о безопасности не срабатывают, если команда звучит поздно или двусмысленно.",
      en: "Safety knowledge does not work when commands come late or are ambiguous.",
    },
  },
  {
    from: "learner_psychology",
    to: "error_correction_feedback",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Hayajonlangan va charchagan oʻquvchiga berilgan tanbeh xatoni kamaytirmaydi, aksincha koʻpaytiradi.",
      ru: "Замечания перегруженному ученику не уменьшают ошибки, а умножают их.",
      en: "Corrections given to an overloaded learner make errors worse, not better.",
    },
  },
  {
    from: "traffic_rules_knowledge",
    to: "hazard_perception",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Xavfni oldindan koʻrish kim kimga va qayerda yoʻl berishini bilishdan boshlanadi.",
      ru: "Предвидение опасности начинается со знания, кто, кому и где уступает.",
      en: "Anticipation starts from knowing who must yield, and where.",
    },
  },
  {
    from: "traffic_rules_knowledge",
    to: "assessment_readiness",
    relation: "prerequisite",
    strength: 0.5,
    rationale: {
      uz: "Oʻquvchining tayyorligi qoidalar asosida baholanadi — avval qoidalarni puxta bilish kerak.",
      ru: "Готовность ученика оценивается по правилам — сначала нужно твёрдо знать их.",
      en: "Readiness is judged against the rules, so solid rules knowledge comes first.",
    },
  },
  {
    from: "instruction_structure",
    to: "assessment_readiness",
    relation: "prerequisite",
    strength: 0.5,
    rationale: {
      uz: "Rivojni baholash uchun oldindan rejalashtirilgan bosqichlar kerak — aks holda solishtirishga asos yoʻq.",
      ru: "Прогресс оценивается относительно плана занятий — без него не с чем сравнивать.",
      en: "Progress is assessed against a planned progression; without one there is nothing to compare to.",
    },
  },
  {
    from: "error_correction_feedback",
    to: "assessment_readiness",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Har mashgʻulotdan keyingi tahlil yozuvlari tayyorlik qanday oʻsayotganini koʻrsatadi.",
      ru: "Записи разборов после занятий показывают, как растёт готовность.",
      en: "Debrief notes after each lesson show how readiness is trending.",
    },
  },
  {
    from: "professional_conduct",
    to: "learner_psychology",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Hurmatli muomala ishonch uygʻotadi, ishonch esa hayajonni pasaytiradi.",
      ru: "Уважительное поведение создаёт доверие, а доверие снижает тревожность.",
      en: "Respectful conduct builds trust, and trust lowers anxiety.",
    },
  },
];

/**
 * §14.2 — only non-default weights listed. Note: theory_instructor.vehicle_control_demonstration = 0.4 follows the
 * canonical doc (allowed range [0.3, 3.0]); gate skills stay ≥ 0.5 in every specialization.
 */
export const specializations: SpecializationInput[] = [
  {
    slug: "practical_instructor",
    name: {
      uz: "Amaliy haydash yoʻriqchisi",
      ru: "Инструктор практического вождения",
      en: "Practical driving instructor",
    },
    description: {
      uz: "Avtomobilda oʻquvchi bilan amaliy mashgʻulot oʻtkazadi.",
      ru: "Проводит практические занятия с учеником в автомобиле.",
      en: "Gives in-car practical lessons to learners.",
    },
    skillWeights: {
      vehicle_control_demonstration: 1.4,
      clear_commands: 1.3,
      hazard_perception: 1.2,
      traffic_rules_knowledge: 0.9,
    },
  },
  {
    slug: "theory_instructor",
    name: { uz: "Nazariya oʻqituvchisi", ru: "Преподаватель теории", en: "Theory instructor" },
    description: {
      uz: "Yoʻl harakati qoidalari va xavfsiz haydash nazariyasini sinfda oʻqitadi.",
      ru: "Преподаёт ПДД и теорию безопасного вождения в классе.",
      en: "Teaches traffic rules and safe-driving theory in the classroom.",
    },
    skillWeights: {
      traffic_rules_knowledge: 1.6,
      hazard_perception: 1.3,
      instruction_structure: 1.2,
      clear_commands: 0.7,
      vehicle_control_demonstration: 0.4,
    },
  },
  {
    slug: "corporate_driver_trainer",
    name: {
      uz: "Korporativ haydovchilar murabbiyi",
      ru: "Тренер корпоративных водителей",
      en: "Corporate driver trainer",
    },
    description: {
      uz: "Kompaniya haydovchilariga xavfsiz va ehtiyotkor haydashni oʻrgatadi.",
      ru: "Обучает водителей компании безопасному и защитному вождению.",
      en: "Trains company drivers in safe, defensive driving.",
    },
    skillWeights: {
      safety_risk_management: 1.4,
      hazard_perception: 1.4,
      learner_psychology: 0.8,
      assessment_readiness: 0.5,
    },
  },
];
