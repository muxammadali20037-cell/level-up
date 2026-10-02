import type { z } from "zod";
import type { actionSchema } from "../../../schema";

export type ActionInput = z.input<typeof actionSchema>;
