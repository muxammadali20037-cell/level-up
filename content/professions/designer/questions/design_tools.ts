import type { QuestionInput } from "./_types";

/** designer.design_tools — keys "designer.design_tools.NN". Tool-agnostic: no product-specific facts. */
export const questions: QuestionInput[] = [
  {
    key: "designer.design_tools.01",
    skill: "design_tools",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Nima uchun logotip odatda vektor formatda tayyorlanadi?",
      ru: "Почему логотип обычно делают в векторе?",
      en: "Why is a logo usually created in vector format?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Vektor har qanday oʻlchamga sifatini yoʻqotmasdan kattalashadi",
          ru: "Вектор масштабируется до любого размера без потери качества",
          en: "Vector scales to any size without losing quality",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Vektor fayllarda ranglar doim yorqinroq chiqadi",
          ru: "В векторных файлах цвета всегда ярче",
          en: "Colours always look brighter in vector files",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Rastr tasvirlarni bosmaga chiqarib boʻlmaydi",
          ru: "Растровые изображения нельзя отправить в печать",
          en: "Raster images can't be sent to print",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Ijtimoiy tarmoqlar faqat vektor fayllarni qabul qiladi",
          ru: "Соцсети принимают только векторные файлы",
          en: "Social networks only accept vector files",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Vektor shakllar matematik tarzda tasvirlanadi, shuning uchun logotip ikonkadan tortib bannergacha tiniq qoladi. Rastr esa kattalashtirilganda xiralashadi.",
      ru: "Векторные формы описаны математически, поэтому логотип остаётся чётким и на иконке, и на баннере. Растр при увеличении размывается.",
      en: "Vector shapes are described mathematically, so a logo stays crisp from an icon to a billboard. Raster blurs when enlarged.",
    },
  },
  {
    key: "designer.design_tools.02",
    skill: "design_tools",
    specializations: [],
    type: "judgment",
    targetLevel: 4,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Faylingizda 200 ta nomsiz qatlam bor, tugmalar esa nusxa koʻchirilib, har biri qoʻlda tahrirlangan. Mijoz barcha tugmalar rangini oʻzgartirishni soʻradi.",
      ru: "В вашем файле 200 безымянных слоёв, а кнопки скопированы и каждая правилась вручную. Заказчик просит поменять цвет всех кнопок.",
      en: "Your file has 200 unnamed layers, and buttons were copy-pasted and each edited by hand. The client asks to change the colour of every button.",
    },
    prompt: {
      uz: "Eng toʻgʻri harakat qaysi?",
      ru: "Какое действие самое правильное?",
      en: "What is the best move?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Hozir har bir tugmani qoʻlda oʻzgartirib, tartibni keyinroq qilish",
          ru: "Сейчас поменять каждую кнопку вручную, а порядок навести потом",
          en: "Change each button by hand now and tidy up later",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Tugmani umumiy uslubli qayta ishlatiladigan komponentga aylantirib, bir marta oʻzgartirish",
          ru: "Сделать кнопку переиспользуемым компонентом с общими стилями и поменять один раз",
          en: "Turn the button into a reusable component with shared styles, then change it once",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Fayl boʻylab rangni qidirib-almashtirish funksiyasidan foydalanish",
          ru: "Заменить цвет по всему файлу через поиск и замену",
          en: "Use find-and-replace on the colour across the file",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Faylni noldan qayta chizish",
          ru: "Перерисовать файл с нуля",
          en: "Rebuild the file from scratch",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Komponent va umumiy uslublar keyingi har qanday oʻzgarishni bir harakatga aylantiradi. Qidirib-almashtirish hozir yordam beradi, lekin muammoning ildizini hal qilmaydi.",
      ru: "Компонент и общие стили превращают любую будущую правку в одно действие. Поиск и замена поможет сейчас, но не устранит причину.",
      en: "A component with shared styles turns every future change into one action. Find-and-replace helps now but doesn't fix the root cause.",
    },
  },
  {
    key: "designer.design_tools.03",
    skill: "design_tools",
    specializations: [],
    type: "scenario",
    targetLevel: 6,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Katalog uchun 30 ta mahsulot suratini toʻgʻridan-toʻgʻri piksel qatlamlarida retush qildingiz. Mijoz hammasida tonni iliqroq va fonni boshqacha qilishni soʻradi. Keyingi oy shunday buyurtma yana bor.",
      ru: "Для каталога вы отретушировали 30 фото товаров прямо на пиксельных слоях. Заказчик просит сделать тон теплее и сменить фон на всех. В следующем месяце похожий заказ.",
      en: "You retouched 30 catalogue product photos directly on pixel layers. The client wants a warmer tone and a different background on all of them. A similar job comes next month.",
    },
    prompt: {
      uz: "Keyingi buyurtmada qaysi ish usuli tahrirlarga eng koʻp vaqt tejaydi?",
      ru: "Какой подход в следующем заказе сэкономит больше всего времени на правках?",
      en: "For next month's job, which setup saves the most time on revisions?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Fayllar yengil boʻlishi uchun birlashtirilgan (flatten) nusxalarda ishlash",
          ru: "Работать со сведёнными (flatten) копиями, чтобы файлы были лёгкими",
          en: "Work on flattened copies to keep the files light",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Har bir tahrirdan keyin faylning alohida versiyasini saqlash",
          ru: "Сохранять отдельную версию файла после каждой правки",
          en: "Save a separate file version after every edit",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Destruktiv boʻlmagan usul: tuzatish qatlamlari, maskalar va takroriy amallarni avtomatlashtirish",
          ru: "Недеструктивно: корректирующие слои, маски и автоматизация повторяющихся шагов",
          en: "Non-destructive work: adjustment layers, masks and automation for repeated steps",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Tezroq ishlash uchun past oʻlchamda retush qilib, keyin kattalashtirish",
          ru: "Ретушировать в низком разрешении для скорости, потом увеличить",
          en: "Retouch at low resolution for speed, then upscale",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Destruktiv boʻlmagan qatlamlar asl tasvirni saqlab, istalgan sozlamani qayta oʻzgartirishga imkon beradi; avtomatlashtirish esa 30 faylga bir xil amalni tez qoʻllaydi.",
      ru: "Недеструктивные слои сохраняют исходник и позволяют менять любую настройку; автоматизация быстро применяет одно действие к 30 файлам.",
      en: "Non-destructive layers keep the original intact so any setting can change later; automation applies the same step to 30 files quickly.",
    },
  },
  {
    key: "designer.design_tools.04",
    skill: "design_tools",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "5 kishilik dizayn jamoasida fayllar shaxsiy noutbuklarda, versiyalar «final_v7_aniq» kabi nomlangan, umumiy kutubxonalar esa har kimda har xil.",
      ru: "В команде из 5 дизайнеров файлы лежат на личных ноутбуках, версии называются «final_v7_tochno», а у каждого своя версия общей библиотеки.",
      en: "In a 5-person design team, files live on personal laptops, versions are named «final_v7_really», and everyone's copy of the shared library differs.",
    },
    prompt: {
      uz: "Jamoa rahbari sifatida nimadan boshlaysiz?",
      ru: "С чего вы начнёте как руководитель команды?",
      en: "As team lead, what do you put in place first?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Har hafta barcha yakuniy fayllarni sizga elektron pochta orqali yuborishni talab qilish",
          ru: "Требовать, чтобы все еженедельно присылали вам финальные файлы по почте",
          en: "Ask everyone to email you their final files every week",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Hammaga eng kuchli plaginlar obunasini sotib olish",
          ru: "Купить всем подписку на самые мощные плагины",
          en: "Buy everyone a subscription to the most powerful plugins",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Toza boshlash uchun butun jamoani yangi dizayn dasturiga oʻtkazish",
          ru: "Перевести всю команду на новую программу, чтобы начать с чистого листа",
          en: "Move the whole team to a new design tool to start fresh",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Umumiy ish maydoni, yagona kutubxona va masʼul shaxs, nomlash va versiya qoidalari, qisqa yoʻriqnoma",
          ru: "Общее пространство, единая библиотека с ответственным, правила именования и версий, короткий гайд",
          en: "A shared workspace, one owned source-of-truth library, naming and versioning rules, a short guide",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Muammo dasturda emas, jarayonda: yagona manba, egasi va kelishilgan qoidalar boʻlmasa, har qanday vosita tartibsizlikni takrorlaydi. Pochta orqali yigʻish nazorat beradi, lekin sizni «tor joy»ga aylantiradi.",
      ru: "Проблема не в программе, а в процессе: без единого источника, владельца и правил любой инструмент повторит хаос. Сбор по почте даёт контроль, но делает вас «узким местом».",
      en: "The problem is process, not software: without one source of truth, an owner and agreed rules, any tool repeats the chaos. Collecting files by email adds control but makes you a bottleneck.",
    },
  },
  {
    key: "designer.design_tools.05",
    skill: "design_tools",
    specializations: [],
    type: "self_report",
    targetLevel: 5,
    discrimination: 0.5,
    scoringRule: "likert",
    prompt: {
      uz: "Asosiy dizayn dasturingizda takrorlanuvchi ishlarni qanday bajarasiz?",
      ru: "Как вы выполняете повторяющуюся работу в своей основной программе?",
      en: "How do you handle repetitive work in your main design software?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Asosan menyular orqali ishlayman, takroriy amallarni qoʻlda bajaraman",
          ru: "В основном через меню, повторяющиеся шаги делаю вручную",
          en: "Mostly through menus; I repeat steps by hand",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Asosiy tugmalar birikmalarini bilaman, elementlarni nusxa koʻchirib ishlataman",
          ru: "Знаю основные горячие клавиши, элементы копирую и вставляю",
          en: "I know the common shortcuts and copy-paste elements",
        },
        score: 0.33,
      },
      {
        key: "c",
        label: {
          uz: "Muntazam komponentlar, uslublar va tartibli qatlamlardan foydalanaman",
          ru: "Регулярно использую компоненты, стили и упорядоченные слои",
          en: "I regularly use components, styles and organized layers",
        },
        score: 0.67,
      },
      {
        key: "d",
        label: {
          uz: "Komponent va uslublar tizimini yuritaman, takroriy ishlarni avtomatlashtiraman",
          ru: "Веду систему компонентов и стилей, повторяющиеся задачи автоматизирую",
          en: "I maintain a component and style system and automate repetitive tasks",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Qayta ishlatiladigan elementlar va avtomatlashtirish vaqtni tejaydi va xatolarni kamaytiradi. Bu odatlar tajriba bilan shakllanadi.",
      ru: "Переиспользуемые элементы и автоматизация экономят время и снижают число ошибок. Эти привычки складываются с опытом.",
      en: "Reusable elements and automation save time and reduce errors. These habits build up with experience.",
    },
  },
];
