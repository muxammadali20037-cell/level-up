import { describe, expect, it } from "vitest";
import { creditFor, InvalidAnswerError } from "./credit";
import {
  authoredOptionKeys,
  creditForDisplayedAnswer,
  displayedOptions,
  displayKey,
  optionOrderSeed,
} from "./option-order";
import { toPublicQuestion } from "./public-question";
import { deriveSeed, RNG_STREAM } from "./rng";
import { likertOptions, makeQuestion, text } from "./test-fixtures";

// Correct answer authored first ("a"), as is common in hand- or LLM-authored items.
const question = makeQuestion({ id: "q-mcq", skillId: "s1", type: "judgment" });
const partial = makeQuestion({
  id: "q-partial",
  skillId: "s1",
  type: "scenario",
  scoringRule: "partial_credit",
  options: [1, 0.5, 0, 0].map((score, i) => ({ key: "abcd"[i] ?? "x", label: text(`P${i}`), score })),
});

function errorCode(run: () => unknown): string | null {
  try {
    run();
    return null;
  } catch (error) {
    return error instanceof InvalidAnswerError ? error.code : "other";
  }
}

describe("displayedOptions", () => {
  it("labels options o1..oN by displayed position and derives the seed like the session does", () => {
    expect(displayKey(0)).toBe("o1");
    expect(optionOrderSeed(42, 3)).toBe(deriveSeed(42, 3, RNG_STREAM.optionOrder));
    const shown = displayedOptions(question, optionOrderSeed(42, 3));
    expect(shown.map((entry) => entry.displayKey)).toEqual(["o1", "o2", "o3", "o4"]);
    expect(shown.map((entry) => entry.option.key).sort()).toEqual(["a", "b", "c", "d"]);
  });

  it("matches the public projection position by position", () => {
    for (let seed = 0; seed < 20; seed += 1) {
      const shown = displayedOptions(partial, seed);
      const projected = toPublicQuestion(partial, "en", seed).options;
      expect(projected.map((o) => o.key)).toEqual(shown.map((entry) => entry.displayKey));
      expect(projected.map((o) => o.label)).toEqual(shown.map((entry) => entry.option.label.en));
    }
  });

  it("spreads the correct answer's display key uniformly although it is always authored first (regression)", () => {
    const counts = new Map<string, number>();
    const sessions = 4000;
    for (let session = 0; session < sessions; session += 1) {
      const seed = optionOrderSeed(session * 7919 + 13, session % 12);
      const correct = displayedOptions(question, seed).find((entry) => entry.option.score === 1);
      const key = correct?.displayKey ?? "none";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    expect([...counts.keys()].sort()).toEqual(["o1", "o2", "o3", "o4"]);
    for (const count of counts.values()) expect(Math.abs(count / sessions - 0.25)).toBeLessThan(0.03);
  });
});

describe("authoredOptionKeys / creditForDisplayedAnswer", () => {
  it("round-trips every displayed option to its authored score", () => {
    for (const item of [question, partial]) {
      for (let seed = 0; seed < 30; seed += 1) {
        for (const entry of displayedOptions(item, seed)) {
          expect(authoredOptionKeys(item, seed, [entry.displayKey])).toEqual([entry.option.key]);
          expect(creditForDisplayedAnswer(item, seed, [entry.displayKey])).toBe(creditFor(item, [entry.option.key]));
        }
      }
    }
  });

  it("maps likert display keys in authored order", () => {
    const selfReport = makeQuestion({ id: "q-sr", skillId: "s1", type: "self_report", options: likertOptions() });
    expect(authoredOptionKeys(selfReport, 99, ["o1", "o5"])).toEqual(["l1", "l5"]);
    expect(creditForDisplayedAnswer(selfReport, 99, ["o4"])).toBe(0.75);
  });

  it("rejects authored keys, unknown keys, empty, duplicate and open answers", () => {
    expect(errorCode(() => creditForDisplayedAnswer(question, 5, ["a"]))).toBe("unknown_option");
    expect(errorCode(() => creditForDisplayedAnswer(question, 5, ["o5"]))).toBe("unknown_option");
    expect(errorCode(() => creditForDisplayedAnswer(question, 5, []))).toBe("no_selection");
    expect(errorCode(() => creditForDisplayedAnswer(question, 5, ["o1", "o1"]))).toBe("multiple_selection");
    expect(errorCode(() => creditForDisplayedAnswer(question, 5, ["o1", "o2"]))).toBe("multiple_selection");
    const open = makeQuestion({ id: "q-open", skillId: "s1", type: "open", scoringRule: "open_ai", options: [] });
    expect(errorCode(() => creditForDisplayedAnswer(open, 5, ["o1"]))).toBe("unsupported_question");
  });

  it("depends on the seed: the same display key resolves differently in other sessions", () => {
    const resolved = new Set<string>();
    for (let seed = 0; seed < 40; seed += 1) resolved.add(authoredOptionKeys(question, seed, ["o1"])[0] ?? "");
    expect(resolved.size).toBe(4);
  });
});
