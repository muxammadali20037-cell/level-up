import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: learner_psychology. Never instruct the user to drive or teach on public roads (§14.1 rule 3). */
export const actions: ActionInput[] = [
  {
    slug: "lp_overload_signs",
    skill: "learner_psychology",
    title: {
      uz: "Ortiqcha yuklanishning 8 belgisini yozing",
      ru: "Запишите 8 признаков перегрузки ученика",
      en: "List 8 signs of learner overload",
    },
    description: {
      uz: "Oʻquvchi hayajonlangan yoki yuklanib qolganini koʻrsatadigan 8 ta kuzatiladigan belgini yozing: rulni qattiq siqish, jim qolish, kech reaksiya, faqat oldinga qarash va h.k. Har biriga birinchi javobingizni yozing.",
      ru: "Запишите 8 наблюдаемых признаков, что ученик волнуется или перегружен: сжимает руль, замолкает, реагирует поздно, смотрит только вперёд и т. п. Для каждого — ваша первая реакция.",
      en: "Write 8 observable signs that a learner is stressed or overloaded: gripping the wheel, going silent, late reactions, staring straight ahead, etc. Add your first response to each.",
    },
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "8 ta belgi va har biriga aniq javob harakati yozilgan.",
      ru: "Записаны 8 признаков и конкретная реакция на каждый.",
      en: "8 signs written, each with a concrete response.",
    },
    why: {
      uz: "Yuklanib qolgan oʻquvchi koʻrsatmani eshitmaydi. Belgilarni erta sezish tuzatishlar foyda berishi uchun shart.",
      ru: "Перегруженный ученик не слышит указаний. Раннее распознавание — условие того, чтобы исправления работали.",
      en: "An overloaded learner does not hear instructions. Spotting it early is what makes corrections work.",
    },
    resources: [],
  },
  {
    slug: "lp_calming_phrases",
    skill: "learner_psychology",
    title: {
      uz: "5 ta tinchlantiruvchi ibora tayyorlang",
      ru: "Подготовьте 5 успокаивающих фраз",
      en: "Prepare 5 calming phrases",
    },
    description: {
      uz: "Hayajonlangan oʻquvchi uchun 5 ta qisqa, xotirjam va baholamaydigan ibora yozing. Yana ishlatishni toʻxtatadigan 3 ta iborani yozing (masalan, ayblovchi yoki shoshiltiruvchi).",
      ru: "Напишите 5 коротких, спокойных и неоценочных фраз для взволнованного ученика. И 3 фразы, от которых вы откажетесь (например, обвиняющие или подгоняющие).",
      en: "Write 5 short, calm, non-judging phrases for an anxious learner. Also write 3 phrases you will stop using (e.g. blaming or rushing ones).",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "5 ta tinchlantiruvchi va 3 ta taqiqlangan ibora roʻyxati.",
      ru: "Список из 5 успокаивающих и 3 исключённых фраз.",
      en: "A list of 5 calming and 3 retired phrases.",
    },
    why: {
      uz: "Ohang oʻquvchining stress darajasiga bevosita taʼsir qiladi. Tayyor iboralar qiyin daqiqada toʻgʻri soʻzni topishga yordam beradi.",
      ru: "Тон напрямую влияет на уровень стресса ученика. Готовые фразы помогают найти верные слова в трудный момент.",
      en: "Tone directly affects the learner's stress level. Ready phrases help you find the right words in a hard moment.",
    },
    resources: [],
  },
  {
    slug: "lp_anxious_first_lesson",
    skill: "learner_psychology",
    title: {
      uz: "Hayajonli oʻquvchi uchun birinchi dars rejasini tuzing",
      ru: "Спланируйте первое занятие для тревожного ученика",
      en: "Plan a low-pressure first lesson for an anxious learner",
    },
    description: {
      uz: "Hayajonli boshlovchi uchun birinchi 15 daqiqani rejalashtiring: suhbat, boshqaruv organlari bilan tanishish, yopiq maydon, surʼatni oʻquvchi tanlashi. Har qismda stressni nima kamaytirishini yozing.",
      ru: "Спланируйте первые 15 минут для тревожного новичка: беседа, знакомство с органами управления, закрытая площадка, выбор темпа учеником. Для каждой части запишите, что снижает стресс.",
      en: "Plan the first 15 minutes for an anxious beginner: talk, getting to know the controls, a closed area, the learner choosing the pace. For each part, note what lowers stress.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "15 daqiqalik reja, har bir qismda stressni kamaytiruvchi omil koʻrsatilgan.",
      ru: "План на 15 минут, в каждой части указан фактор снижения стресса.",
      en: "A 15-minute plan, with a stress-reducing factor named for each part.",
    },
    why: {
      uz: "Birinchi taassurot keyingi darslardagi ishonchni belgilaydi. Nazorat hissi hayajonni kamaytiradi.",
      ru: "Первое впечатление определяет доверие на следующих занятиях. Ощущение контроля снижает тревогу.",
      en: "First impressions set trust for later lessons. A sense of control lowers anxiety.",
    },
    resources: [],
  },
  {
    slug: "lp_pre_lesson_checkin",
    skill: "learner_psychology",
    title: {
      uz: "Darsdan oldin 2 savollik suhbat oʻtkazing",
      ru: "Проводите короткий опрос перед занятием",
      en: "Run a 2-question check-in before lessons",
    },
    description: {
      uz: "Bir hafta davomida har bir darsdan oldin oʻquvchidan soʻrang: «Bugun oʻzingizni 1–5 ball bilan qanday his qilyapsiz?» va «Bugun nimadan xavotirdasiz?». Javob va reja oʻzgarishini daftarga yozing.",
      ru: "В течение недели перед каждым занятием спрашивайте ученика: «Как вы себя чувствуете сегодня по шкале 1–5?» и «Что вас сегодня беспокоит?». Записывайте ответ и изменение плана.",
      en: "For one week, before each lesson ask the learner: «How do you feel today, 1–5?» and «What worries you today?». Log the answer and any change to the plan.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Bir haftalik jurnal: har bir darsda ball, xavotir va qabul qilingan moslashtirish.",
      ru: "Журнал за неделю: по каждому занятию — балл, тревога и принятая корректировка.",
      en: "A one-week log: score, concern and adjustment for every lesson.",
    },
    why: {
      uz: "Oʻquvchining holati darsning xavfsizligi va samarasiga taʼsir qiladi. Qisqa suhbat rejani oldindan moslashtirish imkonini beradi.",
      ru: "Состояние ученика влияет на безопасность и пользу занятия. Короткий опрос позволяет скорректировать план заранее.",
      en: "The learner's state affects lesson safety and value. A short check-in lets you adjust the plan in advance.",
    },
    resources: [],
  },
  {
    slug: "lp_anonymous_tone_feedback",
    skill: "learner_psychology",
    title: {
      uz: "Ohangingiz haqida anonim fikr toʻplang",
      ru: "Соберите анонимный отзыв о вашем тоне",
      en: "Collect anonymous feedback on your tone",
    },
    description: {
      uz: "3–5 oʻquvchiga 3 savolli varaqa bering: «Oʻzingizni xavfsiz his qildingizmi?», «Koʻrsatmalar xotirjam berildimi?», «Nimani oʻzgartirish kerak?». Ismsiz yigʻing va bitta oʻzgarishni tanlang.",
      ru: "Дайте 3–5 ученикам карточку из 3 вопросов: «Чувствовали ли вы себя в безопасности?», «Были ли указания спокойными?», «Что изменить?». Соберите анонимно и выберите одно изменение.",
      en: "Give 3–5 learners a 3-question card: «Did you feel safe?», «Were instructions calm?», «What should change?». Collect them anonymously and pick one change.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 20,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Kamida 3 ta javob yigʻilgan; bitta aniq oʻzgarish yozilgan.",
      ru: "Собрано не менее 3 ответов; записано одно конкретное изменение.",
      en: "At least 3 responses collected; one concrete change written down.",
    },
    why: {
      uz: "Oʻz ohangingizni ichkaridan baholash qiyin. Oʻquvchilarning fikri ishonch muhitini haqiqatda yaratayotganingizni koʻrsatadi.",
      ru: "Свой тон трудно оценить изнутри. Отзывы учеников показывают, создаёте ли вы реально атмосферу доверия.",
      en: "Your own tone is hard to judge from the inside. Learner feedback shows whether you really build trust.",
    },
    resources: [],
  },
];
