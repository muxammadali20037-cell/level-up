import { assertCreditable, creditFor, InvalidAnswerError } from "./credit";
import { deriveSeed, RNG_STREAM, seededShuffle } from "./rng";
import type { Question, QuestionOption, QuestionType } from "./types";

/** Types whose options have no natural order: shown shuffled so position carries no information. */
export const SHUFFLED_OPTION_TYPES: readonly QuestionType[] = ["knowledge", "judgment", "scenario", "decision"];

/** Ordered scales (self_report and any likert item) keep the authored order. */
export function shouldShuffleOptions(question: Pick<Question, "type" | "scoringRule">): boolean {
  return question.scoringRule !== "likert" && SHUFFLED_OPTION_TYPES.includes(question.type);
}

/** Prefix of display keys. Authored keys are a, b, c… so a forgotten mapping fails loudly (unknown_option). */
export const DISPLAY_KEY_PREFIX = "o";

/** Opaque display key of the option shown at `position` (0-based): "o1", "o2", … */
export function displayKey(position: number): string {
  return `${DISPLAY_KEY_PREFIX}${position + 1}`;
}

/**
 * Seed of the option order of the item served at `sequence` of a session:
 * deriveSeed(rngSeed, sequence, RNG_STREAM.optionOrder). Use the same value to render and to resolve an answer,
 * so a reload shows the same order (AC-F06-03) and the answer maps back to the same options.
 */
export function optionOrderSeed(rngSeed: number, sequence: number): number {
  return deriveSeed(rngSeed, sequence, RNG_STREAM.optionOrder);
}

export interface DisplayedOption {
  /** Opaque per-session key sent to the client ("o1".."oN" by displayed position). */
  readonly displayKey: string;
  /** The authored option (server-side only: carries the authored key and the score). */
  readonly option: QuestionOption;
}

/**
 * Options in the order shown for one served item, each with its display key:
 * order = seededShuffle(options, seed) for knowledge/judgment/scenario/decision items, authored order for
 * self_report and likert items; displayKey = displayKey(position).
 *
 * The client only ever sees display keys. Authored keys encode the authored position (the validator requires
 * a, b, c… in authored order), and correct answers often cluster at one authored position, so sending them would
 * leak the answer key; a display key only reveals the displayed position, which is a seeded random permutation.
 */
export function displayedOptions(question: Question, seed: number): DisplayedOption[] {
  const ordered = shouldShuffleOptions(question) ? seededShuffle(question.options, seed) : question.options.slice();
  return ordered.map((option, position) => ({ displayKey: displayKey(position), option }));
}

/**
 * Maps display keys sent by the client back to authored option keys, with the SAME seed used to render the item
 * (`optionOrderSeed(rngSeed, sequence)`). Order and duplicates are preserved (creditFor rejects duplicates).
 * Store the authored keys (assessment_answers.selected_option_keys) so re-scoring never needs the seed.
 *
 * Throws InvalidAnswerError `unknown_option` for a key that is not a display key of this item — including an
 * authored key such as "a".
 */
export function authoredOptionKeys(question: Question, seed: number, displayKeys: readonly string[]): string[] {
  const byDisplayKey = new Map(displayedOptions(question, seed).map((entry) => [entry.displayKey, entry.option.key]));
  return displayKeys.map((key) => {
    const authored = byDisplayKey.get(key);
    if (authored === undefined) {
      throw new InvalidAnswerError("unknown_option", question.id, `Unknown option key for question ${question.id}`);
    }
    return authored;
  });
}

/**
 * Server entry point for a client answer: creditFor(question, authoredOptionKeys(question, seed, displayKeys)).
 * Open items are rejected first (`unsupported_question`); then `unknown_option`, `no_selection`,
 * `multiple_selection` as in `creditFor`.
 */
export function creditForDisplayedAnswer(question: Question, seed: number, displayKeys: readonly string[]): number {
  assertCreditable(question);
  return creditFor(question, authoredOptionKeys(question, seed, displayKeys));
}
