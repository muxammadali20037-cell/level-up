import { describe, expect, it } from "vitest";
import type { SkillEstimate } from "@/modules/scoring/domain/types";
import { bandForScore, bandSkills, pickStrongest, pickWeakest } from "./banding";
import type { ReportSkill, SkillBand } from "./types";

const rs = (skillId: string, score: number, band: SkillBand, measured = true): ReportSkill => ({
  skillId,
  score,
  band,
  measured,
  nItems: measured ? 2 : 0,
});

describe("bandForScore", () => {
  it("uses 40 / 60 without a next-level threshold", () => {
    expect([0, 39, 40, 59, 60, 100].map((s) => bandForScore(s))).toEqual([
      "weak",
      "weak",
      "ok",
      "ok",
      "strong",
      "strong",
    ]);
  });

  it("is weak below the next-level threshold and strong only from max(60, threshold)", () => {
    expect(bandForScore(44, 45)).toBe("weak");
    expect(bandForScore(50, 45)).toBe("ok");
    expect(bandForScore(65, 70)).toBe("weak");
    expect(bandForScore(70, 70)).toBe("strong");
    expect(bandForScore(35, 30)).toBe("weak"); // < 40 is always weak
  });

  it("is monotonic in score for any threshold", () => {
    const rank: Record<SkillBand, number> = { weak: 0, ok: 1, strong: 2 };
    for (const threshold of [undefined, 20, 45, 60, 75]) {
      for (let score = 1; score <= 100; score += 1) {
        expect(rank[bandForScore(score, threshold)]).toBeGreaterThanOrEqual(rank[bandForScore(score - 1, threshold)]);
      }
    }
  });
});

describe("bandSkills", () => {
  it("maps estimates to report skills, keeping order and measurement flags", () => {
    const estimates: SkillEstimate[] = [
      { skillId: "a", theta: 0, se: 0.4, score: 62, nItems: 3, measured: true },
      { skillId: "b", theta: 0, se: 0.8, score: 50, nItems: 0, measured: false },
    ];
    expect(bandSkills(estimates, { a: 65 })).toEqual([
      { skillId: "a", score: 62, band: "weak", measured: true, nItems: 3 },
      { skillId: "b", score: 50, band: "ok", measured: false, nItems: 0 },
    ]);
  });
});

describe("pickStrongest / pickWeakest", () => {
  const skills = [
    rs("a", 90, "strong", false),
    rs("b", 80, "strong"),
    rs("c", 80, "strong"),
    rs("d", 70, "strong"),
    rs("e", 55, "ok"),
    rs("f", 30, "weak"),
    rs("g", 20, "weak", false),
    rs("h", 35, "weak"),
    rs("i", 35, "weak"),
  ];
  const importance = { b: 0.1, c: 0.2, h: 0.1, i: 0.1 };

  it("prefers measured skills, then score, then importance, then id", () => {
    expect(pickStrongest(skills, importance)).toEqual(["c", "b", "d"]);
    expect(pickStrongest(skills, importance, 5)).toEqual(["c", "b", "d", "e", "a"]);
    expect(pickWeakest(skills, importance)).toEqual(["f", "h", "i"]);
    expect(pickWeakest(skills, importance, 4)).toEqual(["f", "h", "i", "g"]);
  });

  it("never mixes strong skills into weakest or weak skills into strongest (when alternatives exist)", () => {
    expect(pickWeakest([rs("x", 80, "strong"), rs("y", 50, "ok")], {})).toEqual(["y"]);
    expect(pickWeakest([rs("x", 80, "strong")], {})).toEqual([]);
    expect(pickStrongest([rs("x", 30, "weak"), rs("y", 45, "ok")], {})).toEqual(["y"]);
    expect(pickStrongest([rs("x", 30, "weak"), rs("y", 35, "weak")], {})).toEqual(["y", "x"]);
    expect(pickStrongest([], {})).toEqual([]);
  });

  it("drops excluded ids (the bottleneck) unless nothing else is left", () => {
    const allWeak = [rs("x", 39, "weak"), rs("y", 35, "weak"), rs("z", 10, "weak")];
    expect(pickStrongest(allWeak, {}, 3, ["x"])).toEqual(["y", "z"]);
    expect(pickStrongest([rs("x", 39, "weak")], {}, 3, ["x"])).toEqual(["x"]);
    expect(pickStrongest(skills, importance, 3, ["f"])).toEqual(["c", "b", "d"]); // weak ids are never in the pool
  });
});
