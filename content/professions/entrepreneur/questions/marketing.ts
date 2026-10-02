import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `marketing` — stage 2. Keys: entrepreneur.marketing.NN */
export const questions: QuestionInput[] = [];
