import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `teamwork` (keys: career_readiness.teamwork.NN). */
export const questions: QuestionInput[] = [];
