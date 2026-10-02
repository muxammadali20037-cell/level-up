import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: copywriting. Keys: marketing.copywriting.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
