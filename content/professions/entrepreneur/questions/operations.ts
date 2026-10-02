import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `operations` — stage 2. Keys: entrepreneur.operations.NN */
export const questions: QuestionInput[] = [
  {
    key: "entrepreneur.operations.01",
    skill: "operations",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Takrorlanadigan ish uchun yozma cheklist (standart tartib) eng avvalo nimaga kerak?",
      ru: "Для чего в первую очередь нужен письменный чек-лист (стандарт) для повторяющейся работы?",
      en: "What is the main purpose of a written checklist (standard procedure) for a repeated task?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Xodimlarni nazorat qilish va kim aybdorligini topish uchun",
          ru: "Чтобы контролировать сотрудников и находить виноватых",
          en: "To control employees and find out who is to blame",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Yangi xodimlarni oʻqitishni butunlay almashtirish uchun",
          ru: "Чтобы полностью заменить обучение новых сотрудников",
          en: "To fully replace training for new staff",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Ishni bir marta hujjatlashtirib, tekshiruvlarda koʻrsatish uchun",
          ru: "Чтобы один раз описать работу и показывать при проверках",
          en: "To document the task once and show it during inspections",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Ishni kim bajarishidan qatʼi nazar, bir xil tartib va sifatda bajarilishi uchun",
          ru: "Чтобы работа выполнялась одинаково и с тем же качеством, кто бы её ни делал",
          en: "So the task is done the same way and to the same quality, whoever does it",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Cheklist natijani egasi yoki tajribali xodimning xotirasiga emas, aniq tartibga bogʻlaydi — shunda sifat takrorlanadi.",
      ru: "Чек-лист привязывает результат к понятному порядку, а не к памяти владельца или опытного сотрудника, — так качество становится воспроизводимым.",
      en: "A checklist ties the result to a clear routine instead of the owner's or a veteran's memory, which makes quality repeatable.",
    },
  },
  {
    key: "entrepreneur.operations.02",
    skill: "operations",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Siz kichik kafe egasisiz. Siz joyida boʻlgan kunlari mijozlar mamnun. Siz yoʻq kunlari esa taomlar sifati va xizmat tezligi haqida shikoyatlar koʻpayadi.",
      ru: "Вы владелец небольшого кафе. В дни, когда вы на месте, клиенты довольны. Когда вас нет, жалоб на качество блюд и скорость обслуживания становится больше.",
      en: "You own a small café. On days you are there, customers are happy. On days you are away, complaints about food quality and service speed go up.",
    },
    prompt: {
      uz: "Eng toʻgʻri keyingi qadam qaysi?",
      ru: "Какой следующий шаг самый правильный?",
      en: "What is the best next step?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Har kuni kafeda boʻlishga harakat qilish",
          ru: "Стараться быть в кафе каждый день",
          en: "Try to be at the café every day",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Asosiy taomlar va xizmat bosqichlarini standart sifatida yozib, xodimlar bilan sinab koʻrish",
          ru: "Записать ключевые блюда и этапы обслуживания как стандарты и проверить их вместе с персоналом",
          en: "Write down key dishes and service steps as standards and test them with the staff",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Shikoyat boʻlgan har bir holat uchun xodimlarga jarima belgilash",
          ru: "Штрафовать сотрудников за каждую жалобу",
          en: "Fine staff for every complaint",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Tajribali menejer yollab, sifatni unga topshirish",
          ru: "Нанять опытного управляющего и поручить качество ему",
          en: "Hire an experienced manager and hand quality over to them",
        },
        score: 0.5,
      },
    ],
    explanation: {
      uz: "Sifat egasiga bogʻlanib qolgan — demak, uning bilimi hali tizimga aylanmagan. Standartlar menejer uchun ham asos boʻladi, ularsiz u ham faqat oʻz tajribasiga tayanadi.",
      ru: "Качество держится на владельце — значит, его знания ещё не стали системой. Стандарты нужны и управляющему: без них он тоже опирается только на свой опыт.",
      en: "Quality depends on the owner, so the know-how has not become a system yet. Standards also give a manager a base; without them they rely only on their own habits.",
    },
  },
  {
    key: "entrepreneur.operations.03",
    skill: "operations",
    specializations: [],
    type: "decision",
    targetLevel: 5,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Onlayn doʻkoningizda bir nechta muammo bor: buyurtmalarning bir qismi notoʻgʻri tovar bilan joʻnatiladi va pul qaytariladi; ijtimoiy tarmoqlarda javoblar kechikadi; ombor javonlari tartibsiz; haftalik hisobot shakli yoʻq.",
      ru: "В вашем онлайн-магазине несколько проблем: часть заказов уходит с неверным товаром и деньги возвращаются; в соцсетях отвечают с задержкой; на полках склада беспорядок; нет формы недельного отчёта.",
      en: "Your online store has several problems: some orders ship with the wrong item and get refunded; replies on social media are slow; warehouse shelves are messy; there is no weekly report template.",
    },
    prompt: {
      uz: "Qaysi jarayonni birinchi navbatda standartlashtirish kerak?",
      ru: "Какой процесс нужно стандартизировать в первую очередь?",
      en: "Which process should you standardize first?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Buyurtmani yigʻish va joʻnatishdan oldin tekshirish tartibi",
          ru: "Порядок сборки заказа и проверки перед отправкой",
          en: "Order picking and the check before shipping",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Ombor javonlarini joylashtirish tartibi",
          ru: "Порядок размещения товара на полках склада",
          en: "How stock is arranged on warehouse shelves",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Ijtimoiy tarmoqlardagi xabarlarga javob berish shablonlari",
          ru: "Шаблоны ответов на сообщения в соцсетях",
          en: "Reply templates for social media messages",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Haftalik hisobot shakli",
          ru: "Форма недельного отчёта",
          en: "The weekly report template",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Notoʻgʻri joʻnatma toʻgʻridan-toʻgʻri pul va mijozni yoʻqotadi, shuning uchun birinchi oʻrinda. Ombor tartibi uning sabablaridan biri boʻlishi mumkin, lekin tekshiruv bosqichi xatoni darhol toʻxtatadi.",
      ru: "Неверная отправка напрямую теряет деньги и клиентов, поэтому она первая. Беспорядок на складе может быть одной из причин, но проверка перед отправкой останавливает ошибку сразу.",
      en: "Wrong shipments lose money and customers directly, so they come first. Shelf disorder may be one cause, but a pre-shipping check stops the error immediately.",
    },
  },
  {
    key: "entrepreneur.operations.04",
    skill: "operations",
    specializations: [],
    type: "judgment",
    targetLevel: 7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Birinchi filialingiz yaxshi ishlayapti va siz ikkinchisini ochmoqchisiz. Hozir ham koʻp qarorlar va muammolar sizning ishtirokingiz bilan hal boʻladi.",
      ru: "Ваш первый филиал работает хорошо, и вы хотите открыть второй. Сейчас многие решения и проблемы по-прежнему решаются с вашим участием.",
      en: "Your first location is doing well and you want to open a second one. Many decisions and problems are still resolved with your personal involvement.",
    },
    prompt: {
      uz: "Ikkinchi filialni ochishdan oldin eng muhim tayyorgarlik qaysi?",
      ru: "Какая подготовка важнее всего перед открытием второго филиала?",
      en: "What is the most important preparation before opening the second location?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Talab yuqoriligida tezroq ochish, jarayonlarni esa yoʻl-yoʻlakay tuzatish",
          ru: "Открыться быстрее, пока высокий спрос, а процессы исправлять по ходу",
          en: "Open quickly while demand is high and fix processes along the way",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Yangi filialga menejer yollab, unga ishni oʻzicha qurishga erkinlik berish",
          ru: "Нанять управляющего для нового филиала и дать ему выстроить работу по-своему",
          en: "Hire a manager for the new site and let them build things their own way",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Birinchi filialni bir necha hafta sizsiz, yozma jarayonlar va koʻrsatkichlar asosida ishlatib koʻrish",
          ru: "Несколько недель запускать первый филиал без вас — по описанным процессам и метрикам",
          en: "Run the first location without you for several weeks on written processes and metrics",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Interyer va menyuni aynan nusxalab, eng yaxshi xodimni yangi filialga oʻtkazish",
          ru: "Точно скопировать интерьер и меню и перевести лучшего сотрудника в новый филиал",
          en: "Copy the interior and menu exactly and move your best employee to the new site",
        },
        score: 0.5,
      },
    ],
    explanation: {
      uz: "Agar birinchi filial sizsiz ishlamasa, ikkinchisi ham ishlamaydi — siz ikki joyda boʻla olmaysiz. Kuchli xodimni oʻtkazish yordam beradi, lekin tizim oʻrnini bosmaydi.",
      ru: "Если первый филиал не работает без вас, второй тоже не заработает — вы не можете быть в двух местах. Перевод сильного сотрудника помогает, но систему не заменяет.",
      en: "If the first site cannot run without you, the second will not either — you cannot be in two places. Moving a strong employee helps but does not replace a system.",
    },
  },
  {
    key: "entrepreneur.operations.05",
    skill: "operations",
    specializations: [],
    type: "scenario",
    targetLevel: 8,
    discrimination: 0.7,
    scoringRule: "single_best",
    scenario: {
      uz: "Sizda 4 ta filial va qatʼiy standart tartiblar bor. Filial rahbarlari qoidalar mahalliy vaziyatlarni hal qilishga xalaqit berayotganidan shikoyat qiladi. Qoidalarni chetlab oʻtadigan bitta filialda mijozlar bahosi eng yuqori.",
      ru: "У вас 4 филиала и строгие стандарты. Руководители филиалов жалуются, что правила мешают решать местные ситуации. В одном филиале, где правила обходят, оценки клиентов самые высокие.",
      en: "You have 4 locations with strict standard procedures. Branch managers complain the rules stop them handling local situations. The one branch that works around the rules has the highest customer ratings.",
    },
    prompt: {
      uz: "Eng toʻgʻri yechim qaysi?",
      ru: "Какое решение самое верное?",
      en: "What is the best response?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Standartlarga qatʼiy rioya qilishni talab qilish: tarmoqda bir xillik eng muhim",
          ru: "Требовать строгого соблюдения стандартов: в сети единообразие важнее всего",
          en: "Enforce the procedures strictly: consistency across the chain matters most",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Har bir filial rahbariga oʻz qoidalarini belgilashga ruxsat berish",
          ru: "Разрешить каждому руководителю филиала устанавливать свои правила",
          en: "Let each branch manager set their own rules",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Qoidalarni buzayotgan rahbarlarni almashtirish",
          ru: "Заменить руководителей, которые нарушают правила",
          en: "Replace the managers who break the rules",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Oʻzgarmas standartlarni (xavfsizlik, sifat, pul) moslashuvchan sohalardan ajratib, yaxshi mahalliy tajribani standartga qoʻshish",
          ru: "Отделить незыблемые стандарты (безопасность, качество, деньги) от гибких зон и вносить удачные местные практики в стандарт",
          en: "Separate fixed standards (safety, quality, money) from flexible areas and fold proven local practices into the standard",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Etuk tizim nima qatʼiy va nima moslashuvchan ekanini aniq belgilaydi hamda yaxshi natija bergan mahalliy yechimlardan standartni yangilash uchun foydalanadi.",
      ru: "Зрелая система чётко разделяет жёсткие и гибкие правила и использует удачные местные решения, чтобы обновлять стандарт.",
      en: "A mature system defines clearly what is fixed and what is flexible, and uses successful local fixes to update the standard.",
    },
  },
];
