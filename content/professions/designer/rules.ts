import type { z } from "zod";
import type { doNotRuleSchema } from "../../schema";

export type DoNotRuleInput = z.input<typeof doNotRuleSchema>;

/** Do-not rules — authored in stage 2 (≥ 3 required). */
export const doNotRules: DoNotRuleInput[] = [];
