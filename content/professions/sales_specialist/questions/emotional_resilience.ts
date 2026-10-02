import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "emotional_resilience" (keys: sales_specialist.emotional_resilience.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
