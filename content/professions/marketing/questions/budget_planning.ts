import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: budget_planning. Keys: marketing.budget_planning.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
