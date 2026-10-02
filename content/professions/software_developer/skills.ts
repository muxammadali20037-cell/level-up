import type { z } from "zod";
import type { edgeSchema, skillSchema, specializationSchema } from "../../schema";

type SkillInput = z.input<typeof skillSchema>;
type EdgeInput = z.input<typeof edgeSchema>;
type SpecializationInput = z.input<typeof specializationSchema>;

/** Doc 05 §6.2 — 11 skills, importance Σ = 1.00. Gate skills: K1 programming_fundamentals, K2 debugging, K3 testing_quality (+ version_control at L4–L5). */
export const skills: SkillInput[] = [
  {
    slug: "programming_fundamentals",
    globalSkillKey: "programming",
    kind: "hard",
    importance: 0.14,
    name: { uz: "Dasturlash asoslari", ru: "Основы программирования", en: "Programming fundamentals" },
    description: {
      uz: "Bitta asosiy tilda turlar, boshqaruv oqimi, funksiyalar, maʼlumotlar bilan ishlash va kodni oʻqish.",
      ru: "Типы, управление потоком, функции, работа с данными и чтение кода на одном основном языке.",
      en: "Types, control flow, functions, data handling and reading code in one main language.",
    },
  },
  {
    slug: "data_structures_algorithms",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Maʼlumotlar tuzilmalari va algoritmlar", ru: "Структуры данных и алгоритмы", en: "Data structures & algorithms" },
    description: {
      uz: "Mos tuzilma va algoritmni tanlash hamda ularning tezligi va xotira sarfini baholash.",
      ru: "Выбор структур данных и алгоритмов и оценка их стоимости по времени и памяти.",
      en: "Choosing structures and algorithms and reasoning about their cost.",
    },
  },
  {
    slug: "version_control",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.07,
    name: { uz: "Versiyalarni boshqarish (Git)", ru: "Контроль версий (Git)", en: "Version control (Git)" },
    description: {
      uz: "Branch, commit, merge, konfliktlarni hal qilish, code review va tarixni xavfsiz oʻzgartirish.",
      ru: "Ветки, коммиты, слияния, конфликты, ревью и безопасное изменение истории.",
      en: "Branches, commits, merges, conflicts, reviews and safe history changes.",
    },
  },
  {
    slug: "sql_databases",
    globalSkillKey: "sql",
    kind: "hard",
    importance: 0.1,
    name: { uz: "SQL va maʼlumotlar bazalari", ru: "SQL и базы данных", en: "SQL & databases" },
    description: {
      uz: "Jadvallarni loyihalash, toʻgʻri soʻrovlar yozish, indekslar va tranzaksiyalar.",
      ru: "Проектирование таблиц, корректные запросы, индексы и транзакции.",
      en: "Modelling tables, writing correct queries, indexes and transactions.",
    },
  },
  {
    slug: "api_design",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: { uz: "API va integratsiya", ru: "API и интеграции", en: "APIs & integration" },
    description: {
      uz: "HTTP API loyihalash va ulardan foydalanish: kontrakt, status kodlar, xatolar, idempotentlik.",
      ru: "Проектирование и использование HTTP API: контракты, коды статусов, ошибки, идемпотентность.",
      en: "Designing and consuming HTTP APIs: contracts, status codes, errors, idempotency.",
    },
  },
  {
    slug: "testing_quality",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.1,
    name: { uz: "Testlash va kod sifati", ru: "Тестирование и качество кода", en: "Testing & code quality" },
    description: {
      uz: "Mazmunli testlar hamda oʻqilishi va qoʻllab-quvvatlanishi oson kod yozish.",
      ru: "Осмысленные тесты и читаемый, поддерживаемый код.",
      en: "Writing meaningful tests and readable, maintainable code.",
    },
  },
  {
    slug: "debugging",
    globalSkillKey: "problem_solving",
    kind: "meta",
    importance: 0.11,
    name: { uz: "Xatolarni topish va muammo yechish", ru: "Отладка и решение проблем", en: "Debugging & problem solving" },
    description: {
      uz: "Xatoni qayta hosil qilish, manbasini ajratish va tizimli tuzatish.",
      ru: "Воспроизведение, локализация и системное исправление дефектов.",
      en: "Reproducing, isolating and fixing defects systematically.",
    },
  },
  {
    slug: "system_design",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.09,
    name: { uz: "Tizim dizayni va arxitektura", ru: "Системный дизайн и архитектура", en: "System design" },
    description: {
      uz: "Ishonchlilik va kengayish uchun komponentlar, maʼlumot oqimi va murosalarni tuzish.",
      ru: "Структура компонентов, потоки данных и компромиссы ради надёжности и масштаба.",
      en: "Structuring components, data flow and trade-offs for reliability and scale.",
    },
  },
  {
    slug: "deployment_ops",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.07,
    name: { uz: "Deploy va ekspluatatsiya", ru: "Деплой и эксплуатация", en: "Deployment & operations" },
    description: {
      uz: "Build chiqarish, muhitlar, konfiguratsiya, loglar va oldingi versiyaga qaytish (rollback).",
      ru: "Выпуск сборок, окружения, конфигурация, логи и откат.",
      en: "Shipping builds, environments, configuration, logs and rollback.",
    },
  },
  {
    slug: "security_basics",
    globalSkillKey: null,
    kind: "hard",
    importance: 0.06,
    name: { uz: "Xavfsiz kod yozish", ru: "Безопасная разработка", en: "Secure coding" },
    description: {
      uz: "Keng tarqalgan zaifliklardan saqlanish: injection, maxfiy kalitlar, autentifikatsiya va kiritmani tekshirish.",
      ru: "Защита от типовых уязвимостей: инъекции, секреты, аутентификация и проверка ввода.",
      en: "Avoiding common vulnerabilities: injection, secrets, auth and input validation.",
    },
  },
  {
    slug: "collaboration",
    globalSkillKey: "communication",
    kind: "soft",
    importance: 0.07,
    name: { uz: "Hamkorlik va muloqot", ru: "Командная работа и коммуникация", en: "Collaboration & communication" },
    description: {
      uz: "Vazifani aniqlashtirish, muddatni baholash, review qilish va texnik qarorlarni tushuntirish.",
      ru: "Уточнение задач, оценка сроков, ревью и объяснение технических решений.",
      en: "Clarifying tasks, estimating, reviewing and explaining technical decisions.",
    },
  },
];

