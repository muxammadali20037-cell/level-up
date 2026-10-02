import type { z } from "zod";
import type { actionSchema } from "../../../schema";

type ActionInput = z.input<typeof actionSchema>;

/** Actions for skill `digital_literacy`. */
export const actions: ActionInput[] = [];
