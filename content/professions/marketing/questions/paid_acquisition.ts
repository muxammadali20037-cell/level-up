import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: paid_acquisition. Keys: marketing.paid_acquisition.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
