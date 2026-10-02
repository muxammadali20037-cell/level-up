import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "pipeline_crm" (keys: sales_specialist.pipeline_crm.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
