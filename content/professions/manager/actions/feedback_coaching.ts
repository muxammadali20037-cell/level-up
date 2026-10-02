import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill "feedback_coaching" (gate K2). Basics L1–4: foundation, practice, application; advanced L4–8: application, verification. */
export const actions: ActionInput[] = [
  {
    slug: "fb_behaviour_impact_notes",
    skill: "feedback_coaching",
    title: {
      uz: "Fikr-mulohazani «harakat → taʼsir» shaklida yozing",
      ru: "Запишите обратную связь в формате «действие → влияние»",
      en: "Write feedback as \"behaviour → impact\"",
    },
    description: {
      uz: "Yaqinda kuzatgan 2 ta holatni tanlang: biri yaxshi, biri yaxshilanishi kerak. Har biri uchun yozing: vaziyat, kuzatilgan harakat (baho emas), uning natijaga taʼsiri va keyingi safar nimani kutayotganingiz.",
      ru: "Выберите 2 недавних случая: один удачный, один требующий улучшения. Для каждого запишите: ситуацию, наблюдаемое действие (не оценку), его влияние на результат и чего вы ждёте в следующий раз.",
      en: "Pick 2 recent situations: one that went well, one that needs improving. For each, write the situation, the observed behaviour (not a judgement), its impact and what you expect next time.",
    },
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "2 ta yozuv bor; ularda «dangasa», «befarq» kabi shaxsiy baholar yoʻq, faqat kuzatilgan harakat.",
      ru: "Есть 2 записи без ярлыков вроде «ленивый» или «безразличный» — только наблюдаемые действия.",
      en: "2 notes exist with no labels like \"lazy\" or \"careless\" — only observed behaviour.",
    },
    why: {
      uz: "Shaxsga emas, harakatga qaratilgan fikr himoyaga emas, oʻzgarishga olib keladi.",
      ru: "Обратная связь о действиях, а не о личности, ведёт к изменениям, а не к обороне.",
      en: "Feedback about behaviour, not personality, leads to change rather than defensiveness.",
    },
    resources: [],
  },
  {
    slug: "fb_specific_positive",
    skill: "feedback_coaching",
    title: {
      uz: "Bugun bitta aniq ijobiy fikr-mulohaza bering",
      ru: "Дайте сегодня одну конкретную позитивную обратную связь",
      en: "Give one specific piece of positive feedback today",
    },
    description: {
      uz: "Xodimning bugun yoki kecha qilgan aniq bir yaxshi ishini tanlang. Unga nima qilganini, bu nimaga taʼsir qilganini va buni davom ettirishini xohlayotganingizni ayting. «Barakalla» bilan cheklanmang.",
      ru: "Выберите конкретное хорошее действие сотрудника за сегодня или вчера. Скажите, что именно он сделал, на что это повлияло и что вы хотите, чтобы он продолжал. Не ограничивайтесь «молодец».",
      en: "Pick one specific good thing a team member did today or yesterday. Tell them what they did, what it affected and that you'd like them to keep doing it. Don't stop at \"well done\".",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Fikr bildirildi; unda aniq harakat va uning taʼsiri tilga olindi.",
      ru: "Обратная связь дана; в ней названы конкретное действие и его влияние.",
      en: "Feedback was given, naming a specific action and its impact.",
    },
    why: {
      uz: "Muntazam va aniq ijobiy fikr ishonch yaratadi. Shunda tanqidiy fikr ham hujum emas, yordam sifatida qabul qilinadi.",
      ru: "Регулярная конкретная позитивная обратная связь создаёт доверие — тогда и критика воспринимается как помощь, а не как нападение.",
      en: "Regular, specific positive feedback builds trust, so corrective feedback later is heard as help, not attack.",
    },
    resources: [],
  },
  {
    slug: "fb_first_one_on_one",
    skill: "feedback_coaching",
    title: {
      uz: "Bitta xodim bilan 30 daqiqalik 1:1 suhbat oʻtkazing",
      ru: "Проведите 30-минутную встречу 1:1 с сотрудником",
      en: "Run a 30-minute 1:1 with one team member",
    },
    description: {
      uz: "Suhbatning birinchi yarmini xodimga bering: unga nima xalaqit beryapti, nimani oʻrganmoqchi. Keyin bitta yaxshilanadigan jihat boʻyicha fikr bering. Oxirida bitta aniq keyingi qadam va muddatni kelishib, yozib qoʻying.",
      ru: "Первую половину встречи отдайте сотруднику: что ему мешает, чему он хочет научиться. Затем дайте обратную связь по одному аспекту. В конце договоритесь об одном конкретном шаге и сроке и запишите их.",
      en: "Give the first half to them: what's getting in their way, what they want to learn. Then give feedback on one thing to improve. End by agreeing one concrete next step and deadline, and write it down.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Suhbat boʻldi; xodim sizdan koʻproq gapirdi; bitta qadam va muddat yozilgan.",
      ru: "Встреча прошла; сотрудник говорил больше вас; записаны один шаг и срок.",
      en: "The 1:1 happened; they talked more than you; one step and deadline are written down.",
    },
    why: {
      uz: "Muntazam 1:1 — fikr-mulohaza va murabbiylikning asosiy odati. Muammolar kattalashmasdan oldin shu yerda koʻrinadi.",
      ru: "Регулярные 1:1 — базовая привычка обратной связи и коучинга. Здесь проблемы видны до того, как вырастут.",
      en: "Regular 1:1s are the core habit of feedback and coaching. Problems show up here before they grow.",
    },
    resources: [],
  },
  {
    slug: "fb_coach_with_questions",
    skill: "feedback_coaching",
    title: {
      uz: "Tayyor javob oʻrniga savollar bilan yoʻnaltiring",
      ru: "Вместо готового ответа направляйте вопросами",
      en: "Coach with questions instead of answers",
    },
    description: {
      uz: "Xodim yechim soʻraganda darhol javob bermang. 3 ta savol bering: «Maqsad nima?», «Qanday variantlar bor?», «Qaysi birini tanlaysiz va nega?» Uning yechimi xavfsiz boʻlsa, oʻshani qoʻllashiga ruxsat bering.",
      ru: "Когда сотрудник просит решение, не отвечайте сразу. Задайте 3 вопроса: «Какая цель?», «Какие есть варианты?», «Какой выберете и почему?» Если его решение безопасно, дайте его применить.",
      en: "When someone asks you for a solution, don't answer right away. Ask: \"What's the goal?\", \"What are the options?\", \"Which would you pick and why?\" If their answer is safe, let them use it.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Kamida bitta muammoni xodim oʻzi yechdi; siz faqat savol berdingiz.",
      ru: "Хотя бы одну проблему сотрудник решил сам; вы только задавали вопросы.",
      en: "At least one problem was solved by the team member; you only asked questions.",
    },
    why: {
      uz: "Murabbiylik odamlarning qobiliyatini oʻstiradi. Usiz har bir muammo sizga qaytib keladi va jamoa oʻsmaydi.",
      ru: "Коучинг развивает способности людей. Без него каждая проблема возвращается к вам, и команда не растёт.",
      en: "Coaching builds people's capability. Without it, every problem comes back to you and the team doesn't grow.",
    },
    resources: [],
  },
  {
    slug: "fb_feedback_on_feedback",
    skill: "feedback_coaching",
    title: {
      uz: "Fikr-mulohazangiz qanday qabul qilinganini soʻrang",
      ru: "Спросите, как была воспринята ваша обратная связь",
      en: "Ask how your feedback actually landed",
    },
    description: {
      uz: "Oxirgi 2 haftada fikr bildirgan 2–3 xodimdan soʻrang: «Fikrim qanchalik aniq va foydali boʻldi? Nimani boshqacha qilay?» Javoblarni yozing, takrorlanadigan bitta naqshni toping va keyingi 1:1 da uni tuzating.",
      ru: "Спросите 2–3 сотрудников, которым вы давали обратную связь за 2 недели: «Насколько она была понятной и полезной? Что мне делать иначе?» Запишите ответы, найдите повторяющийся паттерн и исправьте его на следующей 1:1.",
      en: "Ask 2–3 people you gave feedback to in the last 2 weeks: \"How clear and useful was it? What should I do differently?\" Write down answers, find one recurring pattern and fix it in your next 1:1.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 20,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Kamida 2 ta javob yozilgan; bitta naqsh va tuzatish rejasi bor.",
      ru: "Записаны минимум 2 ответа; есть один паттерн и план исправления.",
      en: "At least 2 answers recorded; one pattern and a fix plan identified.",
    },
    why: {
      uz: "Fikringiz taʼsirini faqat oʻz tomoningizdan baholab boʻlmaydi. Qabul qiluvchining javobi — eng ishonchli dalil.",
      ru: "Эффект своей обратной связи нельзя оценить только со своей стороны. Ответ получателя — самое надёжное доказательство.",
      en: "You can't judge your feedback's effect from your side alone. The receiver's answer is the most reliable evidence.",
    },
    resources: [],
  },
];
