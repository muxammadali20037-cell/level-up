import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Skill: assessment_readiness. Never instruct the user to drive or teach on public roads (§14.1 rule 3). */
export const actions: ActionInput[] = [];
