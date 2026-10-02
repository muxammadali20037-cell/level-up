import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `unit_economics` — stage 2. Keys: entrepreneur.unit_economics.NN */
export const questions: QuestionInput[] = [
  {
    key: "entrepreneur.unit_economics.01",
    skill: "unit_economics",
    specializations: [],
    type: "knowledge",
    targetLevel: 3,
    discrimination: 1.3,
    scoringRule: "single_best",
    prompt: {
      uz: "Mahsulotni 100 000 soʻmga sotasiz. Uning xarid narxi 60 000 soʻm, har bir buyurtmani yetkazish va qadoqlash 10 000 soʻm. Bitta sotuvdan qancha marja (qoplash summasi) qoladi?",
      ru: "Вы продаёте товар за 100 000 сум. Его закупочная цена — 60 000 сум, доставка и упаковка каждого заказа — 10 000 сум. Какая маржа (вклад) остаётся с одной продажи?",
      en: "You sell a product for 100,000 UZS. It costs 60,000 UZS to buy, and delivery plus packaging is 10,000 UZS per order. What contribution margin is left per sale?",
    },
    options: [
      { key: "a", label: { uz: "40 000 soʻm", ru: "40 000 сум", en: "40,000 UZS" }, score: 0 },
      { key: "b", label: { uz: "30 000 soʻm", ru: "30 000 сум", en: "30,000 UZS" }, score: 1 },
      { key: "c", label: { uz: "70 000 soʻm", ru: "70 000 сум", en: "70,000 UZS" }, score: 0 },
      { key: "d", label: { uz: "90 000 soʻm", ru: "90 000 сум", en: "90,000 UZS" }, score: 0 },
    ],
    explanation: {
      uz: "Har bir sotuv bilan bogʻliq barcha oʻzgaruvchan xarajatlar ayiriladi: 100 000 − 60 000 − 10 000 = 30 000 soʻm.",
      ru: "Вычитаются все переменные расходы, связанные с каждой продажей: 100 000 − 60 000 − 10 000 = 30 000 сум.",
      en: "Subtract every variable cost tied to each sale: 100,000 − 60,000 − 10,000 = 30,000 UZS.",
    },
  },
  {
    key: "entrepreneur.unit_economics.02",
    skill: "unit_economics",
    specializations: [],
    type: "scenario",
    targetLevel: 5,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Oʻtgan oy reklamaga 6 mln soʻm sarfladingiz va 40 ta yangi mijoz keldi. Hozircha har bir mijoz bitta xarid qilgan, bitta xariddan marja 120 000 soʻm.",
      ru: "В прошлом месяце вы потратили на рекламу 6 млн сум и получили 40 новых клиентов. Пока каждый клиент сделал одну покупку, маржа с одной покупки — 120 000 сум.",
      en: "Last month you spent 6 million UZS on ads and got 40 new customers. So far each customer has bought once, with a contribution margin of 120,000 UZS per purchase.",
    },
    prompt: {
      uz: "Bu raqamlar nimani koʻrsatadi va keyin nima qilish kerak?",
      ru: "О чём говорят эти цифры и что делать дальше?",
      en: "What do these numbers tell you, and what should you do next?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Reklama ishlayapti: 40 ta mijoz yaxshi natija, byudjetni ikki baravar oshirish kerak",
          ru: "Реклама работает: 40 клиентов — хороший результат, бюджет нужно удвоить",
          en: "The ads work: 40 customers is a good result, so double the budget",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Reklama zarar keltiryapti, uni butunlay toʻxtatish kerak",
          ru: "Реклама убыточна, её нужно полностью остановить",
          en: "The ads lose money, so stop advertising completely",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Tushum oʻsayotgan ekan, bitta mijozni jalb qilish narxi muhim emas",
          ru: "Пока выручка растёт, стоимость привлечения клиента не важна",
          en: "While revenue grows, the cost to acquire a customer does not matter",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Mijoz 150 000 soʻmga tushib, birinchi xariddan kam marja beradi — oshirishdan oldin qayta xaridni tekshirish",
          ru: "Клиент стоит 150 000 сум — больше маржи с первой покупки; до роста бюджета проверить повторные покупки",
          en: "Each customer costs 150,000 UZS, more than the first purchase earns; check repeat buying before scaling",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Jalb qilish narxi 6 000 000 / 40 = 150 000 soʻm, birinchi xarid marjasi esa 120 000. Mijozlar qayta xarid qilsa, kanal foydali boʻlishi mumkin, shuning uchun avval shuni oʻlchash kerak.",
      ru: "Стоимость привлечения — 6 000 000 / 40 = 150 000 сум, а маржа первой покупки — 120 000. Если клиенты покупают повторно, канал может окупаться, поэтому сначала нужно это измерить.",
      en: "Acquisition cost is 6,000,000 / 40 = 150,000 UZS versus 120,000 margin on the first purchase. If customers buy again the channel may pay off, so measure that first.",
    },
  },
  {
    key: "entrepreneur.unit_economics.03",
    skill: "unit_economics",
    specializations: [],
    type: "decision",
    targetLevel: 6,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Ikki reklama kanalini solishtiryapsiz. Har bir buyurtmadan marja ikkalasida ham 90 000 soʻm. Qolgan raqamlar jadvalda. Pul zaxirangiz cheklangan.",
      ru: "Вы сравниваете два рекламных канала. Маржа с одного заказа в обоих — 90 000 сум. Остальные цифры в таблице. Запас денег у вас ограничен.",
      en: "You are comparing two ad channels. Margin per order is 90,000 UZS in both. The other numbers are in the table. Your cash reserve is limited.",
    },
    media: {
      kind: "table",
      headers: [
        { uz: "Kanal", ru: "Канал", en: "Channel" },
        { uz: "Jalb qilish narxi, soʻm", ru: "Стоимость привлечения, сум", en: "Acquisition cost, UZS" },
        { uz: "Mijozga oʻrtacha buyurtmalar", ru: "Заказов на клиента в среднем", en: "Avg. orders per customer" },
      ],
      rows: [
        ["A", "80 000", "1"],
        ["B", "200 000", "4"],
      ],
    },
    prompt: {
      uz: "Byudjetni qanday taqsimlash eng toʻgʻri?",
      ru: "Как правильнее всего распределить бюджет?",
      en: "How should you allocate the budget?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "B ni pul imkon bergancha oshirish: mijoz foydaliroq, lekin xarajat bir necha oyda qaytadi",
          ru: "Масштабировать B в пределах денег: клиент выгоднее, но затраты окупаются за несколько месяцев",
          en: "Scale B within what cash allows: customers are worth more, but payback takes several months",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "A ni tanlash, chunki mijozni jalb qilish arzonroq",
          ru: "Выбрать A, потому что привлечение клиента дешевле",
          en: "Choose A because acquiring a customer is cheaper",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Butun byudjetni darhol B ga yoʻnaltirish",
          ru: "Сразу направить весь бюджет в B",
          en: "Move the entire budget to B right away",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Ikkala kanalda ham jalb qilish narxi 50 000 dan tushmaguncha kutish",
          ru: "Ждать, пока стоимость привлечения в обоих каналах не упадёт ниже 50 000",
          en: "Wait until acquisition cost falls below 50,000 in both channels",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "A: 90 000 − 80 000 = 10 000 soʻm, B: 4 × 90 000 − 200 000 = 160 000 soʻm. B foydaliroq, lekin pul sekin qaytadi — shuning uchun oʻsish pul zaxirasiga qarab chegaralanadi.",
      ru: "A: 90 000 − 80 000 = 10 000 сум, B: 4 × 90 000 − 200 000 = 160 000 сум. B выгоднее, но деньги возвращаются медленно — поэтому рост ограничен запасом денег.",
      en: "A: 90,000 − 80,000 = 10,000 UZS; B: 4 × 90,000 − 200,000 = 160,000 UZS. B is more profitable but pays back slowly, so growth must stay within available cash.",
    },
  },
  {
    key: "entrepreneur.unit_economics.04",
    skill: "unit_economics",
    specializations: [],
    type: "judgment",
    targetLevel: 8,
    scoringRule: "single_best",
    scenario: {
      uz: "Oʻrtacha hisobda mijoz qiymati uni jalb qilish narxidan ancha yuqori va unit-iqtisodiyot yaxshi koʻrinadi. Shunga qaramay, oxirgi oylarda foyda oʻsishi sekinlashdi.",
      ru: "В среднем ценность клиента намного выше стоимости его привлечения, и юнит-экономика выглядит хорошо. Тем не менее в последние месяцы рост прибыли замедлился.",
      en: "On average, customer lifetime value is well above acquisition cost and unit economics look healthy. Still, profit growth has slowed in recent months.",
    },
    prompt: {
      uz: "Yashirin muammoni qaysi tahlil eng yaxshi ochib beradi?",
      ru: "Какой анализ лучше всего покажет скрытую проблему?",
      en: "Which analysis best reveals the hidden problem?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Umumiy oʻrtacha koʻrsatkichni har oy aniqroq qayta hisoblash",
          ru: "Каждый месяц точнее пересчитывать общий средний показатель",
          en: "Recalculate the overall average more precisely each month",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Koʻrsatkichlarni boshqa kompaniyalarniki bilan solishtirish",
          ru: "Сравнить показатели с показателями других компаний",
          en: "Compare your figures with other companies' figures",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Mijozlarni kelgan oyi va kanali boʻyicha guruhlab solishtirish: yangilari yomonroq qaytib, qimmatroq tushishi mumkin",
          ru: "Разбить клиентов по месяцу и каналу привлечения: новые когорты могут хуже возвращаться и стоить дороже",
          en: "Split customers by start month and channel: newer cohorts may return less and cost more than the average shows",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Oʻrtacha unit-iqtisodiyot yaxshi ekan, umumiy tushumni oshirishga eʼtibor qaratish",
          ru: "Раз средняя юнит-экономика хорошая, сосредоточиться на росте общей выручки",
          en: "Since average unit economics are fine, focus on growing total revenue",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Oʻrtacha raqam eski, sodiq mijozlar hisobiga yaxshi koʻrinishi mumkin. Kogorta va kanal kesimidagi tahlil yangi mijozlar iqtisodiyoti yomonlashayotganini koʻrsatadi.",
      ru: "Среднее может хорошо выглядеть за счёт старых лояльных клиентов. Анализ по когортам и каналам показывает, что экономика новых клиентов ухудшается.",
      en: "An average can look good thanks to older loyal customers. Cohort and channel analysis shows whether the economics of new customers are getting worse.",
    },
  },
  {
    key: "entrepreneur.unit_economics.05",
    skill: "unit_economics",
    specializations: [],
    type: "self_report",
    targetLevel: 5,
    discrimination: 0.5,
    scoringRule: "likert",
    prompt: {
      uz: "Bitta mijozni jalb qilish narxi va bitta sotuvdan marjani qanchalik tez-tez hisoblaysiz?",
      ru: "Как часто вы считаете стоимость привлечения одного клиента и маржу с одной продажи?",
      en: "How often do you calculate the cost to acquire one customer and the margin per sale?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Bularni hali hisoblamaganman",
          ru: "Ещё ни разу не считал(а)",
          en: "I have not calculated them yet",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Biznes boshida bir marta hisoblaganman",
          ru: "Посчитал(а) один раз в начале бизнеса",
          en: "I calculated them once when I started",
        },
        score: 0.33,
      },
      {
        key: "c",
        label: {
          uz: "Narx yoki xarajatlar sezilarli oʻzgarganda qayta hisoblayman",
          ru: "Пересчитываю, когда заметно меняются цены или расходы",
          en: "I recalculate when prices or costs change noticeably",
        },
        score: 0.67,
      },
      {
        key: "d",
        label: {
          uz: "Har oy kanal yoki mahsulot kesimida kuzatib boraman",
          ru: "Отслеживаю каждый месяц в разрезе каналов или продуктов",
          en: "I track them monthly by channel or product",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Kanal va mahsulot kesimida muntazam kuzatish qaysi oʻsish foyda, qaysi biri zarar keltirishini vaqtida koʻrsatadi.",
      ru: "Регулярное отслеживание по каналам и продуктам вовремя показывает, какой рост приносит прибыль, а какой — убыток.",
      en: "Tracking regularly by channel and product shows in time which growth makes money and which loses it.",
    },
  },
];
