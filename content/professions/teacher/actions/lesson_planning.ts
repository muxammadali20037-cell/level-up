import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: lesson_planning. */
export const actions: ActionInput[] = [];
