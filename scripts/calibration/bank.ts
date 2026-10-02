/**
 * Synthetic profession for the scoring calibration study: 10 skills × 5 items (+ 4 self_report items), the default
 * 9-level scheme, and the TRUE response model used to simulate answers.
 */
import { difficultyFromTargetLevel, type Question, type QuestionOption, type QuestionType, type ScoringRule } from "@/modules/assessments/domain";
import { DEFAULT_PROFESSION_CONFIG, type LevelDefinition, type SkillModel } from "@/modules/catalog/domain/types";
import { IRT_SCALING_D, type ScoringSkill } from "@/modules/scoring/domain";

export const SKILL_IDS = Array.from({ length: 10 }, (_, s) => `s${s}`);
/** Strictly decreasing importances (sum 1), as in the routing test bank. */
export const SKILLS: readonly ScoringSkill[] = [0.16, 0.14, 0.12, 0.11, 0.1, 0.09, 0.08, 0.07, 0.07, 0.06].map(
  (importance, s) => ({ id: `s${s}`, importance }),
);

/** c of an item under a guessing policy (the assumption of the scoring model, not the truth). */
export type GuessingPolicy = (rule: ScoringRule, options: readonly QuestionOption[]) => number;

/** How the simulated respondents really answer. */
export interface TruthScenario {
  readonly id: string;
  /** True discrimination = assumed a × factor; `aSpread` 0.4 → factor 0.6 or 1.4 (random sign per item). */
  readonly aSpread: number;
  /** True guessing floors = uniform-random floors × this (1 = blind uniform guessing, 0.5 = attractive distractors). */
  readonly floorScale: number;
}

export const SCENARIOS: Readonly<Record<string, TruthScenario>> = {
  nominal: { id: "nominal", aSpread: 0, floorScale: 1 },
  misspec: { id: "misspec", aSpread: 0.4, floorScale: 1 },
  lowfloor: { id: "lowfloor", aSpread: 0, floorScale: 0.5 },
};

const t = (en: string) => ({ uz: en, ru: en, en });
const options = (scores: readonly number[]): QuestionOption[] =>
  scores.map((score, i) => ({ key: String.fromCharCode(97 + i), label: t(`o${i}`), score }));

const SINGLE_BEST_4 = [1, 0, 0, 0];
const DECISION_3 = [1, 0, 0];
const PARTIAL_4 = [1, 0.5, 0, 0];
const LIKERT_5 = [0, 0.25, 0.5, 0.75, 1];
/** Per skill: 2 knowledge (single_best, 4 options), 2 scenario/judgment (partial credit), 1 decision (3 options). */
const ROTATION: readonly QuestionType[] = ["knowledge", "scenario", "decision", "judgment", "knowledge"];
const BASE_LEVELS = [2, 4, 5, 6, 8];
const SELF_REPORT = [
  { skill: 0, level: 4 },
  { skill: 3, level: 5 },
  { skill: 6, level: 6 },
  { skill: 9, level: 7 },
];

function question(
  id: string,
  skill: number,
  type: QuestionType,
  targetLevel: number,
  policy: GuessingPolicy,
  a: number,
): Question {
  const rule: ScoringRule =
    type === "self_report" ? "likert" : type === "scenario" || type === "judgment" ? "partial_credit" : "single_best";
  const opts = options(
    rule === "likert" ? LIKERT_5 : rule === "partial_credit" ? PARTIAL_4 : type === "decision" ? DECISION_3 : SINGLE_BEST_4,
  );
  return {
    id,
    key: id,
    version: 1,
    skillId: `s${skill}`,
    specializationIds: [],
    type,
    targetLevel,
    difficulty: difficultyFromTargetLevel(targetLevel),
    discrimination: rule === "likert" ? 0.5 : a,
    guessing: policy(rule, opts),
    weight: rule === "likert" ? 0.5 : 1,
    scoringRule: rule,
    prompt: t(id),
    scenario: null,
    media: null,
    options: opts,
    explanation: null,
  };
}

/**
 * The 54-item bank with guessing set by `policy` and discrimination `a` for tested items (self_report 0.5).
 * Target levels 2..8 (shifted by skill), types crossed with levels.
 */
