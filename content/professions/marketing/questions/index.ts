import type { z } from "zod";
import type { questionSchema } from "../../../schema";
import { questions as customerResearch } from "./customer_research";
import { questions as positioningMessaging } from "./positioning_messaging";
import { questions as contentCreation } from "./content_creation";
import { questions as copywriting } from "./copywriting";
import { questions as channelManagement } from "./channel_management";
import { questions as paidAcquisition } from "./paid_acquisition";
import { questions as analyticsMeasurement } from "./analytics_measurement";
import { questions as funnelConversion } from "./funnel_conversion";
import { questions as budgetPlanning } from "./budget_planning";
import { questions as experimentation } from "./experimentation";

type QuestionInput = z.input<typeof questionSchema>;

export const questions: QuestionInput[] = [
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
