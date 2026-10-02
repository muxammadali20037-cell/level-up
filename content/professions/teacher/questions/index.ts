import type { z } from "zod";
import type { questionSchema } from "../../../schema";
import { questions as subjectMastery } from "./subject_mastery";
import { questions as lessonPlanning } from "./lesson_planning";
import { questions as learningObjectives } from "./learning_objectives";
import { questions as instructionalMethods } from "./instructional_methods";
import { questions as classroomManagement } from "./classroom_management";
import { questions as assessmentFeedback } from "./assessment_feedback";
import { questions as differentiation } from "./differentiation";
import { questions as studentMotivation } from "./student_motivation";
import { questions as communicationParents } from "./communication_parents";
import { questions as reflectivePractice } from "./reflective_practice";

type QuestionInput = z.input<typeof questionSchema>;

export const questions: QuestionInput[] = [
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
