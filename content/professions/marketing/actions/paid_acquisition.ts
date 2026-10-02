import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: paid_acquisition. Stage 2 placeholder. */
export const actions: ActionInput[] = [];
