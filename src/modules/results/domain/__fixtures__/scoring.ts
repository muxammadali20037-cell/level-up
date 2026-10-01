import type { SkillModel } from "@/modules/catalog/domain/types";
import type {
  AbilityEstimate,
  ConfidenceAssessment,
  LevelAssignment,
  LevelEvaluation,
} from "@/modules/scoring/domain/types";

/** Ability estimate in model order; `unmeasured` skills get nItems 0 / measured false. */
export function makeAbility(
  model: SkillModel,
  scores: Readonly<Record<string, number>>,
  unmeasured: readonly string[] = [],
): AbilityEstimate {
  const skills = model.skills.map((s) => {
    const score = scores[s.id] ?? 50;
    const measured = !unmeasured.includes(s.id);
    return { skillId: s.id, theta: (score / 100) * 7 - 3.5, se: 0.5, score, nItems: measured ? 2 : 0, measured };
  });
  const total = model.skills.reduce((sum, s) => sum + s.importance, 0);
  const weighted = model.skills.reduce((sum, s) => sum + s.importance * (scores[s.id] ?? 50), 0);
  return { thetaG: 0, seG: 0.4, skills, composite: Math.round((weighted / total) * 10) / 10, compositeSe: 4 };
}

export function makeAssignment(level: number, evaluations: readonly LevelEvaluation[] = []): LevelAssignment {
  return { level, uncappedLevel: level, cappedBy: null, range: null, evaluations };
}

export const mediumConfidence: ConfidenceAssessment = { level: "medium", reasons: ["few_items"] };
export const highConfidence: ConfidenceAssessment = { level: "high", reasons: [] };
