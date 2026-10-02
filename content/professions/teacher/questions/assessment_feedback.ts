import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: assessment_feedback. Keys: teacher.assessment_feedback.NN */
export const questions: QuestionInput[] = [];
