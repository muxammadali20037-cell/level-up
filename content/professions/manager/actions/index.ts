import type { z } from "zod";
import type { actionSchema } from "../../../schema";

import { actions as goalSettingPlanning } from "./goal_setting_planning";
import { actions as delegation } from "./delegation";
import { actions as feedbackCoaching } from "./feedback_coaching";
import { actions as communication } from "./communication";
import { actions as decisionMaking } from "./decision_making";
import { actions as performanceManagement } from "./performance_management";
import { actions as hiringOnboarding } from "./hiring_onboarding";
import { actions as processImprovement } from "./process_improvement";
import { actions as conflictResolution } from "./conflict_resolution";
import { actions as selfManagement } from "./self_management";

type ActionInput = z.input<typeof actionSchema>;

export const actions: ActionInput[] = [
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
