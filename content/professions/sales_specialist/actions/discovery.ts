import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill "discovery". Authored in stage 2. */
export const actions: ActionInput[] = [];
