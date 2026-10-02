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
 * Skill: error_correction_feedback. Keys: driving_instructor.error_correction_feedback.NN
 * Correct dangerous faults at once; discuss non-dangerous ones after pulling over safely; prioritize.
 */
export const questions: QuestionInput[] = [
  {
    key: "driving_instructor.error_correction_feedback.01",
    skill: "error_correction_feedback",
    specializations: [],
    type: "knowledge",
    targetLevel: 3,
    scoringRule: "single_best",
    prompt: {
      uz: "Xavfli boʻlmagan xatoni batafsil muhokama qilish uchun eng yaxshi vaqt qachon?",
      ru: "Когда лучше всего подробно разобрать ошибку, которая не создала опасности?",
      en: "When is the best time to discuss a non-dangerous mistake in detail?",
    },
    options: [
      opt(
        "a",
        0,
        "Darhol, haydash davomida — oʻquvchi yaxshiroq eslab qolishi uchun",
        "Сразу, прямо в движении — чтобы ученик лучше запомнил",
        "Right away while driving, so the learner remembers it better",
      ),
      opt(
        "b",
        0,
        "Kurs oxirida, barcha xatolarni bir joyda koʻrib chiqqanda",
        "В конце курса, когда разбираются все ошибки вместе",
        "At the end of the course, when all mistakes are reviewed together",
      ),
      opt(
        "c",
        1,
        "Xatodan keyin tez orada, xavfsiz joyda toʻxtagach",
        "Вскоре после ошибки, остановившись в безопасном месте",
        "Soon after the mistake, once you have stopped in a safe place",
      ),
      opt(
        "d",
        0,
        "Faqat oʻquvchi uni uch marta takrorlagandan keyin",
        "Только если ученик повторил её три раза",
        "Only after the learner has repeated it three times",
      ),
    ],
    explanation: {
      uz: "Haydash paytidagi uzun tahlil diqqatni yoʻldan chalgʻitadi, uzoq kechiktirish esa xotirani susaytiradi. Xavfsiz toʻxtab, tez orada gaplashish ikkalasini muvozanatlaydi.",
      ru: "Длинный разбор в движении отвлекает от дороги, а долгая отсрочка стирает память о ситуации. Безопасная остановка вскоре после ошибки сочетает и то, и другое.",
      en: "A long discussion while driving pulls attention off the road, and a long delay fades the memory. Stopping safely soon after balances both.",
    },
  },
  {
    key: "driving_instructor.error_correction_feedback.02",
    skill: "error_correction_feedback",
    specializations: [],
    type: "scenario",
    targetLevel: 5,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Yoʻl chetida toʻxtadingiz. Oʻquvchi joyidan qoʻzgʻalishdan oldin «oʻlik zona»ni tekshirmagan payti haqida gaplashmoqchisiz.",
      ru: "Вы остановились у обочины. Нужно обсудить момент, когда ученик тронулся, не проверив «слепую зону».",
      en: "You have pulled over. You want to discuss the moment the learner moved off without checking the blind spot.",
    },
    prompt: {
      uz: "Tahlilni qanday oʻtkazish eng toʻgʻri?",
      ru: "Как лучше всего провести разбор?",
      en: "What is the best way to run this debrief?",
    },
    options: [
      opt(
        "a",
        1,
        "Nimani tekshirganini soʻrab, nima yetishmaganini va nega muhimligini kelishib, qoʻzgʻalishni mashq qilish",
        "Спросить, что он проверил, вместе найти пропуск и почему он важен, затем потренировать трогание",
        "Ask what they checked, agree what was missed and why it matters, then practise moving off",
      ),
      opt(
        "b",
        0.5,
        "Toʻgʻri ketma-ketlikni tushuntirib, keyingi mashqqa oʻtish",
        "Объяснить правильную последовательность и перейти к следующему упражнению",
        "Explain the correct sequence and move on to the next exercise",
      ),
      opt(
        "c",
        0,
        "Imtihonda bunday xato uchun yiqitishlarini aytish",
        "Сказать, что за такую ошибку на экзамене не сдают",
        "Tell them this mistake would fail them in the exam",
      ),
      opt(
        "d",
        0,
        "Bugun nechta xato qilganini sanab koʻrsatish",
        "Перечислить, сколько ошибок он сделал сегодня",
        "Count out how many mistakes they have made today",
      ),
    ],
    explanation: {
      uz: "Oʻquvchi xatoni oʻzi aniqlab, sababini tushunib, darhol toʻgʻri mashq qilsa, tuzatish mustahkamlanadi. Faqat tushuntirish foydali, lekin kamroq taʼsir qiladi.",
      ru: "Когда ученик сам находит ошибку, понимает причину и сразу отрабатывает верное действие, исправление закрепляется. Просто объяснение полезно, но действует слабее.",
      en: "When learners find the fault themselves, understand why, and practise the right action at once, the correction sticks. Explaining alone helps but has less effect.",
    },
  },
  {
    key: "driving_instructor.error_correction_feedback.03",
    skill: "error_correction_feedback",
    specializations: [],
    type: "judgment",
    targetLevel: 6,
    scoringRule: "partial_credit",
    discrimination: 0.7,
    scenario: {
      uz: "Bir darsda oʻquvchi 6 ta xato qildi: ilashish pedali bilan keskin harakat, ikki marta kech burilish signali, keng burilish va bitta xavfli xato — chorrahada yoʻl bermadi, siz tormozladingiz.",
      ru: "За одно занятие ученик сделал 6 ошибок: резкая работа сцеплением, дважды поздний поворотник, широкий поворот и одна опасная — не уступил дорогу на перекрёстке, вы затормозили.",
      en: "In one lesson the learner made 6 mistakes: jerky clutch, late indicator twice, a wide turn, and one dangerous one: failing to give way at a junction, so you braked.",
    },
    prompt: {
      uz: "Darsdan keyin fikr-mulohazani qanday berish eng toʻgʻri?",
      ru: "Как лучше всего дать обратную связь после занятия?",
      en: "What is the best way to give feedback after the lesson?",
    },
    options: [
      opt(
        "a",
        0.5,
        "Oltita xatoning hammasini sodir boʻlgan tartibda birma-bir koʻrib chiqish",
        "Разобрать все шесть ошибок по порядку, как они происходили",
        "Go through all six mistakes one by one in the order they happened",
      ),
      opt(
        "b",
        0,
        "Eng koʻp takrorlangani sababli ilashish pedaliga eʼtibor qaratish",
        "Сосредоточиться на сцеплении, раз эта ошибка самая частая",
        "Focus on clutch control, since it was the most frequent",
      ),
      opt(
        "c",
        0,
        "Yutuqlarni maqtab, xafa qilmaslik uchun yoʻl bermaslikni tilga olmaslik",
        "Похвалить удачи, а неуступление не упоминать, чтобы не расстраивать",
        "Praise the good parts and skip the failure to give way to avoid upset",
      ),
      opt(
        "d",
        1,
        "Avval yoʻl bermaslikni ustuvor koʻrish, keyin yana bitta naqsh (signal) tanlab, qolganini keyinga qoldirish",
        "Сначала разобрать неуступление как главное, затем ещё одну закономерность (поворотник), остальное позже",
        "Start with the failure to give way, then pick one more pattern (signals); leave the rest for later",
      ),
    ],
    explanation: {
      uz: "Xavfsizlikka taʼsir qiluvchi xato birinchi oʻrinda turadi, oʻquvchi esa bir vaqtda bir-ikki mavzuni yaxshi oʻzlashtiradi. Xavfli xatoni chetlab oʻtish xavfni yashiradi.",
      ru: "Ошибка, влияющая на безопасность, всегда на первом месте, а за раз ученик хорошо усваивает одну-две темы. Обойти опасную ошибку молчанием — значит скрыть риск.",
      en: "A safety-critical fault always comes first, and a learner absorbs one or two topics at a time. Skipping the dangerous fault hides the risk.",
    },
  },
  {
    key: "driving_instructor.error_correction_feedback.04",
    skill: "error_correction_feedback",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Siz avtomaktabdagi katta yoʻriqchisiz. Oʻquvchilar turli yoʻriqchilarning tavsiyalari bir-biriga zid ekanidan shikoyat qiladi: rulni ushlash, signalni qachon yoqish va hokazo.",
      ru: "Вы старший инструктор автошколы. Ученики жалуются, что советы разных инструкторов противоречат друг другу: как держать руль, когда включать поворотник и т. д.",
      en: "You are the senior instructor at a driving school. Learners complain that different instructors give conflicting advice: how to hold the wheel, when to signal, and so on.",
    },
    prompt: {
      uz: "Eng toʻgʻri qadam qaysi?",
      ru: "Какой шаг лучше всего?",
      en: "What is the best step?",
    },
    options: [
      opt(
        "a",
        0,
        "Har bir yoʻriqchi oʻz uslubida qolsin — bu odatiy hol",
        "Пусть каждый инструктор сохраняет свой стиль — это нормально",
        "Let each instructor keep their own style, since that is normal",
      ),
      opt(
        "b",
        1,
        "Jamoa bilan asosiy standartlar va atamalarni kelishib, ularni qoʻshma dars tahlillarida tekshirish",
        "Договориться с командой о базовых стандартах и терминах и проверять их на совместных разборах занятий",
        "Agree core standards and feedback terms with the team, and check them in joint lesson reviews",
      ),
      opt(
        "c",
        0.5,
        "Har bir oʻquvchini faqat bitta yoʻriqchiga biriktirish",
        "Закрепить каждого ученика только за одним инструктором",
        "Assign each learner to only one instructor",
      ),
      opt(
        "d",
        0,
        "Oʻquvchilarga qaysi maslahat osonroq boʻlsa, shunga amal qilishni aytish",
        "Сказать ученикам следовать тому совету, который им проще",
        "Tell learners to follow whichever advice feels easier",
      ),
    ],
    explanation: {
      uz: "Umumiy standart oʻquvchini chalkashlikdan qutqaradi va fikr-mulohaza sifatini butun maktabda oshiradi. Bitta yoʻriqchiga biriktirish belgini yashiradi, sababni esa hal qilmaydi.",
      ru: "Общий стандарт избавляет учеников от путаницы и повышает качество обратной связи во всей школе. Закрепление за одним инструктором скрывает симптом, но не устраняет причину.",
      en: "A shared standard removes learner confusion and raises feedback quality across the school. One instructor per learner hides the symptom without fixing the cause.",
    },
  },
];
