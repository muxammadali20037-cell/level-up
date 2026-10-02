import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: experimentation. Stage 2 placeholder. */
export const actions: ActionInput[] = [];
