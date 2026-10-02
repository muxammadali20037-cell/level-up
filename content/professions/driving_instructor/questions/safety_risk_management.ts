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
 * Skill: safety_risk_management (gate K1, no slack). Keys: driving_instructor.safety_risk_management.NN
 * §14.1 rule 4: any unsafe option scores 0, also in partial_credit items. Universal principles only (no
 * jurisdiction-specific rules).
 */
export const questions: QuestionInput[] = [
  {
    key: "driving_instructor.safety_risk_management.01",
    skill: "safety_risk_management",
    specializations: [],
    type: "knowledge",
    targetLevel: 2,
    scoringRule: "single_best",
    prompt: {
      uz: "Oʻquv avtomobilidagi qoʻshimcha tormoz pedali asosan nima uchun kerak?",
      ru: "Для чего в первую очередь нужна дублирующая педаль тормоза в учебном автомобиле?",
      en: "What is the main purpose of the dual brake pedal in a training car?",
    },
    options: [
      opt(
        "a",
        0,
        "Har bir toʻxtashda oʻquvchiga yumshoq tormozlashga yordam berish uchun",
        "Помогать ученику плавно тормозить при каждой остановке",
        "To help the learner brake smoothly at every stop",
      ),
      opt(
        "b",
        1,
        "Oʻquvchi xavfga oʻz vaqtida javob bera olmasa, avtomobilni toʻxtatish uchun",
        "Остановить машину, если ученик не успевает среагировать на опасность",
        "To stop the car when the learner cannot respond to a hazard in time",
      ),
      opt(
        "c",
        0,
        "Oʻquvchiga pedalni qanday kuch bilan bosishni koʻrsatib berish uchun",
        "Показывать ученику, с каким усилием нажимать на педаль",
        "To show the learner how hard to press the pedal",
      ),
      opt(
        "d",
        0,
        "Uzoq mashgʻulotlarda oʻquvchining charchashini kamaytirish uchun",
        "Снижать усталость ученика на долгих занятиях",
        "To reduce the learner's fatigue on long lessons",
      ),
    ],
    explanation: {
      uz: "Qoʻshimcha pedal — oʻquvchi ulgurmagan vaziyat uchun xavfsizlik zaxirasi. Uni odatiy yordam sifatida ishlatish oʻquvchini mashqdan mahrum qiladi va haqiqiy koʻnikmani yashiradi.",
      ru: "Дублирующая педаль — страховка на случай, когда ученик не успевает. Если пользоваться ею постоянно, ученик теряет практику, а его реальный навык остаётся скрытым.",
      en: "The dual brake is a safety backup for moments the learner cannot handle in time. Using it routinely takes away practice and hides the learner's real skill.",
    },
  },
  {
    key: "driving_instructor.safety_risk_management.02",
    skill: "safety_risk_management",
    specializations: [],
    type: "scenario",
    targetLevel: 4,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Bugun yangi oʻquvchi bilan birinchi amaliy mashgʻulot. U ilgari hech qachon rul ortida oʻtirmagan.",
      ru: "Сегодня первое практическое занятие с новым учеником. Он ни разу не сидел за рулём.",
      en: "Today is the first practical lesson with a new learner who has never been behind the wheel.",
    },
    prompt: {
      uz: "Mashgʻulotni qayerdan boshlash eng toʻgʻri?",
      ru: "С чего лучше всего начать это занятие?",
      en: "Where is it best to start this lesson?",
    },
    options: [
      opt(
        "a",
        0,
        "Tirbandlik kam paytda katta koʻchada — real harakatga tezroq koʻnikadi",
        "На крупной улице в часы без пробок — так он быстрее привыкнет к потоку",
        "On a main road at an off-peak time, so they get used to traffic faster",
      ),
      opt(
        "b",
        0.5,
        "Boshqaruv organlarini tushuntirib, keyin tinch turar-joy koʻchasida",
        "Объяснить органы управления, а затем ехать по тихой жилой улице",
        "Explain the controls, then drive on a quiet residential street",
      ),
      opt(
        "c",
        0,
        "Oʻquvchiga oʻzi qulay deb bilgan joyni tanlashga ruxsat berib",
        "Дать ученику самому выбрать место, где ему комфортно",
        "Let the learner choose a place where they feel comfortable",
      ),
      opt(
        "d",
        1,
        "Yopiq oʻquv maydonchasida: boshqaruv, joyidan qoʻzgʻalish va toʻxtashdan",
        "На закрытой учебной площадке: органы управления, трогание и остановка",
        "In a closed training area: controls, moving off and stopping first",
      ),
    ],
    explanation: {
      uz: "Birinchi koʻnikmalar boshqa yoʻl harakati qatnashchilari yoʻq joyda xavfsiz shakllanadi. Tinch koʻcha ham mumkin, lekin yopiq maydoncha xavfni eng past darajaga tushiradi.",
      ru: "Первые навыки безопаснее всего формировать там, где нет других участников движения. Тихая улица допустима, но закрытая площадка снижает риск сильнее всего.",
      en: "First skills are built most safely where there is no other traffic. A quiet street is acceptable, but a closed area keeps risk lowest.",
    },
  },
  {
    key: "driving_instructor.safety_risk_management.03",
    skill: "safety_risk_management",
    specializations: [],
    type: "decision",
    targetLevel: 5,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Toʻrtinchi mashgʻulot. Oʻquvchi quruq yoʻlda yaxshi haydayapti. Reja boʻyicha koʻp qatorli yoʻlga chiqishingiz kerak, lekin kuchli yomgʻir boshlandi va koʻrinish yomonlashdi.",
      ru: "Четвёртое занятие. Ученик уверенно едет по сухой дороге. По плану — выезд на многополосную дорогу, но начался сильный дождь и видимость ухудшилась.",
      en: "Lesson four. The learner copes well on dry roads. The plan is a multi-lane road, but heavy rain has started and visibility has dropped.",
    },
    prompt: {
      uz: "Eng toʻgʻri qaror qaysi?",
      ru: "Какое решение лучше всего?",
      en: "What is the best decision?",
    },
    options: [
      opt(
        "a",
        1,
        "Rejani oʻzgartirib, tanish tinch yoʻnalishga oʻtish va toʻxtash masofasini qisqa muhokama qilish",
        "Сменить план: тихий знакомый маршрут и короткий разбор тормозного пути в дождь",
        "Change the plan: a quiet familiar route and a short talk on stopping distance in rain",
      ),
      opt(
        "b",
        0,
        "Rejadagi yoʻnalishni davom ettirib, oʻquvchiga sekinroq haydashni aytish",
        "Ехать по плану, но сказать ученику держать скорость ниже",
        "Keep to the planned route but tell the learner to drive slower",
      ),
      opt(
        "c",
        0.5,
        "Mashgʻulotni toʻxtatib, oʻquvchini oʻzingiz uyiga olib borish",
        "Прекратить занятие и самому отвезти ученика домой",
        "Stop the lesson and drive the learner home yourself",
      ),
      opt(
        "d",
        0,
        "Rejani saqlash — qiyin sharoit eng yaxshi mashq",
        "Сохранить план — сложные условия и есть лучшая практика",
        "Keep the plan, since difficult conditions are the best practice",
      ),
    ],
    explanation: {
      uz: "Ikkita yangi qiyinchilikni (koʻp qatorli yoʻl va yomgʻir) birdaniga qoʻshish xavfni keskin oshiradi. Murakkablikni kamaytirib, vaziyatni darsga aylantirish xavfsiz va foydali.",
      ru: "Два новых усложнения сразу (многополосная дорога и дождь) резко повышают риск. Снизить сложность и превратить ситуацию в урок — безопасно и полезно.",
      en: "Adding two new difficulties at once (multi-lane road and rain) sharply raises risk. Lowering complexity and turning the weather into a lesson is safe and useful.",
    },
  },
  {
    key: "driving_instructor.safety_risk_management.04",
    skill: "safety_risk_management",
    specializations: [],
    type: "judgment",
    targetLevel: 7,
    scoringRule: "partial_credit",
    discrimination: 0.7,
    scenario: {
      uz: "Oxirgi oyda bitta oʻquvchi bilan deyarli har mashgʻulotda bir xil joyda qoʻshimcha tormozni bosdingiz: gavjum chorrahada qarama-qarshi oqimni kesib chapga burilishda.",
      ru: "За последний месяц почти на каждом занятии с одним учеником вы нажимали дублирующий тормоз в одном и том же месте: левый поворот через встречный поток на оживлённом перекрёстке.",
      en: "Over the past month, in almost every lesson with one learner, you used the dual brake at the same kind of place: turning across oncoming traffic at a busy junction.",
    },
    prompt: {
      uz: "Bu nimani koʻrsatadi va qanday yoʻl tutish kerak?",
      ru: "О чём это скорее всего говорит и что лучше сделать?",
      en: "What does this most likely show, and what should you do?",
    },
    options: [
      opt(
        "a",
        0,
        "Oʻquvchi haydashga yaroqsiz — mashgʻulotlarni toʻxtatishni tavsiya qilish",
        "Ученик не способен водить — рекомендовать прекратить занятия",
        "The learner is not suited to driving, so recommend stopping lessons",
      ),
      opt(
        "b",
        0,
        "Aralashishda davom etish — xavfni toʻxtatish yoʻriqchining vazifasi",
        "Продолжать вмешиваться — останавливать опасность и есть работа инструктора",
        "Keep intervening, since stopping danger is the instructor's job",
      ),
      opt(
        "c",
        1,
        "Reja koʻnikmadan oldinga ketgan: oddiyroq burilishlarga qaytib, keyin tayyorlab qaytish",
        "План опережает навык: вернуться к простым поворотам, подготовить и лишь потом вернуться",
        "The plan is ahead of the skill: go back to simpler turns, prepare, then return",
      ),
      opt(
        "d",
        0.5,
        "Har aralashuvdan keyin xatoni qatʼiyroq tushuntirish",
        "После каждого вмешательства твёрже объяснять ошибку",
        "Explain the mistake more firmly after each intervention",
      ),
    ],
    explanation: {
      uz: "Bir joyda takrorlanuvchi aralashuv — oʻquvchi koʻnikmasi hali yetmagan muhitga erta olib chiqilganining belgisi. Xavfni rejalashtirish orqali kamaytirish aralashuvga tayanishdan yaxshiroq.",
      ru: "Повторяющееся вмешательство в одном месте — признак того, что ученика рано вывели в эту обстановку. Снижать риск планированием лучше, чем полагаться на вмешательство.",
      en: "Repeated interventions at the same place signal the learner was brought there too early. Reducing risk through planning beats relying on the dual brake.",
    },
  },
  {
    key: "driving_instructor.safety_risk_management.05",
    skill: "safety_risk_management",
    specializations: [],
    type: "decision",
    targetLevel: 8,
    scoringRule: "partial_credit",
    scenario: {
      uz: "Siz avtomaktabda kichik yoʻriqchilar guruhiga rahbarlik qilasiz. Yaqinda ikki marta xavfli vaziyat yuz berdi: ikkalasida ham yangi yoʻriqchilar, maktab yonidagi yoʻnalish, darslar tugagan payt.",
      ru: "Вы руководите небольшой группой инструкторов в автошколе. Недавно было два опасных случая: оба с новыми инструкторами, на маршруте у школы, в момент окончания уроков.",
      en: "You lead a small team of instructors at a driving school. There were two recent near-misses: both with new instructors, on a route by a school, as classes ended.",
    },
    prompt: {
      uz: "Rahbar sifatida birinchi qadamingiz qanday boʻlishi kerak?",
      ru: "Каким должен быть ваш первый шаг как руководителя?",
      en: "What should your first step be as the team lead?",
    },
    options: [
      opt(
        "a",
        0,
        "Ikkala yoʻriqchiga rasmiy ogohlantirish berib, shaxsiy hujjatiga yozib qoʻyish",
        "Объявить обоим инструкторам официальное предупреждение с записью в личное дело",
        "Give both instructors a formal warning and record it in their files",
      ),
      opt(
        "b",
        1,
        "Ayblovsiz tahlil oʻtkazib, umumiy omillarni topish va hammaga yoʻnalish-vaqt qoidasini yangilash",
        "Провести разбор без поиска виноватых, найти общие факторы и обновить правила маршрутов для всех",
        "Run a blame-free review, find common factors, and update route and timing guidance for all",
      ),
      opt(
        "c",
        0.5,
        "Bu yoʻnalishni hamma uchun butunlay taqiqlash",
        "Навсегда запретить этот маршрут для всех",
        "Ban that route for everyone permanently",
      ),
      opt(
        "d",
        0,
        "Umumiy yigʻilishda hammani ehtiyotkorroq boʻlishga chaqirish",
        "На общем собрании призвать всех быть внимательнее",
        "Ask everyone to be more careful at a general meeting",
      ),
    ],
    explanation: {
      uz: "Takrorlangan holatlar tizimli sababga ishora qiladi (yoʻnalish, vaqt, tajriba). Ayblovsiz tahlil haqiqiy omillarni ochadi va butun jamoa uchun xavfni kamaytiradi.",
      ru: "Повторяющиеся случаи указывают на системную причину (маршрут, время, опыт). Разбор без обвинений выявляет реальные факторы и снижает риск для всей команды.",
      en: "Repeated incidents point to a system cause (route, timing, experience). A blame-free review surfaces the real factors and lowers risk for the whole team.",
    },
  },
  {
    key: "driving_instructor.safety_risk_management.06",
    skill: "safety_risk_management",
    specializations: [],
    type: "self_report",
    targetLevel: 5,
    discrimination: 0.5,
    scoringRule: "likert",
    prompt: {
      uz: "Har bir amaliy mashgʻulot oldidan xavfsizlikni qanday tekshirasiz?",
      ru: "Как вы проверяете безопасность перед каждым практическим занятием?",
      en: "How do you check safety before each practical lesson?",
    },
    options: [
      opt(
        "a",
        0,
        "Alohida tekshirmayman, darhol boshlayman",
        "Специально не проверяю, сразу начинаю",
        "I do no special check and start straight away",
      ),
      opt(
        "b",
        0.33,
        "Esimga tushganda avtomobilni (tormoz, oynalar, qoʻshimcha pedal) tekshiraman",
        "Проверяю машину (тормоза, зеркала, дублирующую педаль), когда вспоминаю",
        "I check the car (brakes, mirrors, dual controls) when I remember",
      ),
      opt(
        "c",
        0.67,
        "Har safar avtomobilni va oʻquvchining holatini (charchoq, kayfiyat) tekshiraman",
        "Каждый раз проверяю машину и состояние ученика (усталость, самочувствие)",
        "Every time I check the car and the learner's state (tiredness, well-being)",
      ),
      opt(
        "d",
        1,
        "Avtomobil va oʻquvchini tekshirib, yoʻnalishni ob-havo, vaqt va bosqichga moslayman",
        "Проверяю машину и ученика и подбираю маршрут под погоду, время и этап обучения",
        "I check car and learner and adapt the route to weather, time and learning stage",
      ),
    ],
    explanation: {
      uz: "Barqaror xavfsizlik odati avtomobil, oʻquvchi holati va yoʻnalishni har safar birga hisobga oladi.",
      ru: "Устойчивая привычка безопасности каждый раз учитывает машину, состояние ученика и маршрут вместе.",
      en: "A reliable safety routine considers the car, the learner's state and the route together, every time.",
    },
  },
];
