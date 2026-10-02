import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: positioning_messaging. Keys: marketing.positioning_messaging.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
