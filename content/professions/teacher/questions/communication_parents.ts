import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: communication_parents. Keys: teacher.communication_parents.NN */
export const questions: QuestionInput[] = [];
