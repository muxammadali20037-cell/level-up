import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill "communication". Basics L1–4: foundation, practice, verification; advanced L4–8: application, verification. */
export const actions: ActionInput[] = [
  {
    slug: "com_audit_task_messages",
    skill: "communication",
    title: {
      uz: "Oxirgi 5 ta topshiriq xabaringizni tahlil qiling",
      ru: "Разберите 5 своих последних сообщений с задачами",
      en: "Review your last 5 task messages",
    },
    description: {
      uz: "Jamoaga yozgan oxirgi 5 ta topshiriq xabarini oching. Har birini tekshiring: natija aniqmi, muddat bormi, masʼul kim, savol berish imkoni bormi. Qaysi qism eng koʻp yetishmasligini sanang.",
      ru: "Откройте 5 последних сообщений с задачами для команды. Проверьте каждое: ясен ли результат, есть ли срок, кто ответственный, понятно ли, куда задать вопрос. Посчитайте, чего не хватает чаще всего.",
      en: "Open the last 5 task messages you sent the team. Check each: is the outcome clear, is there a deadline, who owns it, is there a way to ask questions? Count which part is missing most often.",
    },
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "5 ta xabar tekshirilgan; eng koʻp yetishmaydigan qism aniqlangan.",
      ru: "5 сообщений проверены; найден элемент, которого чаще всего не хватает.",
      en: "5 messages checked; the most frequently missing element identified.",
    },
    why: {
      uz: "Noaniq xabar qayta ishlash, kechikish va keraksiz kelishmovchiliklarga olib keladi. Oʻz xabarlaringizni koʻrish — tuzatishning birinchi qadami.",
      ru: "Нечёткие сообщения ведут к переделкам, задержкам и лишним конфликтам. Посмотреть на свои сообщения — первый шаг к исправлению.",
      en: "Unclear messages cause rework, delays and needless friction. Looking at your own messages is the first step to fixing that.",
    },
    resources: [],
  },
  {
    slug: "com_short_status_update",
    skill: "communication",
    title: {
      uz: "5 qatorli haftalik holat xabarini yozing",
      ru: "Напишите недельный статус в 5 строк",
      en: "Write a 5-line weekly status update",
    },
    description: {
      uz: "Rahbaringiz yoki jamoa uchun 5 qatordan oshmaydigan xabar yozing: nima bajarildi, nima kechikmoqda va nega, qanday yordam kerak, keyingi hafta nima boʻladi. Asosiy xulosani birinchi qatorga qoʻying.",
      ru: "Напишите для руководителя или команды сообщение не длиннее 5 строк: что сделано, что задерживается и почему, какая нужна помощь, что будет на следующей неделе. Главный вывод — в первой строке.",
      en: "Write a message of at most 5 lines for your boss or team: what's done, what's late and why, what help you need, what's next week. Put the main takeaway in the first line.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Xabar 5 qatordan oshmaydi; birinchi qator — asosiy xulosa; kechikish sababi bilan yozilgan.",
      ru: "Сообщение не длиннее 5 строк; первая строка — главный вывод; задержки указаны с причинами.",
      en: "At most 5 lines; first line is the takeaway; delays come with reasons.",
    },
    why: {
      uz: "Rahbar faqat pastga emas, yuqoriga va yon tomonga ham muloqot qiladi. Qisqa va oʻz vaqtidagi xabar kutilmagan holatlarning oldini oladi.",
      ru: "Руководитель общается не только вниз, но и вверх и по горизонтали. Короткий своевременный статус предотвращает неприятные сюрпризы.",
      en: "Managers communicate up and across, not just down. A short, timely update prevents unpleasant surprises.",
    },
    resources: [],
  },
  {
    slug: "com_confirm_meeting_outcomes",
    skill: "communication",
    title: {
      uz: "Majlis xulosasini ishtirokchilar bilan tasdiqlang",
      ru: "Подтвердите итоги встречи с участниками",
      en: "Confirm meeting outcomes with attendees",
    },
    description: {
      uz: "Keyingi majlisdan soʻng kelishuvlarni (kim, nima, qachon) 3–5 qatorda yozib, ishtirokchilarga yuboring. Har biridan tasdiq yoki tuzatish soʻrang. Nechta tuzatish kelganini sanang.",
      ru: "После следующей встречи запишите договорённости (кто, что, когда) в 3–5 строк и отправьте участникам. Попросите каждого подтвердить или поправить. Посчитайте, сколько пришло правок.",
      en: "After your next meeting, write the agreements (who, what, when) in 3–5 lines and send them to attendees. Ask each to confirm or correct. Count how many corrections came back.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Xulosa yuborildi; barcha ishtirokchilar tasdiqladi yoki tuzatishlar kiritildi; tuzatishlar soni yozilgan.",
      ru: "Итоги отправлены; все подтвердили или правки внесены; число правок записано.",
      en: "Summary sent; everyone confirmed or corrections were made; the number of corrections is noted.",
    },
    why: {
      uz: "Yozma tasdiq odamlar bir xil narsani tushunmaganini ish boshlanmasdan oldin koʻrsatadi. Tuzatishlar soni — muloqotingiz aniqligining oddiy oʻlchovi.",
      ru: "Письменное подтверждение показывает разное понимание до начала работы. Число правок — простая мера ясности вашей коммуникации.",
      en: "Written confirmation reveals different understandings before work starts. The number of corrections is a simple measure of your clarity.",
    },
    resources: [],
  },
  {
    slug: "com_deliver_hard_news",
    skill: "communication",
    title: {
      uz: "Noxush oʻzgarishni jamoaga rejali tarzda eʼlon qiling",
      ru: "Спланируйте и объявите команде неприятное изменение",
      en: "Plan and announce an unwelcome change",
    },
    description: {
      uz: "Jamoaga yoqmasligi mumkin boʻlgan bitta yangilikni tanlang. Oldindan yozing: nima oʻzgaradi, nega, ular uchun nima oʻzgaradi, nima oʻzgarmaydi. Uni yuzma-yuz eʼlon qiling va savollarga vaqt ajrating.",
      ru: "Выберите одну новость, которая может не понравиться команде. Заранее запишите: что меняется, почему, что меняется для них, что остаётся прежним. Объявите лично и оставьте время на вопросы.",
      en: "Pick one piece of news the team may not like. Write down in advance: what changes, why, what changes for them, what stays the same. Announce it in person and leave time for questions.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Eʼlon 4 savolga javob beradi; savollar yozib olingan va javobsizlari uchun muddat berilgan.",
      ru: "Объявление отвечает на 4 вопроса; вопросы записаны, по оставшимся без ответа назван срок.",
      en: "The announcement answers all 4 questions; questions were logged and open ones have a reply date.",
    },
    why: {
      uz: "Ishonch qiyin xabar qanday yetkazilishiga bogʻliq. Jimlik mish-mishlar va nizolarni keltirib chiqaradi.",
      ru: "Доверие зависит от того, как подаются трудные новости. Молчание порождает слухи и конфликты.",
      en: "Trust depends on how hard news is delivered. Silence breeds rumours and conflict.",
    },
    resources: [],
  },
  {
    slug: "com_team_clarity_pulse",
    skill: "communication",
    title: {
      uz: "Jamoadan ustuvorliklar aniqligi boʻyicha baho oling",
      ru: "Попросите команду оценить ясность приоритетов",
      en: "Ask the team to rate how clear priorities are",
    },
    description: {
      uz: "3–5 xodimdan anonim tarzda 2 savol soʻrang: «Ustuvorliklarimiz sizga qanchalik aniq (1–5)?» va «Qaysi maʼlumot sizga kech yetib keladi?» Oʻrtacha bahoni hisoblang va eng koʻp aytilgan muammo boʻyicha bitta oʻzgarish kiriting.",
      ru: "Анонимно задайте 3–5 сотрудникам 2 вопроса: «Насколько вам ясны наши приоритеты (1–5)?» и «Какая информация доходит до вас поздно?» Посчитайте среднее и внесите одно изменение по самой частой проблеме.",
      en: "Anonymously ask 3–5 people 2 questions: \"How clear are our priorities to you (1–5)?\" and \"What information reaches you too late?\" Average the score and make one change for the most common issue.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 20,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Kamida 3 javob yigʻilgan; oʻrtacha baho hisoblangan; bitta oʻzgarish jamoaga eʼlon qilingan.",
      ru: "Собрано не меньше 3 ответов; среднее посчитано; одно изменение объявлено команде.",
      en: "At least 3 answers collected; average calculated; one change announced to the team.",
    },
    why: {
      uz: "Siz aniq gapiryapman deb oʻylashingiz mumkin, lekin oʻlchov faqat tinglovchi tomonda. Raqam keyingi oyda yaxshilanishni koʻrishga imkon beradi.",
      ru: "Вам может казаться, что вы говорите ясно, но измерить это можно только у слушателей. Число позволит увидеть улучшение через месяц.",
      en: "You may feel you're being clear, but only listeners can measure it. A number lets you see improvement next month.",
    },
    resources: [],
  },
];
