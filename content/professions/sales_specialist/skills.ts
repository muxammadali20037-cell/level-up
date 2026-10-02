import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** Skills per docs/architecture/05-profession-skill-model.md §7.2 (Σ importance = 1.00). Gates: K1 discovery, K2 objection_handling, K3 closing. */
export const skills: SkillInput[] = [
  {
    slug: "prospecting",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.08,
    name: { uz: "Mijoz izlash", ru: "Поиск клиентов", en: "Prospecting" },
    description: {
      uz: "Haqiqatan sotib olishi mumkin boʻlgan mijozlarni topish va saralash.",
      ru: "Поиск и квалификация потенциальных покупателей, которые действительно могут купить.",
      en: "Finding and qualifying potential buyers who can actually buy.",
    },
  },
  {
    slug: "discovery",
    globalSkillKey: "customer_focus",
    kind: "hard",
    importance: 0.13,
    name: { uz: "Ehtiyojni aniqlash", ru: "Выявление потребностей", en: "Needs discovery" },
    description: {
      uz: "Mijozning haqiqiy muammosi, tanlov mezonlari va qaror jarayonini ochadigan savollar bera olish.",
      ru: "Вопросы, которые раскрывают реальную проблему покупателя, его критерии и процесс принятия решения.",
      en: "Asking questions that uncover the buyer's real problem, criteria and decision process.",
    },
  },
  {
    slug: "product_knowledge",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.07,
    name: { uz: "Mahsulotni bilish", ru: "Знание продукта", en: "Product knowledge" },
    description: {
      uz: "Mahsulot nima qilishini, kimga mosligini va muqobillardan nimasi bilan farq qilishini bilish.",
      ru: "Понимание того, что делает продукт, кому он подходит и чем отличается от альтернатив.",
      en: "Knowing what the product does, for whom, and how it compares.",
    },
  },
  {
    slug: "presentation",
    globalSkillKey: null,
    kind: "soft",
    importance: 0.1,
    name: { uz: "Qiymatni taqdim etish", ru: "Презентация ценности", en: "Value presentation" },
    description: {
      uz: "Mahsulot xususiyatlarini mijoz aytgan ehtiyojlar bilan bogʻlab koʻrsatish.",
      ru: "Связь возможностей продукта с потребностями, которые назвал покупатель.",
      en: "Linking product features to the buyer's stated needs.",
    },
  },
  {
    slug: "objection_handling",
    globalSkillKey: null,
    kind: "soft",
    importance: 0.12,
    name: { uz: "Eʼtirozlar bilan ishlash", ru: "Работа с возражениями", en: "Objection handling" },
    description: {
      uz: "Mijoz shubhalarini bosimsiz aniqlashtirish, tan olish va hal qilish.",
      ru: "Уточнение, признание и снятие сомнений покупателя без давления.",
      en: "Clarifying, acknowledging and resolving doubts without pressure.",
    },
  },
  {
    slug: "closing",
    globalSkillKey: "sales",
    kind: "hard",
    importance: 0.11,
    name: { uz: "Bitimni yopish", ru: "Закрытие сделки", en: "Closing" },
    description: {
      uz: "Toʻgʻri paytda aniq keyingi qadam yoki qaror boʻyicha kelishib olish.",
      ru: "Договорённость о чётком следующем шаге или решении в правильный момент.",
      en: "Agreeing on a clear next step or decision at the right moment.",
    },
  },
  {
    slug: "follow_up_retention",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Kuzatuv va mijozni saqlash", ru: "Сопровождение и удержание", en: "Follow-up & retention" },
    description: {
      uz: "Sotuvdan keyin vaʼdalarni bajarish; takroriy xarid va tavsiyalarga erishish.",
      ru: "Выполнение обещаний после продажи; повторные покупки и рекомендации.",
      en: "Keeping commitments after the sale; repeat purchases and referrals.",
    },
  },
  {
    slug: "pipeline_crm",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: { uz: "Voronka va CRM intizomi", ru: "Воронка и CRM-дисциплина", en: "Pipeline & CRM discipline" },
    description: {
      uz: "Har bir bitim, keyingi qadam va sanani qayd etish; savdo voronkasini oʻqiy olish.",
      ru: "Фиксация каждой сделки, следующего шага и даты; умение читать воронку.",
      en: "Recording every deal, next step and date; reading the funnel.",
    },
  },
  {
    slug: "negotiation",
    globalSkillKey: "negotiation",
    kind: "soft",
    importance: 0.1,
    name: { uz: "Muzokara", ru: "Переговоры", en: "Negotiation" },
    description: {
      uz: "Har bir yon berishni qiymatga almashtirish; narx va shartlarni himoya qilish.",
      ru: "Обмен уступок на ценность; защита цены и условий.",
      en: "Trading concessions for value; protecting price and terms.",
    },
  },
  {
    slug: "emotional_resilience",
    globalSkillKey: "self_management",
    kind: "meta",
    importance: 0.07,
    name: {
      uz: "Bardoshlilik va oʻzini boshqarish",
      ru: "Стрессоустойчивость и самоорганизация",
      en: "Resilience & self-management",
    },
    description: {
      uz: "Rad javobidan keyin ham barqaror ishlash; oʻz faollik rejasini boshqarish.",
      ru: "Стабильная работа после отказов; управление собственным планом активности.",
      en: "Staying consistent after rejection; managing own activity plan.",
    },
  },
  {
    slug: "team_coaching",
    globalSkillKey: "feedback",
    kind: "soft",
    // Doc §7.2 / P16: low base importance, lifted by the sales_manager / head_of_sales multipliers.
    importance: 0.03,
    name: { uz: "Savdo jamoasiga murabbiylik", ru: "Коучинг продавцов", en: "Sales coaching" },
    description: {
      uz: "Qoʻngʻiroqlar tahlili, fikr-mulohaza va maqsadlar orqali boshqa sotuvchilarni rivojlantirish.",
      ru: "Развитие других продавцов через разбор звонков, обратную связь и цели.",
      en: "Developing other sellers through call reviews, feedback and targets.",
    },
  },
];

