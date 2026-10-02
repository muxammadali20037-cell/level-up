import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: subject_mastery. */
export const actions: ActionInput[] = [];
