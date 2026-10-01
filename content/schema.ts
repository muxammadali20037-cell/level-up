/**
 * Content-as-code schema. Every profession lives in content/professions/<slug>/ and exports a
 * `ProfessionContent` object validated by `professionContentSchema`. `npm run content:validate` checks all
 * content; `npm run db:seed` upserts it idempotently (new question versions when a question changes).
 *
 * Cross-references inside a profession use slugs (skill slugs, specialization slugs). Global resources/sources
 * are referenced by their slug from content/evidence.
 */
import { z } from "zod";

export const LOCALES = ["uz", "ru", "en"] as const;

/** Every MVP string must exist in all three locales. */
export const i18nSchema = z.object({
  uz: z.string().min(1),
  ru: z.string().min(1),
  en: z.string().min(1),
});
export type I18n = z.infer<typeof i18nSchema>;

const slug = z.string().regex(/^[a-z][a-z0-9_]*$/, "snake_case slug");
const level = z.number().int().min(1).max(9);

export const experienceBandSchema = z.enum(["none", "lt1", "1to3", "3to5", "5plus"]);
export const goalTypeSchema = z.enum([
  "start",
  "find_job",
  "professional",
  "increase_income",
  "lead",
  "expert",
  "first_job",
  "manager",
  "build_business",
  "scale_business",
  "change_career",
]);

export const skillSchema = z.object({
  slug,
  globalSkillKey: slug.nullable(),
  name: i18nSchema,
  description: i18nSchema,
  kind: z.enum(["hard", "soft", "meta"]),
  importance: z.number().positive().max(1),
});

export const edgeSchema = z.object({
  from: slug,
  to: slug,
  relation: z.enum(["prerequisite", "limits", "enables"]),
  strength: z.number().min(0).max(1),
  /** Explanation used by the bottleneck engine, e.g. "Sales generate demand, but processes are not repeatable." */
  rationale: i18nSchema,
});

export const requirementSchema = z.object({
  type: z.enum(["composite_min", "skill_min", "verified_scenario", "practical_action", "experience_min"]),
  skill: slug.optional(),
  threshold: z.number().nullable(),
  gatesAssessed: z.boolean(),
  description: i18nSchema,
});

export const levelSchema = z.object({
  number: level,
  slug,
  name: i18nSchema,
  shortDescription: i18nSchema,
  meaning: i18nSchema,
  minComposite: z.number().min(0).max(100),
  requiresVerification: z.boolean(),
  requirements: z.array(requirementSchema),
});

export const optionSchema = z.object({
  key: z.string().regex(/^[a-e]$/),
  label: i18nSchema,
  /** 1 best, 0.5 acceptable, 0 poor (single_best: exactly one option with 1). */
  score: z.number().min(0).max(1),
});

const mediaSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("code"), language: z.string(), code: z.string().max(1200) }),
  z.object({
    kind: z.literal("table"),
    headers: z.array(i18nSchema).min(2).max(5),
    rows: z.array(z.array(z.string()).min(2).max(5)).min(1).max(8),
  }),
]);

export const questionSchema = z.object({
  /** Globally unique stable key: <profession>.<skill>.<nn>, e.g. "sales_specialist.discovery.03". */
  key: z.string().regex(/^[a-z_]+\.[a-z_]+\.\d{2}$/),
  skill: slug,
  /** Empty array = every specialization. */
  specializations: z.array(slug),
  type: z.enum(["knowledge", "judgment", "scenario", "decision", "self_report"]),
  targetLevel: level,
  /** IRT a; default 1.0 (self_report 0.5). */
  discrimination: z.number().min(0.3).max(2.5).optional(),
  scoringRule: z.enum(["single_best", "partial_credit", "likert"]),
  prompt: i18nSchema,
  scenario: i18nSchema.optional(),
  media: mediaSchema.optional(),
  options: z.array(optionSchema).min(2).max(5),
  /** Shown only after the assessment (learning mode / report), never during the test. */
  explanation: i18nSchema,
});

