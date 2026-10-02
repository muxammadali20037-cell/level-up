import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: differentiation. Keys: teacher.differentiation.NN */
export const questions: QuestionInput[] = [];
