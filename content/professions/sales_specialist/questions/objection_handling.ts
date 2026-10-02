import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "objection_handling" (keys: sales_specialist.objection_handling.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
