import { describe, expect, it } from "vitest";
import { guessingFor } from "./item-params";

describe("guessingFor", () => {
  it("uses 1/n for single_best and partial_credit items", () => {
    expect(guessingFor("single_best", 4)).toBe(0.25);
    expect(guessingFor("single_best", 3)).toBeCloseTo(1 / 3, 12);
    expect(guessingFor("single_best", 2)).toBe(0.5);
    expect(guessingFor("partial_credit", 4)).toBe(0.25);
    expect(guessingFor("partial_credit", 5)).toBe(0.2);
  });

  it("uses 0 for likert (self_report) and open_ai items, whatever the option count", () => {
    expect(guessingFor("likert", 5)).toBe(0);
    expect(guessingFor("likert", 0)).toBe(0);
    expect(guessingFor("open_ai", 0)).toBe(0);
  });

  it("rejects fewer than 2 options for guessable rules", () => {
    expect(() => guessingFor("single_best", 1)).toThrow(RangeError);
    expect(() => guessingFor("partial_credit", Number.NaN)).toThrow(RangeError);
    expect(guessingFor("single_best", 4.9)).toBe(0.25);
  });
});
