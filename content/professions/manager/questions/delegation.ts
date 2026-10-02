import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** manager.delegation.NN — gate skill K3; target levels 2, 3, 5, 6, 7 + one self_report. */
export const questions: QuestionInput[] = [
  {
    key: "manager.delegation.01",
    skill: "delegation",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Vazifani topshirayotganda xodimga eng avvalo nimani yetkazish kerak?",
      ru: "Что в первую очередь нужно передать сотруднику, делегируя задачу?",
      en: "When delegating a task, what should you make sure to hand over?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Faqat muddatni — qolganini xodim oʻzi hal qilsin",
          ru: "Только срок — остальное сотрудник решит сам",
          en: "Only the deadline — the person can figure out the rest",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Xato qilmasligi uchun har bir qadamning batafsil yoʻriqnomasini",
          ru: "Подробную пошаговую инструкцию, чтобы не было ошибок",
          en: "Detailed step-by-step instructions so nothing goes wrong",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Vazifa nomini va oxirida hammasini tekshirishingizni",
          ru: "Название задачи и то, что в конце вы всё проверите",
          en: "The task name and that you will check everything at the end",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Kutilgan natija, nima uchun kerakligi, vakolat chegaralari va oraliq tekshiruv nuqtalarini",
          ru: "Ожидаемый результат, зачем он нужен, границы полномочий и точки сверки",
          en: "The expected outcome, why it matters, authority limits and check-in points",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Vakolat berish — bu natijani kontekst va vakolat bilan birga topshirish. Faqat muddat yoki faqat yoʻriqnoma berish yo nazoratsizlikka, yo mikromenejmentga olib keladi.",
      ru: "Делегирование — это передача результата вместе с контекстом и полномочиями. Только срок или только инструкция ведут либо к потере контроля, либо к микроменеджменту.",
      en: "Delegation means handing over an outcome with context and authority. A bare deadline or a rigid script leads either to drift or to micromanagement.",
    },
  },
  {
    key: "manager.delegation.02",
    skill: "delegation",
    specializations: [],
    type: "scenario",
    targetLevel: 3,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Siz yangi xodimga oylik hisobotni topshirdingiz va muddatgacha u bilan gaplashmadingiz. Muddat kuni hisobot xatolar bilan keldi.",
      ru: "Вы поручили новому сотруднику ежемесячный отчёт и до срока с ним не сверялись. В день сдачи отчёт пришёл с ошибками.",
      en: "You gave a new team member the monthly report and did not check in before the deadline. It arrived on the due date full of errors.",
    },
    prompt: {
      uz: "Keyingi safar nimani boshqacha qilish eng toʻgʻri?",
      ru: "Что лучше всего сделать иначе в следующий раз?",
      en: "What is the best thing to do differently next time?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Tajribasiga mos oraliq tekshiruvni kelishish, masalan, ish yarmida qoralamani koʻrish",
          ru: "Договориться о промежуточной сверке по уровню опыта, например посмотреть черновик на полпути",
          en: "Agree an interim check-in suited to their experience, e.g. review a draft halfway",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Hisobotni yana oʻzingiz tayyorlash — shunda tezroq va ishonchliroq",
          ru: "Снова готовить отчёт самому — так быстрее и надёжнее",
          en: "Go back to doing the report yourself — it is faster and safer",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Vazifani tajribaliroq boshqa xodimga berish",
          ru: "Передать задачу другому, более опытному сотруднику",
          en: "Give the task to a more experienced colleague instead",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Har safar har bir qadam boʻyicha batafsil yoʻriqnoma yozib berish",
          ru: "Каждый раз писать подробную инструкцию по каждому шагу",
          en: "Write detailed instructions for every step each time",
        },
        score: 0.5,
      },
    ],
    explanation: {
      uz: "Nazorat darajasi xodimning shu vazifadagi tajribasiga mos boʻlishi kerak: yangi xodimga ertaroq va tez-tez tekshiruv kerak. Yoʻriqnoma yordam beradi, ammo oraliq tekshiruvsiz xatolar baribir oxirida chiqadi.",
      ru: "Уровень контроля должен соответствовать опыту человека в этой задаче: новичку нужны более ранние и частые сверки. Инструкция помогает, но без промежуточной сверки ошибки всё равно всплывут в конце.",
      en: "Oversight should match the person's experience with the task: a newcomer needs earlier, more frequent check-ins. Instructions help, but without an interim check errors still surface at the end.",
    },
  },
  {
    key: "manager.delegation.03",
    skill: "delegation",
    specializations: [],
    type: "judgment",
    targetLevel: 5,
    scoringRule: "single_best",
    scenario: {
      uz: "Siz haddan tashqari band boʻlib qoldingiz va bir vazifani jamoaga topshirmoqchisiz.",
      ru: "Вы перегружены и хотите передать одну задачу команде.",
      en: "You are overloaded and want to hand one task over to the team.",
    },
    prompt: {
      uz: "Qaysi vazifani birinchi topshirish eng maqsadga muvofiq?",
      ru: "Какую задачу разумнее всего передать первой?",
      en: "Which task is the best one to delegate first?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Jamoa ish haqini qayta koʻrib chiqish (maxfiy maʼlumot)",
          ru: "Пересмотр зарплат команды (конфиденциальные данные)",
          en: "Reviewing the team's salaries (confidential data)",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Natijasi past xodim bilan jiddiy suhbat",
          ru: "Серьёзный разговор с сотрудником с низкими результатами",
          en: "A difficult conversation with an underperforming employee",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Har hafta oʻzingiz tuzadigan va xodim uchun oʻsish imkoni boʻladigan savdo hisoboti",
          ru: "Еженедельный отчёт по продажам, который вы делаете по привычке и который поможет сотруднику расти",
          en: "The weekly sales report you do out of habit, which would help a team member grow",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Shu bugun yirik mijoz bilan yuzaga kelgan inqirozni hal qilish",
          ru: "Решение кризиса с крупным клиентом, возникшего сегодня",
          en: "Handling a crisis with a major client that broke out today",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Birinchi navbatda takrorlanadigan, xavfi past va xodimni rivojlantiradigan vazifalar topshiriladi. Maxfiy, kadrlar bilan bogʻliq va keskin inqirozli masalalar odatda rahbarda qoladi.",
      ru: "В первую очередь передают повторяющиеся задачи с низким риском, которые развивают сотрудника. Конфиденциальные, кадровые и острые кризисные вопросы обычно остаются за руководителем.",
      en: "Delegate recurring, low-risk work that develops someone first. Confidential, people-sensitive and acute crisis issues usually stay with the manager.",
    },
  },
  {
    key: "manager.delegation.04",
    skill: "delegation",
    specializations: [],
    type: "scenario",
    targetLevel: 6,
    scoringRule: "partial_credit",
    discrimination: 0.7,
    scenario: {
      uz: "Siz loyihani tajribali xodimga topshirdingiz. U siznikidan boshqacha, lekin ishlaydigan yondashuvni tanladi. Kelishilgan natija va muddatga xavf yoʻq.",
      ru: "Вы передали проект опытному сотруднику. Она выбрала подход, отличный от вашего, но рабочий. Согласованному результату и сроку ничто не угрожает.",
      en: "You handed a project to an experienced team member. She chose an approach different from yours, but a workable one. The agreed outcome and deadline are not at risk.",
    },
    prompt: {
      uz: "Eng toʻgʻri harakat qaysi?",
      ru: "Как лучше всего поступить?",
      en: "What is the best response?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Oʻz yondashuvingizni talab qilish — siz buni avval qilgansiz",
          ru: "Настоять на своём подходе — вы уже делали это раньше",
          en: "Insist on your approach — you have done this before",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Uning yondashuvida davom etishiga ruxsat berib, koʻrgan xavflaringizni muhokama qilish va tekshiruvlarni saqlash",
          ru: "Дать ей продолжить по-своему, обсудить риски, которые вы видите, и сохранить точки сверки",
          en: "Let her proceed her way, discuss any risks you see and keep the agreed check-ins",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Avval yondashuvini yozma asoslab berishini soʻrab, keyin qaror qilish",
          ru: "Попросить письменно обосновать подход, а потом решить",
          en: "Ask her to justify the approach in writing, then decide",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Davom etishiga ruxsat berib, rozi boʻlmagan qismlarni keyin jimgina oʻzingiz qayta qilish",
          ru: "Разрешить продолжить, а несогласные части потом молча переделать самому",
          en: "Let her continue, then quietly redo the parts you disagree with",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Vakolat berilganda natija nazorat qilinadi, usul emas: agar yondashuv ishlasa, xodimning egaligini saqlash muhim. Yozma asoslash qabul qilinadi, ammo ishonchni kamaytiradi va jarayonni sekinlashtiradi.",
      ru: "При делегировании контролируют результат, а не способ: если подход рабочий, важно сохранить ответственность сотрудника. Письменное обоснование допустимо, но снижает доверие и тормозит работу.",
      en: "Delegation controls the outcome, not the method: if the approach works, preserving ownership matters. A written justification is defensible but signals distrust and slows things down.",
    },
  },
  {
    key: "manager.delegation.05",
    skill: "delegation",
    specializations: [],
    type: "decision",
    targetLevel: 7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Sizga boʻysunuvchi jamoa rahbarlari kichik qarorlarni ham sizga olib kelishadi. Siz tor joyga aylandingiz: ishlar sizning javobingizni kutib turibdi.",
      ru: "Подчинённые вам руководители команд несут вам даже мелкие решения. Вы стали узким местом: работа ждёт вашего ответа.",
      en: "The team leads who report to you bring you even small decisions. You have become the bottleneck: work waits for your answer.",
    },
    prompt: {
      uz: "Eng toʻgʻri yechim qaysi?",
      ru: "Какое решение лучшее?",
      en: "What is the best fix?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Ular bilan kelishilmagan holda masalalarni olib kelishni toʻxtatishni aytish",
          ru: "Просто сказать им перестать нести вопросы к вам",
          en: "Simply tell them to stop bringing issues to you",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Uzoqroq ishlab, qarorlarni tezroq qabul qilish",
          ru: "Работать дольше и принимать решения быстрее",
          en: "Work longer hours and decide faster",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Har qanday masala uchun avval yozma hisobot talab qilish",
          ru: "Требовать письменную записку перед любым вопросом",
          en: "Require a written memo before any escalation",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Qaror huquqlarini belgilash: nimani oʻzlari hal qiladi, nima haqida xabar beradi, nimaga ruxsat kerak; ilk holatlarda murabbiylik qilish",
          ru: "Определить права решений: что решают сами, о чём сообщают, что согласуют; сопроводить первые случаи",
          en: "Define decision rights — decide alone, inform, or get approval — and coach them through the first cases",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Eskalatsiya chegaralar noaniq boʻlganda koʻpayadi; aniq qaror huquqlari va dastlabki murabbiylik jamoa rahbarlarining mustaqilligini oshiradi. Yozma hisobot oqimni kamaytiradi, ammo ildiz sababni hal qilmaydi.",
      ru: "Эскалаций много, когда границы размыты; явные права решений и сопровождение первых случаев растят самостоятельность руководителей. Письменные записки сокращают поток, но не устраняют причину.",
      en: "Escalations multiply when boundaries are vague; explicit decision rights plus early coaching build the leads' autonomy. Memos reduce the flow but do not fix the root cause.",
    },
  },
  {
    key: "manager.delegation.06",
    skill: "delegation",
    specializations: [],
    type: "self_report",
    targetLevel: 4,
    discrimination: 0.5,
    scoringRule: "likert",
    prompt: {
      uz: "Vazifani topshirganda natijani odatda qanday kelishib olasiz?",
      ru: "Как вы обычно договариваетесь о результате, передавая задачу?",
      en: "When you hand over a task, how do you usually agree on the result?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Vazifa va muddatni aytaman, qolganini xodim oʻzi tushunadi",
          ru: "Называю задачу и срок, остальное сотрудник понимает сам",
          en: "I name the task and the deadline; the rest is up to them",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Nima kerakligini ogʻzaki tushuntiraman va oxirida tekshiraman",
          ru: "Объясняю устно, что нужно, и проверяю в конце",
          en: "I explain verbally what is needed and check at the end",
        },
        score: 0.33,
      },
      {
        key: "c",
        label: {
          uz: "Kutilgan natija va muddatni aytaman, bitta oraliq tekshiruvni kelishaman",
          ru: "Называю ожидаемый результат и срок, договариваюсь об одной промежуточной сверке",
          en: "I state the expected result and deadline and agree one interim check-in",
        },
        score: 0.67,
      },
      {
        key: "d",
        label: {
          uz: "Natija, mezonlar, vakolat va tekshiruvlarni kelishamiz, xodim ularni oʻz soʻzlari bilan takrorlaydi",
          ru: "Согласуем результат, критерии, полномочия и сверки, сотрудник пересказывает их своими словами",
          en: "We agree outcome, criteria, authority and check-ins, and they restate it in their own words",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Natija, mezon va tekshiruv nuqtalari oldindan kelishilsa, topshirilgan ish kamroq qayta qilinadi. Xodimning oʻz soʻzlari bilan takrorlashi tushunmovchilikni erta aniqlaydi.",
      ru: "Когда результат, критерии и точки сверки согласованы заранее, переделок меньше. Пересказ своими словами рано выявляет недопонимание.",
      en: "Agreeing outcome, criteria and check-ins up front means less rework. Having the person restate it surfaces misunderstandings early.",
    },
  },
];
