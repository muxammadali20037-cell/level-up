import { describe, expect, it } from "vitest";
import { mulberry32 as referenceMulberry32 } from "@/modules/scoring/domain/test-fixtures";
import { deriveSeed, mulberry32, RNG_STREAM, seededShuffle } from "./rng";

describe("mulberry32", () => {
  it("matches the published reference sequence for seed 42", () => {
    const next = mulberry32(42);
    expect(next()).toBe(0.6011037519201636);
    expect(next()).toBe(0.44829055899754167);
    expect(next()).toBe(0.8524657934904099);
  });

  it("agrees with an independent implementation over many draws", () => {
    for (const seed of [0, 1, 7, 123456789, 0xffffffff]) {
      const ours = mulberry32(seed);
      const reference = referenceMulberry32(seed);
      for (let i = 0; i < 200; i += 1) expect(ours()).toBe(reference());
    }
  });

  it("stays in [0, 1) and is roughly uniform", () => {
    const next = mulberry32(2024);
    const buckets = new Array<number>(10).fill(0);
    let sum = 0;
    const draws = 20000;
    for (let i = 0; i < draws; i += 1) {
      const u = next();
      expect(u).toBeGreaterThanOrEqual(0);
      expect(u).toBeLessThan(1);
      sum += u;
      buckets[Math.floor(u * 10)] = (buckets[Math.floor(u * 10)] ?? 0) + 1;
    }
    expect(sum / draws).toBeCloseTo(0.5, 1);
    for (const count of buckets) expect(Math.abs(count - draws / 10)).toBeLessThan(draws / 10 / 5);
  });

  it("treats non-finite seeds as 0 and reduces seeds modulo 2^32", () => {
    expect(mulberry32(Number.NaN)()).toBe(mulberry32(0)());
    expect(mulberry32(2 ** 32 + 5)()).toBe(mulberry32(5)());
  });
});

describe("deriveSeed", () => {
  it("is deterministic and returns unsigned 32-bit integers", () => {
    expect(deriveSeed(42, 0)).toBe(153049355);
    expect(deriveSeed(42, 1)).toBe(3746427653);
    expect(deriveSeed(42, 0, RNG_STREAM.optionOrder)).toBe(987554529);
    for (let sequence = 0; sequence < 50; sequence += 1) {
      const seed = deriveSeed(987654321, sequence);
      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(2 ** 32);
      expect(deriveSeed(987654321, sequence)).toBe(seed);
    }
  });

  it("defaults to the routing stream", () => {
    expect(deriveSeed(42, 3)).toBe(deriveSeed(42, 3, RNG_STREAM.routing));
  });

  it("separates sequences, streams and sessions (no collisions in a sample)", () => {
    const seeds = new Set<number>();
    for (let session = 0; session < 20; session += 1) {
      for (let sequence = 0; sequence < 20; sequence += 1) {
        for (const stream of [RNG_STREAM.routing, RNG_STREAM.optionOrder]) seeds.add(deriveSeed(session, sequence, stream));
      }
    }
    expect(seeds.size).toBe(20 * 20 * 2);
  });

  it("uses the high bits of 63-bit database seeds", () => {
    expect(deriveSeed(2 ** 40 + 42, 0)).not.toBe(deriveSeed(42, 0));
    expect(deriveSeed(2 ** 40 + 42, 0)).toBe(4151915291);
  });
});

describe("seededShuffle", () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8] as const;

  it("returns a deterministic permutation without mutating the input", () => {
    const input = [...items];
    const shuffled = seededShuffle(input, 7);
    expect(shuffled).toEqual([5, 7, 2, 3, 4, 6, 8, 1]);
    expect(input).toEqual([...items]);
    expect([...shuffled].sort((a, b) => a - b)).toEqual([...items]);
    expect(seededShuffle(input, 7)).toEqual(shuffled);
  });

  it("handles empty and single-item arrays", () => {
    expect(seededShuffle([], 1)).toEqual([]);
    expect(seededShuffle(["x"], 1)).toEqual(["x"]);
  });

  it("produces every permutation of three items with roughly equal frequency", () => {
    const counts = new Map<string, number>();
    const trials = 6000;
    for (let seed = 0; seed < trials; seed += 1) {
      const key = seededShuffle(["a", "b", "c"], deriveSeed(99, seed)).join("");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    expect(counts.size).toBe(6);
    for (const count of counts.values()) expect(Math.abs(count - trials / 6)).toBeLessThan(trials / 6 / 5);
  });
});
