import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `leadership` — stage 2. Keys: entrepreneur.leadership.NN */
export const questions: QuestionInput[] = [
  {
    key: "entrepreneur.leadership.01",
    skill: "leadership",
    specializations: [],
    type: "judgment",
    targetLevel: 3,
    scoringRule: "partial_credit",
    prompt: {
      uz: "Haftalik hisobotni tayyorlashni xodimga topshirdingiz. Vazifani qanday berish eng toʻgʻri?",
      ru: "Вы поручили сотруднику готовить еженедельный отчёт. Как правильнее всего поставить задачу?",
      en: "You have delegated the weekly report to an employee. What is the best way to hand over the task?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Vazifani berib, faqat biror narsa notoʻgʻri ketsa aralashish",
          ru: "Дать задачу и вмешиваться, только если что-то пойдёт не так",
          en: "Hand it over and step in only if something goes wrong",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Oʻzingiz qanday qilishingizni koʻrsatib, aynan shunday takrorlashni soʻrash",
          ru: "Показать, как делаете вы, и попросить повторять точно так же",
          en: "Show how you do it and ask them to copy it exactly",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Kutilgan natija, muddat, sifat mezonlari va oraliq tekshiruv vaqtini kelishib olish",
          ru: "Договориться о результате, сроке, критериях качества и времени промежуточной проверки",
          en: "Agree on the expected result, deadline, quality criteria and when you will check progress",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Vazifani berib, jarayonni har soatda tekshirib turish",
          ru: "Дать задачу и проверять ход работы каждый час",
          en: "Hand it over and check on progress every hour",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Yaxshi topshiriq natijani aniq belgilaydi va oldindan kelishilgan nazorat nuqtalarini beradi — bu mikromenejmentsiz masʼuliyat yaratadi.",
      ru: "Хорошее делегирование чётко задаёт результат и заранее согласованные точки контроля — это создаёт ответственность без микроменеджмента.",
      en: "Good delegation defines the result and agrees checkpoints upfront, which creates accountability without micromanaging.",
    },
  },
  {
    key: "entrepreneur.leadership.02",
    skill: "leadership",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    scoringRule: "single_best",
    scenario: {
      uz: "Xodim muhim vazifa muddatini ikkinchi marta buzdi. Odatda u yaxshi ishlaydi, bu safar esa sababini aytmadi.",
      ru: "Сотрудник второй раз сорвал срок важной задачи. Обычно он работает хорошо, но в этот раз причину не объяснил.",
      en: "An employee has missed the deadline on an important task for the second time. They usually work well, but gave no reason this time.",
    },
    prompt: {
      uz: "Rahbar sifatida eng toʻgʻri harakat qaysi?",
      ru: "Какое действие руководителя самое правильное?",
      en: "What is the best action as their leader?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Yakkama-yakka gaplashish: faktlarni aniqlash, sababni va aniq oʻzgarishlarni kelishib, keyingi uchrashuv sanasini belgilash",
          ru: "Поговорить один на один: уточнить факты, согласовать причину и конкретные изменения, назначить дату следующей встречи",
          en: "Talk one-on-one: clarify the facts, agree on the cause and specific changes, and set a follow-up date",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Boshqalarga saboq boʻlishi uchun jamoa yigʻilishida tanqid qilish",
          ru: "Покритиковать на общей встрече, чтобы другим был урок",
          en: "Criticize them at the team meeting as a lesson for others",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Boshqa kechikish boʻlmasligi uchun ishni oʻzingiz bajarish",
          ru: "Сделать работу самому, чтобы не было новых задержек",
          en: "Do the work yourself to avoid further delays",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Jamoadagi muhitni buzmaslik uchun eʼtibor bermaslik",
          ru: "Не обращать внимания, чтобы не портить атмосферу в команде",
          en: "Let it go so as not to spoil the team atmosphere",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Takroriy muammo ochiq, lekin hurmat bilan qilingan suhbatni talab qiladi: sababni tushunish va aniq kelishuv bilan masʼuliyatni tiklash.",
      ru: "Повторяющаяся проблема требует прямого, но уважительного разговора: понять причину и вернуть ответственность через конкретную договорённость.",
      en: "A repeated issue calls for a direct but respectful conversation: understand the cause and restore accountability through a concrete agreement.",
    },
  },
  {
    key: "entrepreneur.leadership.03",
    skill: "leadership",
    specializations: [],
    type: "decision",
    targetLevel: 6,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Jamoangiz deyarli har bir qaror uchun sizning roziligingizni kutadi. Siz kuniga 12 soat ishlaysiz, lekin biznes oʻsishi toʻxtab qolgan.",
      ru: "Ваша команда ждёт вашего согласия почти по каждому решению. Вы работаете по 12 часов в день, но рост бизнеса остановился.",
      en: "Your team waits for your approval on almost every decision. You work 12 hours a day, but the business has stopped growing.",
    },
    prompt: {
      uz: "Birinchi navbatda nima qilish kerak?",
      ru: "Что нужно сделать в первую очередь?",
      en: "What should you do first?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Barcha qarorlarni siz oʻrningizga tasdiqlaydigan oʻrinbosar yollash",
          ru: "Нанять заместителя, который будет утверждать все решения вместо вас",
          en: "Hire a deputy who approves every decision instead of you",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Jamoaga koʻproq tashabbus koʻrsatishni aytish",
          ru: "Сказать команде проявлять больше инициативы",
          en: "Tell the team to show more initiative",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Tezroq javob berish uchun yanada koʻproq ishlash",
          ru: "Работать ещё больше, чтобы отвечать быстрее",
          en: "Work even longer hours to answer faster",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Jamoa oʻzi qabul qiladigan qarorlar va chegaralarni belgilab, har bir qadam oʻrniga natijani haftada koʻrib chiqish",
          ru: "Определить, какие решения команда принимает сама и в каких пределах, и раз в неделю разбирать результаты вместо каждого шага",
          en: "Define which decisions the team makes alone and within what limits, then review results weekly instead of each step",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Muammo — vakolatlar aniq boʻlmagani. Chegaralangan vakolat jamoaga mustaqil ishlash imkonini beradi, siz esa natijani nazorat qilasiz. Oʻrinbosar tor joyni faqat boshqa odamga koʻchiradi.",
      ru: "Проблема — в нечётких полномочиях. Ограниченные полномочия позволяют команде действовать самостоятельно, а вы контролируете результат. Заместитель лишь переносит узкое место на другого человека.",
      en: "The issue is unclear decision rights. Bounded authority lets the team act on its own while you control results. A deputy only moves the bottleneck to someone else.",
    },
  },
  {
    key: "entrepreneur.leadership.04",
    skill: "leadership",
    specializations: [],
    type: "judgment",
    targetLevel: 8,
    discrimination: 0.7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Raqamlar chakana savdodan ulgurji savdoga oʻtish kerakligini koʻrsatmoqda. Jamoaning bir qismi bunga qarshi: ular ish joyi va odatiy tartibi uchun xavotirda.",
      ru: "Цифры показывают, что нужно переходить из розницы в опт. Часть команды против: люди переживают за свои места и привычный порядок работы.",
      en: "The numbers show the business should shift from retail to wholesale. Part of the team resists, worried about their jobs and familiar routines.",
    },
    prompt: {
      uz: "Oʻzgarishni boshqarishda eng kuchli yondashuv qaysi?",
      ru: "Какой подход к управлению изменениями самый сильный?",
      en: "What is the strongest approach to leading this change?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Qarorni qatʼiy eʼlon qilib, qarshilik qilganlarni almashtirish",
          ru: "Твёрдо объявить решение и заменить тех, кто сопротивляется",
          en: "Announce the decision firmly and replace those who resist",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Sababni ochiq raqamlar bilan tushuntirish, kalit xodimlarni rejaga jalb qilish, har bir rol uchun oʻzgarishni aniqlash",
          ru: "Объяснить причину честными цифрами, вовлечь ключевых людей в план и определить, что меняется для каждой роли",
          en: "Explain the reason with honest numbers, involve key people in planning, and define what changes for each role",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Hamma rozi boʻlmaguncha oʻzgarishni kechiktirish",
          ru: "Отложить изменения, пока все не согласятся",
          en: "Postpone the change until everyone agrees",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Qarshilik boʻlmasligi uchun oʻzgarishni tushuntirmasdan, sekin-asta joriy qilish",
          ru: "Внедрять изменения постепенно и без объяснений, чтобы избежать сопротивления",
          en: "Roll out the change gradually without explaining it, to avoid resistance",
        },
        score: 0.5,
      },
    ],
    explanation: {
      uz: "Odamlar sababni tushunib, rejani birga tuzganda va oʻz roli aniq boʻlganda oʻzgarishni qoʻllab-quvvatlaydi. Jimgina joriy qilish qisqa muddatda ishlashi mumkin, lekin ishonchni yoʻqotadi.",
      ru: "Люди поддерживают изменения, когда понимают причину, участвуют в плане и знают свою роль. Тихое внедрение может сработать на короткой дистанции, но подрывает доверие.",
      en: "People support change when they understand why, help shape the plan and know their role. A quiet rollout may work short term but erodes trust.",
    },
  },
  {
    key: "entrepreneur.leadership.05",
    skill: "leadership",
    specializations: [],
    type: "self_report",
    targetLevel: 5,
    discrimination: 0.5,
    scoringRule: "likert",
    prompt: {
      uz: "Topshirilgan vazifalar qanday ketayotganini qanday kuzatasiz?",
      ru: "Как вы следите за ходом делегированных задач?",
      en: "How do you keep track of tasks you have delegated?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Odatda vazifani qaytarib olaman yoki qayta bajaraman",
          ru: "Обычно забираю задачу обратно или переделываю сам(а)",
          en: "I usually take the task back or redo it myself",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Faqat biror narsa notoʻgʻri ketganda soʻrayman",
          ru: "Спрашиваю, только когда что-то пошло не так",
          en: "I ask only when something has gone wrong",
        },
        score: 0.33,
      },
      {
        key: "c",
        label: {
          uz: "Esimga tushganda soʻrayman, aniq sanalarsiz",
          ru: "Уточняю, когда вспоминаю, без фиксированных дат",
          en: "I check in when I remember, without fixed dates",
        },
        score: 0.67,
      },
      {
        key: "d",
        label: {
          uz: "Natija va tekshiruv sanalarini oldindan kelishib, muntazam koʻrib chiqaman",
          ru: "Заранее согласую результат и даты проверки и регулярно их разбираю",
          en: "I agree on results and check-in dates upfront and review them regularly",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Oldindan kelishilgan natija va muntazam tekshiruv mikromenejmentsiz nazoratni taʼminlaydi.",
      ru: "Заранее согласованный результат и регулярные проверки дают контроль без микроменеджмента.",
      en: "Agreed results and regular check-ins give control without micromanagement.",
    },
  },
];
