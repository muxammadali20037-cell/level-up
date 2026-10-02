/** Aggregates per-session metrics into the study tables (markdown). */
import type { SessionMetrics } from "./evaluate";

export interface VariantSummary {
  readonly variant: string;
  readonly scenario: string;
  readonly sessions: number;
  /** Composite (score points) RMSE / bias over all sessions. */
  readonly rmse: number;
  readonly bias: number;
  /** RMSE / bias per flat θ and per uneven θ_g (keys "flat:-2" … "uneven:1"). */
  readonly byTheta: Readonly<Record<string, { rmse: number; bias: number; n: number }>>;
  readonly levelExact: number;
  readonly levelWithin1: number;
  readonly spearman: number;
  readonly gapTrue: number;
  readonly gapEstimated: number;
  readonly gapRatio: number;
  readonly bottleneckHit: number;
  readonly oracleBottleneckHit: number;
  readonly strongestHit: number;
  readonly spuriousSpread: number;
  readonly designedMeasured: number;
  /** RMSE of skill scores vs true skill scores, all respondents (score points). */
  readonly skillRmse: number;
  readonly meanLength: number;
  readonly rangeShare: number;
  readonly oldRangeShare: number;
  readonly confidence: Readonly<Record<"high" | "medium" | "low", number>>;
  /** n ≥ 12 and SE_g ≤ 0.35 (before downgrades). */
  readonly highPrecision: number;
  readonly meanSeG: number;
  readonly minSeG: number;
  /** Profile-preservation index: (Spearman + min(gap ratio, 1) + bottleneck hit) / 3. */
  readonly profileIndex: number;
}

const mean = (xs: readonly number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const share = <T>(xs: readonly T[], pred: (x: T) => boolean): number =>
  xs.length ? xs.filter(pred).length / xs.length : NaN;

function errorStats(rows: readonly SessionMetrics[]): { rmse: number; bias: number; n: number } {
  const errors = rows.map((r) => r.composite - r.trueComposite);
  return { rmse: Math.sqrt(mean(errors.map((e) => e * e))), bias: mean(errors), n: rows.length };
}

export function summarize(variant: string, scenario: string, rows: readonly SessionMetrics[]): VariantSummary {
  const uneven = rows.filter((r) => r.respondent.kind === "uneven");
  const flat = rows.filter((r) => r.respondent.kind === "flat");
  const byTheta: Record<string, { rmse: number; bias: number; n: number }> = {};
  for (const r of rows) {
    const key = `${r.respondent.kind}:${r.respondent.thetaG}`;
    if (!byTheta[key]) {
      byTheta[key] = errorStats(rows.filter((x) => `${x.respondent.kind}:${x.respondent.thetaG}` === key));
    }
  }
  const all = errorStats(rows);
  const gapTrue = mean(uneven.map((r) => r.gapTrue ?? 0));
  const gapEstimated = mean(uneven.map((r) => r.gapEstimated ?? 0));
  const spearman = mean(uneven.map((r) => r.spearman ?? 0));
  const bottleneckHit = share(uneven, (r) => r.bottleneck === r.respondent.bottleneck);
  const gapRatio = gapEstimated / gapTrue;
  return {
    variant,
    scenario,
    sessions: rows.length,
    rmse: all.rmse,
    bias: all.bias,
    byTheta,
    levelExact: share(rows, (r) => r.level === r.trueLevel),
    levelWithin1: share(rows, (r) => Math.abs(r.level - r.trueLevel) <= 1),
    spearman,
    gapTrue,
    gapEstimated,
    gapRatio,
    bottleneckHit,
    oracleBottleneckHit: share(uneven, (r) => r.oracleBottleneck === r.respondent.bottleneck),
    strongestHit: share(uneven, (r) => r.strongestHit === true),
    spuriousSpread: mean(flat.map((r) => r.spuriousSpread ?? 0)),
    designedMeasured: mean(uneven.map((r) => r.designedMeasured ?? 0)),
    skillRmse: Math.sqrt(mean(rows.map((r) => r.skillSquaredError))),
    meanLength: mean(rows.map((r) => r.n)),
    rangeShare: share(rows, (r) => r.range),
    oldRangeShare: share(rows, (r) => r.oldRange),
    confidence: {
      high: share(rows, (r) => r.confidence === "high"),
      medium: share(rows, (r) => r.confidence === "medium"),
      low: share(rows, (r) => r.confidence === "low"),
    },
    highPrecision: share(rows, (r) => r.highPrecision),
    meanSeG: mean(rows.map((r) => r.seG)),
    minSeG: Math.min(...rows.map((r) => r.seG)),
    profileIndex: (spearman + Math.min(gapRatio, 1) + bottleneckHit) / 3,
  };
}

const f = (x: number, digits = 2): string => (Number.isFinite(x) ? x.toFixed(digits) : "–");
const pct = (x: number): string => (Number.isFinite(x) ? `${Math.round(x * 100)}%` : "–");

/** Main comparison table (one row per variant × scenario). */
export function mainTable(summaries: readonly VariantSummary[]): string {
  const head =
    "| variant | scenario | RMSE | bias | level exact | ±1 | Spearman | gap est/true | gap ratio | bottleneck hit " +
    "| strongest hit | skill RMSE | flat spread | strong/weak measured | length | range (new/old) | HIGH / MED / LOW | n≥12&SE≤.35 | mean (min) SE_g | profile idx |";
  const sep = `|${head.split("|").slice(1, -1).map(() => "---").join("|")}|`;
  const rows = summaries.map((s) =>
    [
      s.variant,
      s.scenario,
      f(s.rmse, 1),
      f(s.bias, 1),
      pct(s.levelExact),
      pct(s.levelWithin1),
      f(s.spearman),
      `${f(s.gapEstimated, 1)}/${f(s.gapTrue, 1)}`,
      f(s.gapRatio),
      `${pct(s.bottleneckHit)} (oracle ${pct(s.oracleBottleneckHit)})`,
      pct(s.strongestHit),
      f(s.skillRmse, 1),
      f(s.spuriousSpread, 1),
      pct(s.designedMeasured),
      f(s.meanLength, 1),
      `${pct(s.rangeShare)}/${pct(s.oldRangeShare)}`,
      `${pct(s.confidence.high)} / ${pct(s.confidence.medium)} / ${pct(s.confidence.low)}`,
      pct(s.highPrecision),
      `${f(s.meanSeG)} (${f(s.minSeG)})`,
      f(s.profileIndex, 3),
    ].join(" | "),
  );
  return [head, sep, ...rows.map((r) => `| ${r} |`)].join("\n");
}

/** Composite RMSE / bias per true θ (one row per variant × scenario). */
export function thetaTable(summaries: readonly VariantSummary[]): string {
  const keys = Object.keys(summaries[0]?.byTheta ?? {});
  const head = `| variant | scenario | ${keys.map((k) => `${k} RMSE (bias)`).join(" | ")} |`;
  const sep = `|---|---|${keys.map(() => "---").join("|")}|`;
  const rows = summaries.map(
    (s) =>
      `| ${s.variant} | ${s.scenario} | ${keys
        .map((k) => {
          const e = s.byTheta[k];
          return e ? `${f(e.rmse, 1)} (${f(e.bias, 1)})` : "–";
        })
        .join(" | ")} |`,
  );
  return [head, sep, ...rows].join("\n");
}
