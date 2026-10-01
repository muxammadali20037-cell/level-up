import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/i18n/text";
import { BOTTLENECK_EXPLANATION_TEMPLATES, EDUCATIONAL_DISCLAIMER, REGULATED_DISCLAIMER_FALLBACK } from "./copy";

describe("results copy", () => {
  const all = [EDUCATIONAL_DISCLAIMER, REGULATED_DISCLAIMER_FALLBACK, ...Object.values(BOTTLENECK_EXPLANATION_TEMPLATES)];

  it("is complete in uz/ru/en with Uzbek modifier letters (no ASCII apostrophes)", () => {
    for (const text of all) {
      for (const locale of SUPPORTED_LOCALES) expect(text[locale]?.trim().length ?? 0).toBeGreaterThan(0);
      expect(text.uz).not.toMatch(/['`‘’]/);
    }
    expect(EDUCATIONAL_DISCLAIMER.uz).toContain("taʼlimiy"); // U+02BC
    expect(EDUCATIONAL_DISCLAIMER.uz).toContain("koʻrsatadi"); // U+02BB
  });

  it("states educational-not-certification and level ≠ human value/intelligence", () => {
    expect(EDUCATIONAL_DISCLAIMER.en).toMatch(/not a professional certification/);
    expect(EDUCATIONAL_DISCLAIMER.en).toMatch(/not your value as a person or your intelligence/);
  });

  it("uses only the documented placeholders, and every locale has the same ones", () => {
    for (const template of Object.values(BOTTLENECK_EXPLANATION_TEMPLATES)) {
      const sets = SUPPORTED_LOCALES.map((l) => [...new Set(template[l]?.match(/\{\w+\}/g) ?? [])].sort().join());
      expect(new Set(sets).size).toBe(1);
      for (const ph of sets[0]?.split(",") ?? []) expect(["{skill}", "{limited}", "{unlocks}"]).toContain(ph);
    }
  });
});
