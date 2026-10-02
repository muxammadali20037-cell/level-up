import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `interview_skills` (keys: career_readiness.interview_skills.NN). */
export const questions: QuestionInput[] = [];
