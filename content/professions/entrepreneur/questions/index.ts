import type { z } from "zod";
import type { questionSchema } from "../../../schema";
import { questions as sales } from "./sales";
import { questions as marketing } from "./marketing";
import { questions as operations } from "./operations";
import { questions as finance } from "./finance";
import { questions as unitEconomics } from "./unit_economics";
import { questions as hiringTeam } from "./hiring_team";
import { questions as leadership } from "./leadership";
import { questions as customerProduct } from "./customer_product";
import { questions as strategy } from "./strategy";
import { questions as decisionMaking } from "./decision_making";

export type QuestionInput = z.input<typeof questionSchema>;

export const questions: QuestionInput[] = [
  ...sales,
  ...marketing,
  ...operations,
  ...finance,
  ...unitEconomics,
  ...hiringTeam,
  ...leadership,
  ...customerProduct,
  ...strategy,
  ...decisionMaking,
];
