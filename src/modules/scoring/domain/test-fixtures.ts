/** Test-only fixtures for the scoring engine (not re-exported from index.ts). */
import type { AnsweredItem } from "@/modules/assessments/domain/types";
import type { LevelDefinition, LevelRequirement } from "@/modules/catalog/domain/types";
import type { LevelAssignmentInput } from "./types";

/** mulberry32 — tiny deterministic 32-bit PRNG returning floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let counter = 0;

export function item(overrides: Partial<AnsweredItem> = {}): AnsweredItem {
  counter += 1;
  return {
    questionId: `q${counter}`,
    skillId: "s1",
    type: "knowledge",
    difficulty: 0,
    discrimination: 1,
    guessing: 0.25,
    weight: 1,
    credit: 1,
    responseMs: 8000,
    ...overrides,
  };
}

export const DEFAULT_THRESHOLDS = [0, 15, 25, 35, 45, 55, 65, 75, 85] as const;

const text = (en: string): Readonly<Record<string, string>> => ({ uz: en, ru: en, en });

export function requirement(overrides: Partial<LevelRequirement> & Pick<LevelRequirement, "type">): LevelRequirement {
  return { skillId: null, threshold: null, gatesAssessed: true, description: text("req"), ...overrides };
}

/** Default 9-level scheme (8 and 9 require verification); `extra` adds requirements per level number. */
export function defaultLevels(extra: Readonly<Record<number, readonly LevelRequirement[]>> = {}): LevelDefinition[] {
  return DEFAULT_THRESHOLDS.map((minComposite, i) => {
    const number = i + 1;
    return {
      number,
      slug: `level-${number}`,
      name: text(`Level ${number}`),
      shortDescription: text(""),
      meaning: text(""),
      minComposite,
      requiresVerification: number >= 8,
      requirements: extra[number] ?? [],
    };
  });
}

export function levelInput(overrides: Partial<LevelAssignmentInput> = {}): LevelAssignmentInput {
  return {
    composite: 50,
    compositeSe: 5,
    skillScores: {},
    experience: "3to5",
    verifiedScenarios: 0,
    practicalActions: 0,
    ...overrides,
  };
}
