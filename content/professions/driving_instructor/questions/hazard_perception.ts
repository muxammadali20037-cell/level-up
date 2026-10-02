import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: hazard_perception. Keys: driving_instructor.hazard_perception.NN */
export const questions: QuestionInput[] = [];
