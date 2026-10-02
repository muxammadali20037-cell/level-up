import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `written_communication` (keys: career_readiness.written_communication.NN). */
export const questions: QuestionInput[] = [];
