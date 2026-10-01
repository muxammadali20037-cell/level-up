import { describe, expect, it } from "vitest";
import { DEFAULT_PROFESSION_CONFIG, type Skill } from "@/modules/catalog/domain/types";
import { routingImportance } from "./importance";
import { selectNextQuestion } from "./routing";
import { buildSessionPool, coreSkillIds, normalizeRoutingConfig, routableSkills } from "./routing-pool";
import { irtResponder, makeBank, makeSkills, routingInput, simulateSession, text } from "./test-fixtures";

const config = normalizeRoutingConfig(DEFAULT_PROFESSION_CONFIG);

/** 8 equal catalog skills s0..s7; the specialization sets s7's weight to 0. */
const catalog: Skill[] = Array.from({ length: 8 }, (_, i) => ({
  id: `s${i}`,
  slug: `skill-${i}`,
  globalSkillKey: null,
  name: text(`S${i}`),
  description: text(""),
  kind: "hard",
  importance: 0.125,
  sortOrder: i,
}));
const skills = routingImportance(catalog, { specializationWeights: { s7: 0 } });
const bank = makeBank({
  skills: 8,
  itemsPerSkill: 5,
  type: (_s, i) => (i % 2 === 1 ? "scenario" : "knowledge"),
  targetLevel: (_s, i) => 3 + i,
});

describe("routing — zero-weight skills (regression)", () => {
  it("keeps only positive-importance skills, falling back to all when none is positive", () => {
    expect(skills.find((s) => s.id === "s7")?.importance).toBe(0);
    expect(routableSkills(skills).map((s) => s.id)).toEqual(["s0", "s1", "s2", "s3", "s4", "s5", "s6"]);
    const allZero = makeSkills([0, 0, Number.NaN]);
    expect(routableSkills(allZero).map((s) => s.id)).toEqual(["s0", "s1", "s2"]);
    expect(routableSkills(makeSkills([0.5, -1, 0.5])).map((s) => s.id)).toEqual(["s0", "s2"]);
  });

  it("never makes a zero-weight skill a core skill", () => {
    const pool = buildSessionPool(routingInput({ bank, skills }), config);
    expect(pool.sessionBank.some((q) => q.skillId === "s7")).toBe(false);
    expect(coreSkillIds(skills, bank, config)).toEqual(["s0", "s1", "s2", "s3", "s4", "s5", "s6"]);
  });

  it("never serves a zero-weight skill in simulated sessions", () => {
    for (let s = 0; s < 50; s += 1) {
      const theta = -2 + (s % 5);
      const session = simulateSession(
        { bank, skills, specializationId: null, priorMean: 0, config, rngSeed: 4000 + s },
        irtResponder(theta),
        900 + s,
      );
      expect(session.questions.some((q) => q.skillId === "s7")).toBe(false);
      expect(session.final.reason).not.toBe("bank_exhausted");
      // Coverage still reaches every weighted skill.
      expect(new Set(session.questions.map((q) => q.skillId)).size).toBe(7);
    }
  });

  it("stops with bank_exhausted rather than serving a zero-weight skill", () => {
    const tiny = [...makeBank({ skills: 1, itemsPerSkill: 2 }), ...makeBank({ skills: 8, itemsPerSkill: 5 }).filter((q) => q.skillId === "s7")];
    const weights = makeSkills([1, 0, 0, 0, 0, 0, 0, 0]);
    const served = tiny.filter((q) => q.skillId === "s0").map((q) => q.id);
    const decision = selectNextQuestion(routingInput({ bank: tiny, skills: weights, servedQuestionIds: served }));
    expect(decision).toMatchObject({ kind: "stop", reason: "bank_exhausted" });
  });

  it("uses every skill when all importances are zero (equal-weight fallback)", () => {
    const decision = selectNextQuestion(routingInput({ bank, skills: makeSkills(Array.from({ length: 8 }, () => 0)) }));
    expect(decision.kind).toBe("question");
    expect(coreSkillIds(makeSkills(Array.from({ length: 8 }, () => 0)), bank, config)).toHaveLength(8);
  });
});
