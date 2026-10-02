import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: learning_objectives. */
export const actions: ActionInput[] = [];
