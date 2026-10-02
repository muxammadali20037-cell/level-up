import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `communication` (keys: career_readiness.communication.NN). */
export const questions: QuestionInput[] = [];
