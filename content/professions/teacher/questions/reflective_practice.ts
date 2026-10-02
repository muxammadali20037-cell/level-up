import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: reflective_practice. Keys: teacher.reflective_practice.NN */
export const questions: QuestionInput[] = [];
