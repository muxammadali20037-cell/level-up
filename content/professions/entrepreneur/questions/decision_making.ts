import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `decision_making` — stage 2. Keys: entrepreneur.decision_making.NN */
export const questions: QuestionInput[] = [];
