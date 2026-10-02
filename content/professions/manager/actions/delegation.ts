import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill "delegation" (gate K3). Basics L1–4: foundation, practice, verification; advanced L4–8: application, verification. */
export const actions: ActionInput[] = [
  {
    slug: "del_list_only_you_tasks",
    skill: "delegation",
    title: {
      uz: "Faqat siz bajarayotgan vazifalar roʻyxatini tuzing",
      ru: "Составьте список задач, которые делаете только вы",
      en: "List the tasks only you are doing",
    },
    description: {
      uz: "Oʻtgan haftadagi ishlaringizni yozing. Har biriga belgi qoʻying: faqat men qila olaman / boshqa odam oʻrgansa qila oladi / boshqa odam hozir ham qila oladi. Oxirgi ikki guruhdan topshiriladigan 3 ta vazifani tanlang.",
      ru: "Выпишите свои дела за прошлую неделю. Отметьте каждое: могу только я / сможет другой после обучения / другой может уже сейчас. Из двух последних групп выберите 3 задачи для передачи.",
      en: "Write down what you did last week. Mark each: only I can do it / someone could after training / someone could right now. From the last two groups, pick 3 tasks to hand over.",
    },
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Roʻyxat 3 guruhga ajratilgan; topshirish uchun 3 ta vazifa tanlangan.",
      ru: "Список разделён на 3 группы; выбраны 3 задачи для передачи.",
      en: "The list is split into 3 groups; 3 tasks are chosen to hand over.",
    },
    why: {
      uz: "Rahbar koʻpincha odatga koʻra vazifani oʻzida ushlab qoladi. Roʻyxat vaqtingiz qayerga ketayotganini va nimani topshirsa boʻlishini koʻrsatadi.",
      ru: "Руководитель часто держит задачи у себя по привычке. Список показывает, куда уходит время и что можно передать.",
      en: "Managers often keep tasks out of habit. The list shows where your time goes and what could be handed over.",
    },
    resources: [],
  },
  {
    slug: "del_delegate_recurring_task",
    skill: "delegation",
    title: {
      uz: "Bitta takrorlanuvchi vazifani delegatsiya qiling",
      ru: "Делегируйте одну повторяющуюся задачу",
      en: "Delegate one recurring task",
    },
    description: {
      uz: "Har hafta takrorlanadigan bitta vazifani tanlang. Xodimga natija qanday boʻlishi, nega muhimligi, qaysi qarorlarni oʻzi qabul qilishi va birinchi tekshiruv qachonligini ayting. Vazifani oʻzingiz qayta bajarib qoʻymang.",
      ru: "Выберите одну задачу, которая повторяется каждую неделю. Скажите сотруднику, каким должен быть результат, почему это важно, какие решения он принимает сам и когда первая проверка. Не переделывайте задачу за него.",
      en: "Pick one task that repeats every week. Tell the person what the result should look like, why it matters, which decisions are theirs and when the first check-in is. Don't redo the task yourself.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Vazifa xodimga oʻtkazildi; natija, kontekst, vakolat chegarasi va tekshiruv vaqti aytildi.",
      ru: "Задача передана; озвучены результат, контекст, границы полномочий и время проверки.",
      en: "The task is handed over with outcome, context, decision limits and a check-in time.",
    },
    why: {
      uz: "Delegatsiya — faqat harakatni emas, natijani topshirish. Takrorlanuvchi vazifa bilan boshlash xavfsiz, chunki xato tez koʻrinadi va arzon tuzatiladi.",
      ru: "Делегирование — это передача результата, а не только действия. Повторяющаяся задача — безопасный старт: ошибка видна быстро и исправляется дёшево.",
      en: "Delegation hands over an outcome, not just activity. A recurring task is a safe start: mistakes show up fast and are cheap to fix.",
    },
    resources: [],
  },
  {
    slug: "del_check_understanding",
    skill: "delegation",
    title: {
      uz: "Topshiriq tushunilganini xodimning soʻzi bilan tekshiring",
      ru: "Проверьте понимание задачи словами сотрудника",
      en: "Check understanding in the person's own words",
    },
    description: {
      uz: "Topshirgan vazifangiz boʻyicha xodimdan soʻrang: «Natija qanday boʻlishi kerak, qachon tekshiramiz, nimani oʻzingiz hal qilasiz?» Javobni oʻz niyatingiz bilan solishtiring va farqlarni darhol aniqlashtiring.",
      ru: "По переданной задаче спросите сотрудника: «Каким должен быть результат, когда проверяем, что решаете сами?» Сравните ответ со своим замыслом и сразу проясните расхождения.",
      en: "For a task you handed over, ask: \"What should the result be, when do we check in, what do you decide on your own?\" Compare the answer with your intent and clarify gaps right away.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Xodim natija, muddat va vakolatni toʻgʻri aytdi yoki farqlar aniqlanib, tuzatildi.",
      ru: "Сотрудник верно назвал результат, срок и полномочия, либо расхождения выявлены и исправлены.",
      en: "The person stated outcome, deadline and authority correctly, or gaps were found and fixed.",
    },
    why: {
      uz: "Xodim vazifani boshqacha tushungan boʻlsa, muammo keyinroq kechikish yoki qayta ishlash sifatida chiqadi.",
      ru: "Если задачу поняли иначе, проблема всплывёт позже — как срыв срока или переделка.",
      en: "If the task was understood differently, the problem surfaces later as a missed deadline or rework.",
    },
    resources: [],
  },
  {
    slug: "del_hand_over_outcome",
    skill: "delegation",
    title: {
      uz: "Butun bir natijani qaror vakolati bilan topshiring",
      ru: "Передайте целый результат вместе с правом решать",
      en: "Hand over a whole outcome with decision rights",
    },
    description: {
      uz: "Kichik loyiha yoki yoʻnalishni (masalan, oylik hisobot yoki yangi xodimni moslashtirish) bitta xodimga toʻliq topshiring. Byudjet yoki qaror chegarasini yozma belgilang, haftalik qisqa tekshiruvga kelishing va qarorlarni u qabul qilsin.",
      ru: "Полностью передайте одному сотруднику небольшой проект или направление (например, ежемесячный отчёт или адаптацию новичка). Письменно задайте бюджет или границы решений, договоритесь о коротком еженедельном созвоне и дайте ему решать.",
      en: "Fully hand one person a small project or area (e.g., the monthly report or onboarding a new hire). Set budget or decision limits in writing, agree a short weekly check-in, and let them make the calls.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Natija egasi yozma belgilangan; xodim kamida bitta qarorni sizsiz qabul qildi.",
      ru: "Владелец результата закреплён письменно; сотрудник принял хотя бы одно решение без вас.",
      en: "The owner is named in writing; the person made at least one decision without you.",
    },
    why: {
      uz: "Yuqori darajada rahbar vazifalarni emas, natijalar egaligini topshiradi. Bu jamoani sizga bogʻliqlikdan chiqaradi va jarayonlarni barqaror qiladi.",
      ru: "На высоком уровне руководитель передаёт не задачи, а владение результатами. Это снимает зависимость команды от вас и делает процессы устойчивыми.",
      en: "At higher levels, managers hand over ownership of outcomes, not tasks. This frees the team from depending on you and makes processes stable.",
    },
    resources: [],
  },
  {
    slug: "del_measure_dependency",
    skill: "delegation",
    title: {
      uz: "Jamoa sizga qanchalik bogʻliqligini bir hafta oʻlchang",
      ru: "Неделю измеряйте, насколько команда зависит от вас",
      en: "Measure for a week how much the team waits on you",
    },
    description: {
      uz: "Bir hafta davomida sizdan ruxsat yoki javob kutib turgan har bir holatni yozib boring. Hafta oxirida ularni turlarga ajrating va kamida 2 turdagi qarorni xodimlarga doimiy topshirish rejasini tuzing.",
      ru: "Неделю записывайте каждый случай, когда от вас ждали разрешения или ответа. В конце недели сгруппируйте их по типам и составьте план постоянной передачи сотрудникам хотя бы 2 типов решений.",
      en: "For a week, log every time someone waited for your approval or answer. At week's end, group them by type and plan to permanently hand at least 2 decision types to the team.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Haftalik qayd bor; kutishlar soni hisoblangan; 2 ta qaror turi topshirilgan yoki topshirish sanasi belgilangan.",
      ru: "Есть недельный журнал; число ожиданий посчитано; 2 типа решений переданы или назначена дата передачи.",
      en: "A week's log exists; waits are counted; 2 decision types are handed over or have a handover date.",
    },
    why: {
      uz: "Har bir qaror sizdan oʻtsa, jamoa tezligi sizning boʻsh vaqtingiz bilan cheklanadi va yaxshilangan jarayonlar ham sizga bogʻlanib qoladi.",
      ru: "Если каждое решение проходит через вас, скорость команды ограничена вашим временем, а улучшенные процессы держатся только на вас.",
      en: "If every decision goes through you, team speed is capped by your free time and even improved processes stay tied to you.",
    },
    resources: [],
  },
];
