import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: customer_research (gate K2). Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "cr_interview_questions",
    skill: "customer_research",
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Mijoz bilan suhbat uchun 8 ta ochiq savol yozing",
      ru: "Напишите 8 открытых вопросов для интервью с клиентом",
      en: "Write 8 open questions for a customer interview",
    },
    description: {
      uz: "Savollar oʻtmishdagi real xatti-harakat haqida boʻlsin: oxirgi xarid qachon boʻlgan, undan oldin nimani sinagan, qaror nimaga bogʻliq boʻlgan. «Sotib olarmidingiz?» kabi taxminiy va javobni ichida tutgan savollarni oʻchiring.",
      ru: "Вопросы — о реальном прошлом поведении: когда была последняя покупка, что пробовали до этого, от чего зависело решение. Уберите гипотетические и наводящие вопросы вроде «Вы бы купили?».",
      en: "Ask about real past behaviour: when they last bought, what they tried before, what the decision depended on. Remove hypothetical and leading questions like \"Would you buy this?\".",
    },
    successCriteria: {
      uz: "8 ta savol tayyor; ularning hech biri taxminiy yoki yoʻnaltiruvchi emas, hammasi «qanday», «qachon», «nima uchun» bilan boshlanadi.",
      ru: "Готовы 8 вопросов; ни один не гипотетический и не наводящий, все начинаются с «как», «когда», «почему».",
      en: "8 questions ready; none is hypothetical or leading, all start with how, when, what or why.",
    },
    why: {
      uz: "Odamlar kelajakdagi xatti-harakatini yaxshi bashorat qilmaydi, lekin oʻtmishni aniq aytib beradi. Toʻgʻri savol — ishonchli tadqiqotning boshlanishi.",
      ru: "Люди плохо предсказывают своё будущее поведение, но точно описывают прошлое. Правильный вопрос — начало надёжного исследования.",
      en: "People predict their future behaviour poorly but describe their past accurately. The right question is where reliable research starts.",
    },
    resources: [],
  },
  {
    slug: "cr_review_mining",
    skill: "customer_research",
    kind: "practice",
    phase: "practice",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "30 ta sharhdan mijoz iboralarini yigʻing",
      ru: "Соберите фразы клиентов из 30 отзывов",
      en: "Collect customer phrases from 30 reviews",
    },
    description: {
      uz: "Mahsulotingiz yoki raqobatchilar haqidagi 30 ta sharh va izohni oʻqing (marketpleys, Telegram, xaritalar). Mijozning aynan oʻz soʻzlarini jadvalga koʻchiring: muammo, kutilgan natija, eʼtiroz. Oʻxshashlarini mavzularga guruhlang.",
      ru: "Прочитайте 30 отзывов и комментариев о вашем продукте или конкурентах (маркетплейсы, Telegram, карты). Перенесите в таблицу дословные фразы клиентов: проблема, желаемый результат, возражение. Сгруппируйте похожие по темам.",
      en: "Read 30 reviews and comments about your product or competitors (marketplaces, Telegram, maps). Copy customers' exact words into a sheet: problem, desired result, objection. Group similar ones into themes.",
    },
    successCriteria: {
      uz: "Jadvalda kamida 20 ta soʻzma-soʻz ibora bor va ular kamida 3 ta mavzuga ajratilgan.",
      ru: "В таблице не менее 20 дословных фраз, разбитых минимум на 3 темы.",
      en: "The sheet has at least 20 verbatim phrases grouped into at least 3 themes.",
    },
    why: {
      uz: "Mijozning oʻz soʻzlari xabar va matn uchun eng kuchli xom ashyo. Bu tadqiqot pullik emas va bugunoq qilinadi.",
      ru: "Слова самих клиентов — лучшее сырьё для месседжа и текстов. Такое исследование бесплатно и делается уже сегодня.",
      en: "Customers' own words are the best raw material for messaging and copy. This research is free and can be done today.",
    },
    resources: [],
  },
  {
    slug: "cr_three_interviews",
    skill: "customer_research",
    kind: "apply",
    phase: "application",
    durationMinutes: 60,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "3 ta mijoz bilan 15 daqiqalik suhbat oʻtkazing",
      ru: "Проведите 3 интервью с клиентами по 15 минут",
      en: "Run three 15-minute customer interviews",
    },
    description: {
      uz: "Yaqinda xarid qilgan 3 ta mijozga qoʻngʻiroq qiling yoki yozing. Tayyor savollar bilan 15 daqiqa gaplashing, sotishga urinmang. Har suhbatdan soʻng muhim iboralarni yozib oling, oxirida takrorlangan 3 ta fikrni ajrating.",
      ru: "Позвоните или напишите 3 клиентам, которые недавно купили. Поговорите 15 минут по готовым вопросам, не пытайтесь продавать. После каждого разговора запишите ключевые фразы, в конце выделите 3 повторяющиеся мысли.",
      en: "Call or message 3 customers who bought recently. Talk for 15 minutes using your prepared questions and do not try to sell. Note key phrases after each call, then pick out 3 ideas that repeat.",
    },
    successCriteria: {
      uz: "3 ta suhbatning yozuvlari bor va kamida 2 ta suhbatda takrorlangan 3 ta fikr ajratilgan.",
      ru: "Есть записи 3 интервью и выделены 3 мысли, повторившиеся минимум в 2 разговорах.",
      en: "Notes from 3 interviews exist, with 3 ideas that came up in at least 2 of them.",
    },
    why: {
      uz: "Pozitsiyalash va kontent mijozni bilishga tayanadi. Bir nechta jonli suhbat ham ofisdagi taxminlarni tez tekshiradi.",
      ru: "Позиционирование и контент опираются на знание клиента. Даже несколько живых разговоров быстро проверяют офисные догадки.",
      en: "Positioning and content depend on knowing the customer. Even a few live conversations quickly test assumptions made at the desk.",
    },
    resources: [],
  },
  {
    slug: "cr_segment_profiles",
    skill: "customer_research",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Dalillarga tayangan 2 ta segment profilini yozing",
      ru: "Опишите 2 сегмента на основе фактов",
      en: "Write 2 evidence-based segment profiles",
    },
    description: {
      uz: "Har bir segment uchun: vaziyat, xaridga turtki, kutilgan natija, sinab koʻrilgan muqobillar, tanlov mezonlari va qarorni kim qabul qilishi. Har bir bandga suhbat, sharh yoki CRM maʼlumotidan dalil qoʻshing. Segmentlarni qiymati boʻyicha tartiblang.",
      ru: "Для каждого сегмента: ситуация, повод для покупки, желаемый результат, испробованные альтернативы, критерии выбора и кто принимает решение. К каждому пункту добавьте факт из интервью, отзывов или CRM. Ранжируйте сегменты по ценности.",
      en: "For each segment: situation, purchase trigger, desired outcome, alternatives tried, choice criteria and who decides. Back every item with evidence from interviews, reviews or CRM data. Rank the segments by value.",
    },
    successCriteria: {
      uz: "2 ta profil tayyor; har birida kamida 3 ta real iqtibos yoki raqam bor va qaysi segment ustuvorligi asoslangan.",
      ru: "Готовы 2 профиля; в каждом минимум 3 реальные цитаты или цифры, приоритет сегмента обоснован.",
      en: "2 profiles are done, each with at least 3 real quotes or numbers, and the priority segment is justified.",
    },
    why: {
      uz: "Hammaga moʻljallangan marketing hech kimga yetib bormaydi. Aniq segment kanal, xabar va byudjet tanlovini osonlashtiradi.",
      ru: "Маркетинг для всех не доходит ни до кого. Чёткий сегмент упрощает выбор канала, месседжа и бюджета.",
      en: "Marketing aimed at everyone reaches no one. A clear segment makes channel, message and budget choices easier.",
    },
    resources: [],
  },
  {
    slug: "cr_research_readout",
    skill: "customer_research",
    kind: "verify",
    phase: "verification",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Tadqiqot xulosasini jamoaga taqdim eting",
      ru: "Представьте команде итоги исследования",
      en: "Present a research readout to your team",
    },
    description: {
      uz: "Bir sahifada yozing: 3 ta asosiy xulosa, har biri uchun dalil va marketingda nima oʻzgarishi kerak. Jamoa yoki rahbarga 10 daqiqada taqdim eting, savollarni yozib oling va kelishilgan qarorni qayd eting.",
      ru: "На одной странице: 3 главных вывода, доказательство к каждому и что должно измениться в маркетинге. Представьте команде или руководителю за 10 минут, запишите вопросы и зафиксируйте согласованное решение.",
      en: "On one page: 3 key insights, evidence for each and what should change in marketing. Present it to your team or manager in 10 minutes, note their questions and record the agreed decision.",
    },
    successCriteria: {
      uz: "Har bir xulosaning dalili bor; taqdimotdan keyin kamida bitta marketing qarori kelishilgan.",
      ru: "У каждого вывода есть доказательство; после презентации согласовано минимум одно маркетинговое решение.",
      en: "Every insight has evidence; at least one marketing decision is agreed after the presentation.",
    },
    why: {
      uz: "Tadqiqot qarorni oʻzgartirgandagina qiymat beradi. Boshqalar oldida himoya qilish xulosalar dalilga tayanganini tekshiradi.",
      ru: "Исследование ценно, только если меняет решения. Защита перед другими проверяет, что выводы опираются на факты.",
      en: "Research only has value when it changes decisions. Defending it in front of others tests whether the insights rest on evidence.",
    },
    resources: [],
  },
];
