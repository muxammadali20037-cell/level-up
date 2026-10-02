import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: analytics_measurement. Keys: marketing.analytics_measurement.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
