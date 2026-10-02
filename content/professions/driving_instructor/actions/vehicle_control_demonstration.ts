import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/**
 * Skill: vehicle_control_demonstration. Never instruct the user to drive or teach on public roads (§14.1 rule 3);
 * in-car work is stationary or closed-area under authorized supervision only.
 */
export const actions: ActionInput[] = [
  {
    slug: "vcd_break_down_manoeuvre",
    skill: "vehicle_control_demonstration",
    title: {
      uz: "Bitta manevrni 5–7 ta oʻrgatiladigan qadamga ajrating",
      ru: "Разбейте один манёвр на 5–7 обучаемых шагов",
      en: "Break one manoeuvre into 5–7 teachable steps",
    },
    description: {
      uz: "Bitta manevrni tanlang (masalan, qiyalikda joyidan qoʻzgʻalish yoki orqaga yurib toʻxtash). Uni 5–7 qadam qilib yozing: har qadamda oʻquvchi nimani koʻradi, nima qiladi va nimani tekshiradi.",
      ru: "Выберите манёвр (например, трогание на подъёме или парковку задним ходом). Распишите его на 5–7 шагов: что ученик видит, делает и проверяет на каждом шаге.",
      en: "Pick one manoeuvre (e.g. a hill start or reverse parking). Write it as 5–7 steps: what the learner sees, does and checks at each step.",
    },
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "5–7 qadam yozilgan, har birida bitta harakat va bitta tekshiruv bor.",
      ru: "Записано 5–7 шагов, в каждом одно действие и одна проверка.",
      en: "5–7 steps written, each with one action and one check.",
    },
    why: {
      uz: "Mohir haydovchi harakatlarni avtomatik bajaradi; yoʻriqchi esa ularni qismlarga ajrata olishi kerak. Aks holda namoyish oʻquvchiga tushunarsiz qoladi.",
      ru: "Опытный водитель действует автоматически, а инструктор должен уметь разложить действия на части. Иначе демонстрация остаётся непонятной ученику.",
      en: "Skilled drivers act automatically; instructors must be able to take actions apart. Otherwise a demonstration stays unclear to the learner.",
    },
    resources: [],
  },
  {
    slug: "vcd_stationary_demo_script",
    skill: "vehicle_control_demonstration",
    title: {
      uz: "Joyida turgan avtomobilda namoyish matnini mashq qiling",
      ru: "Отрепетируйте демонстрацию в неподвижной машине",
      en: "Rehearse a demo script in a parked car",
    },
    description: {
      uz: "Dvigatel oʻchiq, toʻxtab turgan avtomobilda yoki stol ustida manevrni ovoz chiqarib tushuntiring: har bir boshqaruv organini nomlang, sekin gapiring, 2 ta tekshiruv savoli bering. Ovozingizni yozib, bir marta tinglang.",
      ru: "В припаркованной машине с выключенным двигателем или за столом проговорите манёвр: назовите каждый орган управления, говорите медленно, задайте 2 проверочных вопроса. Запишите голос и прослушайте.",
      en: "In a parked car with the engine off, or at a desk, talk through the manoeuvre: name each control, speak slowly, ask 2 check questions. Record your voice and listen once.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "3 daqiqagacha yozuv: barcha qadamlar nomlangan, kamida 2 ta tekshiruv savoli bor.",
      ru: "Запись до 3 минут: все шаги названы, есть не менее 2 проверочных вопросов.",
      en: "A recording of up to 3 minutes: every step named, at least 2 check questions.",
    },
    why: {
      uz: "Harakatsiz mashq namoyishni xavfsiz sharoitda silliqlaydi. Yozuvni tinglash tez gapirish yoki qadamni tashlab ketishni koʻrsatadi.",
      ru: "Тренировка без движения шлифует демонстрацию в безопасных условиях. Прослушивание показывает спешку и пропущенные шаги.",
      en: "Stationary practice polishes the demo safely. Listening back reveals rushing or skipped steps.",
    },
    resources: [],
  },
  {
    slug: "vcd_fault_cue_table",
    skill: "vehicle_control_demonstration",
    title: {
      uz: "Manevr uchun 3 ta tipik xato jadvalini tuzing",
      ru: "Составьте таблицу 3 типичных ошибок манёвра",
      en: "Build a 3-fault table for one manoeuvre",
    },
    description: {
      uz: "Tanlangan manevr uchun oʻquvchilarning 3 ta tipik xatosini yozing. Har biriga: yoʻriqchi oʻrindigʻidan qanday koʻrinadi va qaysi qisqa ishora bilan tuzatiladi.",
      ru: "Для выбранного манёвра запишите 3 типичные ошибки учеников. Для каждой: как она выглядит с места инструктора и какой короткой подсказкой исправляется.",
      en: "For the chosen manoeuvre, write 3 typical learner faults. For each: how it looks from the instructor's seat and which short cue corrects it.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "3×3 jadval: xato, belgisi, tuzatuvchi ishora.",
      ru: "Таблица 3×3: ошибка, признак, корректирующая подсказка.",
      en: "A 3×3 table: fault, visible sign, correcting cue.",
    },
    why: {
      uz: "Kuchli namoyish xatoni oldindan kutishni ham oʻz ichiga oladi. Tayyor ishora xatoni tez va xotirjam tuzatishga yordam beradi.",
      ru: "Сильная демонстрация включает предвидение ошибок. Готовая подсказка помогает исправлять быстро и спокойно.",
      en: "A strong demonstration includes anticipating faults. A ready cue helps correct quickly and calmly.",
    },
    resources: [],
  },
  {
    slug: "vcd_closed_area_demo_plan",
    skill: "vehicle_control_demonstration",
    title: {
      uz: "Yopiq maydon uchun namoyish rejasini tuzing",
      ru: "Составьте план демонстрации для закрытой площадки",
      en: "Plan a closed-area demonstration session",
    },
    description: {
      uz: "Avtodromdagi namoyish rejasini yozing: 1) oddiy tezlikda namoyish, 2) sekin, sharh bilan, 3) oʻquvchi qadamma-qadam bajaradi. Har bosqich vaqti va xavfsizlik shartlarini yozing va rejani maktab rahbariyatiga tasdiqlating.",
      ru: "Напишите план демонстрации на автодроме: 1) показ в обычном темпе, 2) медленно с комментарием, 3) ученик выполняет по шагам. Укажите время и условия безопасности этапов и согласуйте план со школой.",
      en: "Write a demo plan for a closed training area: 1) normal-speed demo, 2) slow with commentary, 3) learner performs step by step. Add timing and safety conditions per stage, and get it approved by your school.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "3 bosqichli yozma reja, xavfsizlik shartlari bilan, maktab tomonidan tasdiqlangan.",
      ru: "Письменный план из 3 этапов с условиями безопасности, согласованный со школой.",
      en: "A written 3-stage plan with safety conditions, approved by the school.",
    },
    why: {
      uz: "Mohir namoyish xavfli muhitda oʻquvchini himoya qilmaydi. Yopiq maydon va tasdiqlangan reja namoyishni xavfsiz qiladi.",
      ru: "Мастерская демонстрация не защищает ученика в опасной среде. Закрытая площадка и согласованный план делают показ безопасным.",
      en: "A skilful demo does not protect a learner in an unsafe setting. A closed area and an approved plan make it safe.",
    },
    resources: [],
  },
  {
    slug: "vcd_colleague_rating",
    skill: "vehicle_control_demonstration",
    title: {
      uz: "Namoyish matningizni hamkasbga baholating",
      ru: "Попросите коллегу оценить ваш сценарий показа",
      en: "Get your demo script rated by a colleague",
    },
    description: {
      uz: "Qadamlar roʻyxati va namoyish matningizni ruxsatga ega hamkasbga koʻrsating. Undan har bir qadam aniqligini 1–5 ball bilan baholashni va eng zaif qadamni koʻrsatishni soʻrang. Shu qadamni qayta yozing.",
      ru: "Покажите список шагов и сценарий коллеге-инструктору с допуском. Попросите оценить ясность каждого шага по шкале 1–5 и указать самый слабый. Перепишите этот шаг.",
      en: "Show your step list and demo script to an authorized colleague. Ask them to rate each step's clarity 1–5 and point out the weakest. Rewrite that step.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 25,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Har bir qadam baholangan; eng zaif qadam qayta yozilgan.",
      ru: "Каждый шаг оценён; самый слабый шаг переписан.",
      en: "Every step has a rating; the weakest step is rewritten.",
    },
    why: {
      uz: "Siz uchun tushunarli qadam boshqalarga noaniq boʻlishi mumkin. Tashqi baho namoyish sifatini tasdiqlaydi.",
      ru: "Понятный вам шаг может быть неясен другим. Внешняя оценка подтверждает качество демонстрации.",
      en: "A step that is clear to you may be unclear to others. An outside rating confirms demonstration quality.",
    },
    resources: [],
  },
];
