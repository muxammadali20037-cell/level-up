import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: professional_conduct. Keys: driving_instructor.professional_conduct.NN */
export const questions: QuestionInput[] = [];
