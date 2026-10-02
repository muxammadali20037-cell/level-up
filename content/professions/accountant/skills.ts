import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** Doc §10.3. Gate skills: K1 double_entry_bookkeeping · K2 financial_statements · K3 accuracy_controls. */
export const skills: SkillInput[] = [
  {
    slug: "accounting_principles",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.13,
    name: { uz: "Buxgalteriya hisobi asoslari", ru: "Основы бухгалтерского учёта", en: "Accounting principles" },
    description: {
      uz: "Hisoblash usuli, daromad va xarajatlar muvofiqligi, aktiv, majburiyat, kapital va buxgalteriya tenglamasi.",
      ru: "Метод начисления, соответствие доходов и расходов, активы, обязательства, капитал и бухгалтерское уравнение.",
      en: "Accrual, matching, assets/liabilities/equity and the accounting equation.",
    },
  },
  {
    slug: "double_entry_bookkeeping",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.13,
    name: { uz: "Ikki yoqlama yozuv", ru: "Двойная запись", en: "Double-entry bookkeeping" },
    description: {
      uz: "Odatiy xoʻjalik operatsiyalari uchun debet va kredit yozuvlarini toʻgʻri tuzish.",
      ru: "Правильные проводки по дебету и кредиту для типовых хозяйственных операций.",
      en: "Posting correct debit/credit entries for typical business transactions.",
    },
  },
  {
    slug: "primary_documents",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: {
      uz: "Birlamchi hujjatlar va solishtirish",
      ru: "Первичные документы и сверка",
      en: "Primary documents & reconciliation",
    },
    description: {
      uz: "Hisob-fakturalar, cheklar, bank koʻchirmalari va ularni hisob registrlari bilan solishtirish.",
      ru: "Счета-фактуры, чеки, банковские выписки и их сверка с учётными регистрами.",
      en: "Invoices, receipts, bank statements; reconciling them with the ledger.",
    },
  },
  {
    slug: "taxation",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.11,
    name: { uz: "Soliqqa tortish", ru: "Налогообложение", en: "Taxation" },
    description: {
      uz: "Soliq tushunchalari, soliq bazasi, soliqni hisoblash va hisobot topshirish mantigʻi (mamlakatga bogʻliq).",
      ru: "Налоговые понятия, налоговая база, начисление и логика сдачи отчётности (с учётом юрисдикции).",
      en: "Tax concepts, tax base, accrual and filing logic (jurisdiction-aware).",
    },
  },
  {
    slug: "payroll",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.08,
    name: { uz: "Ish haqi hisob-kitobi", ru: "Расчёт заработной платы", en: "Payroll" },
    description: {
      uz: "Hisoblangan ish haqidan qoʻlga beriladigan summagacha hisob-kitob, ushlanmalar va tegishli yozuvlar.",
      ru: "Расчёт от начисленной зарплаты до суммы к выплате, удержания и связанные проводки.",
      en: "Calculating gross-to-net pay, deductions and related postings.",
    },
  },
  {
    slug: "financial_statements",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.12,
    name: { uz: "Moliyaviy hisobotlar", ru: "Финансовая отчётность", en: "Financial statements" },
    description: {
      uz: "Buxgalteriya balansi, foyda va zararlar hamda pul oqimlari hisobotlarini tuzish va oʻqish.",
      ru: "Составление и чтение баланса, отчёта о прибылях и убытках и отчёта о движении денежных средств.",
      en: "Preparing and reading balance sheet, P&L and cash-flow statement.",
    },
  },
  {
    slug: "management_accounting",
    globalSkillKey: "finance_literacy",
    kind: "hard",
    importance: 0.09,
    name: { uz: "Boshqaruv hisobi va tahlil", ru: "Управленческий учёт и анализ", en: "Management accounting & analysis" },
    description: {
      uz: "Qaror qabul qilish uchun tannarx, byudjet, marja va ogʻishlar tahlili.",
      ru: "Себестоимость, бюджеты, маржа и анализ отклонений для принятия решений.",
      en: "Costing, budgets, margins and variance analysis for decisions.",
    },
  },
  {
    slug: "accounting_software",
    globalSkillKey: "digital_tools",
    kind: "hard",
    importance: 0.08,
    name: {
      uz: "Buxgalteriya dasturlari va jadvallar",
      ru: "Учётные программы и таблицы",
      en: "Accounting software & spreadsheets",
    },
    description: {
      uz: "Buxgalteriya tizimlari va elektron jadvallarda aniq va tez ishlash.",
      ru: "Точная и быстрая работа в учётных системах и электронных таблицах.",
      en: "Working accurately in accounting systems and spreadsheets.",
    },
  },
  {
    slug: "accuracy_controls",
    globalSkillKey: null,
    kind: "meta",
    importance: 0.08,
    name: { uz: "Aniqlik va ichki nazorat", ru: "Точность и внутренний контроль", en: "Accuracy & internal control" },
    description: {
      uz: "Tekshiruvlar, vazifalarni ajratish va xatolarni tarqalib ketmasidan oldin aniqlash.",
      ru: "Проверки, разделение обязанностей и выявление ошибок до того, как они распространятся.",
      en: "Checks, segregation of duties and catching errors before they spread.",
    },
  },
  {
    slug: "professional_ethics",
    globalSkillKey: "ethics_compliance",
    kind: "meta",
    importance: 0.08,
    name: {
      uz: "Kasbiy etika va qonunga rioya",
      ru: "Профессиональная этика и комплаенс",
      en: "Professional ethics & compliance",
    },
    description: {
      uz: "Maxfiylik, mustaqillik va notoʻgʻri talablarni rad eta olish.",
      ru: "Конфиденциальность, независимость и умение отказать в неправомерной просьбе.",
      en: "Confidentiality, independence and refusing improper requests.",
    },
  },
];

