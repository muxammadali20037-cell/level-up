import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "presentation" (keys: sales_specialist.presentation.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
