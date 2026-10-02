import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: copywriting. Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "cw_headline_structures",
    skill: "copywriting",
    kind: "learn",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "4 xil tuzilmada 8 ta sarlavha yozing",
      ru: "Напишите 8 заголовков по 4 структурам",
      en: "Write 8 headlines using 4 structures",
    },
    description: {
      uz: "Taklifingiz uchun 4 xil tuzilmada 2 tadan sarlavha yozing: foyda + muddat, muammo-savol, «Qanday qilib…», raqamli roʻyxat. Oxirida mijoz tilida eng aniq yangraganini tanlang.",
      ru: "Для вашего предложения напишите по 2 заголовка в 4 структурах: выгода + срок, вопрос-проблема, «Как…», список с числом. В конце выберите самый ясный для клиента.",
      en: "For your offer, write 2 headlines in each of 4 structures: benefit + timeframe, problem question, \"How to…\", numbered list. Then pick the one that sounds clearest to a customer.",
    },
    successCriteria: {
      uz: "8 ta sarlavha bor; tanlangani aniq foyda va kim uchun ekanini aytadi.",
      ru: "Есть 8 заголовков; выбранный ясно называет выгоду и для кого она.",
      en: "8 headlines exist; the chosen one clearly states the benefit and who it is for.",
    },
    why: {
      uz: "Koʻp odam faqat sarlavhani oʻqiydi. Bir nechta variant yozish odati birinchi kelgan zaif gʻoyada qolib ketmaslikka yordam beradi.",
      ru: "Многие читают только заголовок. Привычка писать несколько вариантов не даёт застрять на первой слабой идее.",
      en: "Many people read only the headline. Writing several versions keeps you from settling on the first weak idea.",
    },
    resources: [],
  },
  {
    slug: "cw_features_to_benefits",
    skill: "copywriting",
    kind: "practice",
    phase: "practice",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "10 ta xususiyatni foyda va dalilga aylantiring",
      ru: "Превратите 10 характеристик в выгоды с доказательством",
      en: "Turn 10 features into benefits with proof",
    },
    description: {
      uz: "Mahsulotning 10 ta xususiyatini yozing. Har biriga «…shuning uchun siz…» bilan mijoz foydasini qoʻshing va bitta dalil yozing: raqam, mijoz fikri yoki kafolat. Dalili yoʻq foydalarni belgilab qoʻying.",
      ru: "Выпишите 10 характеристик продукта. К каждой добавьте выгоду через «…поэтому вы…» и одно доказательство: цифру, отзыв или гарантию. Отметьте выгоды без доказательств.",
      en: "List 10 product features. For each, add the customer benefit with \"…so you can…\" and one proof: a number, a customer quote or a guarantee. Flag the benefits that have no proof.",
    },
    successCriteria: {
      uz: "10 ta qator: xususiyat, foyda, dalil; dalilsiz foydalar alohida belgilangan.",
      ru: "10 строк: характеристика, выгода, доказательство; выгоды без доказательств отмечены.",
      en: "10 rows of feature, benefit and proof; unproven benefits are flagged.",
    },
    why: {
      uz: "Mijoz xususiyatni emas, oʻz natijasini sotib oladi. Dalil esa vaʼdani ishonarli qiladi.",
      ru: "Клиент покупает не характеристику, а свой результат. Доказательство делает обещание убедительным.",
      en: "Customers buy their own outcome, not a feature. Proof makes the promise believable.",
    },
    resources: [],
  },
  {
    slug: "cw_rewrite_ad",
    skill: "copywriting",
    kind: "apply",
    phase: "application",
    durationMinutes: 30,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Bitta reklama matnini qayta yozing va 30% qisqartiring",
      ru: "Перепишите один рекламный текст и сократите на 30%",
      en: "Rewrite one ad and cut it by 30%",
    },
    description: {
      uz: "Hozir ishlayotgan reklama matnini oling. Tuzilma: sarlavha, asosiy foyda, dalil, bitta aniq chaqiruv. Shablon iboralar va keraksiz sifatlarni oʻchiring, hajmni kamida 30% qisqartiring. Yangi variantni ishga tushiring.",
      ru: "Возьмите текущий рекламный текст. Структура: заголовок, главная выгода, доказательство, один чёткий призыв. Уберите штампы и лишние прилагательные, сократите объём минимум на 30%. Запустите новую версию.",
      en: "Take a live ad. Structure: headline, main benefit, proof, one clear call to action. Remove clichés and extra adjectives and cut length by at least 30%. Put the new version live.",
    },
    successCriteria: {
      uz: "Yangi matn kamida 30% qisqa, 4 ta qismi bor va faqat bitta chaqiruv mavjud; reklama ishga tushirilgan.",
      ru: "Новый текст короче минимум на 30%, есть 4 части и только один призыв; реклама запущена.",
      en: "The new text is at least 30% shorter, has all 4 parts and only one CTA; the ad is live.",
    },
    why: {
      uz: "Telefon ekranida qisqa va aniq matn tezroq tushuniladi. Bitta chaqiruv mijozni ikkilantirmaydi.",
      ru: "На экране телефона короткий и ясный текст понимается быстрее. Один призыв не заставляет клиента колебаться.",
      en: "Short, clear text is understood faster on a phone screen. One CTA keeps the customer from hesitating.",
    },
    resources: [],
  },
  {
    slug: "cw_landing_rewrite",
    skill: "copywriting",
    kind: "apply",
    phase: "application",
    durationMinutes: 60,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Sotuv sahifasini mijoz iboralari asosida qayta yozing",
      ru: "Перепишите посадочную страницу словами клиентов",
      en: "Rewrite a landing page in customers' own words",
    },
    description: {
      uz: "Tadqiqotdagi mijoz iboralaridan foydalanib sahifani qayta yozing: birinchi ekran (kim uchun, natija, chaqiruv), 3 ta foyda, dalillar, eʼtirozlarga javob, narx va keyingi qadam. Eski va yangi variantni saqlang.",
      ru: "Используя фразы клиентов из исследования, перепишите страницу: первый экран (для кого, результат, призыв), 3 выгоды, доказательства, ответы на возражения, цена и следующий шаг. Сохраните старую и новую версии.",
      en: "Using customer phrases from your research, rewrite the page: first screen (who it is for, outcome, CTA), 3 benefits, proof, objection answers, price and next step. Keep both old and new versions.",
    },
    successCriteria: {
      uz: "Birinchi ekranda kim uchun, natija va chaqiruv bor; kamida 3 ta mijoz iborasi ishlatilgan; ikkala variant saqlangan.",
      ru: "На первом экране есть для кого, результат и призыв; использовано минимум 3 фразы клиентов; обе версии сохранены.",
      en: "The first screen states who, outcome and CTA; at least 3 customer phrases are used; both versions are saved.",
    },
    why: {
      uz: "Mijoz oʻz soʻzlarini koʻrganda «bu men haqimda» deb his qiladi. Ikkala variantni saqlash keyin test qilishga imkon beradi.",
      ru: "Видя свои слова, клиент чувствует «это про меня». Две версии позволят потом провести тест.",
      en: "Seeing their own words makes customers feel \"this is about me\". Keeping both versions lets you test them later.",
    },
    resources: [],
  },
  {
    slug: "cw_five_second_test",
    skill: "copywriting",
    kind: "verify",
    phase: "verification",
    durationMinutes: 20,
    minLevel: 1,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Matningizni 5 soniyalik test bilan tekshiring",
      ru: "Проверьте текст 5-секундным тестом",
      en: "Check your copy with a 5-second test",
    },
    description: {
      uz: "Reklama yoki sahifaning birinchi ekranini 5 kishiga 5 soniya koʻrsating. Soʻng 3 ta savol bering: nima taklif qilinyapti, kim uchun, keyin nima qilish kerak. Javoblarni yozib oling va matnni tuzating.",
      ru: "Покажите 5 людям первый экран рекламы или страницы на 5 секунд. Затем задайте 3 вопроса: что предлагают, для кого, что делать дальше. Запишите ответы и доработайте текст.",
      en: "Show the first screen of your ad or page to 5 people for 5 seconds. Then ask 3 questions: what is offered, for whom, and what to do next. Record the answers and fix the copy.",
    },
    successCriteria: {
      uz: "5 kishidan kamida 4 tasi uchala savolga toʻgʻri javob bergan yoki matn tuzatilib, qayta tekshirilgan.",
      ru: "Минимум 4 из 5 верно ответили на все 3 вопроса, либо текст исправлен и проверен повторно.",
      en: "At least 4 of 5 people answer all 3 questions correctly, or the copy is fixed and re-tested.",
    },
    why: {
      uz: "Muallif oʻz matnini doim tushunadi. Begona koʻz matn haqiqatan ham aniq yoki yoʻqligini tez koʻrsatadi.",
      ru: "Автор всегда понимает свой текст. Свежий взгляд быстро показывает, действительно ли он ясен.",
      en: "Writers always understand their own copy. Fresh eyes quickly show whether it is actually clear.",
    },
    resources: [],
  },
];
