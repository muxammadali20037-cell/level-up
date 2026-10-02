import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: vehicle_control_demonstration. Keys: driving_instructor.vehicle_control_demonstration.NN */
export const questions: QuestionInput[] = [];
