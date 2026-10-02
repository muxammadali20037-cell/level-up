import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: hazard_perception. Never instruct the user to drive or teach on public roads (§14.1 rule 3). */
export const actions: ActionInput[] = [
  {
    slug: "hp_scan_predict_act",
    skill: "hazard_perception",
    title: {
      uz: "«Kuzat – oldindan koʻr – harakat qil» siklini yozing",
      ru: "Опишите цикл «осмотр – прогноз – действие»",
      en: "Write out the scan–predict–act cycle",
    },
    description: {
      uz: "Uch bosqichni oʻz soʻzlaringiz bilan yozing. Har biriga oʻquvchiga beradigan bitta savol qoʻshing, masalan: «Toʻxtab turgan furgon ortida nima boʻlishi mumkin?»",
      ru: "Запишите три шага своими словами. К каждому добавьте один вопрос ученику, например: «Что может скрываться за припаркованным фургоном?»",
      en: "Write the three steps in your own words. Add one question for the learner to each, e.g. «What could that parked van be hiding?»",
    },
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "3 bosqich tavsifi va 3 ta oʻquvchi savoli yozilgan.",
      ru: "Записаны описания 3 шагов и 3 вопроса для ученика.",
      en: "3 step descriptions and 3 learner questions are written.",
    },
    why: {
      uz: "Xavfni koʻrishni oʻrgatish uchun avval jarayonni nomlay olish kerak. Savollar oʻquvchini passiv tinglovchidan faol kuzatuvchiga aylantiradi.",
      ru: "Чтобы учить восприятию опасности, сначала нужно уметь назвать процесс. Вопросы превращают ученика из слушателя в активного наблюдателя.",
      en: "To teach hazard perception you first need to name the process. Questions turn the learner from a listener into an active observer.",
    },
    resources: [],
  },
  {
    slug: "hp_video_commentary",
    skill: "hazard_perception",
    title: {
      uz: "Videoregistrator yozuviga ovozli sharh bering",
      ru: "Прокомментируйте запись видеорегистратора",
      en: "Commentate a dashcam recording aloud",
    },
    description: {
      uz: "5 daqiqalik haydash videosini koʻring va har 30 soniyada pauza qiling. Har safar 2 ta xavfni va qanday rivojlanishi mumkinligini ovoz chiqarib ayting. Kech sezgan xavflarni yozib boring.",
      ru: "Посмотрите 5-минутное видео поездки, ставя паузу каждые 30 секунд. Каждый раз вслух назовите 2 опасности и как они могут развиться. Записывайте те, что заметили поздно.",
      en: "Watch a 5-minute driving video, pausing every 30 seconds. Each time, name 2 hazards aloud and how they could develop. Note the ones you spotted late.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    successCriteria: {
      uz: "Kamida 20 ta xavf nomlangan; kech sezilganlar roʻyxati bor.",
      ru: "Названо не менее 20 опасностей; есть список замеченных поздно.",
      en: "At least 20 hazards named; a list of late-spotted ones exists.",
    },
    why: {
      uz: "Oʻzingiz ovoz chiqarib sharhlay olmagan narsani oʻquvchiga oʻrgata olmaysiz. Video xavfsiz sharoitda mashq qilish imkonini beradi.",
      ru: "Нельзя научить тому, что сам не умеешь комментировать вслух. Видео позволяет тренироваться в безопасных условиях.",
      en: "You cannot teach what you cannot commentate yourself. Video lets you practise in safe conditions.",
    },
    resources: [],
  },
  {
    slug: "hp_what_if_questions",
    skill: "hazard_perception",
    title: {
      uz: "Bitta marshrut uchun 5 ta «Agar…?» savolini tuzing",
      ru: "Составьте 5 вопросов «А что если…?» для маршрута",
      en: "Write 5 «What if…?» questions for one route",
    },
    description: {
      uz: "Odatdagi marshrutingizning bir qismi uchun oʻquvchini oldindan koʻrishga undaydigan 5 savol yozing (masalan: «Avtobus chiqib qolsa, qayerda boʻlasiz?»). Ularni aniq xavfdan yashirin xavfga qarab tartiblang.",
      ru: "Для участка привычного маршрута напишите 5 вопросов, заставляющих ученика прогнозировать (например: «Если автобус начнёт выезжать, где вы будете?»). Расположите от очевидных опасностей к скрытым.",
      en: "For a section of your usual route, write 5 questions that make the learner predict (e.g. «If the bus pulls out, where will you be?»). Order them from obvious to hidden hazards.",
    },
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "5 ta savol murakkablik boʻyicha tartiblangan, har biri aniq joyga bogʻlangan.",
      ru: "5 вопросов упорядочены по сложности, каждый привязан к конкретному месту.",
      en: "5 questions ordered by difficulty, each tied to a specific location.",
    },
    why: {
      uz: "Savol oʻquvchining fikrini oldinga olib chiqadi. Oddiydan yashiringa oʻtish xavfni koʻrishni bosqichma-bosqich rivojlantiradi.",
      ru: "Вопрос выводит мышление ученика вперёд. Переход от очевидного к скрытому развивает восприятие опасности поэтапно.",
      en: "A question moves the learner's thinking ahead. Going from obvious to hidden builds hazard perception step by step.",
    },
    resources: [],
  },
  {
    slug: "hp_classroom_spotting_exercise",
    skill: "hazard_perception",
    title: {
      uz: "Nazariy dars uchun xavfni topish mashqini yarating",
      ru: "Создайте упражнение на поиск опасностей для класса",
      en: "Build a hazard-spotting exercise for a theory session",
    },
    description: {
      uz: "Yoʻl holatining 3 ta surati yoki chizmasini tayyorlang. Har biriga xavflar roʻyxati va kutilgan javobni yozing. Mashqni sinfda 1–2 oʻquvchi bilan oʻtkazing va ular qaysi xavflarni oʻtkazib yuborganini qayd eting.",
      ru: "Подготовьте 3 фото или схемы дорожных ситуаций. Для каждой запишите список опасностей и ожидаемый ответ. Проведите упражнение в классе с 1–2 учениками и отметьте, какие опасности они пропустили.",
      en: "Prepare 3 photos or sketches of road scenes. For each, list the hazards and the expected answer. Run it in class with 1–2 learners and note which hazards they missed.",
    },
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Javob kaliti bilan mashq varagʻi tayyor; bir marta qoʻllangan; oʻtkazib yuborilgan xavflar yozilgan.",
      ru: "Лист упражнения с ключом готов; проведён один раз; пропущенные опасности записаны.",
      en: "An exercise sheet with an answer key exists; used once; missed hazards are recorded.",
    },
    why: {
      uz: "Sinfdagi mashq xavfni koʻrishni avtomobilga chiqishdan oldin, xavfsiz muhitda rivojlantiradi va oʻquvchining zaif joylarini koʻrsatadi.",
      ru: "Упражнение в классе развивает восприятие опасности до выезда, в безопасной среде, и показывает слабые места ученика.",
      en: "A classroom exercise builds hazard perception before any drive, in a safe setting, and reveals the learner's weak spots.",
    },
    resources: [],
  },
  {
    slug: "hp_measure_spotting_time",
    skill: "hazard_perception",
    title: {
      uz: "Oʻquvchilarning xavfni topish vaqtini oʻlchang",
      ru: "Измерьте время обнаружения опасности у учеников",
      en: "Measure learners' hazard-spotting time",
    },
    description: {
      uz: "Sinfda 3 ta qisqa video koʻrsating. Har bir oʻquvchi asosiy xavfni necha soniyada birinchi nomlaganini yozing va oʻz natijangiz bilan solishtiring. 2 haftadan keyin takrorlash uchun sanani belgilang.",
      ru: "Покажите в классе 3 коротких видео. Запишите, на какой секунде каждый ученик впервые назвал главную опасность, и сравните со своим временем. Назначьте повтор через 2 недели.",
      en: "Show 3 short clips in class. Record the second at which each learner first names the main hazard and compare with your own time. Set a repeat date in 2 weeks.",
    },
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    successCriteria: {
      uz: "Har bir oʻquvchi va video boʻyicha vaqtlar jadvali va takrorlash sanasi bor.",
      ru: "Есть таблица времени по каждому ученику и видео, назначена дата повтора.",
      en: "A table of times per learner per clip exists, with a repeat date set.",
    },
    why: {
      uz: "Oʻlchov oʻqitishingiz natija berayotganini koʻrsatadi. Takroriy oʻlchov sizning usulingizni tasdiqlaydi yoki tuzatish zarurligini bildiradi.",
      ru: "Измерение показывает, работает ли ваше обучение. Повторный замер подтверждает метод или показывает, что его нужно править.",
      en: "Measuring shows whether your teaching works. A repeat measurement confirms your method or shows it needs fixing.",
    },
    resources: [],
  },
];
