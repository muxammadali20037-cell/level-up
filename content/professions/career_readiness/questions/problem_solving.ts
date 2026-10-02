import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `problem_solving` (keys: career_readiness.problem_solving.NN). */
export const questions: QuestionInput[] = [];
