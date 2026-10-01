import { DEFAULT_PROFESSION_CONFIG, type Skill, type SkillEdge, type SkillModel } from "@/modules/catalog/domain/types";
import { makeLevels, req } from "./levels";
import { tx } from "./text";

function skill(id: string, importance: number, sortOrder: number): Skill {
  return {
    id,
    slug: id,
    globalSkillKey: null,
    name: tx(id.charAt(0).toUpperCase() + id.slice(1)),
    description: tx(`About ${id}`),
    kind: "hard",
    importance,
    sortOrder,
  };
}

function edge(from: string, to: string, relation: SkillEdge["relation"], strength: number, why?: string): SkillEdge {
  return why ? { from, to, relation, strength, rationale: tx(why) } : { from, to, relation, strength };
}

export const SYSTEMS_LIMITS_SALES =
  "Sales generate demand, but internal processes are not repeatable, so growth leaks away.";

/** Entrepreneur: weak operations/systems caps strong sales and marketing; finance is lowest but isolated. */
export const entrepreneurModel: SkillModel = {
  professionId: "entrepreneur",
  professionSlug: "entrepreneur",
  skills: [
    skill("sales", 0.18, 1),
    skill("marketing", 0.14, 2),
    skill("systems", 0.12, 3),
    skill("finance", 0.08, 4),
    skill("leadership", 0.12, 5),
    skill("strategy", 0.12, 6),
    skill("product", 0.12, 7),
    skill("hiring", 0.12, 8),
  ],
  edges: [
    edge("systems", "sales", "limits", 0.8, SYSTEMS_LIMITS_SALES),
    edge("systems", "marketing", "limits", 0.6, "Leads arrive, but there is no system to process them."),
    edge("product", "marketing", "prerequisite", 0.5, "Know the product before promoting it."),
    edge("leadership", "hiring", "enables", 0.5),
  ],
  levels: makeLevels({ 6: [req.skill("systems", 45), req.skill("sales", 50)], 8: [req.verified(1)] }),
  config: DEFAULT_PROFESSION_CONFIG,
};

/** Scores for the canonical entrepreneur case (assessed level 5). */
export const entrepreneurScores: Readonly<Record<string, number>> = {
  sales: 81,
  marketing: 72,
  systems: 35,
  finance: 25,
  leadership: 55,
  strategy: 50,
  product: 58,
  hiring: 45,
};

/** Developer: prerequisite chain git → sql → api → testing. */
export const developerModel: SkillModel = {
  professionId: "software_developer",
  professionSlug: "software_developer",
  skills: [
    skill("git", 0.06, 1),
    skill("sql", 0.12, 2),
    skill("api", 0.16, 3),
    skill("testing", 0.12, 4),
    skill("javascript", 0.16, 5),
    skill("architecture", 0.12, 6),
    skill("debugging", 0.14, 7),
    skill("communication", 0.12, 8),
  ],
  edges: [
    edge("git", "sql", "prerequisite", 0.7, "Version control comes before collaborating on database code."),
    edge("sql", "api", "prerequisite", 0.7, "APIs read and write data, so SQL comes first."),
    edge("api", "testing", "prerequisite", 0.6),
  ],
  levels: makeLevels({ 4: [req.skill("javascript", 40)], 5: [req.skill("api", 45), req.practical(1)], 8: [req.verified(2)] }),
  config: DEFAULT_PROFESSION_CONFIG,
};

/** Scores for the canonical developer case (assessed level 3): git, sql, api, testing, architecture weak. */
export const developerScores: Readonly<Record<string, number>> = {
  git: 30,
  sql: 32,
  api: 28,
  testing: 25,
  javascript: 70,
  architecture: 35,
  debugging: 50,
  communication: 62,
};
