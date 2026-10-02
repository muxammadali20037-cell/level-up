import type { z } from "zod";
import type { doNotRuleSchema } from "../../schema";

type DoNotRuleInput = z.input<typeof doNotRuleSchema>;

export const doNotRules: DoNotRuleInput[] = [];
