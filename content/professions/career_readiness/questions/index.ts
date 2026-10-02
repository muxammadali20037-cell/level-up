import type { z } from "zod";
import type { questionSchema } from "../../../schema";
import { questions as selfAwarenessDirection } from "./self_awareness_direction";
import { questions as learningSkills } from "./learning_skills";
import { questions as communication } from "./communication";
import { questions as writtenCommunication } from "./written_communication";
import { questions as digitalLiteracy } from "./digital_literacy";
import { questions as problemSolving } from "./problem_solving";
import { questions as teamwork } from "./teamwork";
import { questions as timeManagement } from "./time_management";
import { questions as jobSearch } from "./job_search";
import { questions as interviewSkills } from "./interview_skills";

export const questions: z.input<typeof questionSchema>[] = [
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
