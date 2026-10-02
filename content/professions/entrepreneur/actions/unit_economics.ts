import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill `unit_economics`. Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "unit_economics_one_product_margin",
    skill: "unit_economics",
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Bitta mahsulotning marjasini hisoblang",
      ru: "Посчитайте маржу одного продукта",
      en: "Calculate the margin of one product",
    },
    description: {
      uz: "Eng koʻp sotiladigan mahsulotni oling. Narxidan har bir dona uchun toʻgʻridan-toʻgʻri xarajatlarni ayiring: xomashyo, qadoq, yetkazish, toʻlov tizimi komissiyasi, sotuvchi bonusi. Dona boshiga marjani soʻmda va foizda yozing.",
      ru: "Возьмите самый продаваемый продукт. Вычтите из цены прямые затраты на единицу: сырьё, упаковка, доставка, комиссия платёжной системы, бонус продавца. Запишите маржу на единицу в сумах и в процентах.",
      en: "Take your best-selling product. Subtract the direct costs per unit from the price: materials, packaging, delivery, payment fee, sales bonus. Write the margin per unit in som and as a percentage.",
    },
    successCriteria: {
      uz: "Barcha toʻgʻridan-toʻgʻri xarajatlar roʻyxati va dona boshiga marja (soʻm va %) yozilgan.",
      ru: "Записаны все прямые затраты и маржа на единицу (в сумах и %).",
      en: "All direct costs listed and per-unit margin written (som and %).",
    },
    why: {
      uz: "Har bir sotuv qancha pul qoldirishini bilmasdan, sotuvni oshirish zararni oshirishi mumkin.",
      ru: "Не зная, сколько оставляет каждая продажа, наращивание продаж может наращивать убыток.",
      en: "Without knowing what each sale leaves you, more sales can mean more losses.",
    },
    resources: [],
  },
  {
    slug: "unit_economics_rank_products_by_margin",
    skill: "unit_economics",
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "5 ta asosiy mahsulotni marja boʻyicha tartiblang",
      ru: "Ранжируйте 5 главных продуктов по марже",
      en: "Rank your top 5 products by margin",
    },
    description: {
      uz: "Eng koʻp sotiladigan 5 mahsulot uchun dona boshiga marjani hisoblang. Ularni tushum boʻyicha emas, oylik umumiy marja (marja × soni) boʻyicha tartiblang. Eng past marjali mahsulot uchun savol yozing: narx, xarajat yoki toʻxtatish?",
      ru: "Посчитайте маржу на единицу для 5 самых продаваемых продуктов. Ранжируйте их не по выручке, а по общей марже за месяц (маржа × количество). Для продукта с самой низкой маржой запишите вопрос: цена, затраты или снять?",
      en: "Calculate per-unit margin for your 5 best sellers. Rank them by total monthly margin (margin × units), not by revenue. For the lowest one write the question: price, cost or drop it?",
    },
    successCriteria: {
      uz: "5 ta mahsulot jadvali (marja, soni, umumiy marja) va eng zaif mahsulot boʻyicha savol tayyor.",
      ru: "Готова таблица 5 продуктов (маржа, количество, общая маржа) и вопрос по самому слабому.",
      en: "Table of 5 products (margin, units, total margin) and a question on the weakest one.",
    },
    why: {
      uz: "Eng koʻp tushum keltiradigan mahsulot har doim eng foydali boʻlmaydi. Tartib eʼtiborni pulni haqiqatan qoldiradigan joyga qaratadi.",
      ru: "Продукт с наибольшей выручкой не всегда самый прибыльный. Ранжирование направляет внимание туда, где реально остаются деньги.",
      en: "The top-revenue product is not always the most profitable. Ranking points attention to where money actually stays.",
    },
    resources: [],
  },
  {
    slug: "unit_economics_break_even_volume",
    skill: "unit_economics",
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Zararsizlik nuqtasini hisoblang",
      ru: "Рассчитайте точку безубыточности",
      en: "Calculate your break-even volume",
    },
    description: {
      uz: "Oylik doimiy xarajatlarni jamlang: ijara, maoshlar, kommunal, obunalar, egasi maoshi. Ularni dona boshiga oʻrtacha marjaga boʻling — bu oyiga kerakli sotuvlar soni. Oxirgi 3 oydagi haqiqiy sotuvlar bilan solishtiring.",
      ru: "Сложите постоянные расходы за месяц: аренда, зарплаты, коммунальные, подписки, зарплата владельца. Разделите на среднюю маржу на единицу — это нужное число продаж в месяц. Сравните с фактом за 3 месяца.",
      en: "Add up monthly fixed costs: rent, wages, utilities, subscriptions, owner's pay. Divide by the average margin per unit — that is the sales volume you need per month. Compare it with the last 3 months.",
    },
    successCriteria: {
      uz: "Zararsizlik hajmi hisoblangan va 3 oylik haqiqiy sotuvlar bilan solishtirilgan.",
      ru: "Объём безубыточности рассчитан и сравнён с фактическими продажами за 3 месяца.",
      en: "Break-even volume calculated and compared with 3 months of actual sales.",
    },
    why: {
      uz: "Bu raqam qancha sotish kerakligini aniq koʻrsatadi va narx, xarajat yoki hajm boʻyicha qarorlarga asos boʻladi.",
      ru: "Эта цифра показывает, сколько нужно продавать, и служит основой решений о цене, затратах и объёме.",
      en: "This number shows exactly how much you must sell and grounds decisions on price, cost and volume.",
    },
    resources: [],
  },
  {
    slug: "unit_economics_cac_payback",
    skill: "unit_economics",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Mijoz jalb qilish narxi va qoplanish muddatini toping",
      ru: "Найдите стоимость привлечения и срок окупаемости",
      en: "Find customer acquisition cost and payback",
    },
    description: {
      uz: "Oxirgi oydagi marketing va savdo sarfini yangi mijozlar soniga boʻling — bu CAC. Bitta mijozdan oyiga oʻrtacha marjani oʻz maʼlumotlaringizdan toping. CACni shu marjaga boʻlib, necha oyda qoplanishini hisoblang.",
      ru: "Разделите расходы на маркетинг и продажи за месяц на число новых клиентов — это CAC. По своим данным найдите среднюю маржу с клиента в месяц. Разделите CAC на неё — получите срок окупаемости в месяцах.",
      en: "Divide last month's marketing and sales spend by new customers — that is CAC. From your own data find average monthly margin per customer. Divide CAC by it to get payback in months.",
    },
    successCriteria: {
      uz: "CAC, mijoz boshiga oylik marja va qoplanish muddati oʻz maʼlumotlaringiz asosida hisoblangan.",
      ru: "CAC, месячная маржа на клиента и срок окупаемости рассчитаны по вашим данным.",
      en: "CAC, monthly margin per customer and payback calculated from your own data.",
    },
    why: {
      uz: "Mijoz boshiga marjani bilmay jalb qilishni kengaytirish zararni kengaytirishi mumkin. Qoplanish muddati qancha tez oʻsish mumkinligini koʻrsatadi.",
      ru: "Масштабировать привлечение без знания маржи на клиента — риск масштабировать убытки. Срок окупаемости показывает, как быстро можно расти.",
      en: "Scaling acquisition without knowing per-customer margin can scale losses. Payback shows how fast you can afford to grow.",
    },
    resources: [],
  },
  {
    slug: "unit_economics_one_page_card",
    skill: "unit_economics",
    kind: "verify",
    phase: "verification",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Bir sahifali unit-iqtisodiyot kartasini tekshirtiring",
      ru: "Соберите карточку юнит-экономики и дайте проверить",
      en: "Build a one-page unit economics card and get it checked",
    },
    description: {
      uz: "Bir sahifaga yozing: oʻrtacha chek, dona marjasi, CAC, takroriy xarid ulushi, mijozning umrbod qiymati (LTV) va LTV/CAC. Har raqam yoniga manbasini yozing. Hamkor yoki buxgalterdan raqamlarni manba bilan tekshirishni soʻrang.",
      ru: "На одной странице: средний чек, маржа на единицу, CAC, доля повторных покупок, пожизненная ценность клиента (LTV) и LTV/CAC. Рядом с каждой цифрой — её источник. Попросите партнёра или бухгалтера сверить цифры с источниками.",
      en: "On one page: average order, unit margin, CAC, repeat-purchase share, customer lifetime value (LTV) and LTV/CAC. Note the source next to each number. Ask a partner or accountant to check the numbers against the sources.",
    },
    successCriteria: {
      uz: "Kartada 6 ta raqam va ularning manbasi bor; boshqa odam tekshirgan va tuzatishlar kiritilgan.",
      ru: "В карточке 6 показателей с источниками; другой человек проверил, исправления внесены.",
      en: "Card has 6 numbers with sources; reviewed by another person and corrections made.",
    },
    why: {
      uz: "Raqamlar boshqa odam tekshirganda ishonchli boʻladi. Bu karta oʻsish qarorlari uchun yagona manba boʻlib xizmat qiladi.",
      ru: "Цифры становятся надёжными, когда их проверил другой человек. Карточка становится единым источником для решений о росте.",
      en: "Numbers become trustworthy when someone else checks them. The card becomes the single source for growth decisions.",
    },
    resources: [],
  },
];
