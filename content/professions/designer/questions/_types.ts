import type { z } from "zod";
import type { questionSchema } from "../../../schema";

export type QuestionInput = z.input<typeof questionSchema>;
