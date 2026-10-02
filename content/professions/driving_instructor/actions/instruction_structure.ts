import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: instruction_structure. Never instruct the user to drive or teach on public roads (§14.1 rule 3). */
export const actions: ActionInput[] = [
  {
    slug: "is_observable_goal",
    skill: "instruction_structure",
    title: {
      uz: "Keyingi dars maqsadini oʻlchanadigan qilib yozing",
      ru: "Запишите цель следующего занятия измеримо",
      en: "Write your next lesson goal in observable terms",
    },
    description: {
      uz: "Keyingi darsingiz uchun bitta maqsadni shu shaklda yozing: «Oʻquvchi … sharoitida … ni koʻrsatmasiz bajara oladi». Harakat, sharoit va meʼyor aniq boʻlsin.",
      ru: "Запишите одну цель следующего занятия в форме: «Ученик выполняет … в условиях … без подсказок». Действие, условия и критерий должны быть конкретными.",
      en: "Write one goal for your next lesson as: «The learner can … in … conditions without prompts». Make the action, condition and standard concrete.",
    },
    kind: "learn",
    phase: "foundation",
    durationMinutes: 10,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Maqsadda harakat, sharoit va meʼyor bor; uni kuzatib tekshirish mumkin.",
      ru: "В цели есть действие, условия и критерий; её можно проверить наблюдением.",
      en: "The goal has an action, a condition and a standard; it can be checked by observation.",
    },
    why: {
      uz: "Aniq maqsadsiz dars «aylanib yurish»ga aylanadi. Oʻlchanadigan maqsad keyin tayyorlikni baholashga asos boʻladi.",
      ru: "Без чёткой цели занятие превращается в «катание». Измеримая цель потом становится основой для оценки готовности.",
      en: "Without a clear goal a lesson becomes «just driving around». A measurable goal later underpins readiness judgments.",
    },
    resources: [],
  },
  {
    slug: "is_progression_ladder",
    skill: "instruction_structure",
    title: {
      uz: "10 bosqichli oʻqitish zinapoyasini chizing",
      ru: "Нарисуйте лестницу обучения из 10 ступеней",
      en: "Draw a 10-step learning progression",
    },
    description: {
      uz: "Yopiq maydondan murakkab harakatgacha 10 bosqich yozing. Har biriga: muhit, asosiy koʻnikma va keyingi bosqichga oʻtish sharti. Muhit murakkabligi bosqichma-bosqich oshib borsin.",
      ru: "Запишите 10 ступеней от закрытой площадки до сложного трафика. Для каждой: среда, ключевой навык и условие перехода дальше. Сложность среды должна расти постепенно.",
      en: "Write 10 steps from a closed area to complex traffic. For each: environment, key skill and the move-on criterion. Environment complexity should rise gradually.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "10 qator: muhit, koʻnikma, oʻtish sharti; hech qayerda murakkablik keskin sakramaydi.",
      ru: "10 строк: среда, навык, условие перехода; нигде нет резкого скачка сложности.",
      en: "10 rows: environment, skill, move-on criterion; no sudden jumps in complexity.",
    },
    why: {
      uz: "Oddiydan murakkabga ketma-ketlik oʻquvchini ortiqcha yuklamadan saqlaydi va xavfni boshqarishni osonlashtiradi.",
      ru: "Последовательность от простого к сложному защищает ученика от перегрузки и упрощает управление риском.",
      en: "Simple-to-complex sequencing protects the learner from overload and makes risk easier to manage.",
    },
    resources: [],
  },
  {
    slug: "is_time_boxed_lesson",
    skill: "instruction_structure",
    title: {
      uz: "Darsni 3 qismga vaqt bilan boʻling",
      ru: "Разделите занятие на 3 части по времени",
      en: "Time-box a lesson into brief, practice, debrief",
    },
    description: {
      uz: "Odatdagi dars davomiyligingiz uchun reja yozing: kirish (maqsad va xavfsizlik), mashq, yakuniy tahlil. Har qismga daqiqalarni belgilang; yakuniy tahlilga kamida 5 daqiqa qoldiring.",
      ru: "Напишите план для вашей обычной длительности занятия: вступление (цель и безопасность), практика, разбор. Распределите минуты; на разбор оставьте минимум 5 минут.",
      en: "Write a plan for your usual lesson length: brief (goal and safety), practice, debrief. Assign minutes to each; keep at least 5 minutes for the debrief.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Uch qismli reja daqiqalar bilan; tahlilga kamida 5 daqiqa ajratilgan.",
      ru: "План из трёх частей с минутами; на разбор выделено не менее 5 минут.",
      en: "A three-part plan with minutes; at least 5 minutes set aside for the debrief.",
    },
    why: {
      uz: "Tahlilsiz dars tajribani mustahkamlamaydi. Vaqt boʻyicha tuzilma darsni maqsadga yoʻnaltirilgan qiladi.",
      ru: "Без разбора опыт не закрепляется. Структура по времени удерживает занятие на цели.",
      en: "Without a debrief, experience does not stick. A timed structure keeps the lesson on its goal.",
    },
    resources: [],
  },
  {
    slug: "is_individual_plans",
    skill: "instruction_structure",
    title: {
      uz: "3 ta oʻquvchi uchun shaxsiy reja tuzing",
      ru: "Составьте индивидуальные планы для 3 учеников",
      en: "Build individual plans for 3 current learners",
    },
    description: {
      uz: "3 ta joriy oʻquvchingiz uchun ularning zinapoyadagi oʻrnini belgilang, keyingi 2 dars maqsadini va keyingi bosqichga oʻtish shartini yozing. Rejalarni dars daftaringizga kiriting.",
      ru: "Для 3 текущих учеников отметьте их место на лестнице обучения, запишите цели 2 следующих занятий и условие перехода на следующую ступень. Внесите планы в журнал занятий.",
      en: "For 3 current learners, mark where they are on your progression, write the goals of their next 2 lessons and the move-on criterion. Add the plans to your lesson records.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 50,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "3 ta reja kartasi: bosqich, 2 ta maqsad, oʻtish sharti.",
      ru: "3 карточки плана: ступень, 2 цели, условие перехода.",
      en: "3 plan cards, each with stage, 2 goals and a move-on criterion.",
    },
    why: {
      uz: "Har bir oʻquvchi har xil surʼatda oʻsadi. Shaxsiy reja imtihonga tayyorlikni rejaga nisbatan baholash imkonini beradi.",
      ru: "Каждый ученик растёт в своём темпе. Индивидуальный план позволяет оценивать готовность относительно плана.",
      en: "Every learner progresses at their own pace. An individual plan lets you judge readiness against a plan.",
    },
    resources: [],
  },
  {
    slug: "is_lesson_notes_audit",
    skill: "instruction_structure",
    title: {
      uz: "Oxirgi 5 dars yozuvini reja bilan solishtiring",
      ru: "Сверьте записи 5 последних занятий с планом",
      en: "Audit your last 5 lesson notes against your plan",
    },
    description: {
      uz: "Oxirgi 5 dars yozuvlaringizni oling. Har birida tekshiring: maqsad yozilganmi, muhit oʻquvchi bosqichiga mos edimi. Mos kelganlar ulushini hisoblang va bitta tuzatishni tanlang.",
      ru: "Возьмите записи 5 последних занятий. Проверьте в каждой: записана ли цель, соответствовала ли среда этапу ученика. Посчитайте долю совпадений и выберите одно исправление.",
      en: "Take your notes from the last 5 lessons. For each, check: was a goal written, did the environment match the learner's stage? Calculate the match rate and pick one fix.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 25,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Ikki koʻrsatkich hisoblangan (maqsadli darslar va mos muhit ulushi) va bitta tuzatish tanlangan.",
      ru: "Посчитаны два показателя (доля занятий с целью и с подходящей средой), выбрано одно исправление.",
      en: "Two figures calculated (share of lessons with a goal and with a matching environment), one fix chosen.",
    },
    why: {
      uz: "Reja faqat amalda bajarilsa ishlaydi. Oʻlchov reja va haqiqat orasidagi farqni koʻrsatadi.",
      ru: "План работает, только если выполняется. Замер показывает разрыв между планом и реальностью.",
      en: "A plan only works if it is followed. Measuring shows the gap between plan and reality.",
    },
    resources: [],
  },
];
