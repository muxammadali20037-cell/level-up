import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: content_creation. Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "cc_content_pillars",
    skill: "content_creation",
    kind: "learn",
    phase: "foundation",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "3–4 ta kontent ustunini va 15 ta mavzuni belgilang",
      ru: "Определите 3–4 контентные рубрики и 15 тем",
      en: "Define 3–4 content pillars and 15 topics",
    },
    description: {
      uz: "Mijoz muammolari va biznes maqsadidan kelib chiqib 3–4 ta kontent ustunini (doimiy rukn) yozing. Har bir ustun uchun 5 ta mavzu va u qaysi maqsadga xizmat qilishini (qamrov, ishonch yoki murojaat) belgilang.",
      ru: "Исходя из проблем клиентов и цели бизнеса, сформулируйте 3–4 постоянные рубрики. Для каждой — 5 тем и цель, которой она служит (охват, доверие или обращения).",
      en: "Based on customer problems and the business goal, write 3–4 content pillars. For each, list 5 topics and the goal it serves (reach, trust or inquiries).",
    },
    successCriteria: {
      uz: "Har bir ustun mijoz muammosi va maqsad bilan bogʻlangan; jami kamida 15 ta mavzu bor.",
      ru: "Каждая рубрика связана с проблемой клиента и целью; всего не меньше 15 тем.",
      en: "Each pillar is linked to a customer problem and a goal; there are at least 15 topics in total.",
    },
    why: {
      uz: "Ustunlarsiz kontent tasodifiy boʻlib qoladi va auditoriyada aniq obraz shakllanmaydi.",
      ru: "Без рубрик контент становится случайным, и у аудитории не складывается понятный образ.",
      en: "Without pillars, content becomes random and the audience never forms a clear picture of you.",
    },
    resources: [],
  },
  {
    slug: "cc_repurpose_best_post",
    skill: "content_creation",
    kind: "practice",
    phase: "practice",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Eng yaxshi postingizni 3 ta formatga moslang",
      ru: "Адаптируйте лучший пост под 3 формата",
      en: "Repurpose your best post into 3 formats",
    },
    description: {
      uz: "Oxirgi oyda eng koʻp saqlangan yoki ulashilgan postni tanlang. Undan qisqa video ssenariysi, karusel va Telegram post yarating. Har bir formatning boshlanishini oʻsha platforma odatiga moslang.",
      ru: "Выберите пост за последний месяц с наибольшим числом сохранений или репостов. Сделайте из него сценарий короткого видео, карусель и Telegram-пост. Начало каждого формата адаптируйте под привычки площадки.",
      en: "Pick last month's post with the most saves or shares. Turn it into a short-video script, a carousel and a Telegram post. Adapt the opening of each to that platform's habits.",
    },
    successCriteria: {
      uz: "3 ta tayyor variant bor; har birining birinchi qatori yoki birinchi 3 soniyasi boshqacha yozilgan.",
      ru: "Готовы 3 варианта; первая строка или первые 3 секунды в каждом написаны по-своему.",
      en: "3 versions are ready; each has its own first line or first 3 seconds.",
    },
    why: {
      uz: "Isbotlangan gʻoyani qayta ishlash yangi gʻoyadan koʻra kamroq vaqt oladi va natija ehtimolini oshiradi.",
      ru: "Переработка проверенной идеи занимает меньше времени, чем новая, и повышает шанс на результат.",
      en: "Reworking a proven idea takes less time than starting from scratch and improves the odds of a result.",
    },
    resources: [],
  },
  {
    slug: "cc_two_week_calendar",
    skill: "content_creation",
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "2 haftalik kontent rejasini tuzib, birinchisini chiqaring",
      ru: "Составьте контент-план на 2 недели и выпустите первый пост",
      en: "Plan 2 weeks of content and publish the first piece",
    },
    description: {
      uz: "Jadval ustunlari: sana, kanal, ustun, format, maqsad (qamrov, ishonch, murojaat) va harakatga chaqiruv. 2 haftani toʻldiring. Birinchi kontentni bugun eʼlon qiling.",
      ru: "Столбцы: дата, канал, рубрика, формат, цель (охват, доверие, обращения) и призыв к действию. Заполните 2 недели. Первый материал опубликуйте сегодня.",
      en: "Columns: date, channel, pillar, format, goal (reach, trust, inquiries) and call to action. Fill in 2 weeks. Publish the first piece today.",
    },
    successCriteria: {
      uz: "2 haftalik reja toʻliq; har bir kontentning maqsadi va chaqiruvi bor; birinchisi eʼlon qilingan.",
      ru: "План на 2 недели заполнен; у каждого материала есть цель и призыв; первый опубликован.",
      en: "The 2-week plan is complete; every piece has a goal and a CTA; the first one is live.",
    },
    why: {
      uz: "Reja muntazamlikni taʼminlaydi va har bir post biznes maqsadiga xizmat qilishini tekshirishga imkon beradi.",
      ru: "План даёт регулярность и позволяет проверить, что каждый пост работает на цель бизнеса.",
      en: "A plan creates consistency and lets you check that each post serves a business goal.",
    },
    resources: [],
  },
  {
    slug: "cc_creator_brief",
    skill: "content_creation",
    kind: "apply",
    phase: "application",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Dizayner yoki videografga aniq brif yozing",
      ru: "Напишите чёткий бриф дизайнеру или видеографу",
      en: "Write a clear brief for a designer or videographer",
    },
    description: {
      uz: "Brifda: maqsad, auditoriya, asosiy xabar, format va oʻlcham, majburiy elementlar, nima qilinmasligi, muddat va muvaffaqiyat qanday oʻlchanishi. Ijrochiga yuboring va qoʻshimcha savollarini yozib boring.",
      ru: "В брифе: цель, аудитория, ключевой месседж, формат и размер, обязательные элементы, чего делать не нужно, срок и как измеряется успех. Отправьте исполнителю и записывайте его уточняющие вопросы.",
      en: "The brief covers: goal, audience, key message, format and size, must-haves, what to avoid, deadline and how success is measured. Send it to the creator and log their follow-up questions.",
    },
    successCriteria: {
      uz: "Brif barcha bandlarni oʻz ichiga oladi; ijrochi qayta tushuntirishsiz ish boshlagan yoki savollar 2 tadan oshmagan.",
      ru: "Бриф содержит все пункты; исполнитель начал работу без переобъяснений или задал не более 2 вопросов.",
      en: "The brief covers every item; the creator started without re-explaining or asked at most 2 questions.",
    },
    why: {
      uz: "Kontent hajmi oshganda ishni boshqalarga topshirish kerak boʻladi. Yaxshi brif qayta ishlash va vaqt yoʻqotishini kamaytiradi.",
      ru: "С ростом объёма контент приходится делегировать. Хороший бриф сокращает переделки и потери времени.",
      en: "As content volume grows you must delegate. A good brief cuts rework and lost time.",
    },
    resources: [],
  },
  {
    slug: "cc_performance_review",
    skill: "content_creation",
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Oxirgi 20 ta kontent natijasini tahlil qiling",
      ru: "Разберите результаты последних 20 публикаций",
      en: "Review the results of your last 20 pieces",
    },
    description: {
      uz: "Jadval: format, ustun, qamrov, saqlash va ulashish, havola bosish yoki murojaatlar. Eng yaxshi 3 va eng zaif 3 kontentdagi umumiy belgilarni toping. Keyingi oy uchun raqamlarga tayangan 2 ta qoida yozing.",
      ru: "Таблица: формат, рубрика, охват, сохранения и репосты, клики или обращения. Найдите общее у 3 лучших и 3 худших материалов. Запишите 2 правила на следующий месяц, опираясь на цифры.",
      en: "Sheet: format, pillar, reach, saves and shares, clicks or inquiries. Find what the top 3 and bottom 3 pieces have in common. Write 2 rules for next month backed by the numbers.",
    },
    successCriteria: {
      uz: "20 ta kontent jadvalda; 2 ta qoida yozilgan va har biri aniq raqamga asoslangan.",
      ru: "20 материалов в таблице; записаны 2 правила, каждое опирается на конкретные цифры.",
      en: "20 pieces in the sheet; 2 rules written, each backed by specific numbers.",
    },
    why: {
      uz: "Kontent yoqqani uchun emas, natija bergani uchun qiymatli. Tahlil kuchni ishlaydigan formatlarga yoʻnaltiradi.",
      ru: "Контент ценен не потому, что нравится, а потому, что даёт результат. Анализ направляет силы на работающие форматы.",
      en: "Content is valuable because it delivers results, not because it looks good. Review points effort at formats that work.",
    },
    resources: [],
  },
];
