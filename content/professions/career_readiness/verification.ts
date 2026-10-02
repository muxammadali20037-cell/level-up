import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

/** Placeholder — authored in stage 2 (05 §12.7: L5 v5_scenario_mock_interview required, status draft). */
export const verificationTasks: VerificationTaskInput[] = [];
