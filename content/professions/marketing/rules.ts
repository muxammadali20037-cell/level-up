import type { z } from "zod";
import type { doNotRuleSchema } from "../../schema";

type DoNotRuleInput = z.input<typeof doNotRuleSchema>;

/** Stage 2 placeholder (≥ 3 rules required). */
export const doNotRules: DoNotRuleInput[] = [];
