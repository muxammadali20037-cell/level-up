import type { SkillEdge } from "@/modules/catalog/domain/types";
import { compareStrings } from "./compare";

function uniqueIds(ids: readonly string[]): string[] {
  return [...new Set(ids)];
}

/** Adjacency of `prerequisite` edges (from → [to]) over the full graph; self-loops and zero-strength edges ignored. */
function prerequisiteAdjacency(edges: readonly SkillEdge[]): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    if (edge.relation !== "prerequisite" || edge.from === edge.to || edge.strength <= 0) continue;
    const list = adjacency.get(edge.from) ?? [];
    if (!list.includes(edge.to)) list.push(edge.to);
    adjacency.set(edge.from, list);
  }
  return adjacency;
}

/** All skills reachable from `start` via prerequisite edges (excluding `start` itself unless on a cycle). */
export function prerequisiteDescendants(start: string, edges: readonly SkillEdge[]): Set<string> {
  const adjacency = prerequisiteAdjacency(edges);
  const seen = new Set<string>();
  const stack = [...(adjacency.get(start) ?? [])];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node === undefined || seen.has(node)) continue;
    seen.add(node);
    stack.push(...(adjacency.get(node) ?? []));
  }
  return seen;
}

/**
 * Stable topological order of `skillIds` by `prerequisite` edges (prerequisites first).
 *
 * - Ordering constraints are TRANSITIVE over the full graph: if git → sql → api and only {git, api} are given,
 *   git still precedes api.
 * - Stable: among skills whose prerequisites are all placed, the earliest in the input order goes next, so the
 *   caller's priority order is kept wherever the graph allows.
 * - Cycles are broken deterministically: when no skill is free, the one with the fewest unplaced prerequisites
 *   (ties: earliest in input order) is placed next.
 * Duplicate ids are dropped (first occurrence wins).
 */
export function prerequisiteOrder(skillIds: readonly string[], edges: readonly SkillEdge[]): string[] {
  const ids = uniqueIds(skillIds);
  const inSet = new Set(ids);
  const preds = new Map<string, Set<string>>(ids.map((id) => [id, new Set<string>()]));
  for (const id of ids) {
    for (const descendant of prerequisiteDescendants(id, edges)) {
      if (descendant !== id && inSet.has(descendant)) preds.get(descendant)?.add(id);
    }
  }
  const placed = new Set<string>();
  const order: string[] = [];
  while (order.length < ids.length) {
    let best: string | null = null;
    let bestUnplaced = Number.POSITIVE_INFINITY;
    for (const id of ids) {
      if (placed.has(id)) continue;
      let unplaced = 0;
      for (const pred of preds.get(id) ?? []) if (!placed.has(pred)) unplaced += 1;
      if (unplaced < bestUnplaced) {
        best = id;
        bestUnplaced = unplaced;
        if (unplaced === 0) break;
      }
    }
    if (best === null) break;
    placed.add(best);
    order.push(best);
  }
  return order;
}

export interface FocusOrderInput {
  readonly bottleneckSkillId: string | null;
  readonly weakSkillIds: readonly string[];
  readonly edges: readonly SkillEdge[];
  /** Gap to target per skill (score points or 0..1 — only the order matters); larger gap = higher priority. */
  readonly gaps: Readonly<Record<string, number>>;
}

/**
 * Priority order of weak skills for recommendations: bottleneck first, then the remaining weak skills in
 * prerequisite order, using gap (desc, ties by id) as the stable base order.
 */
export function orderFocusSkills(input: FocusOrderInput): string[] {
  const rest = uniqueIds(input.weakSkillIds)
    .filter((id) => id !== input.bottleneckSkillId)
    .sort((a, b) => (input.gaps[b] ?? 0) - (input.gaps[a] ?? 0) || compareStrings(a, b));
  const ordered = prerequisiteOrder(rest, input.edges);
  return input.bottleneckSkillId ? [input.bottleneckSkillId, ...ordered] : ordered;
}