export const actionSchema = z.object({
  slug,
  skill: slug,
  title: i18nSchema,
  description: i18nSchema,
  kind: z.enum(["learn", "practice", "apply", "verify", "reflect"]),
  phase: z.enum(["foundation", "practice", "application", "verification"]),
  durationMinutes: z.number().int().min(5).max(120),
  minLevel: level,
  maxLevel: level,
  budget: z.enum(["free", "low", "medium", "high"]),
  successCriteria: i18nSchema,
  why: i18nSchema,
  /** Optional slugs from content/evidence/resources.ts — only real, verifiable resources. */
  resources: z.array(slug).default([]),
});

export const doNotRuleSchema = z.object({
  slug,
  skill: slug.optional(),
  condition: z.object({
    maxLevel: level.optional(),
    minLevel: level.optional(),
    /** Rule applies when ANY of these skills is weak. */
    weakSkills: z.array(slug).optional(),
    goalTypes: z.array(goalTypeSchema).optional(),
  }),
  message: i18nSchema,
  reason: i18nSchema,
});

export const contextQuestionSchema = z.object({
  key: slug,
  prompt: i18nSchema,
  options: z
    .array(
      z.object({
        key: slug,
        label: i18nSchema,
        /** Optional skill importance multipliers when this option is chosen. */
        skillBoosts: z.record(z.string(), z.number().min(0.5).max(2)).optional(),
        /** Optional suggested specialization slug. */
        suggestsSpecialization: slug.optional(),
      }),
    )
    .min(2)
    .max(6),
});

export const verificationTaskSchema = z.object({
  slug,
  skills: z.array(slug).min(1),
  levelNumber: level,
  type: z.enum(["coding", "simulation", "case", "portfolio", "exercise"]),
  title: i18nSchema,
  brief: i18nSchema,
  rubric: z.array(z.object({ criterion: i18nSchema, weight: z.number().positive() })).min(2),
});

export const specializationSchema = z.object({
  slug,
  name: i18nSchema,
  description: i18nSchema,
  /** skill slug → importance multiplier (missing = 1). */
  skillWeights: z.record(z.string(), z.number().min(0).max(3)),
});

export const professionContentSchema = z.object({
  slug,
  category: slug,
  name: i18nSchema,
  description: i18nSchema,
  sortOrder: z.number().int(),
  isRegulated: z.boolean(),
  disclaimer: i18nSchema.optional(),
  config: z
    .object({
      minQuestions: z.number().int().min(5).max(20),
      maxQuestions: z.number().int().min(7).max(30),
      targetQuestions: z.number().int().min(5).max(30),
      targetSe: z.number().positive(),
      retestCooldownDays: z.number().int().min(0),
      experienceCaps: z.record(experienceBandSchema, level),
      maxSelfReportItems: z.number().int().min(0).max(4),
      minScenarioLikeItems: z.number().int().min(0).max(8),
    })
    .partial()
    .optional(),
  specializations: z.array(specializationSchema),
  skills: z.array(skillSchema).min(6).max(12),
  edges: z.array(edgeSchema),
  /** Optional: overrides of the default level scheme (full list of 9 when provided). */
  levels: z.array(levelSchema).length(9).optional(),
  /** Requirements appended to the (default or overridden) level scheme, keyed by level number. */
  levelRequirements: z.record(z.string(), z.array(requirementSchema)).optional(),
  /** Up to 2 profession-specific context questions (asked after the 3 global ones). */
  contextQuestions: z.array(contextQuestionSchema).max(2).default([]),
  questions: z.array(questionSchema),
  actions: z.array(actionSchema),
  doNotRules: z.array(doNotRuleSchema),
  verificationTasks: z.array(verificationTaskSchema).default([]),
});

export type ProfessionContent = z.input<typeof professionContentSchema>;
export type ParsedProfessionContent = z.output<typeof professionContentSchema>;

export const categorySchema = z.object({
  slug,
  name: i18nSchema,
  description: i18nSchema,
  icon: z.string(),
  sortOrder: z.number().int(),
  isMvp: z.boolean(),
});
