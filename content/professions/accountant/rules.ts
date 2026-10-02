import type { z } from "zod";
import type { doNotRuleSchema } from "../../schema";

type DoNotRuleInput = z.input<typeof doNotRuleSchema>;

/** Stage 2: "do not do now" rules (≥ 3). */
export const doNotRules: DoNotRuleInput[] = [];
