import type { QuestionInput } from "./_types";

/** designer.typography — keys "designer.typography.NN" (gate skill K3). */
export const questions: QuestionInput[] = [
  {
    key: "designer.typography.01",
    skill: "typography",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Tipografikada interlinyaj (leading) nimani belgilaydi?",
      ru: "Что в типографике определяет интерлиньяж (leading)?",
      en: "In typography, what does leading control?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Harflar orasidagi masofani",
          ru: "Расстояние между буквами",
          en: "The space between letters",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Harf chiziqlarining qalinligini",
          ru: "Толщину штрихов букв",
          en: "The thickness of letter strokes",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Matn ustunining kengligini",
          ru: "Ширину колонки текста",
          en: "The width of the text column",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Matn qatorlari orasidagi vertikal masofani",
          ru: "Вертикальное расстояние между строками текста",
          en: "The vertical distance between lines of text",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Interlinyaj — qatorlar orasidagi masofa. Harflar orasidagi masofa trekking deyiladi; ikkalasi ham oʻqilishga bevosita taʼsir qiladi.",
      ru: "Интерлиньяж — расстояние между строками. Расстояние между буквами — это трекинг; оба параметра напрямую влияют на читаемость.",
      en: "Leading is the space between lines; the space between letters is tracking. Both directly affect readability.",
    },
  },
  {
    key: "designer.typography.02",
    skill: "typography",
    specializations: [],
    type: "judgment",
    targetLevel: 4,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Restoran menyusida 4 ta shrift bor: sarlavhalar uchun yozma, taom nomlari uchun serifli, tavsiflar uchun groteks va narxlar uchun dekorativ. Menyu tartibsiz koʻrinadi.",
      ru: "В меню ресторана 4 шрифта: рукописный для заголовков, антиква для названий блюд, гротеск для описаний и декоративный для цен. Меню выглядит хаотично.",
      en: "A restaurant menu uses 4 typefaces: a script for headings, a serif for dish names, a sans for descriptions and a display face for prices. It looks chaotic.",
    },
    prompt: {
      uz: "Menyuni tartibga keltirishning eng yaxshi yoʻli qaysi?",
      ru: "Как лучше всего навести порядок в меню?",
      en: "What is the best way to bring order to the menu?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Bir-ikki shrift oilasini qoldirib, ierarxiyani oʻlcham, qalinlik va registr bilan qurish",
          ru: "Оставить одно-два семейства и строить иерархию размером, насыщенностью и регистром",
          en: "Keep one or two families and build hierarchy with size, weight and case",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Shriftlarni qoldirib, barcha matnni oʻrtaga tekislash",
          ru: "Оставить шрифты, но выровнять весь текст по центру",
          en: "Keep the fonts but centre-align all the text",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Hammasini restoran kayfiyatiga mos bitta dekorativ shriftga oʻtkazish",
          ru: "Перевести всё на один декоративный шрифт под атмосферу ресторана",
          en: "Switch everything to one decorative font that fits the restaurant",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Oʻqilishi oson boʻlishi uchun barcha matnni qalin qilish",
          ru: "Сделать весь текст жирным, чтобы он легче читался",
          en: "Make all the text bold so it reads more easily",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Tartib shriftlar soni bilan emas, bitta oila ichidagi aniq qoidalar bilan yaratiladi. Bitta dekorativ shrift izchil, lekin uzun tavsiflarni oʻqishni qiyinlashtiradi.",
      ru: "Порядок создают не количеством шрифтов, а чёткими правилами внутри одного семейства. Один декоративный шрифт последователен, но мешает читать длинные описания.",
      en: "Order comes from clear rules within one family, not from the number of fonts. A single display face is consistent but makes long descriptions hard to read.",
    },
  },
  {
    key: "designer.typography.03",
    skill: "typography",
    specializations: [],
    type: "scenario",
    targetLevel: 6,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Oʻzbek (lotin) va rus tilidagi vivеska uchun chiroyli lotin shrifti topdingiz. Unda kirill harflari yoʻq, «oʻ» va «gʻ» dagi belgi esa boshqa shriftda chiqyapti. Topshirish — ertaga.",
      ru: "Для вывески на узбекском (латиница) и русском вы нашли красивый латинский шрифт. В нём нет кириллицы, а знак в «oʻ» и «gʻ» подставляется из другого шрифта. Сдача — завтра.",
      en: "For a sign in Uzbek (Latin) and Russian you found a beautiful Latin typeface. It has no Cyrillic, and the mark in «oʻ» and «gʻ» falls back to another font. It's due tomorrow.",
    },
    prompt: {
      uz: "Eng toʻgʻri qaror qaysi?",
      ru: "Какое решение самое верное?",
      en: "What is the soundest decision?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Uni lotin uchun qoldirib, rus matniga proporsiyasi oʻxshash kirill shriftini tanlash",
          ru: "Оставить его для латиницы и подобрать к русскому тексту кириллицу похожих пропорций",
          en: "Keep it for Latin and pair the Russian text with a Cyrillic font of similar proportions",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Yetishmayotgan belgini oddiy apostrof bilan almashtirish — farqi bilinmaydi",
          ru: "Заменить недостающий знак обычным апострофом — разницы не заметят",
          en: "Replace the missing mark with a plain apostrophe; nobody will notice",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Lotin, kirill va «ʻ» belgisini toʻliq qoʻllaydigan oilani tanlab, real soʻzlarda sinab koʻrish",
          ru: "Выбрать семейство с латиницей, кириллицей и знаком «ʻ» и проверить на реальных словах",
          en: "Choose a family with full Latin, Cyrillic and «ʻ» support and test it on the real words",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Matnni konturga aylantirib, yetishmagan harflarni oʻzingiz chizish",
          ru: "Перевести текст в кривые и дорисовать недостающие буквы самому",
          en: "Convert the text to outlines and draw the missing glyphs yourself",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Ikki tilli matnda yagona oila bir xil ovozni saqlaydi va «oʻ», «gʻ» toʻgʻri chiqishini kafolatlaydi. Juftlash mumkin, lekin belgi muammosi qoladi.",
      ru: "Единое семейство сохраняет один голос в двуязычном тексте и гарантирует правильные «oʻ», «gʻ». Пара шрифтов возможна, но проблема знака остаётся.",
      en: "One family keeps a single voice across both languages and renders «oʻ» and «gʻ» correctly. Pairing can work, but the missing-mark problem remains.",
    },
  },
  {
    key: "designer.typography.04",
    skill: "typography",
    specializations: [],
    type: "judgment",
    targetLevel: 7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Mobil ilovada asosiy matn 14 px, ingichka va oq fonda och kulrang. Mijozga bu «havodor» koʻrinish yoqadi, ammo foydalanuvchilar matnni oʻqish qiyinligidan shikoyat qilmoqda.",
      ru: "В мобильном приложении основной текст 14 px, тонкий, светло-серый на белом. Заказчику нравится «воздушность», но пользователи жалуются, что читать тяжело.",
      en: "In a mobile app, body text is 14 px, thin and light grey on white. The client loves the «airy» look, but users complain it's hard to read.",
    },
    prompt: {
      uz: "Qanday yoʻl tutish eng toʻgʻri?",
      ru: "Как правильнее всего поступить?",
      en: "What is the best course of action?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Bu brend uslubi, shuning uchun hammasini oʻzgarishsiz qoldirish",
          ru: "Ничего не менять — это фирменный стиль",
          en: "Change nothing; this is the brand style",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Asosiy matnda kontrast va qalinlikni oshirib, yengil uslubni yirik sarlavhalarga qoldirish",
          ru: "Поднять контраст и насыщенность основного текста, а лёгкий стиль оставить крупным заголовкам",
          en: "Raise body-text contrast and weight, and keep the light style for large headings",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Rangni saqlagan holda oʻlchamni 18 px gacha kattalashtirish",
          ru: "Увеличить размер до 18 px, сохранив цвет",
          en: "Increase the size to 18 px but keep the colour",
        },
        score: 0.5,
      },
      {
        key: "d",
        label: {
          uz: "Ilovadagi barcha matnni qora va qalin qilish",
          ru: "Сделать весь текст в приложении чёрным и жирным",
          en: "Make all text in the app black and bold",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Oʻqilish kontrast va qalinlikka bogʻliq; ularni WCAG kontrast tavsiyalari bilan tekshirish mumkin. Yengil uslub yirik sarlavhalarda saqlansa, brend his-tuygʻusi yoʻqolmaydi.",
      ru: "Читаемость зависит от контраста и насыщенности, их можно проверить по рекомендациям WCAG. Лёгкий стиль в крупных заголовках сохраняет ощущение бренда.",
      en: "Readability depends on contrast and weight, which you can check against WCAG contrast guidance. Keeping the light style in large headings preserves the brand feel.",
    },
  },
  {
    key: "designer.typography.05",
    skill: "typography",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    scoringRule: "single_best",
    scenario: {
      uz: "Kompaniya yangi asosiy shriftni tanlamoqda. U ilova, bosma materiallar va vivеskalarda, lotin va kirillda, koʻp jamoalar tomonidan yillar davomida ishlatiladi.",
      ru: "Компания выбирает новый основной шрифт. Его годами будут использовать много команд — в приложении, печати и на вывесках, на латинице и кириллице.",
      en: "A company is choosing a new primary typeface. Many teams will use it for years across the app, print and signage, in Latin and Cyrillic.",
    },
    prompt: {
      uz: "Tanlovni nima belgilashi kerak?",
      ru: "Что должно определять выбор?",
      en: "What should drive the choice?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Ajralib turuvchi displey shrift, qolgan hamma joyda esa tizim shrifti",
          ru: "Яркий акцидентный шрифт, а во всех остальных местах — системный",
          en: "A distinctive display face, with a system font everywhere else",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Maketlarda rahbarga eng koʻp yoqqan shrift, litsenziyani esa ishga tushgandan keyin olish",
          ru: "Шрифт, который больше всего понравился руководителю в макетах; лицензию — после запуска",
          en: "The font the CEO liked most in mockups, with licences bought after launch",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Mashhur bepul oila, yetishmagan belgilarni har loyihada alohida hal qilish",
          ru: "Популярное бесплатное семейство, а недостающие знаки решать в каждом проекте",
          en: "A popular free family, fixing missing glyphs in each project",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Yozuvlar qamrovi, qalinliklar, ekranda koʻrinishi va barcha muhitlar uchun litsenziya; real matnda sinov",
          ru: "Охват письменностей, начертания, отрисовка на экране и лицензия на все носители; тест на реальном тексте",
          en: "Script coverage, weights, screen rendering and licensing for every medium, tested on real content",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Tizim shrifti estetikadan tashqari texnik va huquqiy talablarga javob berishi kerak. Real matnda sinash keyinroq qimmatga tushadigan xatolarni oldindan koʻrsatadi.",
      ru: "Системный шрифт должен отвечать не только эстетике, но и техническим и правовым требованиям. Тест на реальном тексте заранее выявляет дорогие ошибки.",
      en: "A system typeface must meet technical and legal requirements, not just aesthetic ones. Testing on real content surfaces costly problems early.",
    },
  },
  {
    key: "designer.typography.06",
    skill: "typography",
    specializations: [],
    type: "self_report",
    targetLevel: 5,
    discrimination: 0.5,
    scoringRule: "likert",
    prompt: {
      uz: "Maketni topshirishdan oldin tipografikani qanday tekshirasiz?",
      ru: "Как вы проверяете типографику перед сдачей макета?",
      en: "How do you check the typography before handing off a layout?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Monitorda yaxshi koʻrinsa, yetarli deb hisoblayman",
          ru: "Если на мониторе выглядит хорошо, этого достаточно",
          en: "If it looks good on my monitor, that's enough",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Baʼzan uzoqlashtirib koʻraman yoki chop etib tekshiraman",
          ru: "Иногда отдаляю макет или распечатываю для проверки",
          en: "Sometimes I zoom out or print it to check",
        },
        score: 0.33,
      },
      {
        key: "c",
        label: {
          uz: "Odatda real oʻlchamda tekshirib, osilgan soʻzlar va notekis qatorlarni tuzataman",
          ru: "Обычно проверяю в реальном размере и правлю висячие слова и рваные строки",
          en: "I usually check at real size and fix orphans and ragged lines",
        },
        score: 0.67,
      },
      {
        key: "d",
        label: {
          uz: "Har doim real qurilma yoki bosmada, barcha tillardagi haqiqiy matn bilan, roʻyxat boʻyicha",
          ru: "Всегда на реальном устройстве или в печати, с настоящим текстом на всех языках, по чек-листу",
          en: "Always on a real device or print, with real text in every language, using a checklist",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Tipografika xatolari koʻpincha real oʻlchamda va haqiqiy matnda koʻrinadi. Muntazam tekshiruv tartibi ularni topshirishdan oldin ushlaydi.",
      ru: "Ошибки типографики чаще всего видны в реальном размере и на настоящем тексте. Регулярная проверка ловит их до сдачи.",
      en: "Type errors mostly show up at real size and with real text. A regular checking routine catches them before handoff.",
    },
  },
];
