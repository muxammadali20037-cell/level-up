import { describe, expect, it } from "vitest";
import type { SkillEdge } from "@/modules/catalog/domain/types";
import { orderFocusSkills, prerequisiteDescendants, prerequisiteOrder } from "./topo";

const pre = (from: string, to: string, strength = 0.7): SkillEdge => ({ from, to, relation: "prerequisite", strength });
const chain: SkillEdge[] = [pre("git", "sql"), pre("sql", "api"), pre("api", "testing")];

describe("prerequisiteOrder", () => {
  it("puts prerequisites first regardless of input order", () => {
    expect(prerequisiteOrder(["testing", "api", "sql", "git"], chain)).toEqual(["git", "sql", "api", "testing"]);
  });

  it("respects transitive prerequisites through skills outside the set", () => {
    expect(prerequisiteOrder(["api", "git"], chain)).toEqual(["git", "api"]);
  });

  it("keeps the input order for unrelated skills (stable)", () => {
    expect(prerequisiteOrder(["b", "api", "a", "sql"], chain)).toEqual(["b", "a", "sql", "api"]);
  });

  it("ignores non-prerequisite relations and zero-strength edges", () => {
    const edges: SkillEdge[] = [
      { from: "x", to: "y", relation: "limits", strength: 0.9 },
      { from: "x", to: "y", relation: "enables", strength: 0.9 },
      pre("x", "y", 0),
    ];
    expect(prerequisiteOrder(["y", "x"], edges)).toEqual(["y", "x"]);
  });

  it("breaks cycles deterministically and still returns every skill once", () => {
    const cyclic = [pre("a", "b"), pre("b", "c"), pre("c", "a"), pre("z", "a")];
    const first = prerequisiteOrder(["c", "b", "a", "z", "c"], cyclic);
    expect(first).toEqual(prerequisiteOrder(["c", "b", "a", "z"], cyclic));
    expect([...first].sort()).toEqual(["a", "b", "c", "z"]);
    expect(first[0]).toBe("z");
  });
});

describe("prerequisiteDescendants", () => {
  it("returns all transitive dependents", () => {
    expect([...prerequisiteDescendants("git", chain)].sort()).toEqual(["api", "sql", "testing"]);
    expect(prerequisiteDescendants("testing", chain).size).toBe(0);
  });
});

describe("orderFocusSkills", () => {
  it("puts the bottleneck first, then the rest by prerequisite order with gap as tie-break", () => {
    const order = orderFocusSkills({
      bottleneckSkillId: "architecture",
      weakSkillIds: ["testing", "api", "architecture", "sql", "design"],
      edges: chain,
      gaps: { testing: 35, api: 32, sql: 28, design: 40, architecture: 25 },
    });
    expect(order).toEqual(["architecture", "design", "sql", "api", "testing"]);
  });

  it("works without a bottleneck", () => {
    expect(orderFocusSkills({ bottleneckSkillId: null, weakSkillIds: ["b", "a"], edges: [], gaps: {} })).toEqual([
      "a",
      "b",
    ]);
  });
});
