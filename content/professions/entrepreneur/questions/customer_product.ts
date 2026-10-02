import type { z } from "zod";
import type { questionSchema } from "../../../schema";

type QuestionInput = z.input<typeof questionSchema>;

/** Skill `customer_product` — stage 2. Keys: entrepreneur.customer_product.NN */
export const questions: QuestionInput[] = [];
