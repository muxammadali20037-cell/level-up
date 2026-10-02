import type { z } from "zod";
import type { actionSchema } from "../../../schema";
import { actions as sales } from "./sales";
import { actions as marketing } from "./marketing";
import { actions as operations } from "./operations";
import { actions as finance } from "./finance";
import { actions as unitEconomics } from "./unit_economics";
import { actions as hiringTeam } from "./hiring_team";
import { actions as leadership } from "./leadership";
import { actions as customerProduct } from "./customer_product";
import { actions as strategy } from "./strategy";
import { actions as decisionMaking } from "./decision_making";

export type ActionInput = z.input<typeof actionSchema>;

export const actions: ActionInput[] = [
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
