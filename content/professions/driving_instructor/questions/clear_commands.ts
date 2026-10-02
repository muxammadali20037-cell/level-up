import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;
type OptionInput = QuestionInput["options"][number];

const opt = (key: string, score: number, uz: string, ru: string, en: string): OptionInput => ({
  key,
  score,
  label: { uz, ru, en },
});

/**
 * Skill: clear_commands (gate K2). Keys: driving_instructor.clear_commands.NN
 * Commands follow "where — when — what": location first, then action, given early. Unsafe options score 0.
 */
export const questions: QuestionInput[] = [
  {
    key: "driving_instructor.clear_commands.01",
    skill: "clear_commands",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Burilishga yaqinlashayotgan oʻquvchi uchun qaysi koʻrsatma eng aniq?",
      ru: "Какая команда самая понятная для ученика, который приближается к повороту?",
      en: "Which command is clearest for a learner approaching a turn?",
    },
    options: [
      opt("a", 0, "«Shu yerda buriling»", "«Поворачивайте здесь»", "\"Turn here\""),
      opt("b", 0, "«Oʻngga, oʻngga, hozir oʻngga!»", "«Направо, направо, сейчас направо!»", "\"Right, right, now right!\""),
      opt("c", 1, "«Keyingi chorrahada oʻngga buriling»", "«На следующем перекрёстке поверните направо»", "\"At the next junction, turn right\""),
      opt("d", 0, "«Tez orada qayergadir burilamiz, tayyor turing»", "«Скоро где-то повернём, будьте готовы»", "\"We'll turn somewhere soon, get ready\""),
    ],
    explanation: {
      uz: "Yaxshi koʻrsatma avval joyni, keyin harakatni aytadi va oldindan beriladi — oʻquvchi qayerda va nima qilishini aniq biladi.",
      ru: "Хорошая команда сначала называет место, потом действие и даётся заранее — ученик точно знает, где и что делать.",
      en: "A good command names the place first, then the action, and comes early, so the learner knows exactly where and what.",
    },
  },
  {
    key: "driving_instructor.clear_commands.02",
    skill: "clear_commands",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Oʻquvchi oʻrtacha tezlikda yon koʻchalari bir-biriga yaqin joylashgan yoʻlda ketyapti. Unga ikkinchi chap koʻchaga burilish kerak.",
      ru: "Ученик едет со средней скоростью по дороге, где боковые улицы идут близко друг к другу. Ему нужно свернуть во вторую улицу налево.",
      en: "The learner is driving at moderate speed on a road where side streets are close together. They need to take the second street on the left.",
    },
    prompt: {
      uz: "Qaysi koʻrsatma usuli eng toʻgʻri?",
      ru: "Какой способ дать команду лучше всего?",
      en: "Which way of giving the command is best?",
    },
    options: [
      opt(
        "a",
        1,
        "Birinchi koʻchadan oldin «ikkinchi chapga» deyish, yaqinlashganda «mana shu» deb tasdiqlash",
        "До первой улицы сказать «вторая налево», а на подъезде подтвердить: «вот эта»",
        "Say \"second left\" before the first street, then confirm \"this one\" on approach",
      ),
      opt(
        "b",
        0,
        "Avtomobil ikkinchi koʻchaga yetganda «chapga buriling» deyish",
        "Сказать «поворачивайте налево», когда машина уже у второй улицы",
        "Say \"turn left\" when the car reaches the second street",
      ),
      opt(
        "c",
        0.5,
        "«Koʻk peshlavhali doʻkondan keyin chapga» deyish",
        "Сказать «налево после магазина с синей вывеской»",
        "Say \"left after the shop with the blue sign\"",
      ),
      opt(
        "d",
        0,
        "«Keyingi chapga — yoʻq, undan keyingisiga» deyish",
        "Сказать «следующая налево — нет, та, что после»",
        "Say \"next left — no, the one after\"",
      ),
    ],
    explanation: {
      uz: "Oldindan berilgan va keyin tasdiqlangan koʻrsatma xato koʻchaga burilish va kech manyovr xavfini kamaytiradi. Moʻljal ham ishlaydi, lekin u koʻrinmay qolishi yoki chalkashtirishi mumkin.",
      ru: "Ранняя команда с подтверждением снижает риск свернуть не туда или маневрировать поздно. Ориентир тоже работает, но его могут не заметить или перепутать.",
      en: "An early command with a confirmation cuts the risk of a wrong or late turn. A landmark can work, but it may be missed or confused.",
    },
  },
  {
    key: "driving_instructor.clear_commands.03",
    skill: "clear_commands",
    specializations: [],
    type: "judgment",
    targetLevel: 6,
    scoringRule: "partial_credit",
    discrimination: 0.7,
    scenario: {
      uz: "Oʻquvchi koʻrsatmalaringizga tez-tez kech javob beradi, garchi toʻxtab turganda ularni yaxshi tushunsa ham. Haydash paytida siz koʻp gapirasiz va har bir narsani tushuntirasiz.",
      ru: "Ученик часто поздно реагирует на ваши команды, хотя на стоянке хорошо их понимает. Во время езды вы много говорите и всё подробно объясняете.",
      en: "The learner often reacts late to your commands, though they understand them well when parked. While driving, you talk a lot and explain everything.",
    },
    prompt: {
      uz: "Asosiy sabab nima va uni qanday tuzatish kerak?",
      ru: "В чём наиболее вероятная причина и как это исправить?",
      en: "What is the most likely cause, and how should you fix it?",
    },
    options: [
      opt(
        "a",
        0,
        "Oʻquvchining reaksiyasi sekin — koʻrsatmalarni balandroq aytish",
        "У ученика медленная реакция — давать команды громче",
        "The learner reacts slowly, so give commands louder",
      ),
      opt(
        "b",
        0.5,
        "Koʻrsatmalarni yanada ertaroq berib, har birini ikki marta takrorlash",
        "Давать команды ещё раньше и повторять каждую дважды",
        "Give commands even earlier and repeat each one twice",
      ),
      opt(
        "c",
        0,
        "Nazariya yetishmaydi — haydash paytida har manyovrdan oldin koʻproq tushuntirish",
        "Не хватает теории — больше объяснять перед каждым манёвром прямо в движении",
        "Theory is lacking, so explain more before each manoeuvre while driving",
      ),
      opt(
        "d",
        1,
        "Ortiqcha gap yuklama beradi — haydashda qisqa koʻrsatma, tushuntirish esa toʻxtaganda",
        "Лишние слова перегружают — в движении короткие команды, объяснения на остановке",
        "Too much talk overloads them: short commands while driving, explanations when stopped",
      ),
    ],
    explanation: {
      uz: "Haydash paytida oʻquvchining diqqati cheklangan; ortiqcha gap muhim koʻrsatmani koʻmib yuboradi. Tushuntirishni toʻxtash vaqtiga koʻchirish javobni tezlashtiradi.",
      ru: "Во время езды внимание ученика ограничено, и лишние слова заглушают важную команду. Перенос объяснений на остановки ускоряет реакцию.",
      en: "Attention is limited while driving, and extra talk buries the key command. Moving explanations to stops speeds up responses.",
    },
  },
  {
    key: "driving_instructor.clear_commands.04",
    skill: "clear_commands",
    specializations: [],
    type: "decision",
    targetLevel: 7,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Oʻquvchi piyodalar oʻtish joyiga tezlikni pasaytirmay yaqinlashmoqda. Toʻxtab turgan avtobus ortidan bola chiqib kelayotganini koʻrdingiz. Harakat qilish uchun taxminan ikki soniya bor.",
      ru: "Ученик подъезжает к пешеходному переходу, не снижая скорости. Вы видите, что из-за стоящего автобуса выходит ребёнок. На действие примерно две секунды.",
      en: "The learner is approaching a pedestrian crossing without slowing. You see a child stepping out from behind a parked bus. There are about two seconds to act.",
    },
    prompt: {
      uz: "Shu lahzada eng toʻgʻri harakat qaysi?",
      ru: "Что лучше всего сделать в этот момент?",
      en: "What is the best action in this moment?",
    },
    options: [
      opt(
        "a",
        0,
        "«Bolani koʻrdingizmi? Endi nima qilasiz?» deb soʻrash",
        "Спросить: «Видите ребёнка? Что будете делать?»",
        "Ask: \"Do you see the child? What will you do?\"",
      ),
      opt(
        "b",
        1,
        "Bitta qisqa, qatʼiy «Tormoz!» koʻrsatmasi va darhol qoʻshimcha pedalni bosishga tayyorlik",
        "Одна короткая твёрдая команда «Тормоз!» и готовность сразу нажать дублирующую педаль",
        "One short, firm \"Brake!\" while ready to use the dual brake at once",
      ),
      opt(
        "c",
        0,
        "«Sekinlang, oldinda oʻtish joyi va avtobus, bola chiqishi mumkin» deyish",
        "Сказать: «Притормозите, впереди переход и автобус, может выйти ребёнок»",
        "Say: \"Slow down, there's a crossing and a bus, a child may step out\"",
      ),
      opt(
        "d",
        0.5,
        "Hech narsa demay, qoʻshimcha pedal bilan oʻzingiz tormozlash",
        "Молча затормозить дублирующей педалью самому",
        "Brake with the dual pedal yourself without saying anything",
      ),
    ],
    explanation: {
      uz: "Favqulodda vaziyatda faqat bitta qisqa koʻrsatmaga vaqt bor; savol yoki uzun jumla kechikadi. Jim tormozlash xavfsiz, lekin oʻquvchi nima boʻlganini va nimani qilish kerakligini bilmay qoladi.",
      ru: "В экстренной ситуации есть время только на одну короткую команду; вопрос или длинная фраза опоздают. Молча тормозить безопасно, но ученик не поймёт, что произошло и что делать.",
      en: "In an emergency there is time for one short command only; a question or long sentence comes too late. Silent braking is safe, but the learner misses what happened and what to do.",
    },
  },
  {
    key: "driving_instructor.clear_commands.05",
    skill: "clear_commands",
    specializations: [],
    type: "judgment",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Siz yangi yoʻriqchiga ustozlik qilasiz. Uning dars yozuvida koʻrsatmalar xushmuomala va toʻgʻri, lekin uzun: «Agar iloji boʻlsa, qulay paytda biroz sekinlay boshlang, chunki oldinda chorraha bor».",
      ru: "Вы наставник нового инструктора. На записи его занятия команды вежливые и верные, но длинные: «Если можно, когда будет удобно, начинайте немного тормозить, потому что впереди перекрёсток».",
      en: "You mentor a new instructor. In a lesson recording, their commands are polite and correct but long: \"If you can, when convenient, start slowing a little, because there's a junction ahead.\"",
    },
    prompt: {
      uz: "Qaysi fikr-mulohaza uning koʻrsatmalarini eng koʻp yaxshilaydi?",
      ru: "Какая обратная связь лучше всего улучшит его команды?",
      en: "Which feedback will improve their commands the most?",
    },
    options: [
      opt(
        "a",
        0,
        "Kamroq xushmuomala va qattiqqoʻlroq boʻlishni maslahat berish",
        "Посоветовать быть менее вежливым и более строгим",
        "Advise them to be less polite and more strict",
      ),
      opt(
        "b",
        0.5,
        "Soʻzma-soʻz yodlash uchun standart koʻrsatmalar roʻyxatini berish",
        "Дать список стандартных команд, чтобы выучить их дословно",
        "Give them a list of standard commands to learn word for word",
      ),
      opt(
        "c",
        1,
        "«Joy — harakat» tuzilmasi va erta vaqtni koʻrsatib, oʻz jumlalarini qisqartirishni mashq qildirish",
        "Показать структуру «где — что» и ранний тайминг и потренировать сокращение его фраз",
        "Show the \"where — what\" structure and early timing, then practise shortening their own phrases",
      ),
      opt(
        "d",
        0,
        "Soʻz oʻrniga koʻproq qoʻl ishoralaridan foydalanishni tavsiya qilish",
        "Рекомендовать вместо слов чаще использовать жесты",
        "Recommend using more hand gestures instead of words",
      ),
    ],
    explanation: {
      uz: "Tamoyilni tushunib, oʻz nutqini qayta ishlagan yoʻriqchi har qanday vaziyatda qisqa koʻrsatma bera oladi. Tayyor roʻyxat yordam beradi, lekin yangi vaziyatga koʻchmaydi.",
      ru: "Инструктор, который понял принцип и переработал свою речь, сможет давать короткие команды в любой ситуации. Готовый список помогает, но плохо переносится на новые случаи.",
      en: "An instructor who grasps the principle and reworks their own speech can give short commands anywhere. A fixed list helps but transfers poorly to new situations.",
    },
  },
];
