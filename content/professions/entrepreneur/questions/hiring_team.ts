import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `hiring_team` — stage 2. Keys: entrepreneur.hiring_team.NN */
export const questions: QuestionInput[] = [
  {
    key: "entrepreneur.hiring_team.01",
    skill: "hiring_team",
    specializations: [],
    type: "judgment",
    targetLevel: 2,
    scoringRule: "partial_credit",
    prompt: {
      uz: "Kichik doʻkoningizga birinchi xodimni olmoqchisiz. Vakansiya eʼlon qilishdan oldin eng avvalo nimani tayyorlash kerak?",
      ru: "Вы хотите взять первого сотрудника в свой небольшой магазин. Что важнее всего подготовить до публикации вакансии?",
      en: "You want to hire the first employee for your small shop. What should you prepare first, before posting the vacancy?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Aniq vazifalar, kutilgan natijalar va qancha toʻlay olishingiz",
          ru: "Конкретные задачи, ожидаемые результаты и сколько вы можете платить",
          en: "The specific tasks, expected results and what you can afford to pay",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Kerakli shaxsiy fazilatlar roʻyxati: masʼuliyatli, stressga chidamli va hokazo",
          ru: "Список желаемых качеств: ответственный, стрессоустойчивый и т. п.",
          en: "A list of desired traits: responsible, handles stress well and so on",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Tanishlardan kimni tavsiya qila olishlarini soʻrash",
          ru: "Спросить знакомых, кого они могут порекомендовать",
          en: "Ask friends whom they can recommend",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Eng yaxshilarni jalb qilish uchun bozordagi eng yuqori maoshni belgilash",
          ru: "Назначить самую высокую зарплату на рынке, чтобы привлечь лучших",
          en: "Set the highest salary on the market to attract the best people",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Vazifa va natija aniq boʻlmasa, nomzodni baholash ham, uni ishga moslashtirish ham qiyin. Fazilatlar muhim, lekin ular aniq ishga bogʻlanganda maʼno kasb etadi.",
      ru: "Без ясных задач и результатов трудно и оценить кандидата, и ввести его в работу. Качества важны, но имеют смысл только в привязке к конкретной работе.",
      en: "Without clear tasks and results it is hard to assess a candidate or onboard them. Traits matter, but only once they are tied to concrete work.",
    },
  },
  {
    key: "entrepreneur.hiring_team.02",
    skill: "hiring_team",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    scoringRule: "single_best",
    scenario: {
      uz: "Yangi xodim ishlay boshlaganiga 2 hafta boʻldi va koʻp xato qilyapti. Unga hech kim jarayonlarni tushuntirmagan, siz esa doim band edingiz.",
      ru: "Новый сотрудник работает 2 недели и делает много ошибок. Процессы ему никто не объяснил, а вы всё время были заняты.",
      en: "A new employee has been working for 2 weeks and makes many mistakes. Nobody explained the processes, and you have been busy the whole time.",
    },
    prompt: {
      uz: "Eng toʻgʻri qadam qaysi?",
      ru: "Какой шаг самый правильный?",
      en: "What is the best step?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Tajribaliroq odam topib, uni almashtirish",
          ru: "Найти более опытного человека и заменить его",
          en: "Find someone more experienced and replace them",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Xatolar davom etsa, ishdan boʻshatilishi haqida ogohlantirish",
          ru: "Предупредить, что при повторении ошибок он будет уволен",
          en: "Warn them they will be let go if the mistakes continue",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Moslashtirish rejasini berish: yozma qadamlar, savol beriladigan odam, dastlabki haftalarda qisqa kunlik suhbat",
          ru: "Дать план адаптации: письменные шаги, к кому обращаться с вопросами, короткие ежедневные встречи в первые недели",
          en: "Give a structured onboarding: written steps, a go-to person for questions, short daily check-ins at first",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Boshqa xodimlarni kuzatib oʻzi oʻrganishini kutish",
          ru: "Ждать, пока он научится сам, наблюдая за другими",
          en: "Wait for them to learn by watching the others",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Xatolarning sababi — moslashtirish yoʻqligi, odamning oʻzi emas. Tizimli moslashtirishsiz keyingi xodim ham xuddi shu xatolarni qiladi.",
      ru: "Причина ошибок — отсутствие адаптации, а не сам человек. Без системной адаптации следующий сотрудник повторит те же ошибки.",
      en: "The mistakes come from missing onboarding, not the person. Without structured onboarding the next hire will repeat the same errors.",
    },
  },
  {
    key: "entrepreneur.hiring_team.03",
    skill: "hiring_team",
    specializations: [],
    type: "decision",
    targetLevel: 6,
    discrimination: 0.7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Eng kuchli xodimingiz maoshini 40% ga oshirishni soʻradi, aks holda raqobatchiga ketishini aytdi. Bunday oshirish jamoadagi maoshlar mutanosibligini buzadi.",
      ru: "Ваш самый сильный сотрудник просит поднять зарплату на 40%, иначе уйдёт к конкуренту. Такое повышение нарушит баланс зарплат в команде.",
      en: "Your strongest employee asks for a 40% raise or will leave for a competitor. Such a raise would break pay fairness in the team.",
    },
    prompt: {
      uz: "Eng toʻgʻri yoʻl qaysi?",
      ru: "Какой путь самый верный?",
      en: "What is the best way forward?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Darhol rozi boʻlish: uni yoʻqotish qimmatroq tushadi",
          ru: "Сразу согласиться: потерять его обойдётся дороже",
          en: "Agree at once: losing them would cost more",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Soʻrovning asl sababini bilish, oshirishni kattaroq rol yoki natijaga bogʻlash, butun jamoa maoshlarini qayta koʻrish",
          ru: "Выяснить настоящую причину, привязать повышение к большей роли или результатам и пересмотреть зарплаты всей команды",
          en: "Learn what drives the request, tie a raise to a bigger role or results, and review pay across the team",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Rad etish: oʻrnini bosib boʻlmaydigan odam yoʻq",
          ru: "Отказать: незаменимых людей нет",
          en: "Refuse: nobody is irreplaceable",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Aniq muddat aytmasdan keyinroq oshirishni vaʼda qilish",
          ru: "Пообещать повышение позже, не называя сроков",
          en: "Promise a raise later without naming a date",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Kalit xodimni saqlash va adolatli maosh tizimi bir-biriga zid boʻlmasligi kerak. Oshirishni kengroq masʼuliyatga bogʻlash ikkalasini ham saqlaydi; tez rozi boʻlish odamni saqlaydi, lekin keyingi muammoni tugʻdiradi.",
      ru: "Удержание ключевого сотрудника и справедливая система оплаты не должны противоречить друг другу. Привязка повышения к большей ответственности сохраняет и то, и другое; быстрое согласие удержит человека, но создаст следующую проблему.",
      en: "Keeping a key person and a fair pay system should not conflict. Tying a raise to more responsibility protects both; agreeing quickly keeps the person but creates the next problem.",
    },
  },
  {
    key: "entrepreneur.hiring_team.04",
    skill: "hiring_team",
    specializations: [],
    type: "judgment",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Jamoa bir yil ichida 8 kishidan 30 kishiga oʻsadi. Asoschi har bir nomzod bilan shaxsan suhbatlashadi va yollash jarayonining eng tor joyiga aylangan.",
      ru: "За год команда вырастет с 8 до 30 человек. Основатель лично собеседует каждого кандидата и стал узким местом найма.",
      en: "The team will grow from 8 to 30 people within a year. The founder interviews every candidate personally and has become the hiring bottleneck.",
    },
    prompt: {
      uz: "Eng toʻgʻri oʻzgarish qaysi?",
      ru: "Какое изменение самое правильное?",
      en: "What is the best change?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Yollashni toʻliqligicha tashqi agentlikka topshirish",
          ru: "Полностью передать найм внешнему агентству",
          en: "Hand all hiring over to an external agency",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Har bir nomzod bilan shaxsan suhbatlashishni davom ettirish: madaniyat shunga bogʻliq",
          ru: "Продолжать лично собеседовать каждого: от этого зависит культура",
          en: "Keep interviewing everyone personally: the culture depends on it",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Talabni pasaytirib tezroq yollash, mos kelmaganlarni keyin boʻshatish",
          ru: "Снизить планку и нанимать быстрее, а неподходящих потом увольнять",
          en: "Lower the bar to hire faster and let go of poor fits later",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Rol talablari, tuzilgan suhbat va amaliy topshiriqli jarayon yaratib, rahbarlarni oʻrgatish; kalit rollarda yakuniy soʻz asoschida",
          ru: "Создать процесс с профилями ролей, структурным интервью и практическим заданием, обучить руководителей; по ключевым ролям финальное слово за основателем",
          en: "Build a process with role scorecards, structured interviews and work tasks, train managers; founder decides only key roles",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Oʻsish bosqichida sifatni asoschining shaxsan ishtiroki emas, takrorlanadigan jarayon taʼminlaydi. Asoschi oʻz eʼtiborini eng muhim rollarga qaratadi.",
      ru: "На этапе роста качество найма обеспечивает воспроизводимый процесс, а не личное участие основателя. Основатель сосредотачивается на ключевых ролях.",
      en: "At the growth stage, hiring quality comes from a repeatable process, not the founder's presence. The founder focuses on the most critical roles.",
    },
  },
];
