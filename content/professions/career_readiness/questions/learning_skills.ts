import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `learning_skills` (keys: career_readiness.learning_skills.NN). */
export const questions: QuestionInput[] = [];
