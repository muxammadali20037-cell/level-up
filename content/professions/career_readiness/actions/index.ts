import type { z } from "zod";
import type { actionSchema } from "../../../schema";
import { actions as selfAwarenessDirection } from "./self_awareness_direction";
import { actions as learningSkills } from "./learning_skills";
import { actions as communication } from "./communication";
import { actions as writtenCommunication } from "./written_communication";
import { actions as digitalLiteracy } from "./digital_literacy";
import { actions as problemSolving } from "./problem_solving";
import { actions as teamwork } from "./teamwork";
import { actions as timeManagement } from "./time_management";
import { actions as jobSearch } from "./job_search";
import { actions as interviewSkills } from "./interview_skills";

export const actions: z.input<typeof actionSchema>[] = [
  ...selfAwarenessDirection,
  ...learningSkills,
  ...communication,
  ...writtenCommunication,
  ...digitalLiteracy,
  ...problemSolving,
  ...teamwork,
  ...timeManagement,
  ...jobSearch,
  ...interviewSkills,
];
