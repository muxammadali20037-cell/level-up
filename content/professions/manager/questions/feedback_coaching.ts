import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** manager.feedback_coaching.NN — authored in stage 2. */
export const questions: QuestionInput[] = [];
