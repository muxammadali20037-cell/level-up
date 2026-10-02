import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: reflective_practice. */
export const actions: ActionInput[] = [];
