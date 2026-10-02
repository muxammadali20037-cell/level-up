import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill "decision_making". Basics L1–4: foundation, practice, application; advanced L4–8: application, verification. */
export const actions: ActionInput[] = [
  {
    slug: "dm_start_decision_log",
    skill: "decision_making",
    title: {
      uz: "Qarorlar daftarini boshlang",
      ru: "Заведите журнал решений",
      en: "Start a decision log",
    },
    description: {
      uz: "Bugun qabul qilgan yoki kechiktirayotgan bitta muhim qarorni yozing: variantlar, tanlov, sabab, kutilayotgan natija va tekshirish sanasi. Bir oydan keyin kutilgan va haqiqiy natijani solishtirasiz.",
      ru: "Запишите одно важное решение, которое вы приняли сегодня или откладываете: варианты, выбор, причина, ожидаемый результат и дата проверки. Через месяц сравните ожидание с фактом.",
      en: "Write down one important decision you made today or are putting off: options, choice, reason, expected result and a review date. In a month, compare expectation with reality.",
    },
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Yozuvda kamida 2 variant, sabab, kutilgan natija va tekshirish sanasi bor.",
      ru: "В записи есть минимум 2 варианта, причина, ожидаемый результат и дата проверки.",
      en: "The entry has at least 2 options, a reason, an expected result and a review date.",
    },
    why: {
      uz: "Xotira qarorlarni keyinroq «qayta yozadi». Daftar tasodifdan emas, haqiqiy natijalardan oʻrganishga yordam beradi.",
      ru: "Память со временем «переписывает» решения. Журнал помогает учиться на фактах, а не на везении.",
      en: "Memory rewrites decisions over time. A log lets you learn from actual outcomes rather than luck.",
    },
    resources: [],
  },
  {
    slug: "dm_sort_reversible",
    skill: "decision_making",
    title: {
      uz: "Qarorlarni qaytariladigan va qaytarilmaydiganga ajrating",
      ru: "Разделите решения на обратимые и необратимые",
      en: "Sort pending decisions into reversible and not",
    },
    description: {
      uz: "Kutib turgan barcha qarorlarni yozing. Har birini belgilang: xato boʻlsa osongina qaytarsa boʻladimi yoki yoʻqmi. Qaytariladiganlardan 2 tasini bugun qabul qiling, qolganlari uchun maʼlumot yigʻish muddatini qoʻying.",
      ru: "Выпишите все отложенные решения. Отметьте каждое: легко ли его отменить, если оно окажется ошибочным. 2 обратимых решения примите сегодня, для остальных назначьте срок сбора информации.",
      en: "List every decision you're sitting on. Mark each: could it be easily undone if wrong? Make 2 of the reversible ones today; for the rest, set a deadline for gathering information.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Roʻyxat ajratilgan; 2 ta qaror bugun qabul qilinib, tegishli odamlarga aytilgan.",
      ru: "Список разделён; 2 решения приняты сегодня и сообщены нужным людям.",
      en: "The list is sorted; 2 decisions were made today and communicated.",
    },
    why: {
      uz: "Qaytariladigan qarorlarni uzoq oʻylash jamoani toʻxtatib qoʻyadi. Tezlik va ehtiyotkorlikni ajrata bilish — qaror sifatining asosi.",
      ru: "Долгие раздумья над обратимыми решениями тормозят команду. Умение различать, где нужна скорость, а где осторожность, — основа качества решений.",
      en: "Overthinking reversible decisions stalls the team. Knowing where speed fits and where care fits is the basis of good decisions.",
    },
    resources: [],
  },
  {
    slug: "dm_criteria_matrix",
    skill: "decision_making",
    title: {
      uz: "Bitta ish qarorini mezonlar jadvali bilan qabul qiling",
      ru: "Примите одно рабочее решение по таблице критериев",
      en: "Make one work decision with a criteria table",
    },
    description: {
      uz: "Real tanlovni oling (masalan, ikki yetkazib beruvchi yoki ikki vazifa tartibi). 3–4 mezon yozing, har biriga ogʻirlik bering, variantlarni 1–5 baholang. Natijani hisoblang va qaror sababini masʼullarga yozma yetkazing.",
      ru: "Возьмите реальный выбор (например, два поставщика или порядок двух задач). Запишите 3–4 критерия, задайте им веса, оцените варианты по шкале 1–5. Посчитайте итог и письменно сообщите решение и причину.",
      en: "Take a real choice (e.g., two suppliers or the order of two projects). Write 3–4 criteria, weight them, score each option 1–5. Calculate the result and send the decision and reason in writing.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Jadval toʻldirilgan; qaror va uning sababi yozma ravishda eʼlon qilingan.",
      ru: "Таблица заполнена; решение и его причина объявлены письменно.",
      en: "The table is filled in; the decision and its reason were shared in writing.",
    },
    why: {
      uz: "Aniq mezonlar qarorni tushuntiriladigan qiladi. Rejalar ham variantlar orasidan tanlashni talab qiladi.",
      ru: "Явные критерии делают решение объяснимым. Планирование тоже требует выбора между вариантами.",
      en: "Explicit criteria make a decision explainable. Plans also require choosing between options.",
    },
    resources: [],
  },
  {
    slug: "dm_run_premortem",
    skill: "decision_making",
    title: {
      uz: "Muhim qaror oldidan «pre-mortem» oʻtkazing",
      ru: "Проведите «пре-мортем» перед важным решением",
      en: "Run a pre-mortem before a major decision",
    },
    description: {
      uz: "Jamoa bilan 30 daqiqa ajrating: «Tasavvur qiling, olti oydan keyin bu qaror muvaffaqiyatsiz boʻldi. Nima sababdan?» Har kim 2–3 sabab yozsin. Eng ehtimolli 3 tasi uchun oldini olish chorasi va masʼul belgilang.",
      ru: "Выделите 30 минут с командой: «Представьте, что через полгода это решение провалилось. Почему?» Пусть каждый запишет 2–3 причины. Для 3 самых вероятных назначьте меры и ответственных.",
      en: "Take 30 minutes with the team: \"Imagine it's six months from now and this decision failed. Why?\" Everyone writes 2–3 reasons. For the 3 most likely, assign preventive actions and owners.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Sabablar roʻyxati bor; eng muhim 3 xavf uchun chora va masʼul belgilangan.",
      ru: "Есть список причин; для 3 главных рисков назначены меры и ответственные.",
      en: "A list of causes exists; the top 3 risks have actions and owners.",
    },
    why: {
      uz: "Odamlar xavflarni ochiq aytishga koʻpincha ikkilanadi. Bu usul ularni xavfsiz tarzda yuzaga chiqaradi va noaniq sharoitda qarorni mustahkamlaydi.",
      ru: "Люди часто не решаются открыто называть риски. Этот приём безопасно выводит их наружу и укрепляет решение в условиях неопределённости.",
      en: "People often hesitate to voice risks. This format surfaces them safely and strengthens decisions under uncertainty.",
    },
    resources: [],
  },
  {
    slug: "dm_review_past_decisions",
    skill: "decision_making",
    title: {
      uz: "Oxirgi 5 ta qaroringizni natijasi bilan tahlil qiling",
      ru: "Разберите 5 последних решений и их итоги",
      en: "Review your last 5 decisions against outcomes",
    },
    description: {
      uz: "Oxirgi 1–3 oydagi 5 ta muhim qarorni oling. Har biri uchun yozing: oʻsha paytdagi maʼlumot, natija, qaror sifati (natijadan alohida) va oʻz vaqtida qabul qilinganmi. Takrorlanadigan bitta xatoni aniqlang.",
      ru: "Возьмите 5 важных решений за последние 1–3 месяца. Для каждого запишите: какая была информация, итог, качество решения (отдельно от итога) и было ли оно своевременным. Найдите одну повторяющуюся ошибку.",
      en: "Take 5 important decisions from the last 1–3 months. For each, note the information you had, the outcome, decision quality (separate from outcome) and whether it was timely. Find one recurring mistake.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "5 ta qaror tahlil qilingan; qaror sifati va natija alohida baholangan; bitta naqsh yozilgan.",
      ru: "Разобраны 5 решений; качество решения и итог оценены отдельно; записан один паттерн.",
      en: "5 decisions reviewed; quality and outcome rated separately; one pattern written down.",
    },
    why: {
      uz: "Yaxshi qaror ham omadsiz natija berishi mumkin va aksincha. Ularni ajratish haqiqiy koʻnikmangizni koʻrsatadi.",
      ru: "Хорошее решение может дать неудачный итог, и наоборот. Разделение этих вещей показывает ваш реальный навык.",
      en: "A good decision can have a bad outcome and vice versa. Separating them shows your real skill.",
    },
    resources: [],
  },
];
