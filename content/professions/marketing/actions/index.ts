import type { z } from "zod";
import type { actionSchema } from "../../../schema";
import { actions as customerResearch } from "./customer_research";
import { actions as positioningMessaging } from "./positioning_messaging";
import { actions as contentCreation } from "./content_creation";
import { actions as copywriting } from "./copywriting";
import { actions as channelManagement } from "./channel_management";
import { actions as paidAcquisition } from "./paid_acquisition";
import { actions as analyticsMeasurement } from "./analytics_measurement";
import { actions as funnelConversion } from "./funnel_conversion";
import { actions as budgetPlanning } from "./budget_planning";
import { actions as experimentation } from "./experimentation";

type ActionInput = z.input<typeof actionSchema>;

export const actions: ActionInput[] = [
  ...customerResearch,
  ...positioningMessaging,
  ...contentCreation,
  ...copywriting,
  ...channelManagement,
  ...paidAcquisition,
  ...analyticsMeasurement,
  ...funnelConversion,
  ...budgetPlanning,
  ...experimentation,
];
