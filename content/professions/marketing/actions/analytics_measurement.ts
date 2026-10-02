import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: analytics_measurement (gate K1). Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "am_metric_glossary",
    skill: "analytics_measurement",
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "6 ta asosiy koʻrsatkich lugʻatini tuzing",
      ru: "Составьте словарь 6 ключевых метрик",
      en: "Write a glossary of 6 core metrics",
    },
    description: {
      uz: "CTR, CPC, CPL, konversiya, CAC va ROAS uchun: 1) formulasini yozing, 2) oʻz (yoki shartli) raqamlaringiz bilan bitta misol hisoblang, 3) bu koʻrsatkich qaysi qarorga yordam berishini bir gapda yozing.",
      ru: "Для CTR, CPC, CPL, конверсии, CAC и ROAS: 1) запишите формулу, 2) посчитайте пример на своих (или условных) цифрах, 3) одной фразой напишите, какое решение помогает принять метрика.",
      en: "For CTR, CPC, CPL, conversion rate, CAC and ROAS: 1) write the formula, 2) calculate one example with your own (or fictional) numbers, 3) write in one sentence which decision the metric informs.",
    },
    successCriteria: {
      uz: "6 ta koʻrsatkichning har birida formula, hisoblangan misol va qaror bor; bitta misolni qayta hisoblaganda natija mos keladi.",
      ru: "У каждой из 6 метрик есть формула, расчёт и решение; при пересчёте одного примера результат совпадает.",
      en: "Each of the 6 metrics has a formula, a worked example and a decision; recalculating one example gives the same result.",
    },
    why: {
      uz: "Analitika — darajani belgilovchi asosiy koʻnikma. Koʻrsatkichlar taʼrifi aniq boʻlmasa, hisobotlar notoʻgʻri oʻqiladi va byudjet notoʻgʻri joyga ketadi.",
      ru: "Аналитика — ключевой навык для уровня. Без чётких определений метрик отчёты читаются неверно, и бюджет уходит не туда.",
      en: "Analytics is the key gate skill. Without clear metric definitions, reports get misread and budget goes to the wrong place.",
    },
    resources: [],
  },
  {
    slug: "am_calc_from_report",
    skill: "analytics_measurement",
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Oʻtgan oy CPL, CAC va ROAS ni qoʻlda hisoblang",
      ru: "Посчитайте вручную CPL, CAC и ROAS за прошлый месяц",
      en: "Calculate last month's CPL, CAC and ROAS by hand",
    },
    description: {
      uz: "Bitta kanal uchun oʻtgan oydagi xarajat, lid, sotuv va tushumni jadvalga yozing. CPL, CAC va ROAS ni oʻzingiz hisoblang va reklama kabinetidagi raqamlar bilan solishtiring. Farq boʻlsa, sababini yozing.",
      ru: "Для одного канала внесите в таблицу расходы, лиды, продажи и выручку за прошлый месяц. Сами посчитайте CPL, CAC и ROAS и сравните с цифрами рекламного кабинета. Если есть расхождение, запишите причину.",
      en: "For one channel, put last month's spend, leads, sales and revenue into a sheet. Calculate CPL, CAC and ROAS yourself and compare them with the ad account's numbers. If they differ, write down why.",
    },
    successCriteria: {
      uz: "Jadvalda 3 ta koʻrsatkich hisoblangan; reklama kabineti bilan har bir farqning izohi bor.",
      ru: "В таблице посчитаны 3 метрики; у каждого расхождения с кабинетом есть объяснение.",
      en: "The sheet has all 3 metrics calculated; every gap with the ad account has an explanation.",
    },
    why: {
      uz: "Platforma koʻrsatgan raqamni qoʻlda tekshira olsangiz, unga koʻr-koʻrona ishonmaysiz va xatoni erta sezasiz.",
      ru: "Когда вы умеете проверить цифру платформы вручную, вы не доверяете ей вслепую и раньше замечаете ошибки.",
      en: "When you can check a platform's number by hand, you stop trusting it blindly and catch errors early.",
    },
    resources: [],
  },
  {
    slug: "am_utm_tracking",
    skill: "analytics_measurement",
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Joriy kampaniyadagi barcha havolalarga UTM qoʻying",
      ru: "Разметьте UTM все ссылки текущей кампании",
      en: "Add UTM tags to every link in your current campaign",
    },
    description: {
      uz: "1) source, medium, campaign uchun yagona nomlash qoidasini yozing. 2) Kampaniyadagi har bir havolani shu qoida bilan belgilang. 3) Havolalarni jadvalga kiriting. 4) Bitta test bosish qiling va analitikada manba toʻgʻri chiqqanini tekshiring.",
      ru: "1) Запишите единое правило именования source, medium, campaign. 2) Разметьте по нему каждую ссылку кампании. 3) Сведите ссылки в таблицу. 4) Сделайте тестовый переход и проверьте, что источник верно виден в аналитике.",
      en: "1) Write one naming rule for source, medium and campaign. 2) Tag every campaign link with it. 3) List the links in a sheet. 4) Make one test click and check that analytics shows the correct source.",
    },
    successCriteria: {
      uz: "Kampaniyadagi barcha havolalar belgilangan; test bosish analitikada toʻgʻri manba bilan koʻrinadi.",
      ru: "Все ссылки кампании размечены; тестовый переход виден в аналитике с правильным источником.",
      en: "All campaign links are tagged; the test click shows up in analytics with the correct source.",
    },
    why: {
      uz: "Trafik manbasi belgilanmasa, qaysi kanal mijoz olib kelayotganini bilib boʻlmaydi — keyingi barcha tahlil shunga tayanadi.",
      ru: "Без разметки не понять, какой канал приводит клиентов, а на этом строится весь дальнейший анализ.",
      en: "Without tagging you cannot tell which channel brings customers, and every later analysis depends on that.",
    },
    resources: [],
  },
  {
    slug: "am_weekly_dashboard",
    skill: "analytics_measurement",
    kind: "apply",
    phase: "application",
    durationMinutes: 60,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Bir sahifalik haftalik marketing dashboardini tuzing",
      ru: "Соберите одностраничный еженедельный дашборд",
      en: "Build a one-page weekly marketing dashboard",
    },
    description: {
      uz: "Har bir kanal boʻyicha: xarajat, lid, sotuv, CPL, CAC, ROAS va oʻtgan haftaga nisbatan oʻzgarish. Oxirgi 4 haftani toʻldiring, rahbar yoki mijozga yuboring va dashboard asosida bitta qaror qabul qiling.",
      ru: "По каждому каналу: расходы, лиды, продажи, CPL, CAC, ROAS и изменение к прошлой неделе. Заполните последние 4 недели, отправьте руководителю или клиенту и примите по дашборду одно решение.",
      en: "Per channel: spend, leads, sales, CPL, CAC, ROAS and change vs last week. Fill in the last 4 weeks, send it to your manager or client and make one decision based on it.",
    },
    successCriteria: {
      uz: "4 haftalik dashboard toʻldirilgan va yuborilgan; undan kelib chiqqan bitta qaror yozib qoʻyilgan.",
      ru: "Дашборд за 4 недели заполнен и отправлен; записано одно решение, принятое по нему.",
      en: "A 4-week dashboard is filled in and shared; one decision based on it is written down.",
    },
    why: {
      uz: "Muntazam koʻriladigan bitta sahifa raqamlarni qarorga aylantiradi va kanallar oʻrtasidagi farqni vaqtida koʻrsatadi.",
      ru: "Одна регулярно просматриваемая страница превращает цифры в решения и вовремя показывает разницу между каналами.",
      en: "One regularly reviewed page turns numbers into decisions and shows differences between channels in time.",
    },
    resources: [],
  },
  {
    slug: "am_crm_reconcile",
    skill: "analytics_measurement",
    kind: "verify",
    phase: "verification",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Reklama konversiyalarini real sotuvlar bilan solishtiring",
      ru: "Сверьте рекламные конверсии с реальными продажами",
      en: "Reconcile ad conversions with real sales",
    },
    description: {
      uz: "Oʻtgan oy uchun reklama kabinetidagi konversiyalarni CRM yoki sotuv jurnalidagi haqiqiy buyurtmalar bilan kanal boʻyicha solishtiring. Farqni foizda hisoblang, 3 ta sababini yozing va bittasini tuzating. Jadvalni hamkasbga tekshirtiring.",
      ru: "Сравните конверсии из рекламного кабинета за прошлый месяц с реальными заказами в CRM или журнале продаж по каждому каналу. Посчитайте расхождение в %, запишите 3 причины и устраните одну. Дайте таблицу на проверку коллеге.",
      en: "Compare last month's ad-account conversions with real orders in your CRM or sales log, per channel. Calculate the gap in %, write 3 causes and fix one. Ask a colleague to review the sheet.",
    },
    successCriteria: {
      uz: "Har bir kanal uchun farq foizi bor, bitta sabab bartaraf etilgan va hamkasb jadvalni koʻrib chiqqan.",
      ru: "Для каждого канала есть % расхождения, одна причина устранена, коллега проверил таблицу.",
      en: "Every channel has a gap %, one cause is fixed and a colleague has reviewed the sheet.",
    },
    why: {
      uz: "Platformalar konversiyani turlicha hisoblaydi. Qarorlar reklama kabinetiga emas, haqiqiy sotuvga tayansa, byudjet oʻzini oqlaydigan joyga ketadi.",
      ru: "Платформы считают конверсии по-разному. Когда решения опираются на реальные продажи, а не на кабинет, бюджет идёт туда, где окупается.",
      en: "Platforms count conversions differently. When decisions rest on real sales rather than the ad account, budget goes where it actually pays back.",
    },
    resources: [],
  },
];
