import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: lesson_planning. Keys: teacher.lesson_planning.NN */
export const questions: QuestionInput[] = [];