/** Dependency graph per doc §7.3 (10 edges). Rationales are user-facing bottleneck explanations about the work. */
export const edges: EdgeInput[] = [
  {
    from: "discovery",
    to: "presentation",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Qiymatni faqat aniqlangan ehtiyojga qarab koʻrsatish mumkin — ehtiyoj ochilmasa, taqdimot umumiy gapga aylanadi.",
      ru: "Ценность можно показать только относительно выявленной потребности — иначе презентация превращается в общие слова.",
      en: "Value can only be presented against an uncovered need — otherwise the pitch turns generic.",
    },
  },
  {
    from: "product_knowledge",
    to: "presentation",
    relation: "prerequisite",
    strength: 0.5,
    rationale: {
      uz: "Mahsulot imkoniyatlarini bilmasdan ularni mijoz ehtiyojiga bogʻlab boʻlmaydi.",
      ru: "Нельзя связать возможности продукта с потребностями, не зная самих возможностей.",
      en: "Features cannot be linked to needs without knowing the features.",
    },
  },
  {
    from: "discovery",
    to: "closing",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Bitimni yopishga urinishlar natija bermaydi, chunki mijozning haqiqiy ehtiyoji aniqlanmagan.",
      ru: "Попытки закрыть сделку срываются, потому что реальная потребность так и не выявлена.",
      en: "Closing attempts fail because the buyer's real need was never uncovered.",
    },
  },
  {
    from: "objection_handling",
    to: "closing",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Bitimlar hal qilinmagan birinchi shubhada toʻxtab qoladi.",
      ru: "Сделки останавливаются на первом неотработанном сомнении.",
      en: "Deals stall at the first doubt that is not resolved.",
    },
  },
  {
    from: "pipeline_crm",
    to: "prospecting",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Yangi mijozlar topiladi, lekin keyingi qadam qayd etilmagani uchun yoʻqotiladi.",
      ru: "Новые клиенты находятся, но теряются, потому что следующий шаг не зафиксирован.",
      en: "New leads are found but lost because next steps are not recorded.",
    },
  },
  {
    from: "pipeline_crm",
    to: "follow_up_retention",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Vaʼda qilingan qayta aloqalar tizim boʻlmagani uchun unutiladi.",
      ru: "Обещанные повторные контакты забываются, потому что нет системы.",
      en: "Promised follow-ups are forgotten because there is no system.",
    },
  },
  {
    from: "emotional_resilience",
    to: "prospecting",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Rad javoblaridan keyin murojaatlar soni kamayadi — yangi mijozlar oqimi qisqaradi.",
      ru: "После отказов число обращений падает — поток новых клиентов сокращается.",
      en: "Outreach volume drops after rejections, so the flow of new leads shrinks.",
    },
  },
  {
    from: "negotiation",
    to: "closing",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Shartlarni almashtira olish yakuniy bosqichda bitimni saqlab qoladi.",
      ru: "Умение обменивать условия сохраняет сделку на финальном этапе.",
      en: "Trading terms keeps deals alive near the end.",
    },
  },
  {
    from: "discovery",
    to: "negotiation",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Mijoz nimani qadrlashini bilish nimani yon berish mumkinligini koʻrsatadi.",
      ru: "Понимание того, что ценит покупатель, подсказывает, чем можно обменяться.",
      en: "Knowing what the buyer values shows what can be traded.",
    },
  },
  {
    from: "pipeline_crm",
    to: "team_coaching",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Murabbiylik voronka maʼlumotlariga tayanadi: raqamlarsiz qayerda yordam kerakligi koʻrinmaydi.",
      ru: "Коучинг опирается на данные воронки: без цифр не видно, где нужна помощь.",
      en: "Coaching relies on pipeline data: without numbers it is unclear where help is needed.",
    },
  },
];

