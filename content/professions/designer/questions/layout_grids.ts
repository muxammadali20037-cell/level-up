import type { QuestionInput } from "./_types";

/** designer.layout_grids — keys "designer.layout_grids.NN". */
export const questions: QuestionInput[] = [
  {
    key: "designer.layout_grids.01",
    skill: "layout_grids",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Modul setkada «gutter» nima?",
      ru: "Что такое «гаттер» (gutter) в модульной сетке?",
      en: "What is a gutter in a layout grid?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Sahifa chetidan kontentgacha boʻlgan maydon",
          ru: "Поле от края страницы до контента",
          en: "The margin from the page edge to the content",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Izohlar uchun ajratilgan tor ustun",
          ru: "Узкая колонка для подписей и примечаний",
          en: "A narrow column reserved for captions",
        },
        score: 0,
      },
      {
        key: "c",
        label: {
          uz: "Ustunlar orasidagi boʻsh joy",
          ru: "Пустое пространство между колонками",
          en: "The empty space between columns",
        },
        score: 1,
      },
      {
        key: "d",
        label: {
          uz: "Matn qatorlari turadigan asosiy chiziqlar qadami",
          ru: "Шаг базовых линий, на которых стоят строки",
          en: "The step of the baselines that text sits on",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Gutter — ustunlar orasidagi masofa; u kontent bloklarini bir-biridan ajratadi. Chetdagi maydon «margin», qatorlar qadami esa baza setka deyiladi.",
      ru: "Гаттер — промежуток между колонками, он разделяет блоки контента. Поле у края — это margin, шаг строк — базовая сетка.",
      en: "A gutter is the gap between columns that separates content blocks. The edge space is the margin; the line step is the baseline grid.",
    },
  },
  {
    key: "designer.layout_grids.02",
    skill: "layout_grids",
    specializations: [],
    type: "judgment",
    targetLevel: 4,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Ilovadagi kartochkalar roʻyxatida elementlar orasidagi masofa tasodifiy: 7, 10, 13 va 15 px. Ekran tartibsiz koʻrinadi.",
      ru: "В списке карточек приложения отступы между элементами случайные: 7, 10, 13 и 15 px. Экран выглядит неаккуратно.",
      en: "In an app's card list, spacing between elements is random: 7, 10, 13 and 15 px. The screen looks messy.",
    },
    prompt: {
      uz: "Bu holatni qanday tuzatish eng toʻgʻri?",
      ru: "Как правильнее всего это исправить?",
      en: "What is the best way to fix the spacing?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Masofalar shkalasini (masalan, 4 yoki 8 ga karrali) joriy qilib, guruh ichida kichikroq, guruhlar orasida kattaroq qilish",
          ru: "Ввести шкалу отступов (например, кратную 4 или 8): внутри группы меньше, между группами больше",
          en: "Adopt a spacing scale (e.g. multiples of 4 or 8), tighter within groups and wider between them",
        },
        score: 1,
      },
      {
        key: "b",
        label: {
          uz: "Barcha masofalarni bir xil 10 px qilish",
          ru: "Сделать все отступы одинаковыми — 10 px",
          en: "Set every gap to the same 10 px",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Har bir element orasiga ajratuvchi chiziq qoʻyish",
          ru: "Поставить разделительную линию между всеми элементами",
          en: "Add divider lines between all elements",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Ekran havodor boʻlishi uchun barcha masofalarni kattalashtirish",
          ru: "Увеличить все отступы, чтобы экран стал «воздушнее»",
          en: "Increase all gaps so the screen feels airier",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Shkala izchillik beradi, masofalar farqi esa qaysi elementlar bir guruhga tegishli ekanini koʻrsatadi. Bir xil masofa tartibli, lekin guruhlashni yoʻqotadi.",
      ru: "Шкала даёт последовательность, а разница отступов показывает, что к чему относится. Одинаковые отступы аккуратны, но теряют группировку.",
      en: "A scale gives consistency, and the difference in gaps shows what belongs together. Equal gaps look tidy but lose the grouping.",
    },
  },
  {
    key: "designer.layout_grids.03",
    skill: "layout_grids",
    specializations: [],
    type: "scenario",
    targetLevel: 6,
    scoringRule: "partial_credit",
    scenario: {
      uz: "12 ustunli desktop landingni mobil versiyaga moslashtiryapsiz. Sahifada 5 ta tarif solishtiriladigan jadval bor.",
      ru: "Вы адаптируете 12-колоночный десктопный лендинг под мобильный. На странице есть таблица сравнения 5 тарифов.",
      en: "You're adapting a 12-column desktop landing page to mobile. The page has a table comparing 5 plans.",
    },
    prompt: {
      uz: "Jadval bilan nima qilish eng toʻgʻri?",
      ru: "Что лучше всего сделать с таблицей?",
      en: "What is the best approach for the table?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Desktop maketni ekranga sigʻadigan qilib kichraytirish",
          ru: "Уменьшить десктопный макет, чтобы он поместился на экран",
          en: "Scale the desktop layout down to fit the screen",
        },
        score: 0,
      },
      {
        key: "b",
        label: {
          uz: "Jadvalni oʻzgartirmay, gorizontal aylantirishni qoʻshish",
          ru: "Оставить таблицу и добавить горизонтальную прокрутку",
          en: "Keep the table as is and add horizontal scrolling",
        },
        score: 0.5,
      },
      {
        key: "c",
        label: {
          uz: "Mobil versiyada jadvalni butunlay yashirish",
          ru: "Полностью скрыть таблицу в мобильной версии",
          en: "Hide the table entirely on mobile",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Tuzilmani qayta qurish: kartochkalarga oʻtkazish yoki 2 tarifni tanlab solishtirish, muhim maʼlumot birinchi",
          ru: "Перестроить: карточки или сравнение 2 выбранных тарифов, главное — первым",
          en: "Restructure into stacked cards or a pick-2-to-compare view, with key info first",
        },
        score: 1,
      },
    ],
    explanation: {
      uz: "Moslashuvchan maket — kichraytirish emas, kontentni yangi format uchun qayta tartiblash. Gorizontal aylantirish ishlaydi, lekin solishtirishni qiyinlashtiradi.",
      ru: "Адаптив — это не уменьшение, а перестройка контента под формат. Горизонтальная прокрутка работает, но мешает сравнивать.",
      en: "Responsive layout means re-structuring content for the format, not shrinking it. Horizontal scrolling works but makes comparison hard.",
    },
  },
  {
    key: "designer.layout_grids.04",
    skill: "layout_grids",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Marketing jamoasi har oy 40 dan ortiq formatda material chiqaradi: ijtimoiy tarmoq postlari, bannerlar, bosma. Har bir dizayner maketni noldan quradi — natija sekin va bir-biriga oʻxshamaydi.",
      ru: "Маркетинговая команда каждый месяц выпускает 40+ форматов: посты, баннеры, печать. Каждый дизайнер верстает с нуля — медленно и вразнобой.",
      en: "A marketing team produces 40+ formats a month: social posts, banners, print. Every designer lays out from scratch, so work is slow and inconsistent.",
    },
    prompt: {
      uz: "Yetakchi dizayner sifatida qanday qaror qabul qilasiz?",
      ru: "Какое решение вы примете как ведущий дизайнер?",
      en: "As the lead designer, what do you decide?",
    },
    options: [
      {
        key: "a",
        label: {
          uz: "Bitta asosiy shablon yaratib, barcha formatlarda uning aynan nusxasini talab qilish",
          ru: "Сделать один мастер-шаблон и требовать его точной копии во всех форматах",
          en: "Create one master template and require exact copies of it in every format",
        },
        score: 0.5,
      },
      {
        key: "b",
        label: {
          uz: "Modulli tizim: proporsional maydonlar, ustunlar va masofa qoidalari, asosiy formatlar uchun shablonlar va istisno qoidalari",
          ru: "Модульная система: пропорциональные поля, колонки и отступы, шаблоны ключевых форматов и правила исключений",
          en: "A modular system: proportional margins, columns and spacing rules, templates for key formats and rules for exceptions",
        },
        score: 1,
      },
      {
        key: "c",
        label: {
          uz: "Har kim oʻz setkasida ishlashda davom etsin, faqat yakuniy ishlarni koʻrib chiqish",
          ru: "Пусть каждый работает в своей сетке, а вы проверяете только финальные работы",
          en: "Let everyone keep their own grids and review only the final outputs",
        },
        score: 0,
      },
      {
        key: "d",
        label: {
          uz: "Har bir format uchun internetdan tayyor shablonlar sotib olish",
          ru: "Купить готовые шаблоны из интернета под каждый формат",
          en: "Buy ready-made online templates for each format",
        },
        score: 0,
      },
    ],
    explanation: {
      uz: "Proporsional qoidalar tizimi har xil formatga moslashadi va jamoani tezlashtiradi. Qatʼiy yagona shablon izchil, lekin turli oʻlchamlarda buziladi.",
      ru: "Система пропорциональных правил масштабируется на любые форматы и ускоряет команду. Жёсткий единый шаблон последователен, но ломается на разных пропорциях.",
      en: "A system of proportional rules scales to any format and speeds the team up. One rigid template is consistent but breaks at different proportions.",
    },
  },
];