export function buildBank(policy: GuessingPolicy, a = 1): Question[] {
  const bank: Question[] = [];
  for (let s = 0; s < SKILL_IDS.length; s++) {
    for (let i = 0; i < 5; i++) {
      const level = Math.min(8, Math.max(2, (BASE_LEVELS[i] ?? 5) + (s % 3) - 1));
      bank.push(question(`q${s}-${i}`, s, ROTATION[(i + s) % 5] ?? "knowledge", level, policy, a));
    }
  }
  for (const { skill, level } of SELF_REPORT) bank.push(question(`sr${skill}`, skill, "self_report", level, policy, a));
  return bank;
}

/** Default 9-level scheme (thresholds 0, 15, …, 85; 8 and 9 require verification), no extra requirements. */
export function levels(): LevelDefinition[] {
  return [0, 15, 25, 35, 45, 55, 65, 75, 85].map((minComposite, i) => ({
    number: i + 1,
    slug: `level-${i + 1}`,
    name: t(`Level ${i + 1}`),
    shortDescription: t(""),
    meaning: t(""),
    minComposite,
    requiresVerification: i + 1 >= 8,
    requirements: [],
  }));
}

export function skillModel(edges: SkillModel["edges"]): SkillModel {
  return {
    professionId: "calibration",
    professionSlug: "calibration",
    skills: SKILLS.map((s, i) => ({
      id: s.id,
      slug: s.id,
      globalSkillKey: null,
      name: t(s.id),
      description: t(""),
      kind: "hard",
      importance: s.importance,
      sortOrder: i,
    })),
    edges,
    levels: levels(),
    config: DEFAULT_PROFESSION_CONFIG,
  };
}

const logistic = (a: number, x: number): number => 1 / (1 + Math.exp(-IRT_SCALING_D * a * x));

/** Half distance (θ units) between the "acceptable" and "best" thresholds of a partial-credit item. */
export const PARTIAL_STEP = 0.5;
/** Likert category thresholds around b (θ units). */
export const LIKERT_STEPS = [-1.2, -0.4, 0.4, 1.2];

/**
 * TRUE response model. Returns the authored key of the chosen option.
 * - single_best (n options): 3PL with c_true = floorScale/n (blind guessing among n options).
 * - partial_credit (scores 1 / 0.5 / 0 / 0): graded response with a guessing floor,
 *     P(x ≥ 0.5) = g≥ + (1 − g≥)·F(θ − b + δ),  P(x = 1) = g1 + (1 − g1)·F(θ − b − δ),  δ = 0.5,
 *   g1 = floorScale·1/4, g≥ = floorScale·2/4 (the floors of a uniformly random pick), F = logistic(1.7·a_true·…).
 * - likert (5 steps): graded response (Samejima), thresholds b + {−1.2, −0.4, 0.4, 1.2}, no guessing.
 */
export function respond(q: Question, theta: number, trueA: number, floorScale: number, u: () => number): string {
  const scores = q.options.map((o) => o.score);
  const keyOf = (score: number): string => {
    const matching = q.options.filter((o) => o.score === score);
    return matching[Math.floor(u() * matching.length)]?.key ?? q.options[0]?.key ?? "a";
  };
  const b = q.difficulty;
  if (q.scoringRule === "likert") {
    const r = u();
    let category = 0;
    for (const step of LIKERT_STEPS) if (r < logistic(trueA, theta - b - step)) category += 1;
    return keyOf(LIKERT_5[category] ?? 0);
  }
  const n = scores.length;
  if (q.scoringRule === "partial_credit") {
    const g1 = floorScale / n;
    const gAcceptable = (floorScale * 2) / n;
    const pBest = g1 + (1 - g1) * logistic(trueA, theta - b - PARTIAL_STEP);
    const pAtLeastHalf = gAcceptable + (1 - gAcceptable) * logistic(trueA, theta - b + PARTIAL_STEP);
    const r = u();
    return keyOf(r < pBest ? 1 : r < Math.max(pBest, pAtLeastHalf) ? 0.5 : 0);
  }
  const c = floorScale / n;
  return keyOf(u() < c + (1 - c) * logistic(trueA, theta - b) ? 1 : 0);
}
