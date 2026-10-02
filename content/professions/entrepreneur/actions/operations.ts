import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill `operations` (gate skill for L4+). Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "operations_map_owner_only_tasks",
    skill: "operations",
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Faqat siz bajaradigan vazifalarni roʻyxatlang",
      ru: "Составьте список задач, которые делаете только вы",
      en: "List the tasks only you can do",
    },
    description: {
      uz: "Shu hafta bajargan barcha ishlaringizni yozing. «Buni faqat men qila olaman» deganlarini belgilang. Ular orasidan eng koʻp takrorlanadigan 3 tasini tanlang — ular birinchi yoziladigan jarayonlar boʻladi.",
      ru: "Запишите все дела за эту неделю. Отметьте те, что «умею только я». Выберите из них 3 самых повторяющихся — это первые процессы, которые нужно описать.",
      en: "Write down everything you did this week. Mark the tasks only you know how to do. Pick the 3 that repeat most — those are the first processes to document.",
    },
    successCriteria: {
      uz: "Haftalik ishlar roʻyxati bor, faqat sizga bogʻliq vazifalar belgilangan, 3 ta jarayon tanlangan.",
      ru: "Есть список дел за неделю, отмечены задачи, завязанные на вас, выбраны 3 процесса.",
      en: "A weekly task list exists, owner-only tasks are marked and 3 processes chosen.",
    },
    why: {
      uz: "Biznes sizning shaxsiy kuchingizga tayansa, siz yoʻq kuni toʻxtaydi. Avval qayerda bogʻliqlik borligini koʻrish kerak.",
      ru: "Если бизнес держится на ваших личных усилиях, он останавливается в день вашего отсутствия. Сначала нужно увидеть, где эта зависимость.",
      en: "A business that runs on your personal effort stops on the day you are away. First see where that dependency sits.",
    },
    resources: [],
  },
  {
    slug: "operations_daily_checklist",
    skill: "operations",
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Bitta kundalik ish uchun chek-list tuzing",
      ru: "Составьте чек-лист для одной ежедневной задачи",
      en: "Make a checklist for one daily task",
    },
    description: {
      uz: "Har kuni takrorlanadigan bitta ishni tanlang (ochilish, buyurtmani qabul qilish, kun yakuni). 5–10 ta qadamni ketma-ket yozing, har birida «bajarildi» belgisi boʻlsin. Ertaga shu chek-list boʻyicha ishlang va yetishmagan qadamni qoʻshing.",
      ru: "Выберите одну ежедневную задачу (открытие, приём заказа, закрытие дня). Запишите 5–10 шагов по порядку с отметкой «сделано». Завтра работайте по чек-листу и добавьте недостающий шаг.",
      en: "Pick one daily task (opening, taking an order, closing the day). Write 5–10 steps in order, each with a \"done\" box. Tomorrow, work from the checklist and add any missing step.",
    },
    successCriteria: {
      uz: "Chek-list yozilgan, kamida bir marta ishlatilgan va tuzatilgan.",
      ru: "Чек-лист написан, использован хотя бы раз и доработан.",
      en: "Checklist written, used at least once and corrected.",
    },
    why: {
      uz: "Chek-list — eng oddiy tizim: natija kayfiyat yoki xotiraga emas, qadamlar tartibiga bogʻliq boʻladi.",
      ru: "Чек-лист — простейшая система: результат зависит не от настроения или памяти, а от порядка шагов.",
      en: "A checklist is the simplest system: the result depends on the steps, not on mood or memory.",
    },
    resources: [],
  },
  {
    slug: "operations_write_three_sops",
    skill: "operations",
    kind: "apply",
    phase: "application",
    durationMinutes: 60,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "3 ta asosiy jarayonni yozing (SOP)",
      ru: "Опишите 3 ключевых процесса (SOP)",
      en: "Write SOPs for your 3 key processes",
    },
    description: {
      uz: "Tanlangan 3 jarayonning har biri uchun bir sahifa yozing: maqsad, kim bajaradi, qadamlar, kerakli vositalar, «toʻgʻri bajarildi» mezoni va xatoda nima qilinadi. Masalan: buyurtma qabul qilish, yetkazish, toʻlovni tekshirish.",
      ru: "Для каждого из 3 процессов — одна страница: цель, кто выполняет, шаги, нужные инструменты, критерий «сделано правильно» и что делать при ошибке. Например: приём заказа, доставка, проверка оплаты.",
      en: "For each of the 3 processes write one page: goal, owner, steps, tools needed, the \"done right\" criterion and what to do on an error. For example: taking orders, delivery, checking payment.",
    },
    successCriteria: {
      uz: "3 ta SOP yozilgan, har birida egasi, qadamlar va sifat mezoni bor.",
      ru: "Написаны 3 SOP, в каждом есть ответственный, шаги и критерий качества.",
      en: "3 SOPs written, each with an owner, steps and a quality criterion.",
    },
    why: {
      uz: "Sotuv talab yaratadi, lekin jarayonlar takrorlanmasa, har yangi mijoz yangi xatolar keltiradi. SOP natijani takrorlanadigan qiladi.",
      ru: "Продажи создают спрос, но без повторяемых процессов каждый новый клиент приносит новые ошибки. SOP делает результат повторяемым.",
      en: "Sales create demand, but without repeatable processes every new customer brings new mistakes. SOPs make the result repeatable.",
    },
    resources: [],
  },
  {
    slug: "operations_handover_by_sop",
    skill: "operations",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Bitta jarayonni faqat SOP orqali topshiring",
      ru: "Передайте один процесс только по SOP",
      en: "Hand over one process using only the SOP",
    },
    description: {
      uz: "Xodimga bitta SOPni bering va jarayonni sizning yordamingizsiz bajarishini soʻrang. Yonida turmang; u bergan har bir savolni yozib boring. Oxirida shu savollarga javoblarni SOPga qoʻshing.",
      ru: "Дайте сотруднику один SOP и попросите выполнить процесс без вашей помощи. Не стойте рядом; записывайте каждый его вопрос. В конце добавьте ответы на эти вопросы в SOP.",
      en: "Give an employee one SOP and ask them to run the process without your help. Do not hover; write down every question they ask. Afterwards, add the answers to the SOP.",
    },
    successCriteria: {
      uz: "Jarayon boshqa odam tomonidan bajarilgan, savollar roʻyxati bor, SOP yangilangan.",
      ru: "Процесс выполнен другим человеком, есть список вопросов, SOP обновлён.",
      en: "Process completed by someone else, list of questions captured, SOP updated.",
    },
    why: {
      uz: "Qogʻozdagi jarayon boshqa odam uni bajara olgandagina tizimga aylanadi. Savollar SOPdagi boʻshliqlarni koʻrsatadi.",
      ru: "Процесс на бумаге становится системой, только когда его может выполнить другой человек. Вопросы показывают пробелы в SOP.",
      en: "A process on paper becomes a system only when someone else can run it. Their questions reveal the gaps.",
    },
    resources: [],
  },
  {
    slug: "operations_track_error_rate",
    skill: "operations",
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Bitta jarayondagi xatolarni bir hafta oʻlchang",
      ru: "Измеряйте ошибки в одном процессе неделю",
      en: "Measure errors in one process for a week",
    },
    description: {
      uz: "Bitta jarayon uchun sifat mezonini belgilang (masalan: buyurtma vaqtida va toʻgʻri yetkazildi). 7 kun davomida jami holatlar va xatolarni kunlik jadvalga yozing. Xato foizini hisoblang va eng koʻp uchragan sababni tuzating.",
      ru: "Задайте критерий качества для одного процесса (например, заказ доставлен вовремя и без ошибок). 7 дней записывайте в таблицу число случаев и ошибок. Посчитайте процент ошибок и устраните самую частую причину.",
      en: "Set a quality criterion for one process (e.g. order delivered on time and correct). For 7 days log total cases and errors daily. Calculate the error rate and fix the most frequent cause.",
    },
    successCriteria: {
      uz: "7 kunlik jurnal toʻldirilgan, xato foizi hisoblangan, bitta sabab boʻyicha tuzatish kiritilgan.",
      ru: "Журнал за 7 дней заполнен, процент ошибок посчитан, по одной причине внесено исправление.",
      en: "7-day log complete, error rate calculated, one cause fixed.",
    },
    why: {
      uz: "Oʻlchanmagan jarayonni boshqarib boʻlmaydi. Xato foizi tizim haqiqatan ishlayotganini isbotlaydi.",
      ru: "Неизмеряемым процессом нельзя управлять. Процент ошибок доказывает, что система действительно работает.",
      en: "You cannot manage a process you do not measure. The error rate proves the system actually works.",
    },
    resources: [],
  },
];