/** Doc §10.4. */
export const edges: EdgeInput[] = [
  {
    from: "accounting_principles",
    to: "double_entry_bookkeeping",
    relation: "prerequisite",
    strength: 0.9,
    rationale: {
      uz: "Har bir yozuv buxgalteriya tenglamasini qoʻllaydi — asoslarsiz yozuvlar taxminga aylanadi.",
      ru: "Каждая проводка применяет бухгалтерское уравнение — без основ проводки превращаются в догадки.",
      en: "Every entry applies the accounting equation — without the basics, postings turn into guesswork.",
    },
  },
  {
    from: "double_entry_bookkeeping",
    to: "financial_statements",
    relation: "prerequisite",
    strength: 0.9,
    rationale: {
      uz: "Hisobotlar toʻgʻri yuritilgan registrlardan tuziladi — yozuvdagi xato hisobotga ham koʻchadi.",
      ru: "Отчётность строится на верно ведённых регистрах — ошибка в проводке переходит в отчёт.",
      en: "Statements are built from correct ledgers — a posting error carries straight into the report.",
    },
  },
  {
    from: "accounting_principles",
    to: "taxation",
    relation: "prerequisite",
    strength: 0.5,
    rationale: {
      uz: "Soliq bazasi buxgalteriya koʻrsatkichlaridan boshlanadi — ularni tushunmasdan soliqni toʻgʻri hisoblash qiyin.",
      ru: "Налоговая база начинается с учётных показателей — без их понимания налог трудно посчитать верно.",
      en: "Tax bases start from accounting figures — without understanding them, tax is hard to get right.",
    },
  },
  {
    from: "financial_statements",
    to: "management_accounting",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Tahlil ishonchli hisobotlarga tayanadi — notoʻgʻri raqamlardan chiqarilgan xulosa ham notoʻgʻri boʻladi.",
      ru: "Анализ опирается на надёжную отчётность — выводы из неверных цифр тоже неверны.",
      en: "Analysis needs reliable statements — conclusions drawn from wrong figures are wrong too.",
    },
  },
  {
    from: "primary_documents",
    to: "double_entry_bookkeeping",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Yozuv toʻgʻri tuzilgan boʻlsa ham, hujjat xato yoki yoʻq boʻlsa, hisob baribir notoʻgʻri chiqadi.",
      ru: "Даже правильная проводка неверна, если документ за ней ошибочный или отсутствует.",
      en: "Even a correct posting is wrong if the document behind it is wrong or missing.",
    },
  },
  {
    from: "accuracy_controls",
    to: "financial_statements",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Hisobotlar toʻliq koʻrinadi, lekin ichida aniqlanmagan xatolar qolib ketadi.",
      ru: "Отчётность выглядит полной, но в ней остаются невыявленные ошибки.",
      en: "Statements look complete but contain undetected errors.",
    },
  },
  {
    from: "accuracy_controls",
    to: "taxation",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Soliq boʻyicha bilim bor, lekin hisob-kitobdagi xatolar uning foydasini yoʻqqa chiqaradi.",
      ru: "Знание налогов есть, но ошибки в расчётах сводят его пользу на нет.",
      en: "Tax knowledge is undermined by calculation errors.",
    },
  },
  {
    from: "professional_ethics",
    to: "taxation",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Etikaga tayanmagan soliq bilimi ish beruvchi uchun huquqiy xavf tugʻdiradi.",
      ru: "Налоговая экспертиза без этики создаёт юридический риск для работодателя.",
      en: "Tax expertise without ethics creates legal risk for the employer.",
    },
  },
  {
    from: "taxation",
    to: "payroll",
    relation: "enables",
    strength: 0.5,
    rationale: {
      uz: "Ish haqidan ushlanmalar soliq mantigʻiga asoslanadi — soliqni tushunish hisob-kitobni osonlashtiradi.",
      ru: "Удержания из зарплаты следуют налоговой логике — понимание налогов упрощает расчёт.",
      en: "Payroll deductions follow tax logic — understanding tax makes payroll easier.",
    },
  },
  {
    from: "accounting_software",
    to: "primary_documents",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Dasturlar hujjatlarni solishtirish va moslashtirishni tezlashtiradi.",
      ru: "Учётные системы ускоряют сопоставление документов и сверку.",
      en: "Systems make matching and reconciliation faster.",
    },
  },
];

