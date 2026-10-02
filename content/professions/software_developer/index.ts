import type { ProfessionContent } from "../../schema";
import { meta } from "./meta";
import { edges, skills, specializations } from "./skills";
import { levelRequirements, levels } from "./levels";
import { contextQuestions } from "./context";
import { questions } from "./questions";
import { actions } from "./actions";
import { doNotRules } from "./rules";
import { verificationTasks } from "./verification";

export const profession = {
  ...meta,
  skills,
  edges,
  specializations,
  levelRequirements,
  levels,
  contextQuestions,
  questions,
  actions,
  doNotRules,
  verificationTasks,
} satisfies ProfessionContent;
