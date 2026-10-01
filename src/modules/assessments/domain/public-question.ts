import { localize, type LocaleCode } from "@/lib/i18n/text";
import { displayedOptions } from "./option-order";
import type { PublicQuestion, Question, QuestionMedia } from "./types";

function copyMedia(media: QuestionMedia | null): QuestionMedia | null {
  if (!media) return null;
  switch (media.kind) {
    case "code":
      return { kind: "code", language: media.language, code: media.code };
    case "table":
      return {
        kind: "table",
        headers: media.headers.map((header) => ({ ...header })),
        rows: media.rows.map((row) => [...row]),
      };
    case "image":
      return { kind: "image", src: media.src, alt: { ...media.alt } };
  }
}

/**
 * Client-safe projection of a question for one locale.
 *
 * Built field by field (whitelist), so option scores, authored option keys, the explanation, IRT parameters
 * (difficulty, discrimination, guessing, weight), key/version, skill and target level can never leak. Texts use
 * `localize` (requested → en → uz fallback).
 *
 * Options come from `displayedOptions(question, seed)`: shuffled for knowledge/judgment/scenario/decision items,
 * authored order for self_report and likert items, and each option's `key` is its opaque display key ("o1".."oN"
 * by displayed position), never the authored key. Resolve an answer with `creditForDisplayedAnswer` /
 * `authoredOptionKeys` and the same seed.
 *
 * `seed` must be stable for the (session, question) pair so a reload shows the same order:
 * `optionOrderSeed(session.rngSeed, sequence)`. Media is copied as authored (its texts are I18nText per the
 * PublicQuestion contract).
 */
export function toPublicQuestion(question: Question, locale: LocaleCode, seed: number): PublicQuestion {
  return {
    id: question.id,
    type: question.type,
    prompt: localize(question.prompt, locale),
    scenario: question.scenario ? localize(question.scenario, locale) : null,
    media: copyMedia(question.media),
    options: displayedOptions(question, seed).map(({ displayKey, option }) => ({
      key: displayKey,
      label: localize(option.label, locale),
    })),
  };
}
