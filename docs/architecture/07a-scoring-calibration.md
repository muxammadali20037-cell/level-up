# 07a — Scoring calibration study

Status: decided before launch. The chosen parameters ARE `irt3pl-eap-hier-v1` (nothing has shipped).
Harness: `scripts/calibration/simulate.ts` (fully seeded, reproducible).

```bash
npx tsx scripts/calibration/simulate.ts --variants V0,V5 --scenarios nominal,misspec --flat 30 --uneven 60
npx tsx scripts/calibration/simulate.ts --variants V5 --scenarios nominal --flat 20 --uneven 40 --max 25
```

## Why

The first engine flattened uneven skill profiles. Example: true skills +1.5 and −1.5 (43 points apart) came out
about 13 points apart. That undermines the product's core story ("strongest skill vs. bottleneck"). A level range
("Level 4–5") was also reported on ~86% of results, which made it meaningless.

## Setup

Full adaptive sessions (`selectNextQuestion` → simulated response → `creditFor` → scoring variant) over a synthetic
10-skill × 5-item bank with a realistic type mix (knowledge, scenario/judgment with partial credit, decision,
self-report). Respondents: flat profiles θ ∈ {−2, −1, 0, 1, 2}; uneven profiles (θ_g ∈ {−1, 0, 1}, two strong
skills +1.2..+1.8, two weak skills −1.2..−1.8, one weak skill designed as a `limits` bottleneck of a strong skill).
Experience priors are drawn plausibly from true θ with noise. A misspecified scenario perturbs true discrimination
by ±40% to guard against over-fitting the simulator.

## Results (seed 20261001, 30×5 flat + 60×3 uneven respondents, 7–15 item test)

| variant | scenario | composite RMSE | level exact / ±1 | skill rank corr. | gap kept (est/true) | bottleneck hit | range shown |
|---|---|---|---|---|---|---|---|
| V0 (old: plug-in EB, τ = 0.8) | nominal | 6.8 | 56% / 97% | 0.37 | 4.0 / 42.7 (9%) | 21% | 86% (old rule) |
| **V5 (chosen: joint posterior, τ = 1.5)** | nominal | 6.8 | 53% / 96% | 0.37 | 9.7 / 42.7 (23%) | 31% | 22% (new rule) |
| V0 | misspec | 7.1 | 54% / 97% | 0.29 | 3.4 / 42.7 (8%) | 21% | 87% |
| **V5** | misspec | 7.2 | 53% / 97% | 0.33 | 8.5 / 42.7 (20%) | 32% | 21% |

Extended assessment (25 items, V5): composite RMSE 6.0, level exact/±1 58%/98%, gap kept 33%, bottleneck hit 37%,
confidence 0% HIGH / 87% MEDIUM / 13% LOW.

The "oracle" bottleneck hit-rate (bottleneck engine run on TRUE skill scores) is ~70–72%; that is the ceiling of
the dependency-graph rule itself.

## Decision

- Joint two-level posterior on the θ grid: θ_g ~ N(μ0(experience), 1²), θ_s | θ_g ~ N(θ_g, τ²), τ = 1.5.
- Guessing `c = 1/n` for single_best and partial_credit items, 0 for likert/open (`guessingFor`).
- SE_g for the stop rule and confidence = posterior SD of the unidimensional EAP.
- Range is shown only when the user is close to the NEXT attainable level:
  composite ≥ minComposite(L+1) − min(compositeSe / 2, 2.5). Never a lower-side range.
- Confidence thresholds are unchanged. HIGH (n ≥ 12, SE_g ≤ 0.35) is not reachable from questions alone even at 25
  items (min SE_g ≈ 0.37). HIGH is therefore reserved for results backed by verification. MEDIUM is the honest normal
  outcome of the test, matching the product copy "Level 4 natijangiz Medium Confidence".

## Honest limitations (product implications)

1. A 7–15 item test over ~10 skills measures individual skills weakly (rank correlation ≈ 0.37). The overall level
   is reliable (±1 level for 96–98% of respondents); individual skill bars are indicative.
   - UI shows per-skill confidence and never claims precision it does not have.
   - The bottleneck explanation comes from the dependency graph plus the scores, and is presented as
     "most likely bottleneck".
2. Improvement paths, in order of expected value:
   - focus each test on the 6–8 most important skills for the user's specialization and goal;
   - the extended assessment (Deep Report) and retests accumulate evidence per skill over time;
   - verification tasks are the only route to HIGH confidence and the VERIFIED badge;
   - re-calibrate item parameters from real response data once ~200 completions per profession exist
     (any change ⇒ new `SCORING_MODEL_VERSION`; historical results are never silently re-scored).
3. Strong users with "no experience" answers are capped by the experience cap (Level 4) by design.
   Verification lifts this.
