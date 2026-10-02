import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill `self_awareness_direction`. */
export const actions: ActionInput[] = [];
