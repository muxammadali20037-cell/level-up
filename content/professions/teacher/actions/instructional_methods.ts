import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: instructional_methods. */
export const actions: ActionInput[] = [];
