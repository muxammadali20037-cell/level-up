import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: subject_mastery. Keys: teacher.subject_mastery.NN */
export const questions: QuestionInput[] = [];
