import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill `leadership`. Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "leadership_time_audit",
    skill: "leadership",
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Shu hafta vaqtingiz qayerga ketganini yozing",
      ru: "Запишите, куда ушло ваше время на этой неделе",
      en: "Map where your time went this week",
    },
    description: {
      uz: "Haftaning asosiy ishlarini va taxminiy soatlarini yozing. Har biriga belgi qoʻying: «faqat egasi qilishi kerak» yoki «boshqasi qila oladi». Ikkinchi guruhdagi soatlarni jamlang.",
      ru: "Запишите основные дела недели и примерные часы. Пометьте каждое: «должен делать только владелец» или «может сделать другой». Сложите часы второй группы.",
      en: "List the week's main tasks with rough hours. Tag each \"only the owner should do this\" or \"someone else could\". Total the hours in the second group.",
    },
    successCriteria: {
      uz: "Vazifalar soatlari bilan yozilgan va boshqaga berish mumkin boʻlgan soatlar jamlangan.",
      ru: "Задачи записаны с часами, посчитаны часы, которые можно передать.",
      en: "Tasks listed with hours and the delegable hours totalled.",
    },
    why: {
      uz: "Rahbar vaqtini koʻrmaguncha, uni yoʻnalish berishga emas, kundalik ishga sarflashda davom etadi.",
      ru: "Пока руководитель не видит своё время, он тратит его на текучку, а не на задание направления.",
      en: "Until you see your time, it keeps going to daily firefighting instead of setting direction.",
    },
    resources: [],
  },
  {
    slug: "leadership_rewrite_tasks_as_outcomes",
    skill: "leadership",
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "3 ta topshiriqni natija shaklida qayta yozing",
      ru: "Перепишите 3 поручения как результат",
      en: "Rewrite 3 instructions as outcomes",
    },
    description: {
      uz: "Shu hafta bergan 3 ta topshiriqni oling («mijozlarga qoʻngʻiroq qil»). Har birini qayta yozing: qanday natija, qaysi muddatgacha, sifat mezoni va oraliq tekshiruv vaqti («juma 18:00gacha 30 mijozga qoʻngʻiroq, natijalar jadvalda»).",
      ru: "Возьмите 3 поручения этой недели («обзвони клиентов»). Перепишите каждое: какой результат, к какому сроку, критерий качества и время промежуточной проверки («до пятницы 18:00 обзвонить 30 клиентов, итоги в таблице»).",
      en: "Take 3 instructions you gave this week (\"call the customers\"). Rewrite each with the result, deadline, quality bar and a check-in time (\"call 30 customers by Friday 18:00, results in the sheet\").",
    },
    successCriteria: {
      uz: "3 ta topshiriqning har biri natija, muddat, mezon va tekshiruv vaqti bilan qayta yozilgan.",
      ru: "Все 3 поручения переписаны с результатом, сроком, критерием и временем проверки.",
      en: "All 3 instructions rewritten with result, deadline, criterion and check-in.",
    },
    why: {
      uz: "Aniq natija berilsa, odamlar mustaqil ishlaydi va sizga mayda nazorat kerak boʻlmaydi.",
      ru: "Когда задан чёткий результат, люди работают самостоятельно, и микроконтроль не нужен.",
      en: "When the outcome is clear, people work on their own and you do not need to micromanage.",
    },
    resources: [],
  },
  {
    slug: "leadership_delegate_recurring_task",
    skill: "leadership",
    kind: "apply",
    phase: "application",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Bitta takrorlanuvchi vazifani delegatsiya qiling",
      ru: "Делегируйте одну повторяющуюся задачу",
      en: "Delegate one recurring task",
    },
    description: {
      uz: "Vaqt roʻyxatidan har hafta takrorlanadigan bitta vazifani tanlang. Xodimga natija, muddat va tekshiruv vaqtini tushuntiring, bir marta birga bajaring. Keyingi safar uni oʻzingiz qayta qilmang — faqat natijani tekshiring.",
      ru: "Выберите из списка времени одну еженедельную задачу. Объясните сотруднику результат, срок и время проверки, один раз сделайте вместе. В следующий раз не переделывайте сами — только проверьте результат.",
      en: "Pick one weekly task from your time list. Explain the result, deadline and check-in to an employee and do it together once. Next time do not redo it yourself — only check the result.",
    },
    successCriteria: {
      uz: "Vazifa topshirilgan, xodim uni kamida bir marta mustaqil bajargan, siz faqat natijani tekshirgansiz.",
      ru: "Задача передана, сотрудник выполнил её самостоятельно хотя бы раз, вы проверили только результат.",
      en: "Task handed over, done independently at least once, and you only checked the result.",
    },
    why: {
      uz: "Delegatsiyasiz yaxshi xodimlar ham oʻsmaydi va siz biznesning toʻsigʻiga aylanasiz.",
      ru: "Без делегирования даже хорошие сотрудники не растут, а вы становитесь узким местом бизнеса.",
      en: "Without delegation even good people stop growing and you become the bottleneck.",
    },
    resources: [],
  },
  {
    slug: "leadership_weekly_metrics_meeting",
    skill: "leadership",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "3 ta koʻrsatkich bilan haftalik yigʻilish oʻtkazing",
      ru: "Проведите недельную планёрку по 3 показателям",
      en: "Run a weekly team meeting on 3 metrics",
    },
    description: {
      uz: "3 ta asosiy koʻrsatkich va har birining egasini belgilang (masalan: sotuv, xatolar, pul qoldigʻi). 30 daqiqalik yigʻilish: har bir ega raqam, toʻsiq va keyingi hafta vaʼdasini aytadi. Vaʼdalarni yozib, keyingi yigʻilishda tekshiring.",
      ru: "Определите 3 ключевых показателя и ответственного за каждый (например, продажи, ошибки, остаток денег). Планёрка 30 минут: каждый называет цифру, препятствие и обещание на неделю. Запишите обещания и проверьте на следующей встрече.",
      en: "Choose 3 key metrics and an owner for each (e.g. sales, errors, cash balance). In a 30-minute meeting each owner gives the number, the blocker and a commitment for next week. Record commitments and check them next time.",
    },
    successCriteria: {
      uz: "Yigʻilish oʻtkazilgan, 3 ta raqam va har bir egadan vaʼda yozib olingan.",
      ru: "Планёрка проведена, записаны 3 цифры и обещание каждого ответственного.",
      en: "Meeting held, 3 numbers and each owner's commitment recorded.",
    },
    why: {
      uz: "Muntazam ritm odamlarni javobgar qiladi va muammolar oy oxirida emas, hafta ichida koʻrinadi.",
      ru: "Регулярный ритм делает людей ответственными, а проблемы видны в течение недели, а не в конце месяца.",
      en: "A steady rhythm creates accountability and surfaces problems within the week, not at month end.",
    },
    resources: [],
  },
  {
    slug: "leadership_team_feedback_round",
    skill: "leadership",
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Jamoadan rahbarligingiz haqida anonim fikr oling",
      ru: "Получите от команды анонимный отзыв о вашем управлении",
      en: "Get anonymous team feedback on how you lead",
    },
    description: {
      uz: "Jamoaga 3 ta savol bering: men nimani boshlashim, nimani toʻxtatishim va nimani davom ettirishim kerak? Javoblarni anonim yigʻing (qogʻozda yoki ismsiz shaklda). Takrorlangan fikrlarni ajrating, bitta oʻzgarishni jamoaga eʼlon qiling.",
      ru: "Задайте команде 3 вопроса: что мне начать, прекратить и продолжить делать? Соберите ответы анонимно (на бумаге или в форме без имени). Выделите повторяющиеся мысли, объявите команде одно изменение.",
      en: "Ask the team 3 questions: what should I start, stop and continue doing? Collect answers anonymously (paper or a nameless form). Group repeated points and announce one change to the team.",
    },
    successCriteria: {
      uz: "Kamida 3 kishidan javob olingan, takrorlangan fikrlar ajratilgan, bitta oʻzgarish eʼlon qilingan.",
      ru: "Получены ответы минимум от 3 человек, выделены повторы, объявлено одно изменение.",
      en: "Answers from at least 3 people, repeated points grouped, one change announced.",
    },
    why: {
      uz: "Rahbarlikni oʻzingiz emas, jamoa his qiladi. Anonim fikr sizning koʻrinmaydigan odatlaringizni ochadi.",
      ru: "Лидерство ощущает команда, а не вы сами. Анонимный отзыв показывает привычки, которых вы не замечаете.",
      en: "Leadership is felt by the team, not by you. Anonymous feedback shows habits you cannot see yourself.",
    },
    resources: [],
  },
];
