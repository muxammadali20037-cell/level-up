import type { ActionInput } from "./_types";
import { actions as visualFundamentals } from "./visual_fundamentals";
import { actions as typography } from "./typography";
import { actions as layoutGrids } from "./layout_grids";
import { actions as briefProblemFraming } from "./brief_problem_framing";
import { actions as userResearch } from "./user_research";
import { actions as interactionUx } from "./interaction_ux";
import { actions as designTools } from "./design_tools";
import { actions as brandSystems } from "./brand_systems";
import { actions as critiqueIteration } from "./critique_iteration";
import { actions as presentationHandoff } from "./presentation_handoff";

export type { ActionInput };

export const actions: ActionInput[] = [
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
