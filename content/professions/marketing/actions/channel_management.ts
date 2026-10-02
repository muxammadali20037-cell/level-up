import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: channel_management. Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "ch_channel_rules",
    skill: "channel_management",
    kind: "learn",
    phase: "foundation",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Har bir kanalning ishlash qoidalarini yozing",
      ru: "Запишите правила работы каждого вашего канала",
      en: "Write down how each of your channels works",
    },
    description: {
      uz: "Foydalanayotgan 2–3 kanal (masalan, Instagram, Telegram, YouTube) uchun yozing: qaysi formatlar ishlaydi, odamlar kontentni qanday topadi, qanchalik tez-tez chiqarish real va bu kanalda muvaffaqiyat qaysi raqam bilan oʻlchanadi.",
      ru: "Для 2–3 используемых каналов (например, Instagram, Telegram, YouTube) запишите: какие форматы работают, как люди находят контент, с какой частотой реально публиковать и какой цифрой мерить успех в этом канале.",
      en: "For the 2–3 channels you use (e.g. Instagram, Telegram, YouTube), write: which formats work, how people discover content, what posting frequency is realistic and which number measures success there.",
    },
    successCriteria: {
      uz: "Har bir kanal uchun 4 ta band toʻldirilgan va kanallar oʻrtasida kamida bitta farq aniq koʻrsatilgan.",
      ru: "Для каждого канала заполнены 4 пункта, и явно указано хотя бы одно отличие между каналами.",
      en: "All 4 points are filled for each channel, with at least one clear difference between channels.",
    },
    why: {
      uz: "Bir xil kontentni hamma kanalga koʻchirish kam natija beradi. Har kanalning oʻz qoidasi bor.",
      ru: "Копирование одного контента во все каналы даёт мало результата. У каждого канала свои правила.",
      en: "Copying the same content into every channel underperforms. Each channel has its own rules.",
    },
    resources: [],
  },
  {
    slug: "ch_reply_standard",
    skill: "channel_management",
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Xabar va izohlarga javob berish standartini joriy qiling",
      ru: "Введите стандарт ответов на сообщения и комментарии",
      en: "Set a standard for replying to messages and comments",
    },
    description: {
      uz: "Yozing: maqsadli javob vaqti, eng koʻp beriladigan 5 ta savolga tayyor javob (narx, yetkazish, toʻlov Click/Payme orqali va h.k.) va qachon savolni sotuvchi yoki rahbarga oʻtkazish kerakligi. Bugundan qoʻllang.",
      ru: "Запишите: целевое время ответа, готовые ответы на 5 частых вопросов (цена, доставка, оплата через Click/Payme и т. п.) и когда передавать вопрос продавцу или руководителю. Применяйте с сегодняшнего дня.",
      en: "Write down: a target reply time, ready answers to the 5 most common questions (price, delivery, payment via Click/Payme, etc.) and when to hand a question to sales or a manager. Use it from today.",
    },
    successCriteria: {
      uz: "Standart yozilgan, 5 ta shablon tayyor va bugungi barcha xabarlarga shu asosda javob berilgan.",
      ru: "Стандарт записан, 5 шаблонов готовы, на все сегодняшние сообщения ответили по нему.",
      en: "The standard is written, 5 templates are ready and all of today's messages were answered with it.",
    },
    why: {
      uz: "Kanal faqat post emas, balki mijoz bilan muloqot ham. Kechikkan javob tayyor murojaatni yoʻqotadi.",
      ru: "Канал — это не только посты, но и общение с клиентом. Запоздалый ответ теряет уже готовое обращение.",
      en: "A channel is conversation, not just posts. A late reply loses an inquiry you already earned.",
    },
    resources: [],
  },
  {
    slug: "ch_dm_metrics",
    skill: "channel_management",
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Bu haftadagi javob vaqti va murojaat konversiyasini oʻlchang",
      ru: "Измерьте время ответа и конверсию обращений за неделю",
      en: "Measure this week's reply time and inquiry conversion",
    },
    description: {
      uz: "Bu haftadagi barcha murojaatlarni jadvalga kiriting: kanal, kelgan vaqt, javob vaqti, natija (buyurtma yoki yoʻq). Oʻrtacha javob vaqtini va buyurtmaga aylangan murojaatlar ulushini kanal boʻyicha hisoblang.",
      ru: "Внесите в таблицу все обращения за неделю: канал, время поступления, время ответа, итог (заказ или нет). Посчитайте среднее время ответа и долю обращений, ставших заказом, по каналам.",
      en: "Log all of this week's inquiries: channel, time received, time answered, outcome (order or not). Calculate average reply time and the share of inquiries that became orders, per channel.",
    },
    successCriteria: {
      uz: "Jadvalda haftaning barcha murojaatlari bor; har kanal uchun oʻrtacha javob vaqti va konversiya hisoblangan va standart bilan solishtirilgan.",
      ru: "В таблице все обращения недели; по каждому каналу посчитаны среднее время ответа и конверсия и сравнены со стандартом.",
      en: "All inquiries for the week are logged; average reply time and conversion are calculated per channel and compared with the standard.",
    },
    why: {
      uz: "Kanal ishini his bilan emas, raqam bilan baholash zaif joyni aniq koʻrsatadi.",
      ru: "Оценка работы канала цифрами, а не ощущениями, точно показывает слабое место.",
      en: "Judging a channel by numbers rather than feel shows exactly where it is weak.",
    },
    resources: [],
  },
  {
    slug: "ch_channel_audit",
    skill: "channel_management",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Kanallar auditini oʻtkazing: saqlash, tuzatish yoki toʻxtatish",
      ru: "Проведите аудит каналов: оставить, исправить или закрыть",
      en: "Audit your channels: keep, fix or stop",
    },
    description: {
      uz: "Har bir kanal boʻyicha oxirgi 30 kunni yozing: qamrov, murojaatlar, unga bogʻlangan sotuvlar va sarflangan ish soatlari. Bir soat mehnatga toʻgʻri keladigan natijani solishtiring. Har kanalga «saqlash», «tuzatish» yoki «toʻxtatish» qarorini yozing.",
      ru: "По каждому каналу за 30 дней: охват, обращения, связанные продажи и затраченные часы. Сравните результат на час работы. Для каждого канала запишите решение: «оставить», «исправить» или «закрыть».",
      en: "For each channel, record the last 30 days: reach, inquiries, attributed sales and hours spent. Compare results per hour of work. Write a keep, fix or stop decision for each channel.",
    },
    successCriteria: {
      uz: "Barcha kanallar jadvalda; har biriga raqam bilan asoslangan qaror yozilgan.",
      ru: "Все каналы в таблице; для каждого записано решение, подкреплённое цифрами.",
      en: "Every channel is in the sheet with a decision backed by numbers.",
    },
    why: {
      uz: "Vaqt ham byudjet. Natija bermayotgan kanalga sarflangan soatlar ishlayotgan kanaldan olinadi.",
      ru: "Время — тоже бюджет. Часы, потраченные на неработающий канал, отнимаются у работающего.",
      en: "Time is budget too. Hours spent on a channel that does not work are taken from one that does.",
    },
    resources: [],
  },
  {
    slug: "ch_owned_audience",
    skill: "channel_management",
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Oʻz auditoriya bazangizni yigʻishni boshlang",
      ru: "Начните собирать собственную базу аудитории",
      en: "Start building an audience list you own",
    },
    description: {
      uz: "Takroriy aloqa kanalini tanlang (Telegram kanal, bot yoki email). Roziligi bilan obuna boʻlish uchun foydali sabab taklif qiling, uni profil va sotuvdan keyingi xabarga qoʻshing. Obunachilarga bitta foydali xabar yuboring.",
      ru: "Выберите канал повторного контакта (Telegram-канал, бот или email). Дайте полезную причину подписаться с согласия, добавьте её в профиль и в сообщение после покупки. Отправьте подписчикам одно полезное сообщение.",
      en: "Pick a repeat-contact channel (Telegram channel, bot or email). Offer a useful reason to opt in, add it to your profile and post-purchase message. Send subscribers one useful message.",
    },
    successCriteria: {
      uz: "Obuna boʻlish yoʻli profil va sotuvdan keyingi xabarda bor; birinchi xabar yuborilgan va ochilish yoki javoblar soni yozilgan.",
      ru: "Путь подписки есть в профиле и в сообщении после покупки; первое сообщение отправлено, открытия или ответы записаны.",
      en: "The opt-in is in the profile and the post-purchase message; the first message is sent and opens or replies are recorded.",
    },
    why: {
      uz: "Ijtimoiy tarmoq algoritmi oʻzgarishi mumkin, oʻz bazangiz esa qayta xaridlarni arzonroq olib keladi.",
      ru: "Алгоритмы соцсетей меняются, а собственная база приносит повторные покупки дешевле.",
      en: "Social algorithms change; a list you own brings repeat purchases at lower cost.",
    },
    resources: [],
  },
];
