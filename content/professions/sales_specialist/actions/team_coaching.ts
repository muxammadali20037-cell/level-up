import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill "team_coaching". Authored in stage 2. */
export const actions: ActionInput[] = [];
