import type { z } from "zod";
import type { doNotRuleSchema } from "../../schema";

type DoNotRuleInput = z.input<typeof doNotRuleSchema>;

/** "Do not do now" rules. Authored in stage 2. */
export const doNotRules: DoNotRuleInput[] = [];
