import { describe, expect, it } from "vitest";
import { optionOrderSeed, shouldShuffleOptions } from "./option-order";
import { toPublicQuestion } from "./public-question";
import { likertOptions, makeQuestion, singleBestOptions, text } from "./test-fixtures";
import type { QuestionType } from "./types";

const scenario = makeQuestion({
  id: "q-scn",
  skillId: "s1",
  type: "scenario",
  scenario: { uz: "Mijoz norozi", ru: "Клиент недоволен", en: "A client is unhappy" },
  prompt: { uz: "Nima qilasiz?", en: "What do you do?" },
  options: singleBestOptions(5),
  media: { kind: "table", headers: [text("Month")], rows: [["Jan"]] },
});

describe("toPublicQuestion", () => {
  it("localizes texts with the requested → en → uz fallback", () => {
    const ru = toPublicQuestion(scenario, "ru", 1);
    expect(ru.scenario).toBe("Клиент недоволен");
    expect(ru.prompt).toBe("What do you do?");
    expect(ru.options.map((o) => o.label).sort()).toEqual(
      ["ru Option 1", "ru Option 2", "ru Option 3", "ru Option 4", "ru Option 5"].sort(),
    );
    expect(toPublicQuestion(scenario, "uz", 1).prompt).toBe("Nima qilasiz?");
    expect(toPublicQuestion(makeQuestion({ id: "q", skillId: "s" }), "en", 1).scenario).toBeNull();
  });

  it("never exposes scores, explanations or IRT parameters", () => {
    const projected = toPublicQuestion(scenario, "en", 3);
    const json = JSON.stringify(projected);
    for (const forbidden of ["score", "explanation", "Explanation", "difficulty", "discrimination", "guessing"]) {
      expect(json).not.toContain(forbidden);
    }
    for (const forbidden of ["weight", "targetLevel", "skillId", "scoringRule", "version"]) {
      expect(json).not.toContain(forbidden);
    }
    expect(Object.keys(projected).sort()).toEqual(["id", "media", "options", "prompt", "scenario", "type"]);
    for (const option of projected.options) expect(Object.keys(option).sort()).toEqual(["key", "label"]);
  });

  it("shuffles options of knowledge/judgment/scenario/decision items deterministically", () => {
    const seed = optionOrderSeed(42, 3);
    const labels = (s: number): string[] => toPublicQuestion(scenario, "en", s).options.map((o) => o.label);
    const first = labels(seed);
    expect(labels(seed)).toEqual(first);
    expect([...first].sort()).toEqual(["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]);
    const orders = new Set<string>();
    for (let s = 0; s < 50; s += 1) orders.add(labels(s).join("|"));
    expect(orders.size).toBeGreaterThan(10);
  });

  it("sends opaque display keys by position, never authored keys (regression)", () => {
    for (let s = 0; s < 50; s += 1) {
      const keys = toPublicQuestion(scenario, "en", s).options.map((o) => o.key);
      expect(keys).toEqual(["o1", "o2", "o3", "o4", "o5"]);
    }
    expect(JSON.stringify(toPublicQuestion(scenario, "en", 7).options)).not.toMatch(/"key":"[a-e]"/);
  });

  it.each<QuestionType>(["knowledge", "judgment", "scenario", "decision"])("shuffles %s items", (type) => {
    expect(shouldShuffleOptions({ type, scoringRule: "single_best" })).toBe(true);
  });

  it("keeps the authored order for self_report and likert items", () => {
    const selfReport = makeQuestion({ id: "q-sr", skillId: "s1", type: "self_report", options: likertOptions() });
    const likertJudgment = makeQuestion({ id: "q-lj", skillId: "s1", type: "judgment", scoringRule: "likert" });
    for (let seed = 0; seed < 20; seed += 1) {
      const sr = toPublicQuestion(selfReport, "en", seed).options;
      expect(sr.map((o) => o.label)).toEqual(["Likert 1", "Likert 2", "Likert 3", "Likert 4", "Likert 5"]);
      expect(sr.map((o) => o.key)).toEqual(["o1", "o2", "o3", "o4", "o5"]);
      const lj = toPublicQuestion(likertJudgment, "en", seed).options;
      expect(lj.map((o) => o.label)).toEqual(["Option 1", "Option 2", "Option 3", "Option 4"]);
    }
  });

  it("copies media and does not mutate or alias the source question", () => {
    const before = JSON.stringify(scenario);
    const projected = toPublicQuestion(scenario, "en", 9);
    expect(projected.media).toEqual(scenario.media);
    expect(projected.media).not.toBe(scenario.media);
    expect(JSON.stringify(scenario)).toBe(before);
  });
});
