import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** §11.2 — slugs, global keys, kinds and importances are normative (Σ = 1.00). */
export const skills: SkillInput[] = [
  {
    slug: "visual_fundamentals",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.13,
    name: { uz: "Vizual asoslar", ru: "Визуальные основы", en: "Visual fundamentals" },
    description: {
      uz: "Kompozitsiya, ierarxiya, kontrast, rang va muvozanat.",
      ru: "Композиция, иерархия, контраст, цвет и баланс.",
      en: "Composition, hierarchy, contrast, colour and balance.",
    },
  },
  {
    slug: "typography",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: { uz: "Tipografika", ru: "Типографика", en: "Typography" },
    description: {
      uz: "Oʻqilishi oson va ohangga mos shrift tanlash hamda matnni terish.",
      ru: "Выбор и набор шрифта с учётом читаемости и тона.",
      en: "Choosing and setting type for readability and tone.",
    },
  },
  {
    slug: "layout_grids",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Maket va setkalar", ru: "Вёрстка и сетки", en: "Layout & grids" },
    description: {
      uz: "Turli formatlarda kontentni setka, boʻshliq va tekislash orqali tartiblash.",
      ru: "Структура контента с помощью сеток, отступов и выравнивания в разных форматах.",
      en: "Structuring content with grids, spacing and alignment across formats.",
    },
  },
  {
    slug: "brief_problem_framing",
    globalSkillKey: "problem_solving",
    kind: "meta",
    importance: 0.11,
    name: { uz: "Brif va muammoni aniqlash", ru: "Бриф и постановка задачи", en: "Brief & problem framing" },
    description: {
      uz: "Dizayndan oldin haqiqiy maqsad, auditoriya va cheklovlarni aniqlab olish.",
      ru: "Выявление настоящей цели, аудитории и ограничений до начала дизайна.",
      en: "Extracting the real goal, audience and constraints before designing.",
    },
  },
  {
    slug: "user_research",
    globalSkillKey: "customer_focus",
    kind: "hard",
    importance: 0.09,
    name: { uz: "Foydalanuvchini oʻrganish", ru: "Исследование пользователей", en: "User research" },
    description: {
      uz: "Dizaynga asos boʻladigan intervyu, kuzatuv va foydalanish testlari.",
      ru: "Интервью, наблюдение и юзабилити-тесты, на которые опирается дизайн.",
      en: "Interviews, observation and usability tests that inform design.",
    },
  },
  {
    slug: "interaction_ux",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: { uz: "Interaksiya va UX", ru: "Взаимодействие и UX", en: "Interaction & UX" },
    description: {
      uz: "Interfeyslardagi ssenariylar, holatlar, javob signallari va qulaylik (accessibility).",
      ru: "Сценарии, состояния, обратная связь и доступность интерфейсов.",
      en: "Flows, states, feedback and accessibility of interfaces.",
    },
  },
  {
    slug: "design_tools",
    globalSkillKey: "digital_tools",
    kind: "hard",
    importance: 0.08,
    name: { uz: "Dizayn dasturlari", ru: "Инструменты дизайна", en: "Design tools" },
    description: {
      uz: "Professional dizayn dasturlarida tez va tartibli ishlash.",
      ru: "Быстрая и аккуратная работа в профессиональных программах для дизайна.",
      en: "Efficient, organized work in professional design software.",
    },
  },
  {
    slug: "brand_systems",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Brend va dizayn tizimlari", ru: "Бренд и дизайн-системы", en: "Brand & design systems" },
    description: {
      uz: "Izchil, qayta ishlatiladigan qoidalar: logotip, palitra, komponentlar, tokenlar.",
      ru: "Единые переиспользуемые правила: логотипы, палитры, компоненты, токены.",
      en: "Consistent reusable rules: logos, palettes, components, tokens.",
    },
  },
  {
    slug: "critique_iteration",
    globalSkillKey: "feedback",
    kind: "meta",
    importance: 0.1,
    name: { uz: "Tanqid va takomillashtirish", ru: "Критика и итерации", en: "Critique & iteration" },
    description: {
      uz: "Ishni bosqichma-bosqich yaxshilash uchun tanqid berish va undan foydalanish.",
      ru: "Умение давать критику и использовать её, улучшая работу циклами.",
      en: "Giving and using critique to improve work in cycles.",
    },
  },
  {
    slug: "presentation_handoff",
    globalSkillKey: "communication",
    kind: "soft",
    importance: 0.11,
    name: { uz: "Taqdimot va topshirish", ru: "Презентация и передача макетов", en: "Presentation & handoff" },
    description: {
      uz: "Qarorlarni mijoz oldida asoslash va dasturchi yoki bosmaxona ishlata oladigan fayllar tayyorlash.",
      ru: "Защита решений перед заказчиком и подготовка файлов, с которыми смогут работать разработчики и типография.",
      en: "Defending decisions to clients and preparing files developers/printers can use.",
    },
  },
];