/** Doc 05 §6.3 — 11 edges. Rationales are explanation templates about the work, never about the person. */
export const edges: EdgeInput[] = [
  {
    from: "version_control",
    to: "deployment_ops",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Deploy versiyalangan koddan yigʻiladi — Git boʻlmasa, ishonchli reliz ham, orqaga qaytish ham boʻlmaydi.",
      ru: "Деплой собирается из версионированного кода: без Git нет ни надёжного релиза, ни отката.",
      en: "Deployments are built from versioned code — without Git there is no reliable release or rollback.",
    },
  },
  {
    from: "sql_databases",
    to: "api_design",
    relation: "prerequisite",
    strength: 0.5,
    rationale: {
      uz: "Koʻp API maʼlumot oʻqiydi va yozadi — avval toʻgʻri soʻrovlar, keyin endpointlar.",
      ru: "Большинство API читают и пишут данные: сначала корректные запросы, потом эндпоинты.",
      en: "Most APIs read and write data — correct queries come before endpoints.",
    },
  },
  {
    from: "programming_fundamentals",
    to: "data_structures_algorithms",
    relation: "prerequisite",
    strength: 0.9,
    rationale: {
      uz: "Algoritmlar kod orqali ifodalanadi — avval tilni ishonchli bilish kerak.",
      ru: "Алгоритмы выражаются в коде — сначала нужно уверенно владеть языком.",
      en: "Algorithms are expressed in code — solid language basics come first.",
    },
  },
  {
    from: "programming_fundamentals",
    to: "testing_quality",
    relation: "prerequisite",
    strength: 0.7,
    rationale: {
      uz: "Test qilish uchun avval kodni mustaqil yoza olish kerak.",
      ru: "Тестировать можно только тот код, который вы уже умеете писать.",
      en: "You test code you can already write.",
    },
  },
  {
    from: "api_design",
    to: "system_design",
    relation: "prerequisite",
    strength: 0.5,
    rationale: {
      uz: "Tizimlar servislar oʻrtasidagi kontraktlardan quriladi — avval API, keyin arxitektura.",
      ru: "Системы складываются из контрактов между сервисами: сначала API, потом архитектура.",
      en: "Systems are composed of service contracts — APIs come before architecture.",
    },
  },
  {
    from: "programming_fundamentals",
    to: "system_design",
    relation: "limits",
    strength: 0.7,
    rationale: {
      uz: "Arxitektura gʻoyalari bor, lekin ularni kodda amalga oshirish qiyin — dizayn doskada qolib ketadi.",
      ru: "Архитектурные идеи есть, но их трудно реализовать в коде — дизайн остаётся на доске.",
      en: "Architecture ideas are there, but they are hard to implement — designs stay on the whiteboard.",
    },
  },
  {
    from: "debugging",
    to: "programming_fundamentals",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Kod yoziladi, lekin xatolar sekin topiladi va taxmin bilan tuzatiladi.",
      ru: "Код пишется, но ошибки находятся медленно и исправляются наугад.",
      en: "Code gets written, but defects are found slowly and fixed by guessing.",
    },
  },
  {
    from: "testing_quality",
    to: "deployment_ops",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "Reliz tez chiqadi, lekin tekshirilmagan oʻzgarishlar toʻgʻridan-toʻgʻri foydalanuvchilarga yetib boradi.",
      ru: "Релизы выходят быстро, но непроверенные изменения сразу попадают к пользователям.",
      en: "Releases are fast, but untested changes go straight to users.",
    },
  },
  {
    from: "security_basics",
    to: "api_design",
    relation: "limits",
    strength: 0.5,
    rationale: {
      uz: "API qulay tuzilgan, lekin maʼlumot sizib chiqsa yoki kiritma tekshirilmasa, u xavfga aylanadi.",
      ru: "API удобно устроен, но если он пропускает данные или доверяет вводу, он становится риском.",
      en: "The API is well shaped, but if it leaks data or trusts input, it becomes a liability.",
    },
  },
  {
    from: "collaboration",
    to: "system_design",
    relation: "limits",
    strength: 0.3,
    rationale: {
      uz: "Yechim yaxshi, lekin aniq tushuntirilmasa, jamoa uni qabul qilmaydi.",
      ru: "Решение хорошее, но без ясного объяснения команда его не принимает.",
      en: "The design is good, but without clear communication the team does not adopt it.",
    },
  },
  {
    from: "data_structures_algorithms",
    to: "system_design",
    relation: "enables",
    strength: 0.3,
    rationale: {
      uz: "Algoritm narxini baholash odati arxitekturadagi murosalarni tanlashga ham yordam beradi.",
      ru: "Привычка оценивать стоимость алгоритмов помогает и в архитектурных компромиссах.",
      en: "Reasoning about cost carries over to architecture trade-offs.",
    },
  },
];

