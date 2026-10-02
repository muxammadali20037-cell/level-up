import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "prospecting" (keys: sales_specialist.prospecting.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
