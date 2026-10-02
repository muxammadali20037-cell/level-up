import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "follow_up_retention" (keys: sales_specialist.follow_up_retention.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
