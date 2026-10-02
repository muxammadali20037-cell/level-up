import type { z } from "zod";
import type { actionSchema } from "../../../schema";
import { actions as prospecting } from "./prospecting";
import { actions as discovery } from "./discovery";
import { actions as productKnowledge } from "./product_knowledge";
import { actions as presentation } from "./presentation";
import { actions as objectionHandling } from "./objection_handling";
import { actions as closing } from "./closing";
import { actions as followUpRetention } from "./follow_up_retention";
import { actions as pipelineCrm } from "./pipeline_crm";
import { actions as negotiation } from "./negotiation";
import { actions as emotionalResilience } from "./emotional_resilience";
import { actions as teamCoaching } from "./team_coaching";

type ActionInput = z.input<typeof actionSchema>;

export const actions: ActionInput[] = [
  ...prospecting,
  ...discovery,
  ...productKnowledge,
  ...presentation,
  ...objectionHandling,
  ...closing,
  ...followUpRetention,
  ...pipelineCrm,
  ...negotiation,
  ...emotionalResilience,
  ...teamCoaching,
];
