import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: channel_management. Keys: marketing.channel_management.<nn>. Stage 2 placeholder. */
export const questions: QuestionInput[] = [];
