import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** Spec §8.2 — importances sum to exactly 1.00. Gate skills: K1 analytics_measurement, K2 customer_research, K3 positioning_messaging. */
export const skills: SkillInput[] = [
  {
    slug: "customer_research",
    globalSkillKey: "customer_focus",
    kind: "hard",
    importance: 0.12,
    name: { uz: "Auditoriyani oʻrganish", ru: "Исследование аудитории", en: "Audience research" },
    description: {
      uz: "Mijoz kimligini, unga nima kerakligini va qanday qaror qabul qilishini aniqlash.",
      ru: "Понимание, кто клиент, что ему нужно и как он принимает решение.",
      en: "Finding out who the customer is, what they need and how they decide.",
    },
  },
  {
    slug: "positioning_messaging",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.11,
    name: { uz: "Pozitsiyalash va xabar", ru: "Позиционирование и месседж", en: "Positioning & messaging" },
    description: {
      uz: "Nega aynan shu taklif, kim uchun va qaysi muqobilga nisbatan ekanini aniq ifodalash.",
      ru: "Чёткий ответ: почему именно это предложение, для кого и в сравнении с какой альтернативой.",
      en: "Stating why this offer, for whom, versus which alternative.",
    },
  },
  {
    slug: "content_creation",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: { uz: "Kontent yaratish", ru: "Создание контента", en: "Content creation" },
    description: {
      uz: "Maqsadga xizmat qiladigan post, video va maqolalarni rejalash va tayyorlash.",
      ru: "Планирование и производство постов, видео и статей, которые работают на цель.",
      en: "Planning and producing posts, videos and articles that serve a goal.",
    },
  },
  {
    slug: "copywriting",
    globalSkillKey: "writing",
    kind: "hard",
    importance: 0.08,
    name: { uz: "Kopirayting", ru: "Копирайтинг", en: "Copywriting" },
    description: {
      uz: "Aniq va ishontiruvchi matn: sarlavha, foyda, dalil va harakatga chaqiruv.",
      ru: "Ясный убедительный текст: заголовок, выгода, доказательство, призыв к действию.",
      en: "Clear persuasive text: headline, benefit, proof, call to action.",
    },
  },
  {
    slug: "channel_management",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Kanallarni boshqarish", ru: "Управление каналами", en: "Channel management" },
    description: {
      uz: "Ijtimoiy tarmoq, qidiruv, messenjer va email kanallarini har birining oʻz qoidasi bilan yuritish.",
      ru: "Ведение соцсетей, поиска, мессенджеров и email по правилам каждого канала.",
      en: "Running social, search, messenger and email channels by their own rules.",
    },
  },
  {
    slug: "paid_acquisition",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Pullik reklama", ru: "Платное привлечение", en: "Paid acquisition" },
    description: {
      uz: "Pullik kampaniyalarni sozlash, auditoriyani tanlash va optimallashtirish.",
      ru: "Настройка, таргетинг и оптимизация платных кампаний.",
      en: "Setting up, targeting and optimizing paid campaigns.",
    },
  },
  {
    slug: "analytics_measurement",
    globalSkillKey: "data_literacy",
    kind: "hard",
    importance: 0.13,
    name: { uz: "Analitika va oʻlchash", ru: "Аналитика и измерение", en: "Analytics & measurement" },
    description: {
      uz: "Kuzatuv, atributsiya va CPL, CAC, ROAS, konversiya kabi koʻrsatkichlar bilan ishlash.",
      ru: "Трекинг, атрибуция и метрики: CPL, CAC, ROAS, конверсия.",
      en: "Tracking, attribution and metrics such as CPL, CAC, ROAS and conversion.",
    },
  },
  {
    slug: "funnel_conversion",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: { uz: "Voronka va konversiya", ru: "Воронка и конверсия", en: "Funnel & conversion" },
    description: {
      uz: "Birinchi aloqadan xaridgacha boʻlgan yoʻlda mijozlar qayerda tushib qolishini topish va tuzatish.",
      ru: "Поиск и устранение потерь на пути от первого касания до покупки.",
      en: "Finding and fixing drop-off between first touch and purchase.",
    },
  },
  {
    slug: "budget_planning",
    globalSkillKey: "planning",
    kind: "hard",
    importance: 0.1,
    name: { uz: "Byudjet va kampaniya rejasi", ru: "Бюджет и планирование кампаний", en: "Budget & campaign planning" },
    description: {
      uz: "Byudjetni maqsad asosida kanallar va vaqt boʻyicha taqsimlash.",
      ru: "Распределение бюджета по каналам и времени под конкретную цель.",
      en: "Allocating budget across channels and time against a goal.",
    },
  },
  {
    slug: "experimentation",
    globalSkillKey: null,
    kind: "meta",
    importance: 0.08,
    name: { uz: "A/B tajribalar", ru: "Эксперименты (A/B)", en: "Experimentation" },
    description: {
      uz: "Gipoteza tuzish va uni kengaytirishdan oldin adolatli sinovdan oʻtkazish.",
      ru: "Формулировка гипотез и честная проверка до масштабирования.",
      en: "Forming hypotheses and testing them fairly before scaling.",
    },
  },
];