/** §11.3 — rationales are explanation templates about the work, never about the person. */
export const edges: EdgeInput[] = [
  {
    from: "visual_fundamentals",
    to: "layout_grids",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Setka ierarxiyani tartiblaydi — avval ierarxiya va kompozitsiyani tushunish kerak.",
      ru: "Сетка упорядочивает иерархию — сначала нужно понимать иерархию и композицию.",
      en: "Grids organize hierarchy, so hierarchy and composition come first.",
    },
  },
  {
    from: "typography",
    to: "brand_systems",
    relation: "prerequisite",
    strength: 0.5,
    rationale: {
      uz: "Shrift qoidalari koʻpchilik brend tizimlarining oʻzagi — tizimdan oldin tipografikani mustahkamlang.",
      ru: "Правила работы со шрифтом — ядро большинства бренд-систем, поэтому типографика идёт первой.",
      en: "Type rules are the core of most brand systems, so typography comes first.",
    },
  },
  {
    from: "user_research",
    to: "interaction_ux",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Interfeys ssenariylari foydalanuvchining kuzatilgan xatti-harakatiga qarab quriladi.",
      ru: "Сценарии интерфейса строятся вокруг наблюдаемого поведения пользователей.",
      en: "Flows are designed around observed user behaviour.",
    },
  },
  {
    from: "brief_problem_framing",
    to: "visual_fundamentals",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Vizual ish chiroyli chiqadi, lekin vazifa aniq qoʻyilmagani uchun notoʻgʻri muammoni hal qiladi.",
      ru: "Визуально работа сильная, но без чёткой постановки задачи она решает не ту проблему.",
      en: "The visuals are strong, but without a clear brief they solve the wrong problem.",
    },
  },
  {
    from: "presentation_handoff",
    to: "visual_fundamentals",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Yaxshi dizayn mijozga asoslab berilmasa rad etiladi yoki fayllar tayyor boʻlmasa notoʻgʻri amalga oshiriladi.",
      ru: "Хороший дизайн отклоняют, если его не защитить, или реализуют неверно, если файлы не готовы.",
      en: "Good design gets rejected when it is not defended, or built wrong when files are not ready.",
    },
  },
  {
    from: "critique_iteration",
    to: "interaction_ux",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Ssenariylar puxta, lekin hech kim tekshirmagan kamchiliklar bilan ishga tushib ketadi.",
      ru: "Сценарии продуманы, но интерфейс выходит с недочётами, которые никто не оспорил.",
      en: "Flows are well built, but interfaces ship with issues no one challenged.",
    },
  },
  {
    from: "brief_problem_framing",
    to: "user_research",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Aniq qoʻyilgan muammo nimani oʻrganish kerakligini koʻrsatadi.",
      ru: "Чётко поставленная задача подсказывает, что именно исследовать.",
      en: "A clear problem tells you what to research.",
    },
  },
  {
    from: "design_tools",
    to: "layout_grids",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Dasturni yaxshi bilish setka tizimlarini amalda qoʻllashni osonlashtiradi.",
      ru: "Свободное владение инструментами делает сетки удобными на практике.",
      en: "Tool fluency makes grid systems practical.",
    },
  },
];

/** §11.1 — weights are normative (Decision P15). Gate skills stay ≥ 0.5 in every specialization. */
export const specializations: SpecializationInput[] = [
  {
    slug: "graphic",
    name: { uz: "Grafik dizayn", ru: "Графический дизайн", en: "Graphic design" },
    description: {
      uz: "Poligrafiya, afishalar, ijtimoiy tarmoq vizuallari va qadoq.",
      ru: "Полиграфия, афиши, визуалы для соцсетей и упаковка.",
      en: "Print, posters, social media visuals and packaging.",
    },
    skillWeights: {
      visual_fundamentals: 1.3,
      typography: 1.3,
      layout_grids: 1.2,
      user_research: 0.5,
      interaction_ux: 0.4,
    },
  },
  {
    slug: "ui_ux",
    name: { uz: "UI/UX dizayn", ru: "UI/UX-дизайн", en: "UI/UX design" },
    description: {
      uz: "Mobil ilovalar, veb-saytlar va raqamli mahsulotlar interfeysi.",
      ru: "Интерфейсы мобильных приложений, сайтов и цифровых продуктов.",
      en: "Interfaces for mobile apps, websites and digital products.",
    },
    skillWeights: {
      interaction_ux: 2.0,
      user_research: 1.8,
      presentation_handoff: 1.2,
      typography: 0.8,
      brand_systems: 0.8,
    },
  },
  {
    slug: "brand_identity",
    name: { uz: "Brend identifikatsiyasi", ru: "Айдентика бренда", en: "Brand identity" },
    description: {
      uz: "Logotip, firma uslubi va brendning vizual qoidalari.",
      ru: "Логотип, фирменный стиль и визуальные правила бренда.",
      en: "Logos, visual identity and a brand's visual rules.",
    },
    skillWeights: {
      brand_systems: 2.0,
      typography: 1.3,
      brief_problem_framing: 1.2,
      interaction_ux: 0.4,
    },
  },
  {
    slug: "motion",
    name: { uz: "Motion dizayn", ru: "Моушн-дизайн", en: "Motion design" },
    description: {
      uz: "Animatsiya, video grafika va harakatdagi interfeys elementlari.",
      ru: "Анимация, видеографика и интерфейсы в движении.",
      en: "Animation, video graphics and interfaces in motion.",
    },
    skillWeights: {
      design_tools: 1.5,
      visual_fundamentals: 1.3,
      interaction_ux: 0.8,
      layout_grids: 0.8,
      user_research: 0.6,
    },
  },
];
