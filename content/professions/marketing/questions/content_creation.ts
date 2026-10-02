import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: content_creation. Keys: marketing.content_creation.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
