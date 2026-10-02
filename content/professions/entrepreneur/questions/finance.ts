import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `finance` — stage 2. Keys: entrepreneur.finance.NN */
export const questions: QuestionInput[] = [
  {
    key: "entrepreneur.finance.01",
    skill: "finance",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Kichik biznesda biznes pulini shaxsiy puldan alohida saqlash nima uchun muhim?",
      ru: "Почему в малом бизнесе важно держать деньги бизнеса отдельно от личных?",
      en: "Why should a small business keep business money separate from personal money?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Bu asosan bank va investorlarda yaxshi taassurot qoldirish uchun kerak",
          ru: "Это нужно в основном, чтобы произвести хорошее впечатление на банк и инвесторов",
          en: "It mostly helps make a good impression on banks and investors",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Faqat shunda biznesning oʻzi foyda keltiryaptimi yoki zarar, aniq koʻrinadi",
          ru: "Только так видно, приносит ли сам бизнес прибыль или убыток",
          en: "Only then can you see whether the business itself makes or loses money",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Bu xodimlar yollanganidan keyingina ahamiyatga ega boʻladi",
          ru: "Это становится важным только после найма сотрудников",
          en: "It only starts to matter once you hire employees",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Shunda egasi biznes tushumini hisob yuritmasdan sarflay oladi",
          ru: "Так владелец может тратить выручку бизнеса без учёта",
          en: "It lets the owner spend business income without keeping records",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Pullar aralashsa, biznes daromadi va xarajati shaxsiy xarajatlar orasida yoʻqoladi va haqiqiy foydani hisoblab boʻlmaydi.",
      ru: "Когда деньги смешаны, доходы и расходы бизнеса теряются среди личных трат, и реальную прибыль посчитать нельзя.",
      en: "When money is mixed, business income and costs get lost among personal spending, so real profit cannot be measured.",
    },
  },
  {
    key: "entrepreneur.finance.02",
    skill: "finance",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    discrimination: 1.3,
    scoringRule: "single_best",
    scenario: {
      uz: "Oʻtgan oyning foyda va zarar hisobotida 12 mln soʻm foyda chiqdi. Lekin hisobda deyarli pul yoʻq, taʼminotchilarga toʻlay olmayapsiz. Bir nechta yirik mijoz kechiktirib toʻlaydi, omborda esa yangi tovar koʻp.",
      ru: "По отчёту о прибылях и убытках за прошлый месяц прибыль — 12 млн сум. Но на счёте почти нет денег, и вы не можете заплатить поставщикам. Несколько крупных клиентов платят с отсрочкой, а на складе много нового товара.",
      en: "Last month the P&L shows a profit of 12 million UZS. Yet the account is almost empty and you cannot pay suppliers. Several large clients pay late, and the warehouse is full of new stock.",
    },
    prompt: {
      uz: "Bu holatning eng ehtimoliy sababi nima?",
      ru: "Какая причина такой ситуации наиболее вероятна?",
      en: "What is the most likely explanation?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Hisobotda xato bor: foydali biznesda pul tugab qolmaydi",
          ru: "В отчёте ошибка: у прибыльного бизнеса деньги не заканчиваются",
          en: "The report is wrong: a profitable business cannot run out of cash",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Narxlar juda past, ularni darhol oshirish kerak",
          ru: "Цены слишком низкие, их нужно срочно поднять",
          en: "Prices are too low and must be raised right away",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Foyda debitorlik qarzi va tovar zaxirasida turibdi — u hali pulga aylanmagan",
          ru: "Прибыль «заморожена» в дебиторке и товарных запасах — она ещё не стала деньгами",
          en: "The profit is tied up in receivables and stock — it has not turned into cash yet",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Yashirin xarajatlar bor, barcha xarajatlarni darhol qisqartirish kerak",
          ru: "Есть скрытые расходы, нужно срочно урезать все затраты",
          en: "There are hidden expenses, so all costs should be cut immediately",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Foyda — hisob koʻrsatkichi, pul oqimi esa boshqa narsa: sotuv yozilgan, lekin pul hali mijozlarda va omborda turibdi.",
      ru: "Прибыль — учётный показатель, а денежный поток — другое: продажи записаны, но деньги ещё у клиентов и на складе.",
      en: "Profit is an accounting figure, cash flow is another: sales are booked, but the money still sits with clients and in stock.",
    },
  },
  {
    key: "entrepreneur.finance.03",
    skill: "finance",
    specializations: [],
    type: "decision",
    targetLevel: 5,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Biznesingizning doimiy xarajatlari (ijara, maosh, kommunal) oyiga taxminan 40 mln soʻm. Har yili yozda tushum sezilarli kamayadi, qishda esa yuqori boʻladi. Hozir qish, hisobda yaxshi qoldiq bor.",
      ru: "Постоянные расходы бизнеса (аренда, зарплаты, коммуналка) — около 40 млн сум в месяц. Каждое лето выручка заметно падает, зимой — высокая. Сейчас зима, на счёте хороший остаток.",
      en: "Your fixed costs (rent, salaries, utilities) are about 40 million UZS a month. Every summer revenue drops noticeably; in winter it is high. It is winter now and the account balance is healthy.",
    },
    prompt: {
      uz: "Pul bilan bogʻliq qaysi qaror eng toʻgʻri?",
      ru: "Какое решение по деньгам самое правильное?",
      en: "Which money decision is best?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Yozda tushum tushganda bankdan kredit olishni rejalashtirish",
          ru: "Запланировать взять банковский кредит, когда летом упадёт выручка",
          en: "Plan to take a bank loan once summer revenue falls",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Qishki foydani kengayishga sarflab, yoz bu yil yaxshiroq boʻlishiga umid qilish",
          ru: "Вложить зимнюю прибыль в расширение и надеяться, что лето будет лучше",
          en: "Invest winter profit in expansion and hope this summer is better",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Yozda tushum tushmasligi uchun narxlarni pasaytirish",
          ru: "Снизить цены летом, чтобы выручка не падала",
          en: "Cut prices in summer to keep revenue from falling",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Bir necha oylik doimiy xarajatga teng zaxira ajratib, oylik pul oqimi rejasini tuzish",
          ru: "Отложить резерв на несколько месяцев постоянных расходов и составить помесячный план движения денег",
          en: "Set aside a reserve covering several months of fixed costs and build a monthly cash-flow plan",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Mavsumiy pasayish oldindan maʼlum, shuning uchun uni kuchli mavsumda yigʻilgan zaxira va reja bilan yopish arzonroq va xavfsizroq. Kredit ham yechim, lekin qimmatroq va kech.",
      ru: "Сезонный спад предсказуем, поэтому его дешевле и безопаснее закрыть резервом, накопленным в сильный сезон, и планом. Кредит — тоже выход, но дороже и позже.",
      en: "A seasonal dip is predictable, so covering it with a reserve built in the strong season and a plan is cheaper and safer. A loan also works, but costs more and comes late.",
    },
  },
  {
    key: "entrepreneur.finance.04",
    skill: "finance",
    specializations: [],
    type: "judgment",
    targetLevel: 7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Yirik mijoz shartnoma taklif qilmoqda: u oylik tushumingizni ikki baravar oshiradi, lekin toʻlov yetkazib berilgandan 90 kun keyin. Xomashyo va maoshlarni oldindan toʻlashingiz kerak. Joriy pul zaxirangiz taxminan 45 kunlik xarajatga yetadi.",
      ru: "Крупный клиент предлагает контракт: он удвоит вашу месячную выручку, но оплата — через 90 дней после поставки. Сырьё и зарплаты нужно оплачивать заранее. Текущего запаса денег хватит примерно на 45 дней расходов.",
      en: "A large client offers a contract that would double your monthly revenue, but payment comes 90 days after delivery. You must pay for materials and salaries upfront. Your current cash covers about 45 days of costs.",
    },
    prompt: {
      uz: "Eng toʻgʻri yondashuv qaysi?",
      ru: "Какой подход самый верный?",
      en: "What is the best approach?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Pul yetishmovchiligini haftama-hafta hisoblab, avans yoki qisqaroq muddat soʻrash, moliyani imzodan oldin hal qilish",
          ru: "Посчитать кассовый разрыв по неделям, договориться об авансе или меньшей отсрочке и найти финансирование до подписания",
          en: "Model the cash gap week by week, negotiate an advance or shorter terms, and secure funding before signing",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Darhol imzolash: ikki baravar tushum barcha muammolarni yopadi",
          ru: "Подписать сразу: удвоенная выручка покроет все проблемы",
          en: "Sign right away: doubled revenue will cover every problem",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Hajmning faqat joriy pulga sigʻadigan qismini olib, keyin oshirishni taklif qilish",
          ru: "Взять только ту часть объёма, которую выдержат текущие деньги, и предложить расти позже",
          en: "Take only the volume your current cash can carry and offer to scale up later",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Imzolab, farqni taʼminotchilarga toʻlovni kechiktirish hisobidan yopish",
          ru: "Подписать и закрыть разрыв за счёт задержки платежей поставщикам",
          en: "Sign and cover the gap by delaying payments to suppliers",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Foydali shartnoma ham pul yetishmovchiligi tufayli biznesni toʻxtatib qoʻyishi mumkin. Avval kassadagi uzilishni oʻlchab, uni shartlar yoki moliyalash bilan yopish kerak; hajmni cheklash xavfsiz, lekin imkoniyatni qisman yoʻqotadi.",
      ru: "Даже выгодный контракт может остановить бизнес из-за кассового разрыва. Сначала нужно измерить разрыв и закрыть его условиями или финансированием; ограничить объём безопасно, но часть возможности теряется.",
      en: "Even a profitable contract can stall a business through a cash gap. Measure the gap first and close it with terms or funding; limiting volume is safe but gives up part of the opportunity.",
    },
  },
  {
    key: "entrepreneur.finance.05",
    skill: "finance",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    discrimination: 0.7,
    scoringRule: "single_best",
    scenario: {
      uz: "Barqaror foyda keltirayotgan biznesingiz yangi yoʻnalish ochmoqchi. Mablagʻ uchun ikki yoʻl bor: bank krediti yoki ulush evaziga sherik olish.",
      ru: "Ваш стабильно прибыльный бизнес хочет открыть новое направление. Есть два пути финансирования: банковский кредит или партнёр за долю в бизнесе.",
      en: "Your steadily profitable business wants to launch a new line. There are two funding routes: a bank loan or a partner who takes an ownership stake.",
    },
    prompt: {
      uz: "Kredit va sherik oʻrtasida tanlashda qaysi tamoyil eng toʻgʻri?",
      ru: "Какой принцип лучше всего подходит для выбора между кредитом и партнёром?",
      en: "Which principle should guide the choice between a loan and a partner?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Kreditni tanlash: 100% egalikni saqlash qaytarish xavfidan muhimroq",
          ru: "Выбрать кредит: сохранить 100% владения важнее, чем риск выплат",
          en: "Choose the loan: keeping 100% ownership matters more than repayment risk",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Sherikni tanlash: qatʼiy toʻlovlar yoʻqligi biznesni har qanday holatda xavfsizroq qiladi",
          ru: "Выбрать партнёра: отсутствие фиксированных выплат делает бизнес безопаснее в любом случае",
          en: "Choose the partner: having no fixed repayments makes the business safer in any case",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Mablagʻni xavfga moslash: pul oqimi toʻlovni zaxira bilan yopsa — kredit, natija noaniq boʻlsa — ulush",
          ru: "Подбирать деньги под риск: если поток надёжно покрывает выплаты с запасом — кредит, если исход неясен — доля",
          en: "Match funding to risk: debt if cash flow covers repayments with a buffer, equity if the outcome is uncertain",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Toʻliq summani eng tez beradigan manbani tanlash, surʼatni yoʻqotmaslik uchun",
          ru: "Выбрать источник, который быстрее всего даст всю сумму, чтобы не потерять темп",
          en: "Pick whichever source can provide the full amount soonest to keep momentum",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Kredit qatʼiy toʻlov talab qiladi, shuning uchun bashorat qilinadigan pul oqimiga mos; ulush xavfni sherik bilan boʻlishadi, lekin egalik va nazoratni kamaytiradi — noaniq loyihalar uchun mosroq.",
      ru: "Кредит требует фиксированных выплат и подходит под предсказуемый денежный поток; доля делит риск с партнёром, но уменьшает владение и контроль — это уместнее для неопределённых проектов.",
      en: "A loan demands fixed repayments, so it suits predictable cash flow; equity shares the risk with a partner but dilutes ownership and control, which fits uncertain bets better.",
    },
  },
  {
    key: "entrepreneur.finance.06",
    skill: "finance",
    specializations: [],
    type: "self_report",
    targetLevel: 5,
    discrimination: 0.5,
    scoringRule: "likert",
    prompt: {
      uz: "Keyingi 1–3 oyda biznesingizda qancha pul boʻlishini qanday bilasiz?",
      ru: "Как вы узнаёте, сколько денег будет у бизнеса в ближайшие 1–3 месяца?",
      en: "How do you know how much cash your business will have over the next 1–3 months?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Biror narsaga toʻlash kerak boʻlganda hisobdagi qoldiqni koʻraman",
          ru: "Смотрю остаток на счёте, когда нужно что-то оплатить",
          en: "I check the balance when I need to pay for something",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Taxminan, xayolan hisoblayman",
          ru: "Прикидываю примерно, в уме",
          en: "I estimate it roughly in my head",
        },
        score: 0.33,
      },
      {
        key: "c",
        label: {
          uz: "Kutilayotgan tushum va toʻlovlarning oddiy roʻyxatini yuritaman",
          ru: "Веду простой список ожидаемых поступлений и платежей",
          en: "I keep a simple list of expected income and payments",
        },
        score: 0.67,
      },
      {
        key: "d",
        label: {
          uz: "Har hafta pul oqimi prognozini yangilab, uni haqiqiy natija bilan solishtiraman",
          ru: "Каждую неделю обновляю прогноз движения денег и сверяю его с фактом",
          en: "I update a cash-flow forecast every week and compare it with actuals",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Muntazam yangilanadigan va haqiqiy natija bilan solishtiriladigan pul oqimi prognozi kassadagi uzilishni oldindan koʻrish imkonini beradi.",
      ru: "Регулярно обновляемый прогноз движения денег, сверенный с фактом, позволяет увидеть кассовый разрыв заранее.",
      en: "A regularly updated cash-flow forecast checked against actuals lets you see a cash gap before it happens.",
    },
  },
];
