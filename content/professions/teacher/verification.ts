import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

/** Slots (05 §4.1, §13.6): v5_scenario_lesson_plan_critique (MVP), v7/v8/v9 post-MVP. */
export const verificationTasks: VerificationTaskInput[] = [];
