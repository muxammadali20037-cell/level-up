import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill `written_communication`. */
export const actions: ActionInput[] = [];
