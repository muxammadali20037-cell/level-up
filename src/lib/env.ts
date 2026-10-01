import { z } from "zod";

/**
 * Server environment. Parsed lazily so that unit tests and scripts only need the variables they use.
 * Secrets live only in env (never in the database or client bundles).
 */
const booleanish = z
  .enum(["true", "false", "1", "0"])
  .optional()
  .transform((v) => v === "true" || v === "1");

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(5),
  SESSION_SECRET: z.string().min(32),
  HASH_SALT: z.string().min(16),
  ADMIN_PASSWORD: z.string().min(12).optional(),

  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_BOT_USERNAME: z.string().optional(),
  TELEGRAM_MINI_APP_SHORT_NAME: z.string().optional(),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),

  PAYMENTS_MOCK_ENABLED: booleanish,
  CLICK_SERVICE_ID: z.string().optional(),
  CLICK_MERCHANT_ID: z.string().optional(),
  CLICK_MERCHANT_USER_ID: z.string().optional(),
  CLICK_SECRET_KEY: z.string().optional(),
  PAYME_MERCHANT_ID: z.string().optional(),
  PAYME_KEY: z.string().optional(),
  PAYME_TEST_MODE: booleanish,

  AI_PROVIDER: z.enum(["anthropic", "none"]).default("none"),
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional(),

  SUPABASE_URL: z.url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function env(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid server environment: ${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/** For tests only. */
export function resetEnvCache(): void {
  cached = null;
}

export const isProduction = (): boolean => process.env.NODE_ENV === "production";
