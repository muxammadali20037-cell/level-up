import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

export const verificationTasks: VerificationTaskInput[] = [];
