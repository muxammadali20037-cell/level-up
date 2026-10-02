import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill `decision_making` — stage 2. */
export const actions: ActionInput[] = [];
