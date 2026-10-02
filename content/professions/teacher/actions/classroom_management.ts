import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: classroom_management. */
export const actions: ActionInput[] = [];
