import { clamp } from "@/modules/scoring/domain";
import type { Question } from "./types";

export type InvalidAnswerCode = "no_selection" | "multiple_selection" | "unknown_option" | "unsupported_question";

/** Thrown when an answer cannot be credited. Map to HTTP 422 in the API layer; never trust the client. */
export class InvalidAnswerError extends Error {
  override readonly name = "InvalidAnswerError";
  readonly code: InvalidAnswerCode;
  readonly questionId: string;

  constructor(code: InvalidAnswerCode, questionId: string, message: string) {
    super(message);
    this.code = code;
    this.questionId = questionId;
  }
}

/** Throws InvalidAnswerError `unsupported_question` for open / open_ai items (never credited by the MVP engine). */
export function assertCreditable(question: Question): void {
  if (question.scoringRule === "open_ai" || question.type === "open") {
    throw new InvalidAnswerError("unsupported_question", question.id, "Open questions are not credited here");
  }
}

/**
 * Server-side credit x ∈ [0, 1] for an answer given as AUTHORED option keys (what assessment_answers stores).
 * A client answer arrives as display keys: map it with `authoredOptionKeys` / `creditForDisplayedAnswer` first.
 *
 * Every scoring rule served today (single_best, partial_credit, likert) takes exactly ONE option key and the
 * credit is that option's authored score (best = 1, acceptable = 0.5, poor = 0; likert steps between), clamped to
 * [0, 1] (a non-finite score counts as 0). `open_ai` items are never served by the MVP engine and are rejected.
 *
 * Throws InvalidAnswerError: `no_selection` (no key), `multiple_selection` (more than one key, duplicates
 * included), `unknown_option` (key not among the question's options), `unsupported_question` (open_ai rule).
 */
export function creditFor(question: Question, selectedOptionKeys: readonly string[]): number {
  assertCreditable(question);
  if (selectedOptionKeys.length === 0) {
    throw new InvalidAnswerError("no_selection", question.id, "Exactly one option must be selected");
  }
  if (selectedOptionKeys.length > 1) {
    throw new InvalidAnswerError("multiple_selection", question.id, "Exactly one option must be selected");
  }
  const key = selectedOptionKeys[0];
  const option = question.options.find((candidate) => candidate.key === key);
  if (!option) {
    throw new InvalidAnswerError("unknown_option", question.id, `Unknown option key for question ${question.id}`);
  }
  return Number.isFinite(option.score) ? clamp(option.score, 0, 1) : 0;
}
