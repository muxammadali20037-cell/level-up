import type { z } from "zod";
import type { verificationTaskSchema } from "../../schema";

export type VerificationTaskInput = z.input<typeof verificationTaskSchema>;

/**
 * Verification tasks (§11.6). MVP requires `v5_scenario_brief_challenge` (case, hybrid + human); slugs referenced
 * by levels.ts: v5_scenario_brief_challenge, v7_scenario_redesign_critique, v8_scenario_client_defense,
 * v8_portfolio_review, v9_scenario_design_system_case, v9_portfolio_body_of_work. Authored in a later stage.
 */
export const verificationTasks: VerificationTaskInput[] = [];
