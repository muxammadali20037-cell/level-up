import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `self_awareness_direction` (keys: career_readiness.self_awareness_direction.NN). */
export const questions: QuestionInput[] = [];
