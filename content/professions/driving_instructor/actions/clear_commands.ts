import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: clear_commands. Never instruct the user to drive or teach on public roads (§14.1 rule 3). */
export const actions: ActionInput[] = [
  {
    slug: "cc_where_when_what",
    skill: "clear_commands",
    title: {
      uz: "«Qayerda – qachon – nima» formulasida 10 buyruq yozing",
      ru: "Напишите 10 команд по формуле «где – когда – что»",
      en: "Write 10 commands using where–when–what",
    },
    description: {
      uz: "Odatdagi 10 ta yoʻnalish koʻrsatmangizni shu tartibda qayta yozing: qayerda (moʻljal), qachon, nima qilish. Masalan: «Keyingi chorrahada oʻngga buriling». Ortiqcha soʻzlarni oʻchiring.",
      ru: "Перепишите 10 привычных указаний в порядке: где (ориентир), когда, что сделать. Например: «На следующем перекрёстке поверните направо». Уберите лишние слова.",
      en: "Rewrite 10 of your usual directions in the order: where (landmark), when, what to do. E.g. «At the next junction, turn right». Cut every extra word.",
    },
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "10 ta buyruq bir xil tartibda, har biri bitta qisqa gap.",
      ru: "10 команд в одном порядке, каждая — одна короткая фраза.",
      en: "10 commands in the same order, each a single short sentence.",
    },
    why: {
      uz: "Oʻquvchi avval qayerga qarashni, keyin nima qilishni bilishi kerak. Doimiy tartib qarorni tezlashtiradi va xavfsizlikni oshiradi.",
      ru: "Ученику нужно сначала знать, куда смотреть, а потом — что делать. Постоянный порядок ускоряет решение и повышает безопасность.",
      en: "The learner needs to know where to look before what to do. A fixed order speeds up decisions and improves safety.",
    },
    resources: [],
  },
  {
    slug: "cc_ambiguous_words",
    skill: "clear_commands",
    title: {
      uz: "Ikki maʼnoli soʻzlaringiz oʻrnini toping",
      ru: "Замените двусмысленные слова в командах",
      en: "Replace ambiguous words in your commands",
    },
    description: {
      uz: "Darsda ishlatadigan noaniq soʻzlarni yozing: «shu yerda», «hozir», «toʻgʻri» (yoʻnalishmi yoki «durust»mi?), «boʻldi». Har biriga bir maʼnoli almashtirish yozing.",
      ru: "Выпишите неоднозначные слова, которые говорите на занятиях: «здесь», «сейчас», «правильно» (направление или одобрение?), «всё». Для каждого запишите однозначную замену.",
      en: "List vague words you use in lessons: «here», «now», «right» (direction or «correct»?), «okay». Write an unambiguous replacement for each.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Kamida 6 ta xavfli soʻz va har biriga aniq almashtirish yozilgan.",
      ru: "Записано не менее 6 рискованных слов и замена для каждого.",
      en: "At least 6 risky words listed, each with a clear replacement.",
    },
    why: {
      uz: "Bitta noaniq soʻz notoʻgʻri harakatga olib kelishi mumkin. Aniq buyruqlarsiz xavfsizlik bilimi ham ishlamaydi.",
      ru: "Одно неоднозначное слово может привести к неверному действию. Без чётких команд знания о безопасности не работают.",
      en: "One ambiguous word can trigger the wrong action. Without clear commands, safety knowledge fails.",
    },
    resources: [],
  },
  {
    slug: "cc_time_your_commands",
    skill: "clear_commands",
    title: {
      uz: "Buyruqlaringizni yozib oling va vaqtini oʻlchang",
      ru: "Запишите команды и замерьте их длительность",
      en: "Record your commands and time them",
    },
    description: {
      uz: "Stol ustida marshrut boʻyicha 10 ta buyruqni ovoz chiqarib ayting va telefoningizga yozib oling. Har birining davomiyligini soniyada oʻlchang. 3 soniyadan uzunlarini qisqartirib, qayta yozing.",
      ru: "За столом произнесите вслух 10 команд по маршруту и запишите на телефон. Замерьте длительность каждой в секундах. Команды длиннее 3 секунд сократите и перезапишите.",
      en: "At a desk, say 10 route commands aloud and record them on your phone. Time each in seconds. Shorten and re-record any longer than 3 seconds.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "10 ta buyruq vaqti yozilgan; qayta yozilgandan keyin barchasi 3 soniyadan qisqa.",
      ru: "Длительность 10 команд записана; после перезаписи все короче 3 секунд.",
      en: "Timings for 10 commands recorded; after re-recording, all are under 3 seconds.",
    },
    why: {
      uz: "Uzun buyruq oʻquvchining diqqatini yoʻldan olib qochadi. Qisqalikni oʻlchash uni odatga aylantiradi.",
      ru: "Длинная команда отвлекает внимание ученика от дороги. Замер краткости превращает её в привычку.",
      en: "A long command pulls the learner's attention off the road. Measuring brevity turns it into a habit.",
    },
    resources: [],
  },
  {
    slug: "cc_route_command_script",
    skill: "clear_commands",
    title: {
      uz: "Bitta marshrut uchun buyruqlar ssenariysini yozing",
      ru: "Напишите сценарий команд для одного маршрута",
      en: "Write a command script for one route",
    },
    description: {
      uz: "Odatdagi marshrutingiz xaritasida har bir burilish va qator almashtirish uchun buyruq qayerda berilishini belgilang va aniq soʻzlarini yozing. Sekin oʻquvchi ham ulgurishi uchun yetarlicha erta boʻlsin.",
      ru: "На карте привычного маршрута отметьте, где подаётся команда для каждого поворота и перестроения, и запишите точные слова. Точка должна быть достаточно ранней, чтобы успел и медленный ученик.",
      en: "On a map of your usual route, mark where each command is given for every turn and lane change, and write the exact words. Make it early enough for a slow learner to react.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 40,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Har bir burilish va qator almashtirish uchun joy va soʻzlar yozilgan.",
      ru: "Для каждого поворота и перестроения записаны место и слова команды.",
      en: "Every turn and lane change has a marked point and exact wording.",
    },
    why: {
      uz: "Kech berilgan buyruq — xavfli buyruq. Oldindan tayyor ssenariy sizni stress paytida ham aniq va erta gapirishga yordam beradi.",
      ru: "Поздняя команда — опасная команда. Готовый сценарий помогает говорить чётко и рано даже под стрессом.",
      en: "A late command is a dangerous command. A prepared script helps you speak early and clearly even under stress.",
    },
    resources: [],
  },
  {
    slug: "cc_listener_test",
    skill: "clear_commands",
    title: {
      uz: "Buyruqlaringizni tinglovchida sinab koʻring",
      ru: "Проверьте свои команды на слушателе",
      en: "Test your commands on a listener",
    },
    description: {
      uz: "Haydovchi boʻlmagan tanishingizga marshrut xaritasini bering va 10 ta buyruqni oʻqib bering. Har birini u birinchi urinishda toʻgʻri tushunganini sanang. Tushunilmaganlarini qayta yozing.",
      ru: "Дайте знакомому без водительского опыта карту маршрута и зачитайте 10 команд. Посчитайте, сколько он понял правильно с первого раза. Непонятые команды перепишите.",
      en: "Give a non-driver friend a route map and read out 10 commands. Count how many they understand correctly the first time. Rewrite the ones they missed.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 25,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Kamida 9/10 buyruq birinchi urinishda tushunilgan; qolganlari qayta yozilgan.",
      ru: "Не менее 9 из 10 команд поняты с первого раза; остальные переписаны.",
      en: "At least 9 of 10 commands understood first time; the rest rewritten.",
    },
    why: {
      uz: "Buyruq aniqligini gapiruvchi emas, tinglovchi belgilaydi. Bu koʻnikma darvoza boʻlgani uchun oʻlchangan dalil muhim.",
      ru: "Чёткость команды определяет слушатель, а не говорящий. Это навык-ворота, поэтому важно измеримое подтверждение.",
      en: "Clarity is decided by the listener, not the speaker. This is a gate skill, so measured evidence matters.",
    },
    resources: [],
  },
];
