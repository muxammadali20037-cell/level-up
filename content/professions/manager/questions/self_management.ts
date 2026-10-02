import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** manager.self_management.NN — target levels 2, 4, 6, 7 + one self_report. */
export const questions: QuestionInput[] = [
  {
    key: "manager.self_management.01",
    skill: "self_management",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Muhim, lekin shoshilinch boʻlmagan ishlarni (rejalashtirish, jamoani rivojlantirish) qanday bajarish eng toʻgʻri?",
      ru: "Как лучше всего работать с важными, но несрочными делами (планирование, развитие команды)?",
      en: "What is the best way to handle important but non-urgent work (planning, developing the team)?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Boʻsh vaqt paydo boʻlganda bajarish",
          ru: "Делать, когда появится свободное время",
          en: "Do it whenever free time comes up",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Har doim boshqa xodimga topshirish",
          ru: "Всегда передавать другому сотруднику",
          en: "Always hand it to someone else",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Shoshilinch boʻlib qolmaguncha chetga qoʻyish",
          ru: "Откладывать, пока не станет срочным",
          en: "Put it aside until it becomes urgent",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Taqvimda oldindan alohida vaqt ajratib qoʻyish",
          ru: "Заранее выделять под них отдельное время в календаре",
          en: "Block dedicated time for it in your calendar in advance",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Muhim, lekin shoshilinch boʻlmagan ishlar shoshilinch ishlar orasida yoʻqolib ketadi, shuning uchun ularga oldindan vaqt ajratiladi. Ularni kutib turish keyinchalik inqirozlarga olib keladi.",
      ru: "Важные, но несрочные дела вытесняются срочными, поэтому время под них резервируют заранее. Откладывание превращает их в будущие кризисы.",
      en: "Important but non-urgent work gets crowded out by urgent tasks, so you reserve time for it in advance. Postponing it turns it into tomorrow's crisis.",
    },
  },
  {
    key: "manager.self_management.02",
    skill: "self_management",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Bugun taqvimingizda 9 ta uchrashuv, messenjerda 40 ta oʻqilmagan xabar bor. Soat 18:00 gacha direktorga reja topshirishni vaʼda qilgansiz.",
      ru: "Сегодня у вас в календаре 9 встреч и 40 непрочитанных сообщений в мессенджере. Вы обещали директору план до 18:00.",
      en: "Today you have 9 meetings and 40 unread messages. You promised the director a plan by 18:00.",
    },
    prompt: {
      uz: "Kunni qanday tashkil qilish eng toʻgʻri?",
      ru: "Как лучше всего организовать день?",
      en: "What is the best way to organize the day?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Avval barcha xabarlarga javob berib, keyin rejaga oʻtish",
          ru: "Сначала ответить на все сообщения, потом заняться планом",
          en: "Clear all the messages first, then work on the plan",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Rejaga 2 soat ajratish, keraksiz uchrashuvlarni rad etish yoki topshirish, xabarlarni belgilangan vaqtda koʻrish",
          ru: "Выделить 2 часа на план, отклонить или делегировать лишние встречи, разбирать сообщения в отведённое время",
          en: "Block 2 hours for the plan, decline or delegate non-essential meetings, batch messages at set times",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Barcha uchrashuvlarga borib, rejani kechqurun yozish",
          ru: "Сходить на все встречи, а план написать вечером",
          en: "Attend every meeting and write the plan in the evening",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Direktordan muddatni ertangi kunga surishni soʻrash",
          ru: "Попросить директора перенести срок на завтра",
          en: "Ask the director to move the deadline to tomorrow",
        },
        score: 0.5,
      },
    ],
    explanation: {
      uz: "Vaʼda qilingan eng muhim natijaga avval himoyalangan vaqt ajratiladi, qolgan ishlar unga moslashtiriladi. Muddatni surishni soʻrash halol, ammo kunni boshqarish oʻrniga muammoni boshqalarga oʻtkazadi.",
      ru: "Сначала защищают время под главный обещанный результат, остальное подстраивают под него. Попросить перенос честно, но это перекладывает проблему вместо управления днём.",
      en: "Protect time for the key commitment first and fit everything else around it. Asking for an extension is honest but shifts the problem instead of managing the day.",
    },
  },
  {
    key: "manager.self_management.03",
    skill: "self_management",
    specializations: [],
    type: "judgment",
    targetLevel: 6,
    scoringRule: "partial_credit",
    discrimination: 0.7,
    scenario: {
      uz: "Bir necha haftadan beri jamoaga asabiy munosabatdasiz, kam uxlaysiz va har kuni ishni uyga olib ketasiz.",
      ru: "Уже несколько недель вы раздражительны с командой, мало спите и каждый день берёте работу домой.",
      en: "For several weeks you have been short-tempered with the team, sleeping little and taking work home every day.",
    },
    prompt: {
      uz: "Eng toʻgʻri yondashuv qaysi?",
      ru: "Какой подход лучший?",
      en: "What is the best approach?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Chorak tugaguncha chidash, keyin dam olish",
          ru: "Потерпеть до конца квартала, а потом отдохнуть",
          en: "Push through until the quarter ends, then rest",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Jamoadan uzr soʻrash, lekin ish tartibini oʻzgartirmaslik",
          ru: "Извиниться перед командой, но ничего не менять в работе",
          en: "Apologize to the team but keep working the same way",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Majburiyatlarni qayta koʻrib, bir qismini topshirish yoki toʻxtatish, chegaralar qoʻyish va dam olish tartibini tiklash",
          ru: "Пересмотреть обязательства, часть делегировать или убрать, задать границы и восстановить режим отдыха",
          en: "Review commitments, delegate or drop some, set boundaries and restore a recovery routine",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Ishni hech kimga topshirmasdan to‘satdan ikki haftaga taʼtilga chiqish",
          ru: "Внезапно уйти в отпуск на две недели, никому не передав дела",
          en: "Suddenly take two weeks off without handing anything over",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Bu belgilar yuklama va imkoniyat oʻrtasidagi nomuvofiqlikni koʻrsatadi; uni ish hajmini qayta taqsimlash va chegaralar orqali hal qilish kerak. Uzr soʻrash toʻgʻri qadam, ammo sababni oʻzgartirmaydi.",
      ru: "Эти признаки говорят о разрыве между нагрузкой и ресурсом; его решают перераспределением работы и границами. Извиниться правильно, но причину это не меняет.",
      en: "These signs point to a gap between workload and capacity, which is fixed by redistributing work and setting boundaries. Apologizing is right but does not address the cause.",
    },
  },
  {
    key: "manager.self_management.04",
    skill: "self_management",
    specializations: [],
    type: "decision",
    targetLevel: 7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Siz jamoaga soat 20:00 dan keyin xabarlarga javob bermaslikni aytgansiz, lekin oʻzingiz soat 23:00 da vazifalar yuborasiz.",
      ru: "Вы сказали команде не отвечать на сообщения после 20:00, но сами отправляете задачи в 23:00.",
      en: "You told the team not to answer messages after 20:00, yet you send them tasks at 23:00.",
    },
    prompt: {
      uz: "Eng toʻgʻri qaror qaysi?",
      ru: "Какое решение лучшее?",
      en: "What is the best decision?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Kechasi yuborishda davom etib, «ertaga javob bering» deb qoʻshib qoʻyish",
          ru: "Продолжать отправлять ночью, добавляя «ответьте завтра»",
          en: "Keep sending at night but add “reply tomorrow”",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Xabarlarni ish vaqtiga rejalashtirib yuborish va oʻz xatti-harakatingizni qoidaga moslashtirish",
          ru: "Ставить отложенную отправку на рабочее время и привести своё поведение в соответствие с правилом",
          en: "Schedule messages for working hours and bring your own behaviour in line with the rule",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Qoidani bekor qilish — baribir hamma kechqurun ham ishlaydi",
          ru: "Отменить правило — всё равно все работают и вечером",
          en: "Drop the rule — everyone works evenings anyway",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Kechki xabarlarni faqat katta xodimlarga yuborish",
          ru: "Отправлять вечерние сообщения только старшим сотрудникам",
          en: "Send late-night messages only to senior staff",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Jamoa rahbarning soʻziga emas, xatti-harakatiga qarab ishlaydi; kechki xabar bosim sifatida qabul qilinadi. «Ertaga javob bering» yozuvi bosimni kamaytiradi, ammo namunani oʻzgartirmaydi.",
      ru: "Команда ориентируется на поведение руководителя, а не на слова; ночное сообщение воспринимается как давление. Приписка «ответьте завтра» смягчает его, но не меняет пример.",
      en: "Teams follow what the manager does, not what they say; a late-night message reads as pressure. Adding “reply tomorrow” softens it but does not change the example you set.",
    },
  },
  {
    key: "manager.self_management.05",
    skill: "self_management",
    specializations: [],
    type: "self_report",
    targetLevel: 4,
    discrimination: 0.5,
    scoringRule: "likert",
    prompt: {
      uz: "Ish haftangizni odatda qanday rejalashtirasiz?",
      ru: "Как вы обычно планируете свою рабочую неделю?",
      en: "How do you usually plan your work week?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Rejalashtirmayman — kelgan ishlarga qarab harakat qilaman",
          ru: "Не планирую — действую по ситуации",
          en: "I don't plan — I react to whatever comes in",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Ishlar roʻyxatini yuritaman, lekin ustuvorliksiz",
          ru: "Веду список дел, но без приоритетов",
          en: "I keep a to-do list, without priorities",
        },
        score: 0.33,
      },
      {
        key: "c",
        label: {
          uz: "Hafta boshida asosiy ustuvorliklarni tanlab, ayrimlariga vaqt ajrataman",
          ru: "В начале недели выбираю главные приоритеты и под часть из них блокирую время",
          en: "At the start of the week I pick top priorities and block time for some",
        },
        score: 0.67,
      },
      {
        key: "d",
        label: {
          uz: "Haftalik koʻrib chiqish: ustuvorliklar jamoa maqsadlariga bogʻlangan, vaqt ajratilgan, hafta oxirida tahlil qilinadi",
          ru: "Еженедельный обзор: приоритеты связаны с целями команды, время заблокировано, в конце недели — разбор",
          en: "A weekly review: priorities tied to team goals, time blocked, and a check-back at week's end",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Muntazam haftalik koʻrib chiqish ustuvorliklarni jamoa maqsadlari bilan bogʻlaydi va rejani vaqtida tuzatishga imkon beradi.",
      ru: "Регулярный недельный обзор связывает приоритеты с целями команды и позволяет вовремя корректировать план.",
      en: "A regular weekly review ties priorities to team goals and lets you correct course in time.",
    },
  },
];
