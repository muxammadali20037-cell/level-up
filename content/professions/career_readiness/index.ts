import type { ProfessionContent } from "../../schema";
import { actions } from "./actions";
import { contextQuestions } from "./context";
import { levelRequirements, levels } from "./levels";
import { meta } from "./meta";
import { questions } from "./questions";
import { doNotRules } from "./rules";
import { edges, skills, specializations } from "./skills";
import { verificationTasks } from "./verification";

export const profession = {
  ...meta,
  skills,
  edges,
  specializations,
  levels,
  levelRequirements,
  contextQuestions,
  questions,
  actions,
  doNotRules,
  verificationTasks,
} satisfies ProfessionContent;
