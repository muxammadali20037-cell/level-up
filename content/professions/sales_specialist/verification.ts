import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

/** Verification tasks (doc §7.6; v5_scenario_ai_customer first). Authored in stage 2. */
export const verificationTasks: VerificationTaskInput[] = [];
