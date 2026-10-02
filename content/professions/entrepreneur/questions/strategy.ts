import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `strategy` — stage 2. Keys: entrepreneur.strategy.NN */
export const questions: QuestionInput[] = [];
