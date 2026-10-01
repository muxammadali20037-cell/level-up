import type { LevelDefinition, LevelRequirement } from "@/modules/catalog/domain/types";
import { tx } from "./text";

/** Default level scheme (brief §7): 1 Starter (0) … 9 Master (85); 8–9 require verification. */
export const DEFAULT_MIN_COMPOSITE = [0, 15, 25, 35, 45, 55, 65, 75, 85] as const;

export const req = {
  composite: (threshold: number): LevelRequirement => ({
    type: "composite_min",
    skillId: null,
    threshold,
    gatesAssessed: true,
    description: tx(`Composite at least ${threshold}`),
  }),
  skill: (skillId: string, threshold: number, gatesAssessed = true): LevelRequirement => ({
    type: "skill_min",
    skillId,
    threshold,
    gatesAssessed,
    description: tx(`${skillId} at least ${threshold}`),
  }),
  verified: (threshold: number): LevelRequirement => ({
    type: "verified_scenario",
    skillId: null,
    threshold,
    gatesAssessed: false,
    description: tx(`${threshold} verified scenario(s)`),
  }),
  practical: (threshold: number): LevelRequirement => ({
    type: "practical_action",
    skillId: null,
    threshold,
    gatesAssessed: false,
    description: tx(`${threshold} practical action(s)`),
  }),
};

/** Levels 1..9; each level gets a composite_min requirement plus `extra[number]`. */
export function makeLevels(extra: Partial<Record<number, LevelRequirement[]>> = {}): LevelDefinition[] {
  return DEFAULT_MIN_COMPOSITE.map((minComposite, index) => {
    const number = index + 1;
    return {
      number,
      slug: `level_${number}`,
      name: tx(`Level ${number}`),
      shortDescription: tx(`Short ${number}`),
      meaning: tx(`Meaning ${number}`),
      minComposite,
      requiresVerification: number >= 8,
      requirements: [req.composite(minComposite), ...(extra[number] ?? [])],
    };
  });
}
