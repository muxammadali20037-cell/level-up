import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: instructional_methods. Keys: teacher.instructional_methods.NN */
export const questions: QuestionInput[] = [];
