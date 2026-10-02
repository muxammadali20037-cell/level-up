import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

export type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

/** Stage 2 placeholder (slot v5_scenario_cash_gap_case, §5.6). */
export const verificationTasks: VerificationTaskInput[] = [];
