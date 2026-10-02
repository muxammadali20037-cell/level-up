/**
 * Scoring calibration study (docs/architecture/07a-scoring-calibration.md).
 *
 * Runs FULL adaptive sessions (selectNextQuestion → simulated true response → creditFor → scoring variant) over a
 * synthetic 10-skill bank for flat and uneven simulated respondents, and prints markdown tables per variant ×
 * truth scenario. Fully reproducible: every random draw comes from mulberry32 (src/modules/assessments/domain/rng.ts).
 *
 *   npx tsx scripts/calibration/simulate.ts [--variants V0,V1,…|EB:1.0:s|J:1.0:s:c] [--scenarios nominal,misspec]
 *                                           [--flat 40] [--uneven 80] [--seed 20261001] [--max 25] [--a 1.0]
 *                                           [--json out.json]
 *
 * --flat / --uneven: respondents per flat θ (5 values) / per uneven θ_g (3 values). Variant grammar: variants.ts.
 * --max N: extended assessment (maxQuestions = targetQuestions = N, targetSe 0.35 = the HIGH threshold) instead of
 * the default 7–15 (target 12) test.
 * --a A: discrimination of the tested items (default 1.0, the brief default; self_report stays 0.5).
 * Scenarios: nominal (true model = assumed a), misspec (true a = assumed a × (1 ± 0.4)), lowfloor (guessing floors
 * halved: attractive distractors).
 */
import { writeFileSync } from "node:fs";
import { deriveSeed } from "@/modules/assessments/domain";
import { DEFAULT_PROFESSION_CONFIG } from "@/modules/catalog/domain/types";
import { buildBank, SCENARIOS } from "./bank";
import { evaluate, type SessionMetrics } from "./evaluate";
import { makeRespondents } from "./respondents";
import { runSession, trueDiscriminations } from "./session";
import { mainTable, summarize, thetaTable, type VariantSummary } from "./summary";
import { NAMED, parseVariant } from "./variants";

interface Options {
  readonly variants: readonly string[];
  readonly scenarios: readonly string[];
  readonly perFlat: number;
  readonly perUneven: number;
  readonly seed: number;
  readonly json: string | null;
  /** Extended assessment: maxQuestions = targetQuestions = this (null = the 7–15 / 12 default test). */
  readonly maxItems: number | null;
  /** Discrimination of the tested items (assumed = true before misspecification). */
  readonly a: number;
}

function parseArgs(argv: readonly string[]): Options {
  const get = (name: string): string | undefined => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  return {
    variants: (get("variants") ?? Object.keys(NAMED).join(",")).split(","),
    scenarios: (get("scenarios") ?? "nominal,misspec").split(","),
    perFlat: Number(get("flat") ?? 40),
    perUneven: Number(get("uneven") ?? 80),
    seed: Number(get("seed") ?? 20261001),
    json: get("json") ?? null,
    maxItems: get("max") ? Number(get("max")) : null,
    a: Number(get("a") ?? 1),
  };
}

/** Runs one variant under one truth scenario for the whole population. */
export function runStudy(variantName: string, scenarioId: string, options: Options): VariantSummary {
  const model = parseVariant(variantName);
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) throw new Error(`Unknown scenario ${scenarioId}`);
  const bank = buildBank(model.guessing, options.a);
  const config = options.maxItems
    ? { ...DEFAULT_PROFESSION_CONFIG, maxQuestions: options.maxItems, targetQuestions: options.maxItems, targetSe: 0.35 }
    : DEFAULT_PROFESSION_CONFIG;
  // Same truth for every variant: true discriminations and respondents depend on the study seed only.
  const trueA = trueDiscriminations(bank, scenario, deriveSeed(options.seed, 1, 7));
  const respondents = makeRespondents(deriveSeed(options.seed, 2, 7), options.perFlat, options.perUneven);
  const rows: SessionMetrics[] = respondents.map((respondent) => {
    const sessionSeed = deriveSeed(options.seed, 1000 + respondent.id, 7);
    const session = runSession(model, bank, trueA, scenario, respondent, sessionSeed, config);
    return evaluate(respondent, session, model.tau);
  });
  return summarize(variantName, scenarioId, rows);
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const summaries: VariantSummary[] = [];
  for (const scenario of options.scenarios) {
    for (const variant of options.variants) {
      const started = Date.now();
      summaries.push(runStudy(variant, scenario, options));
      console.error(`${variant} × ${scenario}: ${((Date.now() - started) / 1000).toFixed(1)}s`);
    }
  }
  const length = options.maxItems ? `extended test, ${options.maxItems} items` : "default 7–15 item test";
  const head = `seed ${options.seed}; ${options.perFlat}×5 flat + ${options.perUneven}×3 uneven respondents`;
  console.log(`${head}; ${length}; item a = ${options.a}\n`);
  for (const variant of options.variants) {
    const spec = NAMED[variant];
    console.log(`- ${variant}: ${parseVariant(variant).description}${spec ? "" : " (ad hoc)"}`);
  }
  console.log(`\n${mainTable(summaries)}\n\n${thetaTable(summaries)}`);
  if (options.json) writeFileSync(options.json, JSON.stringify(summaries, null, 2));
}

main();
