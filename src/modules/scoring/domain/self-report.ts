import type { AnsweredItem } from "@/modules/assessments/domain/types";
import { eapEstimate } from "./eap";
import { DEFAULT_PRIOR_SD, DEFAULT_TAU } from "./estimate";
import { probability } from "./irt";
import { unitInterval } from "./numeric";
import type { NormalPrior } from "./types";

/** Fields of an answered item the self-report check reads. */
export type SelfReportGapItem = Pick<
  AnsweredItem,
  "skillId" | "type" | "credit" | "difficulty" | "discrimination" | "guessing" | "weight"
>;

export interface SelfReportGapOptions {
  /** Prior mean of general ability (EXPERIENCE_PRIOR_MEAN[experience]), as in the main estimate. */
  readonly priorMean: number;
  /** Default DEFAULT_PRIOR_SD (1.0). */
  readonly priorSd?: number;
  /** SD of a skill ability around general ability. Default DEFAULT_TAU (1.5). */
  readonly tau?: number;
}

/**
 * Model-based self-report consistency check (brief §7 "self-report consistency", AC-F07-04):
 *
 *   θ̂_g      = EAP over the TESTED (non-self_report) items, prior N(priorMean, priorSd²)
 *   θ̂_s      = EAP over the tested items of skill s, prior N(θ̂_g, τ²)   (θ̂_g when s has no tested item)
 *   expected = mean over self_report items i of P_i(θ̂_{s(i)})            (the item's own a, b, c)
 *   gap      = | mean over self_report items of x_i − expected |
 *
 * i.e. how far the self-ratings are from what the tested answers predict for those same self-report items. Raw
 * credit means are NOT compared: adaptive routing targets tested items at ~50–65% success for everybody, while a
 * self-report item's credit depends on how hard it is relative to the person, so a raw comparison measures item
 * difficulty instead of inconsistency and would flag honest respondents. Self-report answers never enter θ̂ here.
 *
 * Returns null when there is no self_report item or no tested item (nothing to compare). Credits are clamped to
 * [0, 1]. Deterministic; the result is in [0, 1].
 */
export function computeSelfReportGap(
  items: readonly SelfReportGapItem[],
  options: SelfReportGapOptions,
): number | null {
  const selfReports = items.filter((item) => item.type === "self_report");
  const tested = items.filter((item) => item.type !== "self_report");
  if (selfReports.length === 0 || tested.length === 0) return null;

  const general = eapEstimate(tested, { mean: options.priorMean, sd: options.priorSd ?? DEFAULT_PRIOR_SD });
  const skillPrior: NormalPrior = { mean: general.theta, sd: options.tau ?? DEFAULT_TAU };
  const thetaBySkill = new Map<string, number>();
  const thetaFor = (skillId: string): number => {
    const cached = thetaBySkill.get(skillId);
    if (cached !== undefined) return cached;
    const skillItems = tested.filter((item) => item.skillId === skillId);
    const theta = skillItems.length > 0 ? eapEstimate(skillItems, skillPrior).theta : general.theta;
    thetaBySkill.set(skillId, theta);
    return theta;
  };

  let observed = 0;
  let expected = 0;
  for (const item of selfReports) {
    observed += unitInterval(item.credit);
    expected += probability(thetaFor(item.skillId), item);
  }
  return Math.abs(observed - expected) / selfReports.length;
}
