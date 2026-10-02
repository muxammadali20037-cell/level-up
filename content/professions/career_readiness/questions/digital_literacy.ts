import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill `digital_literacy` (keys: career_readiness.digital_literacy.NN). */
export const questions: QuestionInput[] = [];
