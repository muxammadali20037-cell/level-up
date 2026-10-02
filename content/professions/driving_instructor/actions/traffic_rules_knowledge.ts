import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/**
 * Skill: traffic_rules_knowledge. Never instruct the user to drive or teach on public roads (§14.1 rule 3).
 * No jurisdiction-specific rule content here: actions point to the current official text, never quote it.
 */
export const actions: ActionInput[] = [
  {
    slug: "trk_reread_right_of_way",
    skill: "traffic_rules_knowledge",
    title: {
      uz: "Ustuvorlik boʻlimini rasmiy matndan qayta oʻqing",
      ru: "Перечитайте раздел о приоритете в официальном тексте",
      en: "Re-read the right-of-way section in the official rules",
    },
    description: {
      uz: "Amaldagi yoʻl harakati qoidalarining rasmiy matnini oching, chorrahalar va ustuvorlik boʻlimini oʻqing. Foydalangan tahrir sanasini yozing va 5 ta qoidani oʻz soʻzlaringiz bilan qayta yozing.",
      ru: "Откройте официальный текст действующих ПДД, прочитайте раздел о перекрёстках и приоритете. Запишите дату использованной редакции и перескажите 5 правил своими словами.",
      en: "Open the current official text of the traffic rules and read the section on junctions and right-of-way. Note the edition date you used and restate 5 rules in your own words.",
    },
    kind: "learn",
    phase: "foundation",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "5 ta qoida oʻz soʻzlaringizda yozilgan, rasmiy tahrir sanasi koʻrsatilgan.",
      ru: "5 правил пересказаны своими словами, указана дата официальной редакции.",
      en: "5 rules restated in your own words, with the official edition date noted.",
    },
    why: {
      uz: "Qoidalar xotirada asta-sekin buziladi va oʻzgarishi mumkin. Xavfni oldindan koʻrish va imtihonga tayyorlik aynan shu bilimga tayanadi.",
      ru: "Правила постепенно искажаются в памяти и могут меняться. Обучение восприятию опасности и оценка готовности опираются именно на это знание.",
      en: "Rules drift in memory and can change. Hazard perception teaching and readiness judgments both build on this knowledge.",
    },
    resources: [],
  },
  {
    slug: "trk_five_sign_cards",
    skill: "traffic_rules_knowledge",
    title: {
      uz: "Chalkashtiriladigan 5 belgiga izoh kartasi tuzing",
      ru: "Сделайте карточки для 5 путаемых знаков",
      en: "Make explanation cards for 5 confusing signs",
    },
    description: {
      uz: "Tajribangizda oʻquvchilar eng koʻp chalkashtiradigan 5 belgini tanlang. Har biriga bir gaplik sodda tushuntirish va bitta keng tarqalgan xatoni yozing. Har birini rasmiy matn bilan solishtiring.",
      ru: "Выберите 5 знаков, которые ученики чаще всего путают по вашему опыту. Для каждого напишите простое объяснение в одно предложение и одну типичную ошибку. Сверьте с официальным текстом.",
      en: "Pick the 5 signs learners confuse most in your experience. For each, write a one-sentence plain explanation and one common mistake. Check each against the official text.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "5 ta karta: tushuntirish, tipik xato va rasmiy matn bilan tekshirilganlik belgisi.",
      ru: "5 карточек: объяснение, типичная ошибка и отметка о сверке с официальным текстом.",
      en: "5 cards, each with an explanation, a typical mistake and a checked-against-official mark.",
    },
    why: {
      uz: "Qoidani bilish yetarli emas — yoʻriqchi uni oʻquvchiga sodda tushuntira olishi kerak. Qisqa izoh darsda vaqtni tejaydi.",
      ru: "Знать правило мало — инструктор должен уметь просто его объяснить. Короткое объяснение экономит время на занятии.",
      en: "Knowing a rule is not enough; an instructor must explain it simply. A short explanation saves lesson time.",
    },
    resources: [],
  },
  {
    slug: "trk_ten_junction_puzzles",
    skill: "traffic_rules_knowledge",
    title: {
      uz: "10 ta chorraha holatini yeching va asoslang",
      ru: "Разберите 10 ситуаций на перекрёстке с обоснованием",
      en: "Solve 10 junction situations and justify each",
    },
    description: {
      uz: "Rasmiy yoki maktab tasdiqlagan savollar bazasidan 10 ta chorraha holatini oling yoki chizing. Har birida kim birinchi oʻtishini va qaysi qoidaga asoslanishini yozing. Ikkilangan holatlarni belgilang va rasmiy matndan tekshiring.",
      ru: "Возьмите из официальной или одобренной школой базы (или нарисуйте) 10 ситуаций на перекрёстке. Для каждой запишите, кто едет первым и на каком правиле это основано. Отметьте сомнения и сверьте с официальным текстом.",
      en: "Take 10 junction situations from an official or school-approved bank (or draw them). For each, write who goes first and which rule says so. Mark any you hesitated on and check them in the official text.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "10 ta javob qoida asosi bilan; barcha ikkilangan holatlar rasmiy matndan tekshirilgan.",
      ru: "10 ответов с обоснованием; все сомнительные случаи сверены с официальным текстом.",
      en: "10 answers with rule reasons; every hesitation checked in the official text.",
    },
    why: {
      uz: "Ustuvorlik — xavfni oldindan koʻrishning boshlangʻich nuqtasi. Sababini aytib bera olish bilimning haqiqiy chuqurligini koʻrsatadi.",
      ru: "Приоритет — отправная точка для предвидения опасности. Умение назвать причину показывает реальную глубину знания.",
      en: "Right-of-way is where anticipation starts. Being able to name the reason shows how deep your knowledge really is.",
    },
    resources: [],
  },
  {
    slug: "trk_rule_change_log",
    skill: "traffic_rules_knowledge",
    title: {
      uz: "Qoidalar oʻzgarishi jurnalini yuriting",
      ru: "Заведите журнал изменений правил",
      en: "Start a rule-change log for your lessons",
    },
    description: {
      uz: "Oxirgi malaka oshirishingizdan beri rasmiy qoidalarga oʻzgartirish kiritilganini tekshiring. Jurnalga yozing: tekshirish sanasi, manba, nima oʻzgargan va qaysi darslarga taʼsir qiladi. Ishonchingiz komil boʻlmasa — «tasdiqlash kerak» deb yozing.",
      ru: "Проверьте, менялись ли официальные правила с вашего последнего обучения. Запишите в журнал: дату проверки, источник, что изменилось и какие занятия это затрагивает. Если не уверены — пометьте «требует проверки».",
      en: "Check whether the official rules have been amended since your last training. Log the check date, the source, what changed and which lessons it affects. If unsure, mark it «needs confirmation».",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Jurnalda tekshirish sanasi va manba bor; har bir oʻzgarish tegishli dars mavzusiga bogʻlangan (oʻzgarish boʻlmasa ham sana qayd etilgan).",
      ru: "В журнале есть дата проверки и источник; каждое изменение связано с темой занятия (даже без изменений дата записана).",
      en: "The log has a check date and source; every change is linked to a lesson topic (the date is logged even if nothing changed).",
    },
    why: {
      uz: "Eskirgan qoidani oʻrgatish oʻquvchini imtihonda ham, yoʻlda ham qiyin ahvolga soladi. Sana bilan ishlash bilimning dolzarbligini nazorat qiladi.",
      ru: "Устаревшее правило подводит ученика и на экзамене, и на дороге. Работа с датами держит знание актуальным.",
      en: "Teaching an outdated rule fails the learner both in the exam and on the road. Working with dates keeps knowledge current.",
    },
    resources: [],
  },
  {
    slug: "trk_timed_self_test",
    skill: "traffic_rules_knowledge",
    title: {
      uz: "Vaqt bilan oʻz-oʻzini sinang va natijani yozing",
      ru: "Пройдите тест на время и запишите результат",
      en: "Take a timed self-test and record your score",
    },
    description: {
      uz: "Rasmiy yoki maktab tasdiqlagan manbadan 20 ta savolli testni 20 daqiqada yeching. Natijani yozing. Har bir xato uchun rasmiy matndagi tegishli qoidani toping va qisqa yozib qoʻying.",
      ru: "Решите тест из 20 вопросов из официального или одобренного школой источника за 20 минут. Запишите результат. Для каждой ошибки найдите правило в официальном тексте и кратко его запишите.",
      en: "Do a 20-question test from an official or school-approved source in 20 minutes. Record the score. For each error, find the rule in the official text and note it briefly.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Ball yozilgan; har bir xato rasmiy matndagi qoidaga bogʻlangan.",
      ru: "Результат записан; каждая ошибка связана с правилом из официального текста.",
      en: "Score recorded; every error is linked to a rule in the official text.",
    },
    why: {
      uz: "Oʻlchangan natija taxminni almashtiradi. Bu koʻnikma darvoza boʻlgani uchun boʻshliqlar keyingi LEVELni toʻsib qoʻyadi.",
      ru: "Измеренный результат заменяет догадку. Это навык-ворота, поэтому пробелы в нём блокируют следующий LEVEL.",
      en: "A measured score replaces guessing. This is a gate skill, so gaps here block the next LEVEL.",
    },
    resources: [],
  },
];
