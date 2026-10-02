import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** manager.decision_making.NN — target levels 2, 4, 6, 8. */
export const questions: QuestionInput[] = [
  {
    key: "manager.decision_making.01",
    skill: "decision_making",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Qaytarib boʻladigan va qaytarib boʻlmaydigan qarorlarni qabul qilish usuli qanday farq qilishi kerak?",
      ru: "Чем должен отличаться подход к обратимым и необратимым решениям?",
      en: "How should your approach differ between reversible and irreversible decisions?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Farq qilmasligi kerak — har qanday qaror bir xil chuqur tahlil talab qiladi",
          ru: "Ничем — любое решение требует одинаково глубокого анализа",
          en: "It shouldn't — every decision needs the same deep analysis",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Qaytarib boʻlmaydiganlarini vaqt yoʻqotmaslik uchun tezroq qabul qilish kerak",
          ru: "Необратимые нужно принимать быстрее, чтобы не терять время",
          en: "Irreversible ones should be made faster so no time is lost",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Qaytarib boʻladiganlarini tez va tor doirada, qaytarib boʻlmaydiganlarini koʻproq tahlil va fikr bilan",
          ru: "Обратимые — быстро и узким кругом, необратимые — с бо́льшим анализом и мнениями",
          en: "Reversible ones quickly by a few people; irreversible ones with more analysis and input",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Qaytarib boʻladigan qarorlarni har doim yuqori rahbarga yuborish kerak",
          ru: "Обратимые решения всегда нужно передавать вышестоящему руководителю",
          en: "Reversible decisions should always go to your own boss",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Xato qimmatga tushadigan va tuzatib boʻlmaydigan qarorlar koʻproq tahlilni oqlaydi. Qaytarib boʻladigan qarorlarda tezlik koʻpincha aniqlikdan muhimroq.",
      ru: "Решения, ошибка в которых дорога и неисправима, оправдывают больше анализа. В обратимых решениях скорость часто важнее точности.",
      en: "Decisions that are costly and hard to undo justify more analysis. For reversible ones, speed usually matters more than precision.",
    },
  },
  {
    key: "manager.decision_making.02",
    skill: "decision_making",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Ikki xodim ikki xil CRM tizimini taklif qilmoqda. Maʼlumot qisman bor, qaror bir hafta ichida kerak.",
      ru: "Два сотрудника предлагают две разные CRM-системы. Данные есть частично, решение нужно в течение недели.",
      en: "Two team members propose two different CRM tools. Data is partial, and a decision is needed within a week.",
    },
    prompt: {
      uz: "Qanday qaror qabul qilish eng toʻgʻri?",
      ru: "Как лучше всего принять решение?",
      en: "What is the best way to decide?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Tajribaliroq xodim taklif qilgan tizimni tanlash",
          ru: "Выбрать систему, которую предложил более опытный сотрудник",
          en: "Pick the tool proposed by the more senior person",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Jamoada ovozga qoʻyish va koʻpchilik tanlovini qabul qilish",
          ru: "Провести голосование в команде и принять выбор большинства",
          en: "Hold a team vote and go with the majority",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Toʻliq maʼlumot yigʻilmaguncha qarorni keyinga surish",
          ru: "Отложить решение, пока не будет полной информации",
          en: "Postpone the decision until full information is available",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Mezonlarni (narx, moslik, joriy qilish mehnati) kelishib, ikkala variantni ular boʻyicha solishtirib, sababini tushuntirish",
          ru: "Согласовать критерии (цена, соответствие, трудоёмкость внедрения), сравнить по ним варианты и объяснить выбор",
          en: "Agree criteria (cost, fit, rollout effort), compare both against them, decide and explain why",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Oldindan kelishilgan mezonlar qarorni shaxslardan ajratadi va uni tushuntirishni osonlashtiradi. Ovoz berish ishtirokni oshiradi, ammo mezonlarsiz mashhur variant yutishi mumkin.",
      ru: "Заранее согласованные критерии отделяют решение от личностей и делают его объяснимым. Голосование повышает вовлечённость, но без критериев побеждает популярное, а не лучшее.",
      en: "Agreed criteria separate the decision from personalities and make it explainable. A vote builds buy-in, but without criteria the popular option may win over the best one.",
    },
  },
  {
    key: "manager.decision_making.03",
    skill: "decision_making",
    specializations: [],
    type: "judgment",
    targetLevel: 6,
    scoringRule: "partial_credit",
    discrimination: 0.7,
    scenario: {
      uz: "Siz joriy qilgan yangi smena jadvali bir oydan keyin qoʻshimcha ish soatlarini oshirib yubordi. Jamoa norozi.",
      ru: "Новый график смен, который вы ввели, через месяц увеличил переработки. Команда недовольна.",
      en: "A month after you introduced a new shift schedule, overtime has gone up. The team is unhappy.",
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
          uz: "Izchil koʻrinish uchun qaroringizni himoya qilib, biroz kutish",
          ru: "Защищать своё решение ради последовательности и подождать",
          en: "Defend the decision for the sake of consistency and wait",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Xatoni ochiq tan olib, qaysi taxmin notoʻgʻri boʻlganini tahlil qilish, jadvalni tuzatish va xulosani ulashish",
          ru: "Открыто признать ошибку, разобрать, какое допущение не сработало, скорректировать график и поделиться выводами",
          en: "Own it openly, find which assumption failed, adjust the schedule and share what you learned",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Hech narsa tushuntirmasdan eski jadvalga jimgina qaytish",
          ru: "Молча вернуть старый график без объяснений",
          en: "Quietly revert to the old schedule without explanation",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Jadval toʻgʻri, muammo jamoaning uni bajarishida deb tushuntirish",
          ru: "Объяснить, что график верный, а проблема в исполнении командой",
          en: "Explain that the schedule is right and the team is executing it badly",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Qaror uchun javobgarlik — natijani tan olish, sababini tushunish va tuzatish. Jimgina qaytish zararni toʻxtatadi, lekin ishonch va saboqni yoʻqotadi.",
      ru: "Ответственность за решение — это признать результат, понять причину и исправить. Тихий откат останавливает вред, но теряет доверие и урок.",
      en: "Owning a decision means acknowledging the result, understanding why and correcting it. A silent revert stops the harm but loses trust and the lesson.",
    },
  },
  {
    key: "manager.decision_making.04",
    skill: "decision_making",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Kompaniya Samarqandda ikkinchi filial ochish yoki Toshkentdagi asosiy filialni kuchaytirish oʻrtasida tanlov qilmoqda. Maʼlumot toʻliq emas, ikkala yoʻl ham katta sarmoya talab qiladi.",
      ru: "Компания выбирает между открытием второго филиала в Самарканде и усилением основного филиала в Ташкенте. Данных недостаточно, оба пути требуют крупных вложений.",
      en: "The company is choosing between opening a second branch in Samarkand and strengthening the main branch in Tashkent. Data is incomplete and both paths need major investment.",
    },
    prompt: {
      uz: "Qarorga qanday yondashish eng toʻgʻri?",
      ru: "Как лучше всего подойти к решению?",
      en: "What is the best way to approach the decision?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Nima rost boʻlishi kerakligini aniqlab, eng xavfli taxminni arzon sinovda tekshirish va qaror muddati hamda mezonlarini belgilash",
          ru: "Определить, что должно быть правдой, дёшево проверить самое рискованное допущение, задать срок и критерии решения",
          en: "Define what must be true, test the riskiest assumption cheaply, and set a decision date and criteria",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Tezlik muhim, shuning uchun tajribaga tayanib darhol qaror qilish",
          ru: "Скорость важна, поэтому сразу решить, опираясь на опыт",
          en: "Speed matters, so decide right away based on experience",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Katta bozor tadqiqotiga buyurtma berib, natijalarini kutish",
          ru: "Заказать большое исследование рынка и дождаться результатов",
          en: "Commission a large market study and wait for the results",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Imkoniyatni boy bermaslik uchun ikkalasini ham toʻliq hajmda boshlash",
          ru: "Запустить оба направления в полном объёме, чтобы не упустить шанс",
          en: "Launch both at full scale so no opportunity is missed",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Katta va qiyin qaytariladigan qarorda asosiy noaniqlikni arzon sinov bilan kamaytirish va oldindan mezon qoʻyish xavf va vaqtni muvozanatlaydi. Katta tadqiqot foydali boʻlishi mumkin, ammo sekin va asosiy taxminni toʻgʻridan-toʻgʻri sinamaydi.",
      ru: "В крупном, трудно обратимом решении дешёвая проверка ключевого допущения и заранее заданные критерии балансируют риск и время. Большое исследование может помочь, но оно медленное и не проверяет допущение напрямую.",
      en: "For a large, hard-to-reverse bet, cheaply testing the key assumption and pre-setting criteria balances risk and speed. A big study can help but is slow and does not test the assumption directly.",
    },
  },
];
