import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill: traffic_rules_knowledge. Keys: driving_instructor.traffic_rules_knowledge.NN */
export const questions: QuestionInput[] = [];
