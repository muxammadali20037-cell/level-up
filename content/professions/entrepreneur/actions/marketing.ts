import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill `marketing`. Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "marketing_trace_customer_sources",
    skill: "marketing",
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Oxirgi 10 mijoz qayerdan kelganini aniqlang",
      ru: "Выясните, откуда пришли 10 последних клиентов",
      en: "Find where your last 10 customers came from",
    },
    description: {
      uz: "Oxirgi 10 ta xaridorni yozing. Yozishmalar yoki savdo yozuvlaridan, kerak boʻlsa oʻzidan soʻrab, har biri qaysi kanaldan kelganini aniqlang: tavsiya, Telegram, Instagram, xarita, oʻtib ketayotgan mijoz. Kanallar boʻyicha sanang.",
      ru: "Выпишите 10 последних покупателей. По переписке, записям продаж или прямому вопросу определите канал каждого: рекомендация, Telegram, Instagram, карты, проходящий клиент. Посчитайте по каналам.",
      en: "List your last 10 buyers. From chats, sales records or by asking them, find each one's channel: referral, Telegram, Instagram, maps, walk-in. Count them by channel.",
    },
    successCriteria: {
      uz: "10 ta mijozning har biri uchun kanal yozilgan va eng koʻp mijoz keltirgan kanal aniqlangan.",
      ru: "Для каждого из 10 клиентов записан канал; определён канал, который дал больше всего клиентов.",
      en: "A channel recorded for all 10 customers and the top channel identified.",
    },
    why: {
      uz: "Marketing taxmin emas, raqamdan boshlanadi: avval qaysi kanal allaqachon ishlayotganini bilish kerak.",
      ru: "Маркетинг начинается с фактов, а не догадок: сначала нужно знать, какой канал уже работает.",
      en: "Marketing starts from facts, not guesses: first learn which channel already works.",
    },
    resources: [],
  },
  {
    slug: "marketing_write_three_offer_versions",
    skill: "marketing",
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Bitta taklifni 3 xil sarlavha bilan yozing",
      ru: "Напишите одно предложение в 3 вариантах",
      en: "Write one offer with 3 different headlines",
    },
    description: {
      uz: "Asosiy mahsulotingiz uchun 3 ta sarlavha yozing: foyda («...ni 1 kunda olasiz»), muammo («... dan charchadingizmi?») va dalil (mijoz fikri). Har biriga aniq chaqiriq qoʻshing. 3 ta mijozdan qaysi biri tushunarli ekanini soʻrang.",
      ru: "Напишите 3 заголовка для главного продукта: выгода («получите ... за 1 день»), проблема («устали от ...?») и доказательство (отзыв клиента). К каждому — чёткий призыв. Спросите 3 клиентов, какой понятнее.",
      en: "Write 3 headlines for your main product: benefit (\"get ... in 1 day\"), problem (\"tired of ...?\") and proof (a customer quote). Add a clear call to action to each. Ask 3 customers which is clearest.",
    },
    successCriteria: {
      uz: "3 ta variant yozilgan, 3 ta mijoz fikri olingan, bitta variant tanlangan.",
      ru: "Написаны 3 варианта, получены отзывы 3 клиентов, выбран один вариант.",
      en: "3 versions written, feedback from 3 customers collected, one version chosen.",
    },
    why: {
      uz: "Bir xil mahsulot turli soʻzlar bilan turlicha sotiladi. Mijoz tilida yozilgan taklif reklamaning har bir soʻmini samaraliroq qiladi.",
      ru: "Один и тот же продукт продаётся по-разному в зависимости от слов. Предложение на языке клиента делает каждый сум рекламы эффективнее.",
      en: "The same product sells differently depending on the words. An offer in the customer's language makes every som of promotion work harder.",
    },
    resources: [],
  },
  {
    slug: "marketing_run_one_channel_week",
    skill: "marketing",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Bitta kanalni 7 kun reja asosida yuriting",
      ru: "Ведите один канал 7 дней по плану",
      en: "Run one channel on a plan for 7 days",
    },
    description: {
      uz: "Eng koʻp mijoz keltirgan kanalni tanlang. 7 kunlik reja tuzing: 5 ta post yoki xabar, har birida bitta taklif va bitta chaqiriq. Birinchisini bugun eʼlon qiling. Har kuni kelgan soʻrovlar sonini yozib boring.",
      ru: "Выберите канал, который дал больше всего клиентов. Составьте план на 7 дней: 5 постов или сообщений, в каждом одно предложение и один призыв. Первый опубликуйте сегодня. Каждый день записывайте число запросов.",
      en: "Pick the channel that brought the most customers. Plan 7 days: 5 posts or messages, each with one offer and one call to action. Publish the first today. Log the number of inquiries every day.",
    },
    successCriteria: {
      uz: "7 kunlik reja tayyor, birinchi post chiqqan, soʻrovlar jurnali boshlangan.",
      ru: "План на 7 дней готов, первый пост опубликован, журнал запросов начат.",
      en: "7-day plan ready, first post published, inquiry log started.",
    },
    why: {
      uz: "Talab tasodifiy postlardan emas, bitta kanaldagi muntazam ishdan barqaror boʻladi.",
      ru: "Спрос становится предсказуемым не от случайных постов, а от регулярной работы в одном канале.",
      en: "Demand becomes predictable through steady work in one channel, not random posts.",
    },
    resources: [],
  },
  {
    slug: "marketing_capped_paid_test",
    skill: "marketing",
    kind: "apply",
    phase: "application",
    durationMinutes: 60,
    minLevel: 4,
    maxLevel: 8,
    budget: "low",
    title: {
      uz: "Chegaralangan byudjet bilan kichik reklama testi",
      ru: "Проведите малый рекламный тест с лимитом",
      en: "Run a small paid test with a fixed cap",
    },
    description: {
      uz: "Yoʻqotishga tayyor boʻlgan summani soʻmda belgilang. Bitta auditoriya, bitta taklif, bitta kanal tanlang. Testni 5–7 kunga ishga tushiring va sarf, soʻrovlar, sotuvlarni yozing. Muvaffaqiyat mezonini oldindan yozib qoʻying.",
      ru: "Определите сумму в сумах, которую готовы потерять. Выберите одну аудиторию, одно предложение, один канал. Запустите тест на 5–7 дней и записывайте расход, запросы, продажи. Критерий успеха запишите заранее.",
      en: "Set an amount in som you can afford to lose. Pick one audience, one offer, one channel. Run the test for 5–7 days and log spend, inquiries and sales. Write down the success threshold before you start.",
    },
    successCriteria: {
      uz: "Byudjet chegarasi va muvaffaqiyat mezoni oldindan yozilgan; test oxirida sarf, soʻrov va sotuvlar qayd etilgan.",
      ru: "Лимит бюджета и критерий успеха записаны заранее; по итогам теста зафиксированы расход, запросы и продажи.",
      en: "Budget cap and success threshold written beforehand; spend, inquiries and sales recorded at the end.",
    },
    why: {
      uz: "Kichik, oʻlchanadigan test katta byudjetni tavakkal qilmasdan qaysi xabar va auditoriya ishlashini koʻrsatadi.",
      ru: "Малый измеримый тест показывает, какое сообщение и аудитория работают, не рискуя большим бюджетом.",
      en: "A small measured test shows which message and audience work without risking a large budget.",
    },
    resources: [],
  },
  {
    slug: "marketing_channel_cost_review",
    skill: "marketing",
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Har bir kanalda lid va mijoz narxini hisoblang",
      ru: "Посчитайте стоимость лида и клиента по каналам",
      en: "Calculate cost per lead and per customer by channel",
    },
    description: {
      uz: "Oxirgi oy uchun har bir kanal boʻyicha jadval tuzing: sarf (pul va vaqt), soʻrovlar, yangi mijozlar. Bitta soʻrov narxi = sarf / soʻrovlar, bitta mijoz narxi = sarf / mijozlar. Eng qimmat kanal uchun qaror yozing: kamaytirish yoki toʻxtatish.",
      ru: "Составьте таблицу за последний месяц по каждому каналу: расход (деньги и время), запросы, новые клиенты. Цена запроса = расход / запросы, цена клиента = расход / клиенты. Для самого дорогого канала запишите решение: сократить или остановить.",
      en: "For last month, build a table per channel: spend (money and time), inquiries, new customers. Cost per lead = spend / inquiries; cost per customer = spend / customers. Write a decision for the most expensive channel: cut or stop.",
    },
    successCriteria: {
      uz: "Har bir kanal uchun ikki koʻrsatkich hisoblangan va eng qimmat kanal boʻyicha yozma qaror bor.",
      ru: "Для каждого канала посчитаны оба показателя, по самому дорогому каналу есть письменное решение.",
      en: "Both metrics calculated for every channel and a written decision on the most expensive one.",
    },
    why: {
      uz: "Mijoz narxini bilmay reklamani oshirish zararni ham oshirishi mumkin. Bu raqam marketingni unit-iqtisodiyot bilan bogʻlaydi.",
      ru: "Наращивать рекламу без знания цены клиента — значит рисковать масштабировать убытки. Эта цифра связывает маркетинг с юнит-экономикой.",
      en: "Scaling promotion without knowing customer cost can scale losses. This number connects marketing to unit economics.",
    },
    resources: [],
  },
];
