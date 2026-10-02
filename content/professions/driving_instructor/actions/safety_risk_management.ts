import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: safety_risk_management. Never instruct the user to drive or teach on public roads (§14.1 rule 3). */
export const actions: ActionInput[] = [
  {
    slug: "srm_pre_lesson_checklist",
    skill: "safety_risk_management",
    title: {
      uz: "Darsdan oldingi xavfsizlik roʻyxatini yozing",
      ru: "Составьте чек-лист безопасности перед занятием",
      en: "Write your pre-lesson safety checklist",
    },
    description: {
      uz: "Uch blokda 8–10 ta tekshiruv yozing: avtomobil (tormoz, qoʻshimcha pedal, koʻzgular, shinalar), oʻquvchi (holati, hujjatlar, koʻzoynak), sharoit (ob-havo, yoʻl yuklamasi). Roʻyxatni bir varaqqa sigʻdiring.",
      ru: "Запишите 8–10 проверок в трёх блоках: автомобиль (тормоза, дублирующая педаль, зеркала, шины), ученик (самочувствие, документы, очки), условия (погода, загруженность). Уместите на одну страницу.",
      en: "Write 8–10 checks in three blocks: vehicle (brakes, dual pedal, mirrors, tyres), learner (condition, documents, glasses), conditions (weather, traffic level). Keep it to one page.",
    },
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Bir varaqli roʻyxat: kamida 8 ta tekshiruv, 3 blokka ajratilgan.",
      ru: "Чек-лист на одной странице: не менее 8 проверок в 3 блоках.",
      en: "A one-page list with at least 8 checks grouped into 3 blocks.",
    },
    why: {
      uz: "Xavf dvigatel ishga tushishidan oldin boshqariladi. Roʻyxat xotiraga tayanishni yoʻqotadi va xavfsizlik — barcha boshqa koʻnikmalarni cheklovchi asosiy shart.",
      ru: "Риск управляется ещё до запуска двигателя. Чек-лист снимает зависимость от памяти, а безопасность ограничивает все остальные навыки.",
      en: "Risk is managed before the engine starts. A checklist removes reliance on memory, and safety limits every other skill.",
    },
    resources: [],
  },
  {
    slug: "srm_route_risk_map",
    skill: "safety_risk_management",
    title: {
      uz: "Oʻquv marshrutingizdagi 5 xavfli joyni belgilang",
      ru: "Отметьте 5 зон риска на учебном маршруте",
      en: "Mark 5 risk zones on your training route",
    },
    description: {
      uz: "Odatdagi marshrutingiz xaritasida (qogʻoz yoki ilova) 5 joyni belgilang: maktab yoni, koʻrinmas chiqish, gavjum chorraha va h.k. Har biriga yozing: nima sodir boʻlishi mumkin va qayerda aralashasiz. Ish stol ustida bajariladi.",
      ru: "На карте привычного маршрута (бумага или приложение) отметьте 5 мест: у школы, выезд без обзора, загруженный перекрёсток и т. п. Для каждого запишите, что может случиться и где вы вмешаетесь. Работа за столом.",
      en: "On a map of your usual route (paper or app), mark 5 places: near a school, a blind exit, a busy junction, etc. For each, note what could happen and where you would intervene. Done at a desk.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Xaritada 5 ta zona: har birida xavf tavsifi va aralashuv nuqtasi bor.",
      ru: "На карте 5 зон, у каждой описан риск и точка вмешательства.",
      en: "A map with 5 zones, each with a described risk and an intervention point.",
    },
    why: {
      uz: "Marshrut va vaqtni tanlash — xavfsizlikning asosiy dastagi. Xavfni oldindan bilgan yoʻriqchi kech emas, erta aralashadi.",
      ru: "Выбор маршрута и времени — главный рычаг безопасности. Инструктор, знающий риски заранее, вмешивается рано, а не поздно.",
      en: "Choosing route and timing is the main safety lever. An instructor who knows the risks in advance intervenes early, not late.",
    },
    resources: [],
  },
  {
    slug: "srm_intervention_ladder",
    skill: "safety_risk_management",
    title: {
      uz: "Aralashuv zinapoyasini yozing va yodlang",
      ru: "Опишите и выучите лестницу вмешательства",
      en: "Write and memorise your intervention ladder",
    },
    description: {
      uz: "4 bosqich yozing: ogohlantirish, qatʼiy buyruq, rulga yordam, qoʻshimcha tormoz. Har biriga: qaysi belgi boshlaydi va aniq qaysi soʻzlarni aytasiz. Qogʻozga qaramay ovoz chiqarib 3 marta takrorlang.",
      ru: "Запишите 4 ступени: подсказка, твёрдая команда, помощь рулём, дублирующий тормоз. Для каждой: какой сигнал её запускает и какие точно слова вы говорите. Проговорите вслух 3 раза без листа.",
      en: "Write 4 steps: prompt, firm command, steering assistance, dual brake. For each: which signal triggers it and the exact words you say. Say it aloud 3 times without notes.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "4 bosqich va ularning belgilari yozilgan; siz ularni qogʻozsiz ayta olasiz.",
      ru: "4 ступени с сигналами записаны; вы называете их без подсказки.",
      en: "4 steps with triggers are written; you can recite them without notes.",
    },
    why: {
      uz: "Stress paytida oldindan tayyorlangan qaror tezroq ishlaydi. Aniq bosqichlar haddan tashqari erta yoki juda kech aralashuvning oldini oladi.",
      ru: "Под стрессом заранее подготовленное решение срабатывает быстрее. Чёткие ступени защищают и от слишком раннего, и от запоздалого вмешательства.",
      en: "Under stress, a pre-made decision works faster. Clear steps prevent both over-early and late intervention.",
    },
    resources: [],
  },
  {
    slug: "srm_weekly_route_stage_plan",
    skill: "safety_risk_management",
    title: {
      uz: "Haftalik marshrutlarni oʻquvchi bosqichiga moslang",
      ru: "Сопоставьте маршруты недели с этапом учеников",
      en: "Match next week's routes to each learner's stage",
    },
    description: {
      uz: "Kelgusi hafta jadvalidagi har bir oʻquvchi uchun jadval tuzing: hozirgi bosqichi, rejalashtirilgan marshrut va vaqt murakkabligi. Mos kelmaganlarini tinchroq marshrut yoki vaqtga koʻchiring.",
      ru: "Для каждого ученика в расписании следующей недели составьте таблицу: текущий этап, запланированный маршрут и сложность времени. Несоответствия перенесите на более спокойный маршрут или время.",
      en: "For every learner on next week's schedule, make a table: current stage, planned route and time-of-day difficulty. Move mismatches to a quieter route or time.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Barcha oʻquvchilar uchun jadval tayyor; har bir nomuvofiqlik tuzatilgan yoki sababi yozilgan.",
      ru: "Таблица по всем ученикам готова; каждое несоответствие исправлено или обосновано.",
      en: "The table covers all learners; every mismatch is fixed or justified in writing.",
    },
    why: {
      uz: "Yaxshi tuzilgan dars ham xavf nazorat qilinmasa xavfli boʻladi. Muhit murakkabligini bosqichga moslash — xavfni boshqarishning kundalik amaliyoti.",
      ru: "Даже хорошо построенное занятие опасно без контроля риска. Подбор сложности среды под этап — ежедневная практика управления риском.",
      en: "Even a well-structured lesson is unsafe without risk control. Matching environment difficulty to stage is daily risk management.",
    },
    resources: [],
  },
  {
    slug: "srm_senior_review",
    skill: "safety_risk_management",
    title: {
      uz: "Xavf xaritangizni tajribali yoʻriqchiga koʻrsating",
      ru: "Покажите карту рисков опытному инструктору",
      en: "Have a senior instructor review your risk plan",
    },
    description: {
      uz: "Marshrut xaritangiz va aralashuv zinapoyangizni ruxsatga ega tajribali yoʻriqchiga koʻrsating. Undan 2 ta qoldirilgan xavf yoki kech aralashuv nuqtasini topishni soʻrang. Izohlarni yozib oling.",
      ru: "Покажите карту маршрута и лестницу вмешательства опытному инструктору с допуском. Попросите найти 2 пропущенных риска или поздние точки вмешательства. Запишите замечания.",
      en: "Show your route map and intervention ladder to an experienced, authorized instructor. Ask them to find 2 missed risks or late intervention points. Write down the notes.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Kamida 2 ta izoh yozilgan va xarita yoki zinapoyaga kiritilgan.",
      ru: "Записано не менее 2 замечаний, и они внесены в карту или лестницу.",
      en: "At least 2 notes are recorded and added to the map or ladder.",
    },
    why: {
      uz: "Xavfdagi oʻz «koʻr nuqtalaringizni» oʻzingiz sezmaysiz. Tashqi koʻz xavfsizlik darvozasi boʻyicha haqiqiy darajangizni tasdiqlaydi.",
      ru: "Свои слепые зоны в рисках сам не увидишь. Внешний взгляд подтверждает реальный уровень по ключевому навыку безопасности.",
      en: "You cannot see your own risk blind spots. An outside view confirms your real level on the key safety skill.",
    },
    resources: [],
  },
];
