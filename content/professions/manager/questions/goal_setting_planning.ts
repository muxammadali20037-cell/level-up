import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** manager.goal_setting_planning.NN — gate skill K1; target levels 2, 4, 5, 7, 8. */
export const questions: QuestionInput[] = [
  {
    key: "manager.goal_setting_planning.01",
    skill: "goal_setting_planning",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Quyidagi maqsadlardan qaysi biri eng toʻgʻri shakllantirilgan?",
      ru: "Какая из этих целей сформулирована лучше всего?",
      en: "Which of these goals is best formulated?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Bu yil mijozlarga xizmat koʻrsatish sifatini yaxshilash",
          ru: "В этом году улучшить качество обслуживания клиентов",
          en: "Improve the quality of customer service this year",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "II chorak oxirigacha 2 soatda javob berilgan murojaatlar ulushini 60% dan 85% ga yetkazish",
          ru: "К концу II квартала поднять долю обращений с ответом за 2 часа с 60% до 85%",
          en: "By the end of Q2, raise the share of requests answered within 2 hours from 60% to 85%",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Mijozlar mamnuniyati ustida koʻproq va faolroq ishlash",
          ru: "Больше и активнее работать над удовлетворённостью клиентов",
          en: "Work harder and more actively on customer satisfaction",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Murojaatlarga raqobatchilardan tezroq javob beradigan boʻlish",
          ru: "Отвечать на обращения быстрее, чем конкуренты",
          en: "Answer requests faster than our competitors",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Yaxshi maqsad oʻlchanadigan koʻrsatkich, boshlangʻich va maqsadli qiymat hamda muddatga ega. Qolgan variantlarda natijani tekshirib boʻlmaydi.",
      ru: "Хорошая цель содержит измеримый показатель, исходное и целевое значение и срок. В остальных вариантах результат невозможно проверить.",
      en: "A good goal has a measurable metric, a baseline, a target and a deadline. The other options cannot be checked.",
    },
  },
  {
    key: "manager.goal_setting_planning.02",
    skill: "goal_setting_planning",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    scoringRule: "partial_credit",
    discrimination: 0.7,
    scenario: {
      uz: "Direktor savdo boʻlimingizga (6 kishi) shu chorakda savdoni 20% ga oshirish vazifasini qoʻydi.",
      ru: "Директор поставил вашему отделу продаж (6 человек) задачу увеличить продажи на 20% в этом квартале.",
      en: "The director has asked your sales team (6 people) to grow sales by 20% this quarter.",
    },
    prompt: {
      uz: "Rejalashtirishni nimadan boshlash eng toʻgʻri?",
      ru: "С чего лучше всего начать планирование?",
      en: "What is the best way to start planning?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Jamoaga 20% maqsadni eʼlon qilib, hammadan koʻproq harakat qilishni soʻrash",
          ru: "Объявить команде цель в 20% и попросить всех стараться больше",
          en: "Announce the 20% target and ask everyone to try harder",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Maqsadni teng boʻlish: har bir xodim oʻz savdosini 20% ga oshiradi",
          ru: "Разделить цель поровну: каждый сотрудник увеличивает свои продажи на 20%",
          en: "Split it evenly: each person grows their own sales by 20%",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Maqsadni omillarga (lidlar, konversiya, oʻrtacha chek) boʻlib, haftalik bosqich va masʼullarni belgilash",
          ru: "Разложить цель на драйверы (лиды, конверсия, средний чек), задать недельные этапы и ответственных",
          en: "Break it into drivers (leads, conversion, average order), set weekly milestones and owners",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Birinchi oy natijalarini kutib, keyin reja tuzish",
          ru: "Дождаться результатов первого месяца и потом составить план",
          en: "Wait for the first month's results, then make a plan",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Umumiy maqsad uni harakatga keltiruvchi omillarga boʻlinganda boshqariladigan boʻladi: har bir omilning masʼuli va oraliq nazorat nuqtasi bor. Teng boʻlish yaxshiroq, lekin xodimlar imkoniyatlaridagi farqni hisobga olmaydi.",
      ru: "Общая цель становится управляемой, когда разложена на драйверы с ответственными и промежуточными точками. Деление поровну лучше, чем ничего, но не учитывает разные возможности людей.",
      en: "A top-line target becomes manageable once broken into drivers with owners and interim checkpoints. An even split is better than nothing but ignores differences between people.",
    },
  },
  {
    key: "manager.goal_setting_planning.03",
    skill: "goal_setting_planning",
    specializations: [],
    type: "judgment",
    targetLevel: 5,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Chorak oʻrtasida asosiy bosqich ikki haftaga kechikdi. Yakuniy muddatni oʻzgartirib boʻlmaydi.",
      ru: "В середине квартала ключевой этап отстаёт на две недели. Финальный срок сдвинуть нельзя.",
      en: "Mid-quarter, a key milestone is two weeks behind. The final deadline cannot move.",
    },
    prompt: {
      uz: "Eng toʻgʻri keyingi qadam qaysi?",
      ru: "Какой следующий шаг лучший?",
      en: "What is the best next step?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Hech kimga aytmasdan jamoani qoʻshimcha soatlarda ishlatib, kechikishni qoplash",
          ru: "Никому не сообщая, перевести команду на сверхурочную работу и догнать график",
          en: "Quietly put the team on overtime to catch up",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Direktorga kechikish haqida xabar berib, nima qilish kerakligini soʻrash",
          ru: "Сообщить директору об отставании и спросить, что делать",
          en: "Tell the director about the delay and ask what to do",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Yakuniy muddatni oʻzingiz surib, keyinroq hammaga maʼlum qilish",
          ru: "Самостоятельно сдвинуть срок и сообщить всем позже",
          en: "Move the deadline yourself and inform people later",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Hajmni qayta koʻrib, muhim boʻlmagan ishlarni keyinga qoldirish va yangilangan rejani manfaatdorlarga yetkazish",
          ru: "Пересмотреть объём, отложить менее ценное и донести обновлённый план до заинтересованных сторон",
          en: "Re-plan scope, defer lower-value work and share the updated plan with stakeholders",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Muddat qatʼiy boʻlsa, boshqariladigan oʻzgaruvchi — hajm va ustuvorliklar; rahbar variantlar bilan chiqadi va hammani xabardor qiladi. Faqat muammoni yuqoriga uzatish qabul qilinadi, lekin yechimsiz.",
      ru: "Если срок жёсткий, управляемая переменная — объём и приоритеты; руководитель приходит с вариантами и держит всех в курсе. Просто эскалировать допустимо, но без предложения решения это слабее.",
      en: "With a fixed deadline, scope and priorities are the levers; a manager re-plans and keeps everyone informed. Escalating is acceptable but weaker without a proposed solution.",
    },
  },
  {
    key: "manager.goal_setting_planning.04",
    skill: "goal_setting_planning",
    specializations: [],
    type: "decision",
    targetLevel: 7,
    scoringRule: "partial_credit",
    discrimination: 0.7,
    scenario: {
      uz: "Sizga uchta boʻlim boʻysunadi. Savdo boʻlimi chegirmalar hisobiga hajmni oshirmoqchi, moliya boʻlimi esa marjani himoya qilmoqchi. Yillik maqsadlar bir-biriga zid.",
      ru: "Вам подчиняются три отдела. Продажи хотят наращивать объём за счёт скидок, финансы — защищать маржу. Годовые цели противоречат друг другу.",
      en: "Three departments report to you. Sales wants volume through discounts, finance wants to protect margin. Their annual goals conflict.",
    },
    prompt: {
      uz: "Yillik maqsadlarni qanday belgilash eng toʻgʻri?",
      ru: "Как лучше всего выстроить годовые цели?",
      en: "What is the best way to set the annual goals?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Umumiy natijani (masalan, foydali oʻsish) belgilab, undan boʻlim maqsadlari va murosa qoidalarini birga chiqarish",
          ru: "Задать общий результат (например, прибыльный рост) и вместе вывести из него цели отделов и правила компромиссов",
          en: "Set one shared outcome (e.g. profitable growth) and derive team goals and trade-off rules from it together",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Har bir boʻlim oʻz maqsadini qoʻysin, ziddiyatlar paydo boʻlganda hal qilinadi",
          ru: "Пусть каждый отдел ставит свои цели, а конфликты решаются по мере появления",
          en: "Let each team set its own goals and resolve conflicts as they arise",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Savdo hajmiga ustuvorlik berish, chunki tushum eng koʻrinadigan koʻrsatkich",
          ru: "Отдать приоритет объёму продаж, потому что выручка — самый заметный показатель",
          en: "Prioritize sales volume, since revenue is the most visible metric",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Ikkala boʻlimga ham ikkala koʻrsatkichni teng vazn bilan berish, murosa qoidalarisiz",
          ru: "Дать обоим отделам оба показателя с равным весом, без правил компромисса",
          en: "Give both teams both metrics with equal weight and no trade-off rules",
        },
        score: 0.5,
      },
    ],
    explanation: {
      uz: "Boʻlim maqsadlari bitta yuqori natijadan kelib chiqsa va murosa qoidalari oldindan kelishilsa, ziddiyat tizimli hal boʻladi. Ikkala koʻrsatkichni berish yaxshiroq, lekin qoidalarsiz ziddiyat xodimlar zimmasida qoladi.",
      ru: "Когда цели отделов выведены из одного общего результата, а правила компромисса согласованы заранее, конфликт решается системно. Дать оба показателя лучше, но без правил конфликт остаётся на людях.",
      en: "When team goals cascade from one shared outcome with agreed trade-off rules, the conflict is resolved by design. Giving both metrics helps, but without rules people are left to fight it out.",
    },
  },
  {
    key: "manager.goal_setting_planning.05",
    skill: "goal_setting_planning",
    specializations: [],
    type: "scenario",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Siz qoʻllab-quvvatlash jamoasi bonusini «yopilgan murojaatlar soni»ga bogʻladingiz. Yopilgan murojaatlar koʻpaydi, ammo takroriy shikoyatlar ham oshdi.",
      ru: "Вы привязали бонус команды поддержки к «числу закрытых обращений». Закрытых обращений стало больше, но выросли и повторные жалобы.",
      en: "You tied the support team's bonus to the number of tickets closed. Closed tickets went up, but repeat complaints rose too.",
    },
    prompt: {
      uz: "Eng toʻgʻri oʻzgarish qaysi?",
      ru: "Какое изменение лучше всего?",
      en: "What is the best change?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Yopilgan murojaatlar boʻyicha rejani yanada oshirish",
          ru: "Ещё сильнее поднять план по закрытым обращениям",
          en: "Raise the closed-tickets target even higher",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Bonuslardan barcha koʻrsatkichlarni olib tashlash",
          ru: "Полностью убрать показатели из бонусов",
          en: "Remove metrics from the bonus altogether",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Asosiy koʻrsatkichga sifat koʻrsatkichini (qayta ochilishlar, mijoz bahosi) qoʻshib, tizimni jamoa bilan qayta koʻrish",
          ru: "Дополнить показатель метрикой качества (повторные открытия, оценка клиента) и пересмотреть систему с командой",
          en: "Pair the metric with a quality counter-metric (reopens, customer rating) and redesign it with the team",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Takroriy shikoyatlar koʻp boʻlgan xodimlarni jarimaga tortish",
          ru: "Штрафовать сотрудников, у которых больше повторных жалоб",
          en: "Penalize the people with the most repeat complaints",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Bitta koʻrsatkich maqsadga aylansa, odamlar sifat hisobiga uni optimallashtiradi; muvozanatlovchi sifat koʻrsatkichi bu xavfni kamaytiradi. Koʻrsatkichlarni butunlay olib tashlash buzilishni toʻxtatadi, lekin yoʻnalishni ham yoʻqotadi.",
      ru: "Когда один показатель становится целью, его начинают оптимизировать в ущерб качеству; парная метрика качества снижает этот риск. Убрать показатели совсем — значит остановить искажение, но потерять и ориентир.",
      en: "When a single metric becomes the target, people optimize it at the expense of quality; a paired quality metric limits that. Dropping metrics stops the distortion but also removes direction.",
    },
  },
];
