import type { ProfessionContent } from "../../schema";
import { actions } from "./actions";
import { contextQuestions } from "./context";
import { levelRequirements } from "./levels";
import { meta } from "./meta";
import { questions } from "./questions";
import { doNotRules } from "./rules";
import { edges, skills, specializations } from "./skills";
import { verificationTasks } from "./verification";

/** sales_specialist — docs/architecture/05-profession-skill-model.md §7. Default level scheme (no rename). */
export const profession = {
  ...meta,
  skills,
  edges,
  specializations,
  levelRequirements,
  contextQuestions,
  questions,
  actions,
  doNotRules,
  verificationTasks,
} satisfies ProfessionContent;
