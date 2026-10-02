import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `time_management` (keys: career_readiness.time_management.NN). */
export const questions: QuestionInput[] = [];
