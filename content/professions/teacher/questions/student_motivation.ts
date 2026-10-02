import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: student_motivation. Keys: teacher.student_motivation.NN */
export const questions: QuestionInput[] = [];
