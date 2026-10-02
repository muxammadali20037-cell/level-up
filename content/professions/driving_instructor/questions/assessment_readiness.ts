import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: assessment_readiness. Keys: driving_instructor.assessment_readiness.NN */
export const questions: QuestionInput[] = [];