/**
 * Doc §10.2 (weights copied exactly; several exceed the 0.5–1.6 authoring hint because the canonical doc
 * allows 0.3–3.0). Gate skills stay ≥ 0.5 in every specialization (doc §2.3).
 */
export const specializations: SpecializationInput[] = [
  {
    slug: "bookkeeping",
    name: { uz: "Buxgalteriya yuritish", ru: "Ведение учёта", en: "Bookkeeping" },
    description: {
      uz: "Birlamchi hujjatlar, kundalik yozuvlar va dasturda toʻgʻri hisob yuritish.",
      ru: "Первичные документы, ежедневные проводки и аккуратный учёт в программе.",
      en: "Primary documents, daily entries and accurate records in the system.",
    },
    skillWeights: {
      primary_documents: 1.4,
      double_entry_bookkeeping: 1.3,
      accounting_software: 1.3,
      management_accounting: 0.6,
    },
  },
  {
    slug: "tax_accounting",
    name: { uz: "Soliq hisobi", ru: "Налоговый учёт", en: "Tax accounting" },
    description: {
      uz: "Soliq bazasini aniqlash, soliqlarni hisoblash va hisobotlarni oʻz vaqtida topshirish.",
      ru: "Определение налоговой базы, расчёт налогов и своевременная сдача отчётности.",
      en: "Determining tax bases, calculating taxes and filing on time.",
    },
    skillWeights: {
      taxation: 2.0,
      professional_ethics: 1.3,
      payroll: 1.1,
      management_accounting: 0.6,
    },
  },
  {
    slug: "payroll",
    name: { uz: "Ish haqi hisobi", ru: "Расчёт зарплаты", en: "Payroll" },
    description: {
      uz: "Ish haqini hisoblash, ushlanmalar, toʻlovlar va ular boʻyicha yozuvlar.",
      ru: "Начисление зарплаты, удержания, выплаты и связанные проводки.",
      en: "Calculating pay, deductions, payouts and the related entries.",
    },
    skillWeights: {
      payroll: 2.5,
      taxation: 1.3,
      primary_documents: 1.1,
      financial_statements: 0.7,
      management_accounting: 0.5,
    },
  },
  {
    slug: "financial_reporting",
    name: {
      uz: "Moliyaviy hisobot (IFRS)",
      ru: "Финансовая отчётность (МСФО)",
      en: "Financial reporting (IFRS)",
    },
    description: {
      uz: "Davr yopilishi, moliyaviy hisobotlarni tuzish va ularning ishonchliligini taʼminlash.",
      ru: "Закрытие периода, составление финансовой отчётности и обеспечение её достоверности.",
      en: "Period close, preparing financial statements and keeping them reliable.",
    },
    skillWeights: {
      financial_statements: 1.8,
      accounting_principles: 1.3,
      accuracy_controls: 1.2,
      payroll: 0.6,
    },
  },
  {
    slug: "management_accounting",
    name: { uz: "Boshqaruv hisobi", ru: "Управленческий учёт", en: "Management accounting" },
    description: {
      uz: "Tannarx, byudjet va tahlil orqali rahbariyatga qaror qabul qilishda yordam berish.",
      ru: "Помощь руководству в решениях через себестоимость, бюджеты и анализ.",
      en: "Supporting management decisions through costing, budgets and analysis.",
    },
    skillWeights: {
      management_accounting: 2.0,
      financial_statements: 1.2,
      taxation: 0.7,
      payroll: 0.5,
    },
  },
];
