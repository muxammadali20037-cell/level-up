import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** manager.conflict_resolution.NN — authored in stage 2. */
export const questions: QuestionInput[] = [];
