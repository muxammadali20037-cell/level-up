import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "negotiation" (keys: sales_specialist.negotiation.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
