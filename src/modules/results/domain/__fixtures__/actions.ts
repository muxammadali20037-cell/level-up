import type { RoadmapPhase } from "@/modules/results/domain/types";
import type { Action, ActionKind, DoNotRule } from "@/modules/roadmaps/domain/types";
import { tx } from "./text";

const KIND_BY_PHASE: Readonly<Record<RoadmapPhase, ActionKind>> = {
  foundation: "learn",
  practice: "practice",
  application: "apply",
  verification: "verify",
};

export function makeAction(
  skillId: string,
  phase: RoadmapPhase,
  durationMinutes: number,
  extra: Partial<Action> = {},
): Action {
  const slug = extra.slug ?? `${skillId}_${phase}_${durationMinutes}`;
  return {
    id: `act_${slug}`,
    slug,
    skillId,
    title: tx(`${skillId} ${phase} ${durationMinutes}m`),
    description: tx(`Do the ${phase} task for ${skillId}`),
    kind: KIND_BY_PHASE[phase],
    phase,
    durationMinutes,
    minLevel: 1,
    maxLevel: 9,
    budget: "free",
    successCriteria: tx("Done and noted"),
    why: tx(`Why ${slug}`),
    resourceIds: [],
    sourceIds: [],
    ...extra,
  };
}

/** Per skill: foundation 15m, practice 20m, application 30m, verification 25m (all free, levels 1–9). */
export function standardLibrary(skillIds: readonly string[]): Action[] {
  return skillIds.flatMap((id) => [
    makeAction(id, "foundation", 15),
    makeAction(id, "practice", 20),
    makeAction(id, "application", 30),
    makeAction(id, "verification", 25),
  ]);
}

export const developerActions: Action[] = [
  ...standardLibrary(["git", "sql", "api", "testing", "javascript", "architecture", "debugging", "communication"]),
  makeAction("git", "foundation", 45, { slug: "git_foundation_long" }),
  makeAction("sql", "practice", 15, { slug: "sql_paid_bootcamp", budget: "high" }),
  makeAction("api", "foundation", 10, { slug: "api_advanced_only", minLevel: 7 }),
  makeAction("api", "practice", 10, { slug: "api_beginner_only", maxLevel: 2 }),
  makeAction("communication", "practice", 5, { slug: "communication_quick_note" }),
  makeAction("testing", "verification", 20, { slug: "testing_sourced", sourceIds: ["src_testing_guide"] }),
];

export const entrepreneurActions: Action[] = standardLibrary([
  "sales",
  "marketing",
  "systems",
  "finance",
  "leadership",
  "strategy",
  "product",
  "hiring",
]);

function rule(slug: string, skillId: string | null, condition: DoNotRule["condition"]): DoNotRule {
  return { id: `rule_${slug}`, slug, skillId, condition, message: tx(`Do not: ${slug}`), reason: tx(`Because ${slug}`) };
}

export const developerDoNotRules: DoNotRule[] = [
  rule("advanced_microservices", "architecture", { maxLevel: 4, weakSkillIds: ["architecture"] }),
  rule("premature_optimization", null, { maxLevel: 5 }),
  rule("learn_many_frameworks", "javascript", { goalTypes: ["find_job"] }),
  rule("skip_version_control", "git", { weakSkillIds: ["git"], maxLevel: 6 }),
  rule("lead_team_now", null, { minLevel: 6 }),
];
