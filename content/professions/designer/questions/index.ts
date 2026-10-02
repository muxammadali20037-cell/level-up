import type { QuestionInput } from "./_types";
import { questions as visualFundamentals } from "./visual_fundamentals";
import { questions as typography } from "./typography";
import { questions as layoutGrids } from "./layout_grids";
import { questions as briefProblemFraming } from "./brief_problem_framing";
import { questions as userResearch } from "./user_research";
import { questions as interactionUx } from "./interaction_ux";
import { questions as designTools } from "./design_tools";
import { questions as brandSystems } from "./brand_systems";
import { questions as critiqueIteration } from "./critique_iteration";
import { questions as presentationHandoff } from "./presentation_handoff";

export type { QuestionInput };

export const questions: QuestionInput[] = [
  ...visualFundamentals,
  ...typography,
  ...layoutGrids,
  ...briefProblemFraming,
  ...userResearch,
  ...interactionUx,
  ...designTools,
  ...brandSystems,
  ...critiqueIteration,
  ...presentationHandoff,
];
