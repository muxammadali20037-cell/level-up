import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

/** Verification tasks (doc §9.6) — v5_scenario_one_on_one_simulation authored in stage 2. */
export const verificationTasks: VerificationTaskInput[] = [];
