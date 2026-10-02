import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: classroom_management. Keys: teacher.classroom_management.NN */
export const questions: QuestionInput[] = [];
