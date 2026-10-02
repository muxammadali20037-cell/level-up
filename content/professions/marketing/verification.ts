import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

/** Stage 2 placeholder. Required in MVP: v5_scenario_campaign_analysis (spec §8.6). */
export const verificationTasks: VerificationTaskInput[] = [];