/**
 * Specializations per doc §7.1. Note: the manager tracks lift team_coaching to 2.5 / 3.0 (doc §7.2, P16, within the
 * schema range 0–3 and the doc range 0.3–3.0). Gate skills (discovery, objection_handling, closing) stay ≥ 0.5 everywhere.
 */
export const specializations: SpecializationInput[] = [
  {
    slug: "retail",
    name: { uz: "Chakana savdo", ru: "Розничные продажи", en: "Retail" },
    description: {
      uz: "Doʻkon yoki savdo zalida xaridorga bevosita sotish.",
      ru: "Продажи покупателю напрямую в магазине или торговом зале.",
      en: "Selling directly to shoppers in a store or showroom.",
    },
    skillWeights: { product_knowledge: 1.3, presentation: 1.2, follow_up_retention: 1.2, pipeline_crm: 0.7, prospecting: 0.6 },
  },
  {
    slug: "b2b",
    name: { uz: "B2B savdo", ru: "B2B-продажи", en: "B2B" },
    description: {
      uz: "Kompaniyalarga sotish: uzun sikl, bir nechta qaror qabul qiluvchi.",
      ru: "Продажи компаниям: длинный цикл, несколько лиц, принимающих решение.",
      en: "Selling to companies: long cycles and several decision-makers.",
    },
    skillWeights: { discovery: 1.4, negotiation: 1.3, pipeline_crm: 1.3, prospecting: 1.2 },
  },
  {
    slug: "telephone_sales",
    name: { uz: "Telefon orqali savdo", ru: "Телефонные продажи", en: "Telephone sales" },
    description: {
      uz: "Qoʻngʻiroqlar orqali sotish: koʻp murojaat, qisqa suhbat, tez-tez rad javobi.",
      ru: "Продажи по телефону: много звонков, короткие разговоры, частые отказы.",
      en: "Selling over the phone: high call volume, short talks, frequent rejection.",
    },
    skillWeights: { emotional_resilience: 1.4, prospecting: 1.3, objection_handling: 1.3, negotiation: 0.7 },
  },
  {
    slug: "field_sales",
    name: { uz: "Dala savdosi", ru: "Выездные продажи", en: "Field sales" },
    description: {
      uz: "Mijozlarga borib sotish: doʻkonlar, ofislar, hududiy marshrutlar.",
      ru: "Продажи с выездом к клиентам: магазины, офисы, территориальные маршруты.",
      en: "Selling on site: visiting stores, offices and territory routes.",
    },
    skillWeights: { prospecting: 1.3, follow_up_retention: 1.2, emotional_resilience: 1.2 },
  },
  {
    slug: "sales_manager",
    name: { uz: "Savdo menejeri", ru: "Менеджер отдела продаж", en: "Sales manager" },
    description: {
      uz: "Kichik savdo jamoasiga rahbarlik qilish va oʻzi ham sotish.",
      ru: "Руководство небольшой командой продаж при собственных продажах.",
      en: "Leading a small sales team while still selling.",
    },
    skillWeights: { team_coaching: 2.5, pipeline_crm: 1.6, follow_up_retention: 1.1, closing: 0.9, prospecting: 0.8 },
  },
  {
    slug: "head_of_sales",
    name: { uz: "Savdo boʻlimi rahbari", ru: "Руководитель отдела продаж", en: "Head of sales" },
    description: {
      uz: "Savdo boʻlimi, uning jarayonlari va natijalari uchun javobgarlik.",
      ru: "Ответственность за отдел продаж, его процессы и результаты.",
      en: "Owning the sales department, its processes and results.",
    },
    skillWeights: {
      team_coaching: 3.0,
      pipeline_crm: 1.8,
      negotiation: 1.2,
      closing: 0.8,
      product_knowledge: 0.7,
      prospecting: 0.6,
    },
  },
];