/** Spec §8.3 — exactly 10 edges; strengths from the {0.3, 0.5, 0.7, 0.9} scale. */
export const edges: EdgeInput[] = [
  {
    from: "customer_research",
    to: "positioning_messaging",
    relation: "prerequisite",
    strength: 0.9,
    rationale: {
      uz: "Pozitsiyalash — mijoz haqidagi daʼvo. Avval auditoriyani oʻrganish kerak, aks holda xabar taxminga quriladi.",
      ru: "Позиционирование — это утверждение о клиенте. Сначала нужно исследование, иначе месседж строится на догадках.",
      en: "Positioning is a claim about customers. Research comes first, otherwise the message is built on guesses.",
    },
  },
  {
    from: "positioning_messaging",
    to: "content_creation",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Kontent chiroyli chiqadi, lekin xabar noaniq boʻlgani uchun u sotuvga aylanmaydi.",
      ru: "Контент выходит красивым, но неясный месседж не превращает его в продажи.",
      en: "The content looks good, but an unclear message keeps it from turning into sales.",
    },
  },
  {
    from: "positioning_messaging",
    to: "paid_acquisition",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Reklama eʼtiborni sotib oladi, ammo xabar ishontirmagani uchun bu eʼtibor xaridga aylanmaydi.",
      ru: "Реклама покупает внимание, но неубедительный месседж не превращает его в покупки.",
      en: "Ads buy attention, but an unconvincing message does not turn it into purchases.",
    },
  },
  {
    from: "analytics_measurement",
    to: "paid_acquisition",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Kampaniyalar ishga tushadi, lekin qaysi biri oʻzini oqlayotgani oʻlchanmagani uchun byudjet koʻr-koʻrona sarflanadi.",
      ru: "Кампании запущены, но без измерений не видно, какие окупаются, — бюджет тратится вслепую.",
      en: "Campaigns run, but without measurement nobody sees which ones pay back, so budget is spent blindly.",
    },
  },
  {
    from: "funnel_conversion",
    to: "paid_acquisition",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Reklama trafik olib keladi, ammo voronkadagi teshiklar tufayli mijozlarning katta qismi xaridgacha yetmaydi.",
      ru: "Реклама приводит трафик, но из-за дыр в воронке большая часть людей не доходит до покупки.",
      en: "Ads bring traffic, but leaks in the funnel stop most people before they buy.",
    },
  },
  {
    from: "budget_planning",
    to: "paid_acquisition",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Yaxshi kampaniyalar ham reja boʻlmagani uchun vaqtidan oldin toʻxtaydi yoki byudjetdan oshib ketadi.",
      ru: "Даже хорошие кампании без плана останавливаются раньше времени или выходят за бюджет.",
      en: "Even good campaigns stop too early or overspend because there is no plan behind them.",
    },
  },
  {
    from: "analytics_measurement",
    to: "experimentation",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Ishonchli koʻrsatkich boʻlmasa, A/B test natijasini toʻgʻri talqin qilib boʻlmaydi.",
      ru: "Без надёжной метрики результат A/B-теста невозможно правильно интерпретировать.",
      en: "Without a reliable metric, an A/B test result cannot be read correctly.",
    },
  },
  {
    from: "copywriting",
    to: "content_creation",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Kuchli matn har qanday formatdagi kontentni — post, video yoki maqolani — kuchaytiradi.",
      ru: "Сильный текст усиливает контент в любом формате — пост, видео или статью.",
      en: "Strong text lifts content in every format — post, video or article.",
    },
  },
  {
    from: "analytics_measurement",
    to: "budget_planning",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Byudjetni oʻlchangan natijalarga qarab taqsimlash osonroq va aniqroq boʻladi.",
      ru: "Бюджет проще и точнее распределять, опираясь на измеренные результаты.",
      en: "Budget is easier and more accurate to allocate when it follows measured returns.",
    },
  },
  {
    from: "customer_research",
    to: "channel_management",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Auditoriya qayerda vaqt oʻtkazishini bilsangiz, kerakli kanalni tanlash osonlashadi.",
      ru: "Когда известно, где проводит время аудитория, выбрать нужный канал проще.",
      en: "Knowing where the audience spends time makes choosing the channel easier.",
    },
  },
];

