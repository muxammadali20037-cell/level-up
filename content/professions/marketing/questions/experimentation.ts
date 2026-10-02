import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: experimentation. Keys: marketing.experimentation.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
