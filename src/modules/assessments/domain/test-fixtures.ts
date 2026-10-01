/** Test-only fixtures for the assessments domain (not re-exported from index.ts). */
import { DEFAULT_PROFESSION_CONFIG, type ProfessionConfig } from "@/modules/catalog/domain/types";
import { probability, type ScoringSkill } from "@/modules/scoring/domain";
import { creditFor } from "./credit";
import { mulberry32 } from "./rng";
import { selectNextQuestion } from "./routing";
import {
  difficultyFromTargetLevel,
  type AnsweredItem,
  type Question,
  type QuestionOption,
  type QuestionType,
  type RoutingDecision,
  type RoutingInput,
} from "./types";

export const text = (en: string): Readonly<Record<string, string>> => ({ uz: `uz ${en}`, ru: `ru ${en}`, en });

export function singleBestOptions(count = 4): QuestionOption[] {
  return Array.from({ length: count }, (_, i) => ({
    key: String.fromCharCode(97 + i),
    label: text(`Option ${i + 1}`),
    score: i === 0 ? 1 : 0,
  }));
}

export function likertOptions(): QuestionOption[] {
  return [0, 0.25, 0.5, 0.75, 1].map((score, i) => ({ key: `l${i + 1}`, label: text(`Likert ${i + 1}`), score }));
}

/** A question with brief-default IRT parameters derived from type and target level. */
export function makeQuestion(overrides: Partial<Question> & Pick<Question, "id" | "skillId">): Question {
  const type: QuestionType = overrides.type ?? "knowledge";
  const selfReport = type === "self_report";
  const options = overrides.options ?? (selfReport ? likertOptions() : singleBestOptions(4));
  const targetLevel = overrides.targetLevel ?? 5;
  return {
    key: `key-${overrides.id}`,
    version: 1,
    specializationIds: [],
    type,
    targetLevel,
    difficulty: difficultyFromTargetLevel(targetLevel),
    discrimination: selfReport ? 0.5 : 1,
    guessing: selfReport ? 0 : 1 / options.length,
    weight: selfReport ? 0.5 : 1,
    scoringRule: selfReport ? "likert" : "single_best",
    prompt: text(`Prompt ${overrides.id}`),
    scenario: null,
    media: null,
    options,
    explanation: text("Explanation"),
    ...overrides,
  };
}

export function answerOf(question: Question, credit: number, responseMs: number | null = 8000): AnsweredItem {
  return {
    questionId: question.id,
    skillId: question.skillId,
    type: question.type,
    difficulty: question.difficulty,
    discrimination: question.discrimination,
    guessing: question.guessing,
    weight: question.weight,
    credit,
    responseMs,
  };
}

/** Equal-importance skills s0..s(count−1), or explicit importances. */
export function makeSkills(importances: readonly number[]): ScoringSkill[] {
  return importances.map((importance, i) => ({ id: `s${i}`, importance }));
}

export interface BankSpec {
  readonly skills: number;
  readonly itemsPerSkill: number;
  readonly type?: (skill: number, item: number) => QuestionType;
  readonly targetLevel?: (skill: number, item: number) => number;
}

/** Items `q-s{skill}-{item}` for skills `s{skill}` (default: knowledge items at level 5). */
export function makeBank(spec: BankSpec): Question[] {
  const bank: Question[] = [];
  for (let s = 0; s < spec.skills; s += 1) {
    for (let i = 0; i < spec.itemsPerSkill; i += 1) {
      bank.push(
        makeQuestion({
          id: `q-s${s}-${i}`,
          skillId: `s${s}`,
          type: spec.type?.(s, i) ?? "knowledge",
          targetLevel: spec.targetLevel?.(s, i) ?? 5,
        }),
      );
    }
  }
  return bank;
}

export function routingInput(overrides: Partial<RoutingInput> = {}): RoutingInput {
  return {
    bank: [],
    answered: [],
    servedQuestionIds: [],
    skills: [],
    specializationId: null,
    priorMean: 0,
    config: DEFAULT_PROFESSION_CONFIG,
    rngSeed: 12345,
    ...overrides,
  };
}

export interface SimulatedSession {
  readonly answered: readonly AnsweredItem[];
  readonly questions: readonly Question[];
  readonly decisions: readonly RoutingDecision[];
  readonly final: Extract<RoutingDecision, { kind: "stop" }>;
}

export type Responder = (question: Question, next: () => number) => string;

/** 3PL respondent at ability θ: picks the best option with probability P(θ), otherwise a random other option. */
export function irtResponder(theta: number): Responder {
  return (question, next) => {
    const sorted = [...question.options].sort((a, b) => b.score - a.score);
    const best = sorted[0];
    if (!best) throw new Error(`Question ${question.id} has no options`);
    if (question.scoringRule === "likert") {
      const target = Math.min(1, Math.max(0, probability(theta, question) + (next() - 0.5) * 0.4));
      return sorted.reduce((a, b) => (Math.abs(b.score - target) < Math.abs(a.score - target) ? b : a)).key;
    }
    if (next() < probability(theta, question)) return best.key;
    const others = sorted.slice(1);
    return others[Math.floor(next() * others.length)]?.key ?? best.key;
  };
}

/** Runs a full adaptive session: route → answer → credit until the engine stops. */
export function simulateSession(
  base: Omit<RoutingInput, "answered" | "servedQuestionIds">,
  responder: Responder,
  responderSeed: number,
  config: ProfessionConfig = base.config,
): SimulatedSession {
  const next = mulberry32(responderSeed);
  const answered: AnsweredItem[] = [];
  const questions: Question[] = [];
  const decisions: RoutingDecision[] = [];
  for (let guard = 0; guard < 100; guard += 1) {
    const decision = selectNextQuestion({
      ...base,
      config,
      answered,
      servedQuestionIds: questions.map((question) => question.id),
    });
    decisions.push(decision);
    if (decision.kind === "stop") return { answered, questions, decisions, final: decision };
    questions.push(decision.question);
    answered.push(answerOf(decision.question, creditFor(decision.question, [responder(decision.question, next)])));
  }
  throw new Error("Session did not stop");
}

const MIXED_TYPES: readonly QuestionType[] = ["knowledge", "judgment", "scenario", "decision", "knowledge"];
const SPREAD_LEVELS: readonly number[] = [2, 4, 5, 6, 8];

/**
 * 10 skills × 5 items, target levels 2..8, mixed types: per skill knowledge/judgment/scenario/decision/knowledge,
 * where every even skill's last item is a self_report (1 self_report per 2 skills).
 */
export function standardBank(): Question[] {
  return makeBank({
    skills: 10,
    itemsPerSkill: 5,
    type: (s, i) => (i === 4 && s % 2 === 0 ? "self_report" : (MIXED_TYPES[i] ?? "knowledge")),
    targetLevel: (s, i) => Math.min(8, Math.max(2, (SPREAD_LEVELS[i] ?? 5) + (s % 3) - 1)),
  });
}

/** Strictly decreasing importances for the 10 standard skills (sum 1). */
export function standardSkills(): ScoringSkill[] {
  return makeSkills([0.16, 0.14, 0.12, 0.11, 0.1, 0.09, 0.08, 0.07, 0.07, 0.06]);
}
