import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: learning_objectives. Keys: teacher.learning_objectives.NN */
export const questions: QuestionInput[] = [];
