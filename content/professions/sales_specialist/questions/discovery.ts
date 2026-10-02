import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "discovery" (keys: sales_specialist.discovery.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
