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
 * Skill: learner_psychology. Keys: driving_instructor.learner_psychology.NN
 * Recognizing stress and overload and adjusting pace and tone. Unsafe options score 0; no clinical claims.
 */
export const questions: QuestionInput[] = [
  {
    key: "driving_instructor.learner_psychology.01",
    skill: "learner_psychology",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Mashgʻulot paytida oʻquvchi haddan tashqari yuklanganini koʻproq qaysi belgi koʻrsatadi?",
      ru: "Какой признак чаще всего говорит о том, что ученик перегружен во время занятия?",
      en: "Which sign most often shows that a learner is overloaded during a lesson?",
    },
    options: [
      opt(
        "a",
        0,
        "Yoʻl chetida toʻxtaganda yoʻnalish haqida bir nechta savol beradi",
        "На остановке у обочины задаёт несколько вопросов о маршруте",
        "They ask several questions about the route while parked at the roadside",
      ),
      opt(
        "b",
        0,
        "Birinchi urinishda yaxshi chiqqan manyovrni yana takrorlashni soʻraydi",
        "Просит повторить манёвр, который с первого раза получился хорошо",
        "They ask to repeat a manoeuvre that went well the first time",
      ),
      opt(
        "c",
        0,
        "Oson toʻgʻri yoʻl boʻlaklarida begona mavzularda gaplashadi",
        "На простых прямых участках болтает на посторонние темы",
        "They chat about other topics on easy straight sections",
      ),
      opt(
        "d",
        1,
        "Rulni qattiq siqadi, oynalarga qaramay qoʻyadi va koʻrsatmalarga kech javob beradi",
        "Сильно сжимает руль, перестаёт смотреть в зеркала и поздно реагирует на команды",
        "They grip the wheel hard, stop checking mirrors and respond to commands late",
      ),
    ],
    explanation: {
      uz: "Mushaklarning taranglashishi, kuzatuvning torayishi va kech javob — yuklama oʻquvchining imkoniyatidan oshganining odatiy belgilari.",
      ru: "Мышечное напряжение, сужение внимания и запоздалая реакция — типичные признаки того, что нагрузка превышает возможности ученика.",
      en: "Muscle tension, narrowing observation and late responses are typical signs that the load exceeds what the learner can handle.",
    },
  },
  {
    key: "driving_instructor.learner_psychology.02",
    skill: "learner_psychology",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Katta yoshli oʻquvchi dars oldidan aytadi: «Juda hayajondaman. Oʻtgan safar bir mashina menga signal chaldi, kechasi uxlay olmadim».",
      ru: "Взрослый ученик перед занятием говорит: «Я очень волнуюсь. В прошлый раз мне посигналила машина, я потом всю ночь не спал».",
      en: "An adult learner says before the lesson: \"I'm really nervous. Last time a car honked at me and I couldn't sleep that night.\"",
    },
    prompt: {
      uz: "Mashgʻulotni qanday boshlash eng toʻgʻri?",
      ru: "Как лучше всего начать занятие?",
      en: "What is the best way to start the lesson?",
    },
    options: [
      opt(
        "a",
        0,
        "«Hamma hayajonlanadi, xavotir olmang» deb, rejadagi gavjum yoʻnalishga chiqish",
        "Сказать «все волнуются, не переживайте» и ехать по плану на оживлённый маршрут",
        "Say \"everyone gets nervous, don't worry\" and go on the planned busy route",
      ),
      opt(
        "b",
        1,
        "Hissini tan olib, voqeani qisqa muhokama qilish, tinchroq yoʻnalish va «toʻxtash» belgisini kelishish",
        "Признать чувства, коротко обсудить случай, выбрать спокойный маршрут и договориться о сигнале «стоп»",
        "Acknowledge the feeling, briefly discuss it, pick a calmer route and agree a \"stop\" signal",
      ),
      opt(
        "c",
        0,
        "Oʻquvchi tinchlanguncha mashgʻulotni bekor qilish",
        "Отменить занятие, пока ученик не успокоится",
        "Cancel the lesson until the learner calms down",
      ),
      opt(
        "d",
        0.5,
        "Rejadagi yoʻnalishdan borib, birinchi qismini oʻzingiz namoyish sifatida haydash",
        "Ехать по плану, но первую часть провести самому как демонстрацию",
        "Keep the planned route but drive the first part yourself as a demonstration",
      ),
    ],
    explanation: {
      uz: "Hissini tan olish va qiyinchilikni vaqtincha kamaytirish oʻquvchiga nazoratni qaytaradi. Kelishilgan belgi xavotirni pasaytiradi va mashgʻulotni xavfsiz qiladi.",
      ru: "Признание чувств и временное снижение сложности возвращают ученику ощущение контроля. Договорённый сигнал снижает тревогу и делает занятие безопаснее.",
      en: "Acknowledging the feeling and briefly lowering difficulty gives the learner back a sense of control. An agreed signal reduces anxiety and keeps the lesson safe.",
    },
  },
  {
    key: "driving_instructor.learner_psychology.03",
    skill: "learner_psychology",
    specializations: [],
    type: "judgment",
    targetLevel: 6,
    scoringRule: "partial_credit",
    discrimination: 0.7,
    scenario: {
      uz: "Yosh oʻquvchi oʻziga juda ishonadi, tez haydaydi va eslatmalaringizga «Otamning mashinasini haydaganman, bilaman» deb javob beradi. Lekin oynalarga qarash va chorrahada kuzatishda muntazam xato qiladi.",
      ru: "Молодой ученик очень уверен в себе, ездит быстро и на замечания отвечает: «Я уже ездил на машине отца, я знаю». Но регулярно ошибается с зеркалами и осмотром на перекрёстках.",
      en: "A young learner is very confident, drives fast and answers your remarks with \"I've driven my dad's car, I know.\" Yet they keep making mistakes with mirrors and junction observation.",
    },
    prompt: {
      uz: "Eng toʻgʻri yondashuv qaysi?",
      ru: "Какой подход лучше всего?",
      en: "What is the best approach?",
    },
    options: [
      opt(
        "a",
        1,
        "Savollar va aniq kuzatuvlar orqali boʻshliqlarni oʻzi koʻrishiga yordam berish, xavfsizlik chegarasini belgilash",
        "Вопросами и конкретными наблюдениями помочь самому увидеть пробелы и чётко задать рамки безопасности",
        "Use questions and specific observations so they see the gaps, and set firm safety limits",
      ),
      opt(
        "b",
        0.5,
        "Xatolarini yozib borib, dars oxirida batafsil koʻrib chiqish",
        "Записывать ошибки и подробно разобрать их в конце занятия",
        "Note their mistakes and go through them in detail at the end",
      ),
      opt(
        "c",
        0,
        "Oʻzi xohlagandek haydashiga ruxsat berish — tajribadan oʻrganadi",
        "Дать ему ездить как хочет — научится на опыте",
        "Let them drive as they like, since they will learn from experience",
      ),
      opt(
        "d",
        0,
        "Qiyinligini his qilishi uchun murakkabroq yoʻnalishlarga olib chiqish",
        "Вывести на более сложные маршруты, чтобы он почувствовал трудность",
        "Take them on harder routes so they feel how difficult it is",
      ),
    ],
    explanation: {
      uz: "Haddan tashqari ishonchli oʻquvchi koʻpincha tanqidni rad etadi, lekin oʻzi koʻrgan dalilni qabul qiladi. Xavfli usullar — erkin qoʻyish yoki qiyinlashtirish — 0 ball oladi.",
      ru: "Слишком уверенный ученик часто отвергает критику, но принимает то, что увидел сам. Опасные способы — дать свободу или усложнить — оцениваются в 0.",
      en: "An overconfident learner often rejects criticism but accepts evidence they notice themselves. Unsafe options, such as free rein or harder routes, score 0.",
    },
  },
  {
    key: "driving_instructor.learner_psychology.04",
    skill: "learner_psychology",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Oʻquvchi 20 ta mashgʻulot oʻtdi. Yopiq maydonchada va tinch koʻchalarda yaxshi, lekin gavjum yoʻlga chiqqan zahoti qotib qoladi. U xafa va oʻqishni tashlash haqida gapirmoqda.",
      ru: "У ученика 20 занятий. На площадке и тихих улицах он справляется хорошо, но на оживлённой дороге сразу цепенеет. Он расстроен и говорит, что хочет бросить обучение.",
      en: "A learner has had 20 lessons. They do well in the closed area and on quiet streets but freeze on busy roads every time. They are upset and talk about quitting.",
    },
    prompt: {
      uz: "Qaysi strategiya eng toʻgʻri?",
      ru: "Какая стратегия лучше всего?",
      en: "Which strategy is best?",
    },
    options: [
      opt(
        "a",
        0,
        "Koʻnikishi uchun uni gavjum yoʻllarga tez-tez olib chiqish",
        "Чаще вывозить его на оживлённые дороги, чтобы привык",
        "Take them onto busy roads more often so they get used to it",
      ),
      opt(
        "b",
        0,
        "Haydash unga toʻgʻri kelmasligini aytib, oʻqishni toʻxtatishni maslahat berish",
        "Сказать, что вождение ему не подходит, и посоветовать прекратить обучение",
        "Tell them driving is not for them and advise them to stop",
      ),
      opt(
        "c",
        1,
        "Gavjum yoʻlgacha kichik bosqichlar va maqsadlar qurish; xavotir kuchli boʻlsa, mutaxassisga murojaatni taklif qilish",
        "Построить маленькие шаги и цели к оживлённым дорогам; при сильной тревоге предложить специалиста",
        "Build small steps and goals toward busy roads; if anxiety is severe, suggest a specialist",
      ),
      opt(
        "d",
        0.5,
        "Oʻzi tayyorman demaguncha tinch koʻchalarda mashq qilishni davom ettirish",
        "Заниматься на тихих улицах, пока он сам не скажет, что готов",
        "Keep practising on quiet streets until they say they are ready",
      ),
    ],
    explanation: {
      uz: "Bosqichma-bosqich yaqinlashish va koʻrinadigan kichik yutuqlar ishonchni xavfsiz tiklaydi. Faqat tinch koʻchada qolish xavfsiz, lekin oʻsishni toʻxtatadi; yoʻriqchi psixolog emas, shuning uchun kuchli xavotirda mutaxassis kerak.",
      ru: "Постепенное приближение и заметные маленькие успехи безопасно восстанавливают уверенность. Оставаться на тихих улицах безопасно, но рост останавливается; инструктор не психолог, при сильной тревоге нужен специалист.",
      en: "Gradual exposure with visible small wins rebuilds confidence safely. Staying on quiet streets is safe but stalls progress; an instructor is not a therapist, so severe anxiety needs a specialist.",
    },
  },
  {
    key: "driving_instructor.learner_psychology.05",
    skill: "learner_psychology",
    specializations: [],
    type: "self_report",
    targetLevel: 5,
    discrimination: 0.5,
    scoringRule: "likert",
    prompt: {
      uz: "Oʻquvchi taranglashganini sezsangiz, odatda nima qilasiz?",
      ru: "Что вы обычно делаете, когда замечаете, что ученик напряжён?",
      en: "What do you usually do when you notice a learner is tense?",
    },
    options: [
      opt(
        "a",
        0,
        "Mashgʻulotni rejadagidek davom ettiraman",
        "Продолжаю занятие по плану",
        "I carry on with the lesson as planned",
      ),
      opt(
        "b",
        0.33,
        "Unga tinchlanishni aytaman",
        "Говорю ему успокоиться",
        "I tell them to calm down",
      ),
      opt(
        "c",
        0.67,
        "Bir muddat qiyinchilikni kamaytiraman va xotirjamroq gapiraman",
        "На время снижаю сложность и говорю спокойнее",
        "I lower the difficulty for a while and speak more calmly",
      ),
      opt(
        "d",
        1,
        "Erta belgilarni sezib, vazifa va ohangni moslayman, keyin unga nima yordam berishini birga muhokama qilamiz",
        "Замечаю ранние признаки, меняю задачу и тон, а потом обсуждаем, что ему помогает",
        "I spot early signs, adjust task and tone, then we discuss what helps them stay calm",
      ),
    ],
    explanation: {
      uz: "Kuchli amaliyot belgilarni erta sezish, darhol moslashish va keyinchalik oʻquvchi bilan birga xulosa chiqarishni oʻz ichiga oladi.",
      ru: "Сильная практика — рано замечать признаки, сразу подстраиваться и потом вместе с учеником делать выводы.",
      en: "Strong practice means spotting signs early, adjusting at once and drawing conclusions together with the learner afterwards.",
    },
  },
];
