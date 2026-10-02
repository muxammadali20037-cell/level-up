import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

/** MVP slot: v5_scenario_instruction_scenarios (§14.7). */
export const verificationTasks: VerificationTaskInput[] = [];
