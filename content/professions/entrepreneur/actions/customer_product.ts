import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill `customer_product`. Basics L1–4, advanced L4–8. */
export const actions: ActionInput[] = [
  {
    slug: "customer_product_who_buys_why",
    skill: "customer_product",
    kind: "reflect",
    phase: "foundation",
    durationMinutes: 15,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Kim va nima uchun sotib olishini yozing",
      ru: "Запишите, кто и почему у вас покупает",
      en: "Write who buys from you and why",
    },
    description: {
      uz: "Asosiy mijozingiz haqida bir abzas yozing: qanday vaziyatda, qaysi muammo bilan keladi, oldin nima ishlatgan va nega sizni tanladi. Har bir jumlaning yoniga «fakt» yoki «taxmin» deb belgi qoʻying.",
      ru: "Напишите абзац о главном клиенте: в какой ситуации и с какой проблемой приходит, чем пользовался раньше и почему выбрал вас. Пометьте каждое утверждение: «факт» или «догадка».",
      en: "Write one paragraph about your main customer: their situation, the problem they come with, what they used before and why they chose you. Tag each statement \"fact\" or \"guess\".",
    },
    successCriteria: {
      uz: "Mijoz tavsifi yozilgan va har bir jumla fakt yoki taxmin deb belgilangan.",
      ru: "Описание клиента написано, каждое утверждение помечено как факт или догадка.",
      en: "Customer description written and every statement tagged as fact or guess.",
    },
    why: {
      uz: "Marketing taklifni kuchaytiradi, lekin avval u kim uchun ekanini bilish kerak. Taxminlarni ajratish nimani tekshirish kerakligini koʻrsatadi.",
      ru: "Маркетинг усиливает предложение, но сначала нужно знать, для кого оно. Отделение догадок показывает, что нужно проверить.",
      en: "Marketing amplifies an offer, but first you must know who it is for. Separating guesses shows what to check.",
    },
    resources: [],
  },
  {
    slug: "customer_product_interview_guide",
    skill: "customer_product",
    kind: "practice",
    phase: "practice",
    durationMinutes: 25,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Mijoz bilan suhbat uchun 5 ta savol tayyorlang",
      ru: "Подготовьте 5 вопросов для интервью с клиентом",
      en: "Prepare a 5-question customer interview guide",
    },
    description: {
      uz: "Oʻtmishdagi xatti-harakat haqida 5 ta savol yozing: oxirgi marta bu muammo qachon boʻldi, nima qildingiz, qancha vaqt va pul ketdi, nimasi yoqmadi. «Mahsulotimiz yoqadimi?» kabi yoʻnaltiruvchi savollarni olib tashlang.",
      ru: "Напишите 5 вопросов о прошлом поведении: когда в последний раз была эта проблема, что вы сделали, сколько ушло времени и денег, что не понравилось. Уберите наводящие вопросы вроде «Вам нравится наш продукт?».",
      en: "Write 5 questions about past behaviour: when did the problem last happen, what did you do, how much time and money did it cost, what was frustrating. Remove leading questions like \"Do you like our product?\".",
    },
    successCriteria: {
      uz: "5 ta savol yozilgan, ularning hech biri yoʻnaltiruvchi emas va oʻtmishdagi faktlarga qaratilgan.",
      ru: "Написаны 5 вопросов, ни один не наводящий, все о фактах из прошлого.",
      en: "5 questions written, none leading, all about past facts.",
    },
    why: {
      uz: "Odamlar kelajakda nima qilishini emas, oʻtmishda nima qilganini aniqroq aytadi. Bunday savollar haqiqiy ehtiyojni ochadi.",
      ru: "Люди точнее рассказывают, что делали, чем что будут делать. Такие вопросы раскрывают реальную потребность.",
      en: "People describe what they did more accurately than what they would do. These questions reveal the real need.",
    },
    resources: [],
  },
  {
    slug: "customer_product_five_customer_calls",
    skill: "customer_product",
    kind: "apply",
    phase: "application",
    durationMinutes: 60,
    minLevel: 1,
    maxLevel: 4,
    budget: "free",
    title: {
      uz: "Shu hafta 5 ta mijoz bilan gaplashing",
      ru: "Поговорите с 5 клиентами на этой неделе",
      en: "Talk to 5 customers this week",
    },
    description: {
      uz: "Tayyorlangan savollar bilan 5 ta mijozga 10–15 daqiqalik qoʻngʻiroq qiling. Ularning aynan soʻzlarini yozing, sotishga urinmang. Oxirida 5 suhbatda takrorlangan ehtiyoj yoki shikoyatni ajrating.",
      ru: "Позвоните 5 клиентам на 10–15 минут с подготовленными вопросами. Записывайте их точные слова, не пытайтесь продавать. В конце выделите потребность или жалобу, повторившуюся в 5 разговорах.",
      en: "Call 5 customers for 10–15 minutes using your guide. Write down their exact words and do not try to sell. Afterwards, pick out the need or complaint that repeated across the 5 calls.",
    },
    successCriteria: {
      uz: "5 ta suhbat yozib olingan va kamida bitta takrorlangan ehtiyoj aniqlangan.",
      ru: "Записаны 5 разговоров, выявлена хотя бы одна повторяющаяся потребность.",
      en: "5 conversations noted and at least one repeated need identified.",
    },
    why: {
      uz: "Mijozning oʻz soʻzlari taklif, reklama matni va mahsulotni yaxshilash uchun eng ishonchli manba.",
      ru: "Собственные слова клиентов — самый надёжный источник для предложения, рекламных текстов и улучшения продукта.",
      en: "Customers' own words are the most reliable input for your offer, your ad copy and product changes.",
    },
    resources: [],
  },
  {
    slug: "customer_product_complaint_analysis",
    skill: "customer_product",
    kind: "apply",
    phase: "application",
    durationMinutes: 45,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Oylik shikoyat va qaytarishlarni tahlil qiling",
      ru: "Разберите жалобы и возвраты за месяц",
      en: "Analyse a month of complaints and returns",
    },
    description: {
      uz: "Oxirgi oydagi barcha shikoyat, qaytarish va salbiy fikrlarni yigʻing. Ularni toifalarga ajrating (sifat, muddat, xizmat, narx, kutilma) va sanang. Eng katta toifa uchun mahsulot yoki taklifdagi bitta oʻzgarishni egasi va muddati bilan belgilang.",
      ru: "Соберите все жалобы, возвраты и негативные отзывы за месяц. Разделите на категории (качество, сроки, сервис, цена, ожидания) и посчитайте. Для самой большой категории назначьте одно изменение в продукте или предложении с ответственным и сроком.",
      en: "Collect every complaint, return and negative review from the last month. Group them (quality, timing, service, price, expectations) and count. For the largest group set one product or offer change with an owner and deadline.",
    },
    successCriteria: {
      uz: "Shikoyatlar toifalar boʻyicha sanalgan va eng katta toifa uchun oʻzgarish belgilangan.",
      ru: "Жалобы посчитаны по категориям, для крупнейшей назначено изменение.",
      en: "Complaints counted by group and a change assigned for the largest one.",
    },
    why: {
      uz: "Shikoyatlar — mijoz qayerda kutilmani yoʻqotishining bepul maʼlumoti. Takrorlanuvchi sababni tuzatish sotuvni ham osonlashtiradi.",
      ru: "Жалобы — бесплатные данные о том, где клиент разочаровывается. Устранение повторяющейся причины облегчает и продажи.",
      en: "Complaints are free data on where customers get disappointed. Fixing a recurring cause also makes selling easier.",
    },
    resources: [],
  },
  {
    slug: "customer_product_repeat_rate",
    skill: "customer_product",
    kind: "verify",
    phase: "verification",
    durationMinutes: 30,
    minLevel: 4,
    maxLevel: 8,
    budget: "free",
    title: {
      uz: "Takroriy xaridlar ulushini oʻlchang",
      ru: "Измерьте долю повторных покупок",
      en: "Measure your repeat-purchase rate",
    },
    description: {
      uz: "Savdo yozuvlaridan 3 oy oldin xarid qilgan mijozlarni oling. Ulardan qanchasi keyin yana sotib olganini sanang va foizini hisoblang. Avvalgi davr bilan solishtiring va qaytmagan 3 mijozdan sababini soʻrang.",
      ru: "Возьмите из записей продаж клиентов, купивших 3 месяца назад. Посчитайте, сколько из них купили снова, и найдите процент. Сравните с прошлым периодом и спросите 3 не вернувшихся клиентов о причине.",
      en: "From your sales records take customers who bought 3 months ago. Count how many bought again and calculate the share. Compare with the previous period and ask 3 who did not return why.",
    },
    successCriteria: {
      uz: "Takroriy xarid foizi ikki davr uchun hisoblangan va qaytmagan 3 mijozning javobi yozilgan.",
      ru: "Доля повторных покупок посчитана за два периода, записаны ответы 3 невернувшихся клиентов.",
      en: "Repeat rate calculated for two periods and answers from 3 non-returning customers recorded.",
    },
    why: {
      uz: "Takroriy xarid — mahsulot ehtiyojga mos kelishining eng toʻgʻri belgisi va mijoz qiymatining asosi.",
      ru: "Повторная покупка — самый честный признак того, что продукт решает потребность, и основа ценности клиента.",
      en: "Repeat purchases are the most honest signal of fit and the basis of customer lifetime value.",
    },
    resources: [],
  },
];
