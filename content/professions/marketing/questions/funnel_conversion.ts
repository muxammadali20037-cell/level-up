import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: funnel_conversion. Keys: marketing.funnel_conversion.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
