import type { I18nText } from "@/lib/i18n/text";
import type { BottleneckReason } from "./types";

/**
 * Bottleneck explanation templates (used when no content-authored edge rationale applies).
 *
 * Placeholders — NOT interpolated in the stored report; the UI (or `renderBottleneckExplanation`) fills them with
 * localized skill names:
 * - `{skill}`   the bottleneck skill (Bottleneck.skillId);
 * - `{limited}` the strong skills it caps (Bottleneck.limitedSkillIds), joined as a list;
 * - `{unlocks}` the weak skills that depend on it (Bottleneck.unlocksSkillIds), joined as a list.
 * Uzbek Latin uses U+02BB (ʻ) and U+02BC (ʼ); never an ASCII apostrophe.
 */
export const BOTTLENECK_EXPLANATION_TEMPLATES: Readonly<Record<BottleneckReason, I18nText>> = {
  limits_strong_skills: {
    uz: "Kuchli tomonlaringiz ({limited}) «{skill}» koʻnikmasi tufayli cheklanib qolmoqda. Bu koʻnikmani rivojlantirsangiz, mavjud salohiyatingiz toʻliq ochiladi.",
    ru: "Ваши сильные стороны ({limited}) упираются в навык «{skill}». Развив его, вы раскроете уже имеющийся потенциал.",
    en: "Your strengths ({limited}) are capped by {skill}. Improving {skill} unlocks value you already have.",
  },
  prerequisite_of_weak: {
    uz: "«{skill}» — {unlocks} uchun poydevor. Avval shu koʻnikmadan boshlang: keyingi koʻnikmalar uning ustiga quriladi.",
    ru: "«{skill}» — основа для навыков: {unlocks}. Начните с него: следующие навыки строятся на этой базе.",
    en: "{skill} is the foundation for {unlocks}. Start with {skill}: the next skills build on it.",
  },
  largest_gap: {
    uz: "«{skill}» koʻnikmasida keyingi darajagacha boʻlgan farq, uning ahamiyatini hisobga olganda, eng katta. Shu farqni yopish sizni eng tez oldinga olib chiqadi.",
    ru: "У навыка «{skill}» самый большой разрыв до следующего уровня с учётом его важности. Его развитие быстрее всего продвинет вас вперёд.",
    en: "{skill} has the largest gap to your next level, weighted by its importance. Closing it moves you forward fastest.",
  },
};

/**
 * Description of the implicit requirement of a requires_verification level that lists no explicit
 * verified_scenario requirement (the scoring engine enforces "at least 1 verified scenario" through its cap).
 */
export const VERIFICATION_REQUIREMENT_DESCRIPTION: I18nText = {
  uz: "Kamida bitta real amaliy topshiriqni tasdiqlang. Bu daraja faqat test natijasi bilan berilmaydi.",
  ru: "Подтвердите хотя бы одно реальное практическое задание. Этот уровень не присваивается только по тесту.",
  en: "Complete at least one verified real-world scenario. This level is not granted by the test alone.",
};

/** Always shown on every report (brief §0: educational assessment; level ≠ human value or intelligence). */
export const EDUCATIONAL_DISCLAIMER: I18nText = {
  uz: "Bu taʼlimiy baholash, kasbiy sertifikatlash emas. LEVEL faqat ushbu sohadagi kompetensiyangizni koʻrsatadi — inson sifatidagi qadringizni yoki aql-zakovatingizni emas.",
  ru: "Это образовательная оценка, а не профессиональная сертификация. LEVEL отражает только ваши компетенции в этой области — не вашу ценность как человека и не интеллект.",
  en: "This is an educational assessment, not a professional certification. Your LEVEL reflects competency in this field only — not your value as a person or your intelligence.",
};

/** Used for regulated professions when the profession has no own disclaimer text. */
export const REGULATED_DISCLAIMER_FALLBACK: I18nText = {
  uz: "Bu soha davlat tomonidan tartibga solinadi. Natija litsenziya yoki kasbiy faoliyat yuritish huquqini bermaydi; mamlakatingizdagi rasmiy talablarga amal qiling.",
  ru: "Эта сфера регулируется государством. Результат не даёт лицензии или права на профессиональную деятельность; соблюдайте официальные требования вашей страны.",
  en: "This field is regulated. The result does not grant a license or the right to practice; follow the official requirements of your country.",
};
