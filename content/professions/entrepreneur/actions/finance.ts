import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill `finance` (gate skill for every level from L2). Basics L1–4, advanced L4–8. No tax treatment advice. */
export const actions: ActionInput[] = [
  {
    slug: "finance_separate_owner_money",
    skill: "finance",
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Biznes va shaxsiy pulni ajrating",
      ru: "Разделите деньги бизнеса и личные",
      en: "Separate business and personal money",
    },
    description: {
      uz: "Oxirgi oyda biznes pulidan qilingan shaxsiy xarajatlarni yozing. Oʻzingizga oylik «egasi maoshi» summasini belgilang va qaysi kuni olishingizni yozing. Shundan keyin shaxsiy xarajatlar faqat shu summadan qilinadi.",
      ru: "Выпишите личные расходы, оплаченные из денег бизнеса за последний месяц. Назначьте себе ежемесячную «зарплату владельца» и день её выплаты. Дальше личные траты — только из этой суммы.",
      en: "List last month's personal expenses paid with business money. Set yourself a fixed monthly owner's pay and the day you take it. From now on, personal spending comes only from that amount.",
    },
    successCriteria: {
      uz: "Shaxsiy xarajatlar roʻyxati bor; egasi maoshi summasi va sanasi yozib qoʻyilgan.",
      ru: "Есть список личных трат; сумма и дата зарплаты владельца записаны.",
      en: "Personal-expense list done; owner's pay amount and date written down.",
    },
    why: {
      uz: "Pullar aralashsa, biznes foyda keltiryaptimi yoki yoʻqmi — bilib boʻlmaydi. Bu boshqa barcha moliyaviy raqamlarning asosi.",
      ru: "Пока деньги смешаны, невозможно понять, прибыльный ли бизнес. Это основа всех остальных финансовых цифр.",
      en: "While money is mixed you cannot tell whether the business makes a profit. This is the base for every other financial number.",
    },
    resources: [],
  },
  {
    slug: "finance_weekly_cash_table",
    skill: "finance",
    kind: "practice",
    phase: "practice",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Haftalik daromad/xarajat jadvalini tuzing",
      ru: "Составьте недельную таблицу доходов и расходов",
      en: "Build a weekly income and expense table",
    },
    description: {
      uz: "Ustunlar: sana, kirim, chiqim, toifa, qoldiq. Oxirgi 7 kundagi barcha toʻlovlarni kiriting: naqd, karta, Click/Payme, bank. Hafta oxiridagi qoldiq kassa va hisobdagi haqiqiy pul bilan mos kelishini tekshiring.",
      ru: "Столбцы: дата, приход, расход, категория, остаток. Внесите все платежи за 7 дней: наличные, карта, Click/Payme, банк. Проверьте, что остаток на конец недели совпадает с реальными деньгами в кассе и на счетах.",
      en: "Columns: date, money in, money out, category, balance. Enter every payment from the last 7 days: cash, card, Click/Payme, bank. Check that the closing balance matches the real money in the till and accounts.",
    },
    successCriteria: {
      uz: "7 kunlik jadval toʻldirilgan va yakuniy qoldiq haqiqiy pul bilan solishtirilgan.",
      ru: "Таблица за 7 дней заполнена, итоговый остаток сверен с реальными деньгами.",
      en: "7-day table complete and the closing balance reconciled with real money.",
    },
    why: {
      uz: "Pul oqimini haftalik koʻrish kassadagi kamomadni oy oxirida emas, oldindan sezishga imkon beradi.",
      ru: "Еженедельный взгляд на денежный поток позволяет заметить нехватку денег заранее, а не в конце месяца.",
      en: "Seeing cash weekly lets you spot a shortfall early instead of at month end.",
    },
    resources: [],
  },
  {
    slug: "finance_limit_top_expenses",
    skill: "finance",
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "5 ta eng katta xarajatga oylik limit qoʻying",
      ru: "Установите лимиты на 5 крупнейших расходов",
      en: "Set limits on your 5 biggest expenses",
    },
    description: {
      uz: "Oxirgi oy yozuvlaridan eng katta 5 xarajat moddasini toping (ijara, xomashyo, maosh, yetkazish, reklama). Har biriga oylik limit belgilang va qachon tekshirishingizni yozing. Bittasini kamaytirish yoʻlini bugun boshlang.",
      ru: "По записям прошлого месяца найдите 5 крупнейших статей расходов (аренда, сырьё, зарплаты, доставка, реклама). Для каждой задайте месячный лимит и дату проверки. Начните сегодня сокращать одну из них.",
      en: "From last month's records find the 5 largest expense lines (rent, materials, wages, delivery, ads). Set a monthly limit for each and a check date. Start reducing one of them today.",
    },
    successCriteria: {
      uz: "5 ta modda, ularning limiti va tekshirish sanasi yozilgan; bittasi boʻyicha aniq qadam qoʻyilgan.",
      ru: "Записаны 5 статей, их лимиты и даты проверки; по одной сделан конкретный шаг.",
      en: "5 lines with limits and check dates recorded; a concrete step taken on one.",
    },
    why: {
      uz: "Xarajatlarning asosiy qismi odatda bir necha moddada boʻladi. Limitlar qarorlarni his-tuygʻuga emas, raqamga bogʻlaydi.",
      ru: "Основная часть расходов обычно сосредоточена в нескольких статьях. Лимиты привязывают решения к цифрам, а не к ощущениям.",
      en: "Most spending usually sits in a few lines. Limits tie decisions to numbers instead of feelings.",
    },
    resources: [],
  },
  {
    slug: "finance_13_week_cash_forecast",
    skill: "finance",
    kind: "apply",
    phase: "application",
    durationMinutes: 60,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "13 haftalik pul oqimi prognozini tuzing",
      ru: "Составьте прогноз денежного потока на 13 недель",
      en: "Build a 13-week cash flow forecast",
    },
    description: {
      uz: "Har hafta uchun kutilayotgan kirimni (mijozlar haqiqatda toʻlaydigan sana boʻyicha) va chiqimni yozing: ijara, maoshlar, yetkazib beruvchilar, soliq va kredit toʻlovlari. Qoldigʻi eng past haftani toping va unga oldindan chora yozing.",
      ru: "По каждой неделе запишите ожидаемый приход (по датам, когда клиенты реально платят) и расход: аренда, зарплаты, поставщики, налоговые и кредитные платежи. Найдите неделю с минимальным остатком и заранее запишите меры.",
      en: "For each week enter expected inflows (by the date customers actually pay) and outflows: rent, wages, suppliers, tax and loan payments. Find the week with the lowest balance and write a plan for it in advance.",
    },
    successCriteria: {
      uz: "13 haftalik jadval tayyor, eng past qoldiqli hafta va unga chora aniqlangan.",
      ru: "Таблица на 13 недель готова, неделя с минимальным остатком и меры определены.",
      en: "13-week table ready; lowest-balance week and its countermeasure identified.",
    },
    why: {
      uz: "Foydali biznes ham pul tugashi sababli toʻxtashi mumkin. Prognoz kamomadni u kelishidan oldin koʻrsatadi.",
      ru: "Даже прибыльный бизнес может встать из-за нехватки денег. Прогноз показывает кассовый разрыв до того, как он наступит.",
      en: "Even a profitable business can stall when cash runs out. A forecast shows the gap before it arrives.",
    },
    resources: [],
  },
  {
    slug: "finance_monthly_pnl_vs_cash",
    skill: "finance",
    kind: "verify",
    phase: "verification",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Oylik foyda hisobotini tuzib, pul bilan solishtiring",
      ru: "Составьте P&L за месяц и сверьте с деньгами",
      en: "Build a monthly P&L and compare it with cash",
    },
    description: {
      uz: "Oʻtgan oy uchun: tushum, toʻgʻridan-toʻgʻri xarajatlar, yalpi foyda, doimiy xarajatlar, sof foyda. Keyin sof foydani hisobdagi pul oʻzgarishi bilan solishtiring va farqni tushuntiring: debitorlik qarzi, zaxira, qarz toʻlovlari.",
      ru: "За прошлый месяц: выручка, прямые затраты, валовая прибыль, постоянные расходы, чистая прибыль. Затем сравните чистую прибыль с изменением денег на счетах и объясните разницу: дебиторка, запасы, выплаты по долгам.",
      en: "For last month: revenue, direct costs, gross profit, fixed costs, net profit. Then compare net profit with the change in cash and explain the difference: receivables, stock, debt repayments.",
    },
    successCriteria: {
      uz: "Foyda hisoboti tayyor va foyda bilan pul oʻzgarishi orasidagi farq yozma tushuntirilgan.",
      ru: "P&L готов, разница между прибылью и изменением денег объяснена письменно.",
      en: "P&L done and the gap between profit and the change in cash explained in writing.",
    },
    why: {
      uz: "Foyda va pul — har xil narsa. Ikkalasini bogʻlay olish moliyaviy boshqaruvning asosiy belgisi va unit-iqtisodiyot uchun zarur shart.",
      ru: "Прибыль и деньги — разные вещи. Умение связать их — главный признак управления финансами и условие для юнит-экономики.",
      en: "Profit and cash are different things. Linking them is the core of financial management and a prerequisite for unit economics.",
    },
    resources: [],
  },
];
