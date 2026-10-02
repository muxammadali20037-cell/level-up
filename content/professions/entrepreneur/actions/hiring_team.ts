import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill `hiring_team`. Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "hiring_team_role_scorecard",
    skill: "hiring_team",
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Keyingi xodim 90 kunda nimaga erishishini yozing",
      ru: "Запишите, чего новый сотрудник достигнет за 90 дней",
      en: "Write what your next hire must achieve in 90 days",
    },
    description: {
      uz: "Sifatlar roʻyxati oʻrniga natijalar yozing: 90 kun ichida oʻlchanadigan 3 ta natija (masalan: kuniga 20 buyurtmani xatosiz rasmiylashtiradi). Har biriga qanday tekshirishingizni qoʻshing. Shundan keyin kerakli koʻnikmalarni yozing.",
      ru: "Вместо списка качеств запишите результаты: 3 измеримых результата за 90 дней (например, оформляет 20 заказов в день без ошибок). К каждому — как будете проверять. Затем выпишите нужные навыки.",
      en: "Write outcomes instead of traits: 3 measurable results for the first 90 days (e.g. processes 20 orders a day without errors). Add how you will check each. Only then list the skills needed.",
    },
    successCriteria: {
      uz: "Lavozim uchun 3 ta oʻlchanadigan natija, tekshirish usuli va koʻnikmalar roʻyxati bor.",
      ru: "Для роли есть 3 измеримых результата, способ проверки и список навыков.",
      en: "The role has 3 measurable outcomes, a way to check them and a skills list.",
    },
    why: {
      uz: "Natija aniq boʻlmasa, «yoqqan» odam yollanadi, kerakli odam emas. Bu xatoni keyin tuzatish ancha qimmat.",
      ru: "Без чётких результатов нанимают «понравившегося», а не нужного человека. Исправлять такую ошибку потом гораздо дороже.",
      en: "Without clear outcomes you hire the person you liked, not the one you need. Fixing that later costs far more.",
    },
    resources: [],
  },
  {
    slug: "hiring_team_structured_interview",
    skill: "hiring_team",
    kind: "practice",
    phase: "practice",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "5 ta tuzilgan intervyu savolini tayyorlang",
      ru: "Подготовьте 5 вопросов для структурированного интервью",
      en: "Prepare 5 structured interview questions",
    },
    description: {
      uz: "90 kunlik natijalar asosida 5 ta savol yozing, ular oʻtmishdagi tajribaga qaratilsin («Shunday vaziyat boʻlganini aytib bering...»). Har biriga 1–5 baholash shkalasi va yaxshi javob belgilarini yozing. Barcha nomzodlarga bir xil savol bering.",
      ru: "На основе результатов за 90 дней напишите 5 вопросов о прошлом опыте («Расскажите о случае, когда...»). Для каждого — шкала 1–5 и признаки хорошего ответа. Задавайте всем кандидатам одинаковые вопросы.",
      en: "Based on the 90-day outcomes write 5 questions about past behaviour (\"Tell me about a time when...\"). For each add a 1–5 scale and signs of a good answer. Ask every candidate the same questions.",
    },
    successCriteria: {
      uz: "5 ta savol, har biri uchun shkala va yaxshi javob belgilari yozilgan.",
      ru: "Написаны 5 вопросов, для каждого есть шкала и признаки хорошего ответа.",
      en: "5 questions written, each with a scale and signs of a good answer.",
    },
    why: {
      uz: "Bir xil savollar va shkala nomzodlarni taassurot emas, dalil asosida solishtirishga yordam beradi.",
      ru: "Одинаковые вопросы и шкала помогают сравнивать кандидатов по фактам, а не по впечатлению.",
      en: "Same questions and a scale let you compare candidates on evidence, not impressions.",
    },
    resources: [],
  },
  {
    slug: "hiring_team_first_week_onboarding",
    skill: "hiring_team",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Yangi xodim uchun birinchi hafta rejasini yozing",
      ru: "Напишите план первой недели для новичка",
      en: "Write a first-week onboarding plan",
    },
    description: {
      uz: "1–5-kunlar boʻyicha yozing: nimani oʻrganadi, kim koʻrsatadi, qaysi SOP yoki chek-listni oʻqiydi va 5-kun oxirigacha qaysi kichik vazifani mustaqil bajaradi. Kim va qachon fikr bildirishini qoʻshing.",
      ru: "Распишите дни 1–5: что изучает, кто показывает, какой SOP или чек-лист читает и какую небольшую задачу выполняет сам к концу 5-го дня. Добавьте, кто и когда даёт обратную связь.",
      en: "Plan days 1–5: what they learn, who shows them, which SOP or checklist they read, and which small task they complete on their own by day 5. Add who gives feedback and when.",
    },
    successCriteria: {
      uz: "5 kunlik reja yozilgan, unda mustaqil vazifa va fikr-mulohaza vaqti bor.",
      ru: "Есть план на 5 дней с самостоятельной задачей и временем обратной связи.",
      en: "A 5-day plan exists with an independent task and feedback slots.",
    },
    why: {
      uz: "Yaxshi odam ham birinchi haftada nima kutilayotganini bilmasa, tez ketadi yoki sekin oʻrganadi.",
      ru: "Даже хороший сотрудник быстро уходит или медленно включается, если в первую неделю не понимает, чего от него ждут.",
      en: "Even a strong hire leaves early or ramps up slowly when the first week has no clear expectations.",
    },
    resources: [],
  },
  {
    slug: "hiring_team_stay_conversation",
    skill: "hiring_team",
    kind: "apply",
    phase: "application",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Asosiy xodim bilan «qolish suhbati» oʻtkazing",
      ru: "Проведите «разговор об удержании» с ключевым сотрудником",
      en: "Hold a stay conversation with a key employee",
    },
    description: {
      uz: "Biznes eng koʻp bogʻliq boʻlgan xodim bilan 20 daqiqa gaplashing. Soʻrang: ishda nima ushlab turadi, nima ketishga undashi mumkin, ishga nima xalaqit beradi. Gapirgandan koʻra koʻproq tinglang. Bitta oʻzgarishni muddati bilan vaʼda qiling.",
      ru: "Поговорите 20 минут с сотрудником, от которого бизнес зависит больше всего. Спросите: что держит на работе, что может заставить уйти, что мешает работать. Больше слушайте. Пообещайте одно изменение со сроком.",
      en: "Talk for 20 minutes with the employee the business depends on most. Ask what keeps them, what could make them leave and what gets in the way. Listen more than you talk. Commit to one change with a deadline.",
    },
    successCriteria: {
      uz: "Suhbat boʻlib oʻtgan, 3 ta javob yozilgan, bitta oʻzgarish muddati bilan belgilangan.",
      ru: "Разговор проведён, записаны 3 ответа, назначено одно изменение со сроком.",
      en: "Conversation held, 3 answers recorded, one change committed with a date.",
    },
    why: {
      uz: "Kalit xodimning ketishi jarayonlarni toʻxtatib qoʻyadi. Uni saqlab qolish yangisini topishdan arzonroq.",
      ru: "Уход ключевого сотрудника останавливает процессы. Удержать дешевле, чем найти нового.",
      en: "Losing a key person stalls your processes. Keeping them is cheaper than replacing them.",
    },
    resources: [],
  },
  {
    slug: "hiring_team_review_last_hires",
    skill: "hiring_team",
    kind: "verify",
    phase: "verification",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Oxirgi 3 ta yollashni natijalar bilan solishtiring",
      ru: "Сверьте 3 последних найма с ожидаемыми результатами",
      en: "Review your last 3 hires against outcomes",
    },
    description: {
      uz: "Oxirgi 3 xodim uchun: kutilgan natijalar, 90 kundagi haqiqiy natija, hozir ishlayaptimi. Yollash jarayonining qaysi qismi (savollar, sinov topshiriq, tavsiya) natijani toʻgʻri bashorat qilganini yozing va jarayonni yangilang.",
      ru: "По 3 последним сотрудникам: ожидаемые результаты, факт через 90 дней, работает ли сейчас. Запишите, какая часть найма (вопросы, тестовое задание, рекомендации) верно предсказала результат, и обновите процесс.",
      en: "For your last 3 hires: expected outcomes, actual results at 90 days, still employed or not. Note which part of hiring (questions, trial task, references) predicted the result and update the process.",
    },
    successCriteria: {
      uz: "3 ta yollash jadvali toʻldirilgan va yollash jarayoniga kamida bitta oʻzgarish kiritilgan.",
      ru: "Таблица по 3 наймам заполнена, в процесс найма внесено хотя бы одно изменение.",
      en: "Table for 3 hires complete and at least one change made to the hiring process.",
    },
    why: {
      uz: "Yollash ham jarayon: uning natijasini oʻlchamasangiz, bir xil xatolar takrorlanadi.",
      ru: "Найм — тоже процесс: если не измерять его результат, одни и те же ошибки повторяются.",
      en: "Hiring is a process too: if you never measure its results, the same mistakes repeat.",
    },
    resources: [],
  },
];
