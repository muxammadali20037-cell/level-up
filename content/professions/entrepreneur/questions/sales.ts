import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `sales` — stage 2. Keys: entrepreneur.sales.NN */
export const questions: QuestionInput[] = [];
