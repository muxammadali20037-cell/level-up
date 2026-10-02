import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: instruction_structure. Keys: driving_instructor.instruction_structure.NN */
export const questions: QuestionInput[] = [];
