import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "product_knowledge" (keys: sales_specialist.product_knowledge.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
