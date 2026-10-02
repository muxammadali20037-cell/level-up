import type { z } from "zod";
import type { questionSchema } from "../../../schema";
import { questions as prospecting } from "./prospecting";
import { questions as discovery } from "./discovery";
import { questions as productKnowledge } from "./product_knowledge";
import { questions as presentation } from "./presentation";
import { questions as objectionHandling } from "./objection_handling";
import { questions as closing } from "./closing";
import { questions as followUpRetention } from "./follow_up_retention";
import { questions as pipelineCrm } from "./pipeline_crm";
import { questions as negotiation } from "./negotiation";
import { questions as emotionalResilience } from "./emotional_resilience";
import { questions as teamCoaching } from "./team_coaching";

type QuestionInput = z.input<typeof questionSchema>;

export const questions: QuestionInput[] = [
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
