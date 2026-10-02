import type { QuestionInput } from "./_types";

/** designer.brand_systems — keys "designer.brand_systems.NN". */
export const questions: QuestionInput[] = [
  {
    key: "designer.brand_systems.01",
    skill: "brand_systems",
    specializations: [],
    type: "knowledge",
    targetLevel: 3,
    scoringRule: "single_best",
    prompt: {
      uz: "Nima uchun logotipning odatda bir nechta varianti boʻladi (gorizontal, vertikal, belgi, bir rangli)?",
      ru: "Зачем у логотипа обычно несколько версий (горизонтальная, вертикальная, знак, одноцветная)?",
      en: "Why does a logo usually come in several versions (horizontal, stacked, symbol, one-colour)?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Mijoz oʻziga yoqqanini tanlashi uchun",
          ru: "Чтобы заказчик выбрал тот, что ему больше нравится",
          en: "So the client can choose the one they like best",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Har xil oʻlcham, format va fonda oʻqiladigan va tanib olinadigan boʻlishi uchun",
          ru: "Чтобы он читался и узнавался в разных размерах, форматах и на разных фонах",
          en: "So it stays legible and recognizable across sizes, formats and backgrounds",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Logotipni nusxa koʻchirishdan himoya qilish uchun",
          ru: "Чтобы защитить логотип от копирования",
          en: "To protect the logo from being copied",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Har bir ijtimoiy tarmoq alohida logotip talab qilgani uchun",
          ru: "Потому что каждая соцсеть требует отдельный логотип",
          en: "Because each social network requires its own logo",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Logotip ilova ikonkasidan peshlavhagacha ishlaydi. Variantlar uni har qanday joy va fonda tiniq va tanish saqlaydi.",
      ru: "Логотип живёт от иконки приложения до вывески. Версии сохраняют его чётким и узнаваемым в любом месте и на любом фоне.",
      en: "A logo has to work from an app icon to a shop sign. Versions keep it clear and recognizable in any space and on any background.",
    },
  },
  {
    key: "designer.brand_systems.02",
    skill: "brand_systems",
    specializations: [],
    type: "judgment",
    targetLevel: 5,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Mijozning savdo boʻlimi flayerlarni oʻzi tayyorlaydi: logotip choʻzilgan, ranglar tasodifiy. Dizayner faqat bitta — siz.",
      ru: "Отдел продаж заказчика сам делает флаеры: логотип растянут, цвета случайные. Дизайнер на проекте один — вы.",
      en: "The client's sales team makes its own flyers: the logo is stretched and colours are random. You're the only designer.",
    },
    prompt: {
      uz: "Izchillikni taʼminlashning eng samarali yoʻli qaysi?",
      ru: "Как эффективнее всего обеспечить единообразие?",
      en: "What is the most effective way to keep materials consistent?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Har safar barcha flayerlarni oʻzingiz qayta chizish",
          ru: "Каждый раз самому переделывать все флаеры",
          en: "Redo every flyer yourself each time",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Savdo boʻlimiga materiallar tayyorlashni taqiqlash",
          ru: "Запретить отделу продаж делать материалы",
          en: "Forbid the sales team from making materials",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "60 sahifalik toʻliq brendbukni PDF qilib yuborish",
          ru: "Отправить полный брендбук на 60 страниц в PDF",
          en: "Send them a full 60-page brand book PDF",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Tahrirlanadigan shablonlar, logotip fayllari va rang kodlari bilan bir sahifalik qoidalar berib, qisqa oʻrgatish",
          ru: "Дать редактируемые шаблоны и одностраничку «можно / нельзя» с логотипами и цветами, коротко обучить",
          en: "Give editable templates and a one-page do/don't with logo files and colour codes, plus a short walkthrough",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Dizayner boʻlmaganlar uchun eng yaxshi qoida — xatoga yoʻl qoʻymaydigan tayyor vosita. Toʻliq brendbuk toʻgʻri, lekin savdo jamoasi uni kam oʻqiydi.",
      ru: "Для недизайнеров лучшее правило — готовый инструмент, в котором трудно ошибиться. Полный брендбук верен, но отдел продаж его вряд ли прочитает.",
      en: "For non-designers the best rule is a ready tool that is hard to misuse. A full brand book is correct, but a sales team rarely reads it.",
    },
  },
  {
    key: "designer.brand_systems.03",
    skill: "brand_systems",
    specializations: [],
    type: "scenario",
    targetLevel: 7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Mahsulot ekranlarida 3 xil biroz farqli koʻk rang va 5 xil tugma uslubi ishlatilgan. Dasturchi qaysi biri toʻgʻri ekanini soʻrayapti.",
      ru: "На экранах продукта используются 3 слегка разных синих и 5 стилей кнопок. Разработчик спрашивает, какой из них правильный.",
      en: "The product's screens use 3 slightly different blues and 5 button styles. A developer asks which one is correct.",
    },
    prompt: {
      uz: "Eng toʻgʻri javob qaysi?",
      ru: "Какой ответ самый правильный?",
      en: "What is the best answer to the developer?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Foydalanishni tahlil qilib, rang rollari tokenlari va tugma variantlarini kelishish, hujjatlashtirish va bosqichma-bosqich oʻtkazish",
          ru: "Провести аудит, согласовать токены цветовых ролей и варианты кнопок, задокументировать и мигрировать поэтапно",
          en: "Audit usage, agree on colour-role tokens and button variants, document them and migrate in stages",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Sizga eng yoqqanini tanlab, dasturchiga aytish",
          ru: "Выбрать тот, что вам больше нравится, и сказать разработчику",
          en: "Pick the one you like best and tell the developer",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Foydalanuvchilar shikoyat qilmagani uchun hammasini qoldirish",
          ru: "Оставить всё как есть — пользователи не жалуются",
          en: "Keep all variants since users haven't complained",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Butun mahsulotni yangi palitra bilan qayta loyihalash",
          ru: "Перерисовать весь продукт в новой палитре",
          en: "Redesign the whole product with a new palette",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Bitta javob hozirgi savolni yopadi, tizim esa keyingi yuzlab savollarning oldini oladi. Tokenlar dizayn va kod bir tilda gapirishini taʼminlaydi.",
      ru: "Один ответ закрывает текущий вопрос, а система предотвращает сотни следующих. Токены позволяют дизайну и коду говорить на одном языке.",
      en: "A single answer closes today's question; a system prevents hundreds of future ones. Tokens let design and code speak the same language.",
    },
  },
  {
    key: "designer.brand_systems.04",
    skill: "brand_systems",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    discrimination: 0.7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Toshkentdagi 12 filialli, 15 yillik non mahsulotlari tarmogʻi «zamonaviy» koʻrinishni xohlaydi. Mijozlar brendni oʻziga xos rangi va maskoti orqali taniydi.",
      ru: "Ташкентская сеть пекарен с 12 филиалами и 15-летней историей хочет «современный» облик. Покупатели узнают бренд по фирменному цвету и маскоту.",
      en: "A 15-year-old Tashkent bakery chain with 12 branches wants a «modern» look. Customers recognize the brand by its distinctive colour and mascot.",
    },
    prompt: {
      uz: "Qaysi strategiya eng toʻgʻri?",
      ru: "Какая стратегия самая верная?",
      en: "Which strategy is soundest?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Oʻzgarishni koʻrsatish uchun yangi ranglar va logotip bilan toʻliq rebrending",
          ru: "Полный ребрендинг с новыми цветами и логотипом, чтобы показать перемены",
          en: "A full rebrand with new colours and logo to signal change",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Uchta butunlay yangi logotip orasida ochiq ovoz berish oʻtkazish",
          ru: "Провести открытое голосование между тремя совсем новыми логотипами",
          en: "Run a public vote between three completely new logos",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Tanilgan elementlarni (rang, maskot) saqlab, yangilash, qolganini zamonaviylashtirish va bosqichma-bosqich joriy qilish",
          ru: "Сохранить и освежить узнаваемые элементы (цвет, маскот), остальное обновить и внедрять поэтапно",
          en: "Keep and refine the recognized assets (colour, mascot), modernize the rest and roll out in phases",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Hammasini qoldirib, faqat shriftni almashtirish",
          ru: "Оставить всё и поменять только шрифт",
          en: "Keep everything and change only the typeface",
        },
        score: 0.5,
      },
    ],
    explanation: {
      uz: "Yillar davomida yigʻilgan taniqlilik — brendning qimmatli aktivi. Uni saqlab yangilash va bosqichma-bosqich joriy qilish mijozlarni yoʻqotmasdan oʻzgarish beradi.",
      ru: "Узнаваемость, накопленная годами, — ценный актив бренда. Её сохранение и поэтапное обновление дают перемены без потери покупателей.",
      en: "Recognition built over years is a valuable brand asset. Keeping it while refining and rolling out in phases delivers change without losing customers.",
    },
  },
];
