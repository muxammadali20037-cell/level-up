import type { z } from "zod";
import type { actionSchema } from "../../../schema";
import { actions as subjectMastery } from "./subject_mastery";
import { actions as lessonPlanning } from "./lesson_planning";
import { actions as learningObjectives } from "./learning_objectives";
import { actions as instructionalMethods } from "./instructional_methods";
import { actions as classroomManagement } from "./classroom_management";
import { actions as assessmentFeedback } from "./assessment_feedback";
import { actions as differentiation } from "./differentiation";
import { actions as studentMotivation } from "./student_motivation";
import { actions as communicationParents } from "./communication_parents";
import { actions as reflectivePractice } from "./reflective_practice";

type ActionInput = z.input<typeof actionSchema>;

export const actions: ActionInput[] = [
  ...subjectMastery,
  ...lessonPlanning,
  ...learningObjectives,
  ...instructionalMethods,
  ...classroomManagement,
  ...assessmentFeedback,
  ...differentiation,
  ...studentMotivation,
  ...communicationParents,
  ...reflectivePractice,
];