/** Doc 05 §6.1 — only non-1.0 weights listed (doc range 0.3–3.0; gate skills stay ≥ 0.5 everywhere). */
export const specializations: SpecializationInput[] = [
  {
    slug: "frontend",
    name: { uz: "Frontend", ru: "Frontend", en: "Frontend" },
    description: {
      uz: "Brauzerdagi interfeyslar: komponentlar, holat, API bilan ishlash va foydalanuvchi tajribasi.",
      ru: "Интерфейсы в браузере: компоненты, состояние, работа с API и пользовательский опыт.",
      en: "Browser interfaces: components, state, API consumption and user experience.",
    },
    skillWeights: {
      testing_quality: 1.2,
      collaboration: 1.2,
      api_design: 0.9,
      system_design: 0.8,
      deployment_ops: 0.8,
      sql_databases: 0.6,
    },
  },
  {
    slug: "backend",
    name: { uz: "Backend", ru: "Backend", en: "Backend" },
    description: {
      uz: "Server tomoni: biznes mantiq, maʼlumotlar bazalari, API va servislar.",
      ru: "Серверная часть: бизнес-логика, базы данных, API и сервисы.",
      en: "Server side: business logic, databases, APIs and services.",
    },
    skillWeights: { sql_databases: 1.4, api_design: 1.4, system_design: 1.2, security_basics: 1.2 },
  },
  {
    slug: "mobile",
    name: { uz: "Mobil dasturlash", ru: "Мобильная разработка", en: "Mobile" },
    description: {
      uz: "iOS va Android ilovalari: interfeys, offline holat, API bilan ishlash va reliz.",
      ru: "Приложения для iOS и Android: интерфейс, офлайн-режим, работа с API и релизы.",
      en: "iOS and Android apps: UI, offline state, API consumption and releases.",
    },
    skillWeights: { testing_quality: 1.2, api_design: 1.1, deployment_ops: 1.1, sql_databases: 0.7 },
  },
  {
    slug: "ai_ml",
    name: { uz: "AI / ML", ru: "AI / ML", en: "AI / ML" },
    description: {
      uz: "Modellarni tayyorlash, baholash va ularni mahsulotga ulash.",
      ru: "Подготовка и оценка моделей и их встраивание в продукт.",
      en: "Preparing and evaluating models and integrating them into products.",
    },
    skillWeights: { data_structures_algorithms: 1.3, sql_databases: 1.2, deployment_ops: 0.9, api_design: 0.8 },
  },
  {
    slug: "data",
    name: { uz: "Maʼlumotlar muhandisligi", ru: "Инженерия данных", en: "Data engineering" },
    description: {
      uz: "Maʼlumot oqimlari (pipeline), omborlar va tahlil uchun ishonchli maʼlumot tayyorlash.",
      ru: "Пайплайны данных, хранилища и подготовка надёжных данных для аналитики.",
      en: "Data pipelines, storage and reliable data for analytics.",
    },
    skillWeights: { sql_databases: 1.8, data_structures_algorithms: 1.1, system_design: 0.9, api_design: 0.7 },
  },
  {
    slug: "devops",
    name: { uz: "DevOps", ru: "DevOps", en: "DevOps" },
    description: {
      uz: "CI/CD, infratuzilma, monitoring va relizlarning barqarorligi.",
      ru: "CI/CD, инфраструктура, мониторинг и стабильность релизов.",
      en: "CI/CD, infrastructure, monitoring and release reliability.",
    },
    skillWeights: {
      deployment_ops: 2.0,
      version_control: 1.3,
      security_basics: 1.3,
      api_design: 0.8,
      data_structures_algorithms: 0.6,
    },
  },
  {
    slug: "cybersecurity",
    name: { uz: "Kiberxavfsizlik", ru: "Кибербезопасность", en: "Cybersecurity" },
    description: {
      uz: "Zaifliklarni topish, himoya choralari va xavfsiz ishlab chiqish amaliyotlari.",
      ru: "Поиск уязвимостей, меры защиты и практики безопасной разработки.",
      en: "Finding vulnerabilities, defensive measures and secure development practices.",
    },
    skillWeights: { security_basics: 2.5, debugging: 1.2, deployment_ops: 1.2, data_structures_algorithms: 0.7 },
  },
];
