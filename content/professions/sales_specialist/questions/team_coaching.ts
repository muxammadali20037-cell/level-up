import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Questions for skill "team_coaching" (keys: sales_specialist.team_coaching.NN). Authored in stage 2. */
export const questions: QuestionInput[] = [];
