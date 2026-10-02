import type { z } from "zod";
import type { questionSchema } from "../../../schema";
import { questions as trafficRulesKnowledge } from "./traffic_rules_knowledge";
import { questions as safetyRiskManagement } from "./safety_risk_management";
import { questions as hazardPerception } from "./hazard_perception";
import { questions as vehicleControlDemonstration } from "./vehicle_control_demonstration";
import { questions as instructionStructure } from "./instruction_structure";
import { questions as clearCommands } from "./clear_commands";
import { questions as learnerPsychology } from "./learner_psychology";
import { questions as errorCorrectionFeedback } from "./error_correction_feedback";
import { questions as assessmentReadiness } from "./assessment_readiness";
import { questions as professionalConduct } from "./professional_conduct";

export const questions: z.input<typeof questionSchema>[] = [
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
