import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

/** Stage 2: verification tasks (MVP requires slot v5_scenario_month_close_exercise, doc §10.7). */
export const verificationTasks: VerificationTaskInput[] = [];
