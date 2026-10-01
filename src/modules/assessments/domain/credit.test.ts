import { describe, expect, it } from "vitest";
import { creditFor, InvalidAnswerError } from "./credit";
import { likertOptions, makeQuestion, text } from "./test-fixtures";
import type { InvalidAnswerCode } from "./credit";
import type { Question } from "./types";

const singleBest = makeQuestion({ id: "q1", skillId: "s1" });
const partial = makeQuestion({
  id: "q2",
  skillId: "s1",
  type: "judgment",
  scoringRule: "partial_credit",
  options: [
    { key: "best", label: text("best"), score: 1 },
    { key: "ok", label: text("ok"), score: 0.5 },
    { key: "poor", label: text("poor"), score: 0 },
  ],
});
const likert = makeQuestion({ id: "q3", skillId: "s1", type: "self_report", options: likertOptions() });

function expectInvalid(question: Question, keys: readonly string[], code: InvalidAnswerCode): void {
  try {
    creditFor(question, keys);
    expect.unreachable("creditFor should throw");
  } catch (error) {
    expect(error).toBeInstanceOf(InvalidAnswerError);
    expect(error).toBeInstanceOf(Error);
    expect((error as InvalidAnswerError).code).toBe(code);
    expect((error as InvalidAnswerError).questionId).toBe(question.id);
    expect((error as InvalidAnswerError).name).toBe("InvalidAnswerError");
  }
}

describe("creditFor", () => {
  it("returns the selected option's score for single-best items", () => {
    expect(creditFor(singleBest, ["a"])).toBe(1);
    expect(creditFor(singleBest, ["b"])).toBe(0);
  });

  it("supports partial credit and likert steps", () => {
    expect(creditFor(partial, ["best"])).toBe(1);
    expect(creditFor(partial, ["ok"])).toBe(0.5);
    expect(creditFor(partial, ["poor"])).toBe(0);
    expect(creditFor(likert, ["l1"])).toBe(0);
    expect(creditFor(likert, ["l4"])).toBe(0.75);
  });

  it("clamps out-of-range authored scores into [0, 1] and maps non-finite scores to 0", () => {
    const broken = makeQuestion({
      id: "q4",
      skillId: "s1",
      options: [
        { key: "hi", label: text("hi"), score: 1.7 },
        { key: "lo", label: text("lo"), score: -0.2 },
        { key: "nan", label: text("nan"), score: Number.NaN },
      ],
    });
    expect(creditFor(broken, ["hi"])).toBe(1);
    expect(creditFor(broken, ["lo"])).toBe(0);
    expect(creditFor(broken, ["nan"])).toBe(0);
  });

  it("rejects empty, multiple, duplicate and unknown selections with typed errors", () => {
    expectInvalid(singleBest, [], "no_selection");
    expectInvalid(singleBest, ["a", "b"], "multiple_selection");
    expectInvalid(singleBest, ["a", "a"], "multiple_selection");
    expectInvalid(singleBest, ["z"], "unknown_option");
    expectInvalid(singleBest, [""], "unknown_option");
  });

  it("rejects open (AI-scored) questions", () => {
    const open = makeQuestion({ id: "q5", skillId: "s1", type: "open", scoringRule: "open_ai", options: [] });
    expectInvalid(open, ["a"], "unsupported_question");
  });
});
