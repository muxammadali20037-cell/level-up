import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill "goal_setting_planning" (gate K1). Basics L1–4: foundation, practice, application; advanced L4–8: application, verification. */
export const actions: ActionInput[] = [
  {
    slug: "gsp_rewrite_goal_measurable",
    skill: "goal_setting_planning",
    title: {
      uz: "Bitta maqsadni oʻlchanadigan qilib qayta yozing",
      ru: "Перепишите одну цель в измеримом виде",
      en: "Rewrite one team goal so it can be measured",
    },
    description: {
      uz: "Jamoaning hozirgi bitta maqsadini oling. Unga natija, raqam, muddat va bitta masʼulni qoʻshing. Masalan: «Mijozlarga yaxshi xizmat» → «Oktabr oxirigacha javob vaqtini 24 soatdan 4 soatga tushirish, masʼul — Dilshod».",
      ru: "Возьмите одну текущую цель команды. Добавьте результат, число, срок и одного ответственного. Например: «Хороший сервис» → «К концу октября сократить время ответа клиенту с 24 до 4 часов, ответственный — Дильшод».",
      en: "Take one current team goal. Add an outcome, a number, a deadline and one owner. Example: \"Good service\" → \"Cut customer response time from 24 to 4 hours by end of October, owner: Dilshod.\"",
    },
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Maqsadda natija, raqam, muddat va masʼul bor; boshqa odam uni oʻqib, bajarilgan-bajarilmaganini aniqlay oladi.",
      ru: "В цели есть результат, число, срок и ответственный; другой человек может по ней понять, выполнена ли она.",
      en: "The goal has an outcome, a number, a deadline and an owner; someone else could tell whether it was achieved.",
    },
    why: {
      uz: "Aniq boʻlmagan maqsadni topshirib ham, baholab ham boʻlmaydi. Vakolat berish va samaradorlikni boshqarish aynan shu koʻnikmaga tayanadi.",
      ru: "Размытую цель нельзя ни передать, ни оценить. Делегирование и управление эффективностью опираются именно на этот навык.",
      en: "A vague goal can be neither handed over nor evaluated. Delegation and performance management both depend on this skill.",
    },
    resources: [],
  },
  {
    slug: "gsp_weekly_three_priorities",
    skill: "goal_setting_planning",
    title: {
      uz: "Keyingi hafta uchun 3 ta ustuvor natijani belgilang",
      ru: "Определите 3 приоритетных результата на неделю",
      en: "Set 3 priority outcomes for next week",
    },
    description: {
      uz: "Jamoaning keyingi haftasi uchun 3 tadan koʻp boʻlmagan natija yozing (vazifa emas, natija). Har biriga masʼul va tugash kunini qoʻying. Roʻyxatga kirmagan ishlarni alohida «hozir emas» deb belgilang.",
      ru: "Запишите не больше 3 результатов команды на следующую неделю (результатов, а не задач). Каждому назначьте ответственного и день завершения. Всё, что не вошло, отметьте отдельно как «не сейчас».",
      en: "Write no more than 3 outcomes (not tasks) for your team next week. Give each an owner and a due day. List everything that didn't make it separately as \"not now\".",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "3 ta natija bor, har birida masʼul va muddat; «hozir emas» roʻyxati tuzilgan.",
      ru: "Есть 3 результата с ответственными и сроками; составлен список «не сейчас».",
      en: "3 outcomes, each with an owner and due day; a \"not now\" list exists.",
    },
    why: {
      uz: "Rejalashtirish — nimadan voz kechishni tanlash hamdir. Ustuvorliklar kam boʻlsa, jamoa diqqati tarqalmaydi.",
      ru: "Планирование — это ещё и выбор, от чего отказаться. Когда приоритетов мало, внимание команды не распыляется.",
      en: "Planning also means choosing what not to do. With few priorities, the team's attention doesn't get scattered.",
    },
    resources: [],
  },
  {
    slug: "gsp_agree_weekly_plan",
    skill: "goal_setting_planning",
    title: {
      uz: "Haftalik rejani jamoa bilan 15 daqiqada kelishib oling",
      ru: "Согласуйте недельный план с командой за 15 минут",
      en: "Agree the weekly plan with your team in 15 minutes",
    },
    description: {
      uz: "Haftalik 3 natijani jamoaga koʻrsating. Har bir masʼuldan oʻz natijasini oʻz soʻzi bilan qaytarib aytishini soʻrang. Toʻsiqlar va kerakli yordamni yozib oling, kelishilgan rejani umumiy chatga joylang.",
      ru: "Покажите команде 3 результата недели. Попросите каждого ответственного пересказать свой результат своими словами. Запишите препятствия и нужную помощь, выложите согласованный план в общий чат.",
      en: "Show the team the 3 outcomes for the week. Ask each owner to restate their outcome in their own words. Note blockers and help needed, then post the agreed plan in the team chat.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Har bir masʼul oʻz natijasini toʻgʻri qayta aytdi; reja chatda yozma holda turibdi.",
      ru: "Каждый ответственный верно пересказал свой результат; план есть письменно в чате.",
      en: "Every owner restated their outcome correctly; the plan is written in the chat.",
    },
    why: {
      uz: "Faqat sizning daftaringizdagi reja jamoaning rejasi emas. Qayta aytish tushunmovchiliklarni ish boshlanmasdan oldin ochib beradi.",
      ru: "План, который есть только в вашем блокноте, — ещё не план команды. Пересказ выявляет недопонимание до начала работы.",
      en: "A plan that lives only in your notebook isn't the team's plan. Restating surfaces misunderstandings before work starts.",
    },
    resources: [],
  },
  {
    slug: "gsp_quarter_goal_cascade",
    skill: "goal_setting_planning",
    title: {
      uz: "Chorak maqsadini jamoa maqsadlariga boʻlib chiqing",
      ru: "Разложите квартальную цель на цели команды",
      en: "Cascade one quarterly goal into team goals",
    },
    description: {
      uz: "Bitta chorak maqsadini 3–4 ta jamoa yoki xodim natijasiga boʻling. Har biriga oʻlchov, oraliq nazorat nuqtasi va masʼul yozing. Har bir pastki maqsad asosiy maqsadga qanday hissa qoʻshishini bir jumlada izohlang.",
      ru: "Разбейте одну квартальную цель на 3–4 результата команд или сотрудников. Для каждого запишите метрику, промежуточную контрольную точку и ответственного. Одной фразой поясните, как каждая подцель влияет на главную.",
      en: "Split one quarterly goal into 3–4 team or individual outcomes. For each, write a metric, a mid-point milestone and an owner. In one sentence, explain how each sub-goal contributes to the main goal.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 60,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Har bir pastki maqsadda oʻlchov, muddat va masʼul bor; asosiy maqsad bilan bogʻliqligi yozilgan.",
      ru: "У каждой подцели есть метрика, срок и ответственный; связь с главной целью описана.",
      en: "Each sub-goal has a metric, a date and an owner; its link to the main goal is written down.",
    },
    why: {
      uz: "Kattaroq jamoada har kimning ishi umumiy yoʻnalishga bogʻlanmasa, kuch tarqalib ketadi. Maqsadlar kaskadi yuqori darajadagi rahbarlikning asosiy dalili.",
      ru: "В большой команде без связи личной работы с общим направлением усилия распыляются. Каскад целей — ключевое доказательство управленческого уровня.",
      en: "In a larger team, effort scatters when individual work isn't tied to the overall direction. A goal cascade is core evidence of senior-level management.",
    },
    resources: [],
  },
  {
    slug: "gsp_plan_vs_actual_review",
    skill: "goal_setting_planning",
    title: {
      uz: "Oʻtgan oy rejasini haqiqiy natija bilan solishtiring",
      ru: "Сравните план прошлого месяца с фактом",
      en: "Compare last month's plan with actual results",
    },
    description: {
      uz: "Oʻtgan oy maqsadlarining har biri yonida rejadagi va haqiqiy natijani yozing. Bajarilganlar ulushini hisoblang. Bajarilmagan har bir maqsad uchun bitta sabab va keyingi oyda nimani oʻzgartirishingizni yozing.",
      ru: "Рядом с каждой целью прошлого месяца запишите план и факт. Посчитайте долю выполненных. Для каждой невыполненной цели запишите одну причину и что вы измените в следующем месяце.",
      en: "Next to each of last month's goals, write the planned and actual result. Calculate the share achieved. For each missed goal, write one cause and what you'll change next month.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Bajarilish ulushi hisoblangan; har bir ogʻish uchun sabab va oʻzgarish yozilgan.",
      ru: "Доля выполнения посчитана; для каждого отклонения записаны причина и изменение.",
      en: "Completion share is calculated; every miss has a cause and a change written down.",
    },
    why: {
      uz: "Reja va natija solishtirilmasa, rejalashtirish sifati oʻsmaydi. Bu tahlil koʻnikmangizning yozma dalili boʻladi.",
      ru: "Без сравнения плана и факта качество планирования не растёт. Этот разбор — письменное доказательство вашего навыка.",
      en: "Without comparing plan and actuals, planning quality doesn't improve. This review is written evidence of your skill.",
    },
    resources: [],
  },
];
