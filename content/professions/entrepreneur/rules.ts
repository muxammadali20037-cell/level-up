import type { z } from "zod";
import type { doNotRuleSchema } from "../../schema";

export type DoNotRuleInput = z.input<typeof doNotRuleSchema>;

/** Stage 2 placeholder. */
export const doNotRules: DoNotRuleInput[] = [];
