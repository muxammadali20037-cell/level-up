import type { I18nText } from "@/lib/i18n/text";
import type { RoadmapPhase } from "@/modules/results/domain/types";

/**
 * Deterministic UI copy snapshotted into recommendations (uz Latin uses U+02BB ʻ and U+02BC ʼ).
 * Templates use `{skill}` = localized skill name; it is interpolated on the server by `interpolateI18n`
 * because recommendation texts are snapshotted into the stored report.
 */

/** WhyThis.limitation when a recommendation has no external sources. */
export const LIMITATION_NO_SOURCES: I18nText = {
  uz: "LEVEL koʻnikmalar modeli va javoblaringizga asoslangan; tashqi tadqiqot emas.",
  ru: "Основано на модели навыков LEVEL и ваших ответах; это не внешнее исследование.",
  en: "Based on LEVEL's skill model and your answers; not an external study.",
};

/** WhyThis.evidence when the action cites sources; the UI lists the sources themselves from `sourceIds`. */
export const EVIDENCE_FROM_SOURCES: I18nText = {
  uz: "Ushbu tavsiya uchun keltirilgan manbalar bilan asoslangan.",
  ru: "Подкреплено источниками, указанными для этой рекомендации.",
  en: "Supported by the sources cited for this recommendation.",
};

/** Fallback WhyThis.reason (only when the action's own `why` is blank) for an action on the bottleneck. */
export const REASON_BOTTLENECK_TEMPLATE: I18nText = {
  uz: "«{skill}» koʻnikmasini rivojlantiradi — aynan u hozir oʻsishingizni eng koʻp cheklayapti.",
  ru: "Развивает навык «{skill}» — именно он сейчас сильнее всего сдерживает ваш рост.",
  en: "Strengthens {skill}, the skill that limits your progress the most right now.",
};

/** Fallback WhyThis.reason (only when the action's own `why` is blank) for any other skill. */
export const REASON_FOCUS_TEMPLATE: I18nText = {
  uz: "«{skill}» koʻnikmasini rivojlantiradi — bu keyingi daraja uchun ustuvor koʻnikmalardan biri.",
  ru: "Развивает навык «{skill}» — один из приоритетных для следующего уровня.",
  en: "Strengthens {skill}, one of your priority skills for the next level.",
};

/** Week 1 theme when a bottleneck exists (`{skill}` = bottleneck). */
export const FOUNDATION_THEME_WITH_SKILL: I18nText = {
  uz: "«{skill}» boʻyicha poydevorni mustahkamlash",
  ru: "Закрыть базовый пробел: «{skill}»",
  en: "Close the foundation gap in {skill}",
};

/** 30-day roadmap week themes by phase (W1 foundation gap, W2 practice, W3 real application, W4 verification). */
export const WEEK_THEMES: Readonly<Record<RoadmapPhase, I18nText>> = {
  foundation: {
    uz: "Asosiy boʻshliqlarni yopish",
    ru: "Закрыть базовые пробелы",
    en: "Close your foundation gaps",
  },
  practice: {
    uz: "Amaliyot: bilimni odatga aylantirish",
    ru: "Практика: превратить знания в привычки",
    en: "Practice: turn knowledge into habits",
  },
  application: {
    uz: "Haqiqiy ishda qoʻllash",
    ru: "Реальное применение: использовать в работе",
    en: "Real application: use it in real work",
  },
  verification: {
    uz: "Tekshiruv: oʻsishingizni isbotlash va qayta test topshirish",
    ru: "Проверка: подтвердить прогресс и пройти тест снова",
    en: "Verification: prove your progress and retest",
  },
};
