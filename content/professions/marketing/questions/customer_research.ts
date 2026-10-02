import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: customer_research. Keys: marketing.customer_research.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
