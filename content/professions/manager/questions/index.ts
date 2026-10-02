import type { z } from "zod";
import type { questionSchema } from "../../../schema";

import { questions as goalSettingPlanning } from "./goal_setting_planning";
import { questions as delegation } from "./delegation";
import { questions as feedbackCoaching } from "./feedback_coaching";
import { questions as communication } from "./communication";
import { questions as decisionMaking } from "./decision_making";
import { questions as performanceManagement } from "./performance_management";
import { questions as hiringOnboarding } from "./hiring_onboarding";
import { questions as processImprovement } from "./process_improvement";
import { questions as conflictResolution } from "./conflict_resolution";
import { questions as selfManagement } from "./self_management";

type QuestionInput = z.input<typeof questionSchema>;

export const questions: QuestionInput[] = [
  ...goalSettingPlanning,
  ...delegation,
  ...feedbackCoaching,
  ...communication,
  ...decisionMaking,
  ...performanceManagement,
  ...hiringOnboarding,
  ...processImprovement,
  ...conflictResolution,
  ...selfManagement,
];
