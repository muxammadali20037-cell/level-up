import type { ResultReport, ResultTeaser } from "./types";

/**
 * Free teaser derived from the full report: main problem (the bottleneck, else weakest[0]), strongest skill (the
 * first of `strongest` that is not the main problem — never the same skill twice; null if none) and the
 * confidence level. Level, skill details and roadmap stay locked (not included).
 */
export function buildTeaser(report: ResultReport): ResultTeaser {
  const mainProblemSkillId = report.bottleneck?.skillId ?? report.weakest[0] ?? null;
  return {
    professionId: report.professionId,
    strongestSkillId: report.strongest.find((id) => id !== mainProblemSkillId) ?? null,
    mainProblemSkillId,
    confidence: report.confidence.level,
  };
}
