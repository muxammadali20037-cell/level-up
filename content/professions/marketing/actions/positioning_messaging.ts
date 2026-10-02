import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: positioning_messaging (gate K3). Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "pm_positioning_statement",
    skill: "positioning_messaging",
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Bir gaplik pozitsiyalash shablonini toʻldiring",
      ru: "Заполните шаблон позиционирования в одну фразу",
      en: "Fill in a one-sentence positioning template",
    },
    description: {
      uz: "Shablon: «[Segment] uchun, [ehtiyoj] boʻlganda, [mahsulot] — bu [kategoriya], u [asosiy foyda] beradi. [Muqobil]dan farqli, biz [dalil]». Har bir boʻshliqni aniq yozing, «sifatli», «eng yaxshi» kabi umumiy soʻzlarni ishlatmang.",
      ru: "Шаблон: «Для [сегмент], которым нужно [потребность], [продукт] — это [категория], который даёт [главная выгода]. В отличие от [альтернатива], мы [доказательство]». Заполните конкретно, без «качественный» и «лучший».",
      en: "Template: \"For [segment] who need [need], [product] is a [category] that delivers [key benefit]. Unlike [alternative], we [proof].\" Fill every blank concretely, without words like \"quality\" or \"best\".",
    },
    successCriteria: {
      uz: "Barcha boʻshliqlar aniq toʻldirilgan; muqobil nomi bor; dalil tekshirib boʻladigan fakt.",
      ru: "Все пропуски заполнены конкретно; названа альтернатива; доказательство — проверяемый факт.",
      en: "Every blank is concrete; a real alternative is named; the proof is a checkable fact.",
    },
    why: {
      uz: "Pozitsiyalash — darajani belgilovchi koʻnikma. Bir gapda aytib boʻlmaydigan taklif reklama va kontentda ham noaniq chiqadi.",
      ru: "Позиционирование — ключевой навык для уровня. Предложение, которое нельзя сказать одной фразой, будет размытым и в рекламе, и в контенте.",
      en: "Positioning is a gate skill. An offer that cannot be said in one sentence comes out vague in ads and content too.",
    },
    resources: [],
  },
  {
    slug: "pm_competitor_promises",
    skill: "positioning_messaging",
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "5 ta raqobatchining asosiy vaʼdasini jadvalga yozing",
      ru: "Выпишите главные обещания 5 конкурентов",
      en: "List the main promises of 5 competitors",
    },
    description: {
      uz: "Sayt, profil bio va reklamalardan 5 ta raqobatchining asosiy sarlavha va vaʼdasini koʻchiring. Hamma aytayotgan daʼvolarni belgilang. Hech kim aytmayotgan, lekin mijozga muhim bitta yoʻnalishni toping.",
      ru: "Выпишите главный заголовок и обещание 5 конкурентов с сайта, био профиля и рекламы. Отметьте утверждения, которые повторяют все. Найдите одно важное для клиента направление, которое никто не занял.",
      en: "Copy the main headline and promise of 5 competitors from their site, profile bio and ads. Mark the claims everyone makes. Find one angle that matters to customers but nobody owns.",
    },
    successCriteria: {
      uz: "5 ta raqobatchi jadvalda; takrorlanuvchi daʼvolar belgilangan; bitta boʻsh yoʻnalish va uning asosi yozilgan.",
      ru: "5 конкурентов в таблице; повторяющиеся утверждения отмечены; записано одно свободное направление и почему.",
      en: "5 competitors in the sheet; repeated claims marked; one open angle written down with the reason.",
    },
    why: {
      uz: "Farqlanish faqat muqobillarga nisbatan mavjud. Raqobatchilar bilan bir xil gapirsangiz, mijoz faqat narxga qaraydi.",
      ru: "Отличие существует только относительно альтернатив. Если вы говорите то же, что конкуренты, клиент смотрит только на цену.",
      en: "Differentiation only exists relative to alternatives. If you say what competitors say, customers compare on price alone.",
    },
    resources: [],
  },
  {
    slug: "pm_why_customers_chose",
    skill: "positioning_messaging",
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "5 ta mijozdan nega sizni tanlaganini soʻrang",
      ru: "Спросите 5 клиентов, почему они выбрали вас",
      en: "Ask 5 customers why they chose you",
    },
    description: {
      uz: "5 ta mijozga bitta savol bering: «Nega aynan bizni tanladingiz va boshqa qaysi variantlarni koʻrdingiz?». Javoblarni soʻzma-soʻz yozing va pozitsiyalash gapingiz bilan solishtiring. Mos kelmasa, gapni qayta yozing.",
      ru: "Задайте 5 клиентам один вопрос: «Почему вы выбрали именно нас и какие варианты ещё смотрели?». Запишите ответы дословно и сравните с вашей фразой позиционирования. Если не совпадает — перепишите её.",
      en: "Ask 5 customers one question: \"Why did you choose us, and what other options did you look at?\" Write the answers word for word and compare them with your positioning sentence. If they do not match, rewrite it.",
    },
    successCriteria: {
      uz: "5 ta javob yozilgan; pozitsiyalash gapi kamida 3 ta javobdagi sabab bilan mos keladi yoki qayta yozilgan.",
      ru: "Записано 5 ответов; фраза позиционирования совпадает с причинами минимум в 3 ответах или переписана.",
      en: "5 answers recorded; the positioning sentence matches the reasons in at least 3 answers, or it has been rewritten.",
    },
    why: {
      uz: "Pozitsiyalash — mijoz haqidagi daʼvo. Uni faqat mijozning haqiqiy sabablari tasdiqlaydi.",
      ru: "Позиционирование — это утверждение о клиенте. Подтвердить его могут только реальные причины клиентов.",
      en: "Positioning is a claim about customers. Only their real reasons can confirm it.",
    },
    resources: [],
  },
  {
    slug: "pm_message_house",
    skill: "positioning_messaging",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Xabarlar uyini quring: vaʼda, 3 tayanch, dalillar",
      ru: "Постройте дом сообщений: обещание, 3 опоры, доказательства",
      en: "Build a message house: promise, 3 pillars, proof",
    },
    description: {
      uz: "Bitta asosiy vaʼda yozing. Uning ostiga 3 ta tayanch fikr va har biriga dalil qoʻying (fakt, mijoz holati, kafolat). Eng koʻp uchraydigan 3 ta eʼtirozga javob qoʻshing. Sayt sarlavhasi va asosiy reklamani shunga moslang.",
      ru: "Сформулируйте одно главное обещание. Под ним 3 опорные мысли с доказательством к каждой (факт, кейс клиента, гарантия). Добавьте ответы на 3 частых возражения. Приведите заголовок сайта и основную рекламу в соответствие.",
      en: "Write one main promise. Under it, add 3 supporting pillars, each with proof (a fact, a customer case, a guarantee). Add answers to the 3 most common objections. Align the site headline and main ad with it.",
    },
    successCriteria: {
      uz: "Hujjatda vaʼda, 3 ta tayanch, har biriga dalil va 3 ta eʼtiroz javobi bor; sayt sarlavhasi va reklama yangilangan.",
      ru: "В документе обещание, 3 опоры с доказательствами и 3 ответа на возражения; заголовок сайта и реклама обновлены.",
      en: "The document has the promise, 3 pillars with proof and 3 objection answers; the site headline and ad are updated.",
    },
    why: {
      uz: "Xabar noaniq boʻlsa, kontent va reklama natija bermaydi. Yagona tuzilma barcha kanallarda bir xil gapirishga yordam beradi.",
      ru: "При неясном месседже контент и реклама не дают результата. Единая структура помогает говорить одно и то же во всех каналах.",
      en: "An unclear message holds back content and ads. One structure keeps every channel saying the same thing.",
    },
    resources: [],
  },
  {
    slug: "pm_touchpoint_audit",
    skill: "positioning_messaging",
    kind: "reflect",
    phase: "practice",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "10 ta aloqa nuqtasida xabar izchilligini tekshiring",
      ru: "Проверьте единство месседжа в 10 точках контакта",
      en: "Audit message consistency across 10 touchpoints",
    },
    description: {
      uz: "Sayt, profil bio, reklamalar, sotuv skripti, Telegram kanal va narx sahifasi kabi 10 ta nuqtani xabarlar uyi bilan solishtiring. Har biriga 1–3 ball qoʻying. Eng past 3 tasini bugun tuzating.",
      ru: "Сравните с домом сообщений 10 точек: сайт, био, рекламу, скрипт продаж, Telegram-канал, страницу цен и т. д. Оцените каждую от 1 до 3. Три самые слабые исправьте сегодня.",
      en: "Compare 10 touchpoints with your message house: site, bio, ads, sales script, Telegram channel, pricing page and so on. Score each 1–3. Fix the 3 weakest today.",
    },
    successCriteria: {
      uz: "10 ta nuqta baholangan; eng past 3 tasi tuzatilgan va oldin/keyin matni saqlangan.",
      ru: "10 точек оценены; 3 самые слабые исправлены, тексты «до/после» сохранены.",
      en: "10 touchpoints scored; the 3 weakest are fixed with before/after text saved.",
    },
    why: {
      uz: "Mijoz bir nechta joyda turli vaʼdani koʻrsa, ishonchi pasayadi. Izchillik mavjud trafikdan koʻproq natija oladi.",
      ru: "Когда клиент видит разные обещания в разных местах, доверие падает. Единство даёт больше результата от того же трафика.",
      en: "When customers see different promises in different places, trust drops. Consistency gets more from the same traffic.",
    },
    resources: [],
  },
];
