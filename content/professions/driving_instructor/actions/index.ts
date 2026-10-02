import type { z } from "zod";
import type { actionSchema } from "../../../schema";
import { actions as trafficRulesKnowledge } from "./traffic_rules_knowledge";
import { actions as safetyRiskManagement } from "./safety_risk_management";
import { actions as hazardPerception } from "./hazard_perception";
import { actions as vehicleControlDemonstration } from "./vehicle_control_demonstration";
import { actions as instructionStructure } from "./instruction_structure";
import { actions as clearCommands } from "./clear_commands";
import { actions as learnerPsychology } from "./learner_psychology";
import { actions as errorCorrectionFeedback } from "./error_correction_feedback";
import { actions as assessmentReadiness } from "./assessment_readiness";
import { actions as professionalConduct } from "./professional_conduct";

export const actions: z.input<typeof actionSchema>[] = [
  ...trafficRulesKnowledge,
  ...safetyRiskManagement,
  ...hazardPerception,
  ...vehicleControlDemonstration,
  ...instructionStructure,
  ...clearCommands,
  ...learnerPsychology,
  ...errorCorrectionFeedback,
  ...assessmentReadiness,
  ...professionalConduct,
];