/** Spec §8.1 — only non-1.0 weights listed. Gate skills stay ≥ 0.5 everywhere. */
export const specializations: SpecializationInput[] = [
  {
    slug: "smm",
    name: { uz: "SMM", ru: "SMM", en: "SMM" },
    description: {
      uz: "Ijtimoiy tarmoqlarda kontent, hamjamiyat va sahifalarni yuritish.",
      ru: "Контент, сообщество и ведение страниц в социальных сетях.",
      en: "Content, community and page management on social media.",
    },
    skillWeights: { content_creation: 1.5, channel_management: 1.4, copywriting: 1.2, paid_acquisition: 0.8, budget_planning: 0.8 },
  },
  {
    slug: "performance",
    name: { uz: "Performance marketing", ru: "Performance-маркетинг", en: "Performance marketing" },
    description: {
      uz: "Oʻlchanadigan natija uchun pullik reklama, voronka va testlar.",
      ru: "Платная реклама, воронки и тесты ради измеримого результата.",
      en: "Paid ads, funnels and tests for measurable results.",
    },
    skillWeights: { paid_acquisition: 2.0, analytics_measurement: 1.4, funnel_conversion: 1.4, experimentation: 1.3, content_creation: 0.6 },
  },
  {
    slug: "content",
    name: { uz: "Kontent marketing", ru: "Контент-маркетинг", en: "Content marketing" },
    description: {
      uz: "Foydali kontent orqali auditoriyani jalb qilish va ishonch qozonish.",
      ru: "Привлечение аудитории и доверия через полезный контент.",
      en: "Attracting an audience and earning trust through useful content.",
    },
    skillWeights: { content_creation: 1.6, copywriting: 1.6, paid_acquisition: 0.5 },
  },
  {
    slug: "brand",
    name: { uz: "Brend marketing", ru: "Бренд-маркетинг", en: "Brand marketing" },
    description: {
      uz: "Brendning oʻrni, ovozi va auditoriya xotirasidagi obrazini shakllantirish.",
      ru: "Формирование места бренда, его голоса и образа в памяти аудитории.",
      en: "Shaping the brand's position, voice and place in the audience's mind.",
    },
    skillWeights: { positioning_messaging: 1.8, customer_research: 1.3, funnel_conversion: 0.7, paid_acquisition: 0.6 },
  },
  {
    slug: "seo",
    name: { uz: "SEO", ru: "SEO", en: "SEO" },
    description: {
      uz: "Qidiruv tizimlaridan organik trafik olish uchun sayt va kontentni optimallashtirish.",
      ru: "Оптимизация сайта и контента для органического трафика из поиска.",
      en: "Optimizing site and content for organic search traffic.",
    },
    skillWeights: { channel_management: 1.6, content_creation: 1.3, analytics_measurement: 1.2, paid_acquisition: 0.4 },
  },
  {
    slug: "strategy",
    name: { uz: "Marketing strategiyasi", ru: "Маркетинговая стратегия", en: "Marketing strategy" },
    description: {
      uz: "Bozor, auditoriya va byudjet asosida marketing yoʻnalishini belgilash.",
      ru: "Определение направления маркетинга исходя из рынка, аудитории и бюджета.",
      en: "Setting marketing direction from market, audience and budget.",
    },
    skillWeights: {
      budget_planning: 1.5,
      customer_research: 1.4,
      positioning_messaging: 1.4,
      channel_management: 0.8,
      content_creation: 0.6,
      copywriting: 0.6,
    },
  },
];
