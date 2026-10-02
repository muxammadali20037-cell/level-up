/** Runs one full adaptive session (selectNextQuestion → true response → credit) and scores it. */
import {
  creditFor,
  EXPERIENCE_PRIOR_MEAN,
  mulberry32,
  selectNextQuestion,
  type AnsweredItem,
  type Question,
} from "@/modules/assessments/domain";
import { DEFAULT_PROFESSION_CONFIG, type ProfessionConfig } from "@/modules/catalog/domain/types";
import type { AbilityEstimate } from "@/modules/scoring/domain";
import { SKILLS, respond, type TruthScenario } from "./bank";
import type { ScoringModel } from "./models";
import type { Respondent } from "./respondents";

export interface SessionResult {
  readonly answered: readonly AnsweredItem[];
  readonly estimate: AbilityEstimate;
  readonly priorMean: number;
}

/**
 * True discrimination per item: assumed a × (1 ± aSpread), the sign drawn per item from `seed` (fixed for the
 * whole study, so every variant faces the same misspecified bank).
 */
export function trueDiscriminations(bank: readonly Question[], scenario: TruthScenario, seed: number): Map<string, number> {
  const u = mulberry32(seed);
  return new Map(bank.map((q) => [q.id, q.discrimination * (1 + (u() < 0.5 ? -1 : 1) * scenario.aSpread)]));
}

export function runSession(
  model: ScoringModel,
  bank: readonly Question[],
  trueA: ReadonlyMap<string, number>,
  scenario: TruthScenario,
  respondent: Respondent,
  seed: number,
  config: ProfessionConfig = DEFAULT_PROFESSION_CONFIG,
): SessionResult {
  const priorMean = EXPERIENCE_PRIOR_MEAN[respondent.experience];
  const u = mulberry32(seed ^ 0x5bd1e995);
  const answered: AnsweredItem[] = [];
  const served: string[] = [];
  for (let guard = 0; guard < 50; guard++) {
    const decision = selectNextQuestion({
      bank,
      answered,
      servedQuestionIds: served,
      skills: SKILLS,
      specializationId: null,
      priorMean,
      config,
      rngSeed: seed,
      estimator: model.estimate,
    });
    if (decision.kind === "stop") break;
    const q = decision.question;
    const theta = respondent.thetas[q.skillId] ?? 0;
    const key = respond(q, theta, trueA.get(q.id) ?? q.discrimination, scenario.floorScale, u);
    served.push(q.id);
    answered.push({
      questionId: q.id,
      skillId: q.skillId,
      type: q.type,
      difficulty: q.difficulty,
      discrimination: q.discrimination,
      guessing: q.guessing,
      weight: q.weight,
      credit: creditFor(q, [key]),
      responseMs: 9000,
    });
  }
  const estimate = model.estimate({ items: answered, skills: SKILLS, priorMean });
  return { answered, estimate, priorMean };
}
