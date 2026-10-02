import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill `sales` (gate skill for L6+). Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "sales_review_lost_deals",
    skill: "sales",
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Oxirgi 5 ta yoʻqotilgan bitimni tahlil qiling",
      ru: "Разберите 5 последних упущенных сделок",
      en: "Review your last 5 lost deals",
    },
    description: {
      uz: "Soʻragan, lekin sotib olmagan oxirgi 5 mijozni yozing. Har biri uchun: qaysi bosqichda toʻxtadi (narx, ishonch, vaqt, javob kechikdi) va oʻzi qanday sabab aytdi. Eng koʻp takrorlangan sababni belgilang.",
      ru: "Выпишите 5 последних клиентов, которые интересовались, но не купили. Для каждого: на каком этапе остановился (цена, доверие, сроки, поздний ответ) и какую причину назвал. Отметьте самую частую причину.",
      en: "List the last 5 people who asked but did not buy. For each: where they stopped (price, trust, timing, slow reply) and the reason they gave. Mark the most frequent reason.",
    },
    successCriteria: {
      uz: "5 ta mijoz, toʻxtagan bosqich va sabab yozilgan; bitta takrorlanuvchi sabab belgilangan.",
      ru: "Записаны 5 клиентов с этапом и причиной; отмечена одна повторяющаяся причина.",
      en: "5 prospects recorded with stage and reason; one recurring reason marked.",
    },
    why: {
      uz: "Savdo koʻproq harakat bilan emas, mijozlar eng koʻp toʻxtaydigan joyni tuzatish bilan oʻsadi.",
      ru: "Продажи растут не от большего напора, а от исправления того места, где клиенты чаще всего уходят.",
      en: "Sales grow less from pushing harder and more from fixing the step where most buyers drop off.",
    },
    resources: [],
  },
  {
    slug: "sales_write_discovery_questions",
    skill: "sales",
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Narxdan oldin beriladigan 5 ta savol yozing",
      ru: "Напишите 5 вопросов, которые задаёте до цены",
      en: "Write 5 questions to ask before the price",
    },
    description: {
      uz: "Mijozning vaziyati, muammosi, muddati va qaror qabul qiluvchi haqida 5 ta ochiq savol yozing («Hozir buni qanday hal qilyapsiz?»). Hamkasb yoki doʻstingiz bilan 2 marta ovoz chiqarib mashq qiling.",
      ru: "Напишите 5 открытых вопросов о ситуации клиента, его проблеме, сроках и том, кто принимает решение («Как вы решаете это сейчас?»). Дважды отрепетируйте вслух с коллегой или другом.",
      en: "Write 5 open questions about the buyer's situation, problem, timing and who decides (\"How do you handle this today?\"). Rehearse them aloud twice with a colleague or friend.",
    },
    successCriteria: {
      uz: "5 ta ochiq savol yozilgan (ha/yoʻq bilan javob berilmaydi), 2 ta mashq oʻtkazilgan.",
      ru: "Записаны 5 открытых вопросов (не на «да/нет»), проведены 2 репетиции.",
      en: "5 open (not yes/no) questions written and 2 rehearsals done.",
    },
    why: {
      uz: "Ehtiyojni bilmasdan aytilgan narx qimmat koʻrinadi. Savollar taklifni mijozning muammosiga bogʻlaydi.",
      ru: "Цена, названная без понимания потребности, кажется высокой. Вопросы связывают предложение с проблемой клиента.",
      en: "A price named before you understand the need feels expensive. Questions tie your offer to the buyer's problem.",
    },
    resources: [],
  },
  {
    slug: "sales_follow_up_open_leads",
    skill: "sales",
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Javob bermagan barcha mijozlarga qayta yozing",
      ru: "Напишите повторно всем, кто не ответил",
      en: "Follow up with every lead who went quiet",
    },
    description: {
      uz: "Oxirgi 14 kunda soʻrov qoldirib, javob bermaganlarni toping. Har biriga shaxsiy xabar yozing: nimani soʻragani va aniq keyingi qadam (qoʻngʻiroq vaqti, namuna, toʻlov havolasi). Javoblarni jadvalga yozing.",
      ru: "Найдите всех, кто оставил запрос за последние 14 дней и пропал. Каждому — личное сообщение: что он спрашивал и конкретный следующий шаг (время звонка, образец, ссылка на оплату). Ответы занесите в таблицу.",
      en: "Find everyone who inquired in the last 14 days and went quiet. Send each a personal message: what they asked about and one concrete next step (call time, sample, payment link). Log the replies in a table.",
    },
    successCriteria: {
      uz: "Roʻyxatdagi har bir mijozga yozilgan, javoblar qayd etilgan, kamida 1 ta keyingi qadam kelishilgan.",
      ru: "Написано каждому из списка, ответы записаны, согласован хотя бы 1 следующий шаг.",
      en: "Every lead contacted, replies logged, at least 1 next step agreed.",
    },
    why: {
      uz: "Koʻp bitimlar «yoʻq» deyilgani uchun emas, hech kim qayta bogʻlanmagani uchun yoʻqoladi.",
      ru: "Многие сделки теряются не из-за отказа, а потому что никто не связался повторно.",
      en: "Many deals are lost not to a \"no\" but because nobody followed up.",
    },
    resources: [],
  },
  {
    slug: "sales_build_pipeline_table",
    skill: "sales",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Savdo voronkasi jadvalini tuzing",
      ru: "Соберите таблицу воронки продаж",
      en: "Build a sales pipeline table",
    },
    description: {
      uz: "Bosqichlarni belgilang: soʻrov → suhbat → taklif → toʻlov. Barcha faol bitimlarni jadvalga kiriting (mijoz, summa, bosqich, keyingi qadam sanasi). Oxirgi oy uchun har bosqichdan keyingisiga oʻtish foizini hisoblang.",
      ru: "Задайте этапы: запрос → разговор → предложение → оплата. Внесите все активные сделки (клиент, сумма, этап, дата следующего шага). Посчитайте конверсию между этапами за последний месяц.",
      en: "Define stages: inquiry → conversation → offer → payment. Enter every active deal (customer, amount, stage, next-step date). Calculate stage-to-stage conversion for the last month.",
    },
    successCriteria: {
      uz: "Barcha faol bitimlar jadvalda, har birida keyingi qadam sanasi bor; bosqichlar orasidagi konversiya hisoblangan.",
      ru: "Все активные сделки в таблице, у каждой есть дата следующего шага; конверсия между этапами посчитана.",
      en: "All active deals in the table with a next-step date; conversion between stages calculated.",
    },
    why: {
      uz: "Voronka savdoni sizning xotirangizdan tizimga oʻtkazadi va qaysi bosqich biznesni ushlab turganini koʻrsatadi.",
      ru: "Воронка переносит продажи из вашей памяти в систему и показывает, какой этап сдерживает бизнес.",
      en: "A pipeline moves sales out of your memory into a system and shows which stage is holding the business back.",
    },
    resources: [],
  },
  {
    slug: "sales_handover_script_test",
    skill: "sales",
    kind: "verify",
    phase: "verification",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Savdo skriptini xodimga topshirib sinab koʻring",
      ru: "Передайте скрипт продаж сотруднику и проверьте",
      en: "Hand your sales script to someone and test it",
    },
    description: {
      uz: "Suhbat tartibi, 5 ta savol va 3 ta asosiy eʼtirozga javoblarni bir sahifaga yozing. Xodim yoki hamkor 5 ta soʻrovni shu skript boʻyicha olib borsin. Uning konversiyasini sizniki bilan solishtiring.",
      ru: "Опишите на одной странице порядок разговора, 5 вопросов и ответы на 3 главных возражения. Пусть сотрудник или партнёр проведёт по скрипту 5 запросов. Сравните его конверсию со своей.",
      en: "Write one page: conversation order, 5 questions and answers to the 3 main objections. Have an employee or partner handle 5 inquiries with it. Compare their conversion with yours.",
    },
    successCriteria: {
      uz: "Skript yozilgan, boshqa odam 5 ta soʻrovni olib borgan, ikki konversiya solishtirilgan va skript yangilangan.",
      ru: "Скрипт написан, другой человек провёл 5 запросов, конверсии сравнены, скрипт обновлён.",
      en: "Script written, someone else handled 5 inquiries, conversions compared and the script updated.",
    },
    why: {
      uz: "Savdo faqat siz orqali ishlasa, biznes sizning vaqtingiz bilan cheklanadi. Boshqa odam sota olishi — tizim belgisi.",
      ru: "Если продажи идут только через вас, бизнес ограничен вашим временем. Продажи без вас — признак системы.",
      en: "If only you can sell, the business is capped by your time. Someone else selling with your method is a system.",
    },
    resources: [],
  },
];
