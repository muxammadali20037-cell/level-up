import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `job_search` (keys: career_readiness.job_search.NN). */
export const questions: QuestionInput[] = [];
