import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES } from "@/lib/i18n/text";
import * as copy from "./copy";
import { hasText, interpolateI18n, joinList } from "./i18n-format";

describe("interpolateI18n", () => {
  it("localizes I18nText values per locale and keeps literal values", () => {
    const out = interpolateI18n(
      { uz: "«{skill}» {n}", ru: "«{skill}» {n}", en: "{skill} {n}" },
      { skill: { uz: "Sotuv", ru: "Продажи", en: "Sales" }, n: 3 },
    );
    expect(out).toEqual({ uz: "«Sotuv» 3", ru: "«Продажи» 3", en: "Sales 3" });
  });

  it("joins lists with the locale conjunction and leaves unknown placeholders", () => {
    const names = [
      { uz: "Sotuv", ru: "Продажи", en: "Sales" },
      { uz: "Marketing", ru: "Маркетинг", en: "Marketing" },
    ];
    const out = interpolateI18n({ uz: "{list} {x}", ru: "{list}", en: "{list}", kk: "{list}" }, { list: names });
    expect(out.uz).toBe("Sotuv va Marketing {x}");
    expect(out.ru).toBe("Продажи и Маркетинг");
    expect(out.en).toBe("Sales and Marketing");
    expect(out.kk).toBe("Sales, Marketing"); // unknown locale → en fallback names, plain separator
  });

  it("joinList handles 0, 1 and 3 items", () => {
    expect(joinList([], "en")).toBe("");
    expect(joinList(["A"], "en")).toBe("A");
    expect(joinList(["A", "B", "C"], "en")).toBe("A, B and C");
  });

  it("hasText detects blank texts", () => {
    expect(hasText({ uz: " ", en: "" })).toBe(false);
    expect(hasText({ uz: "x" })).toBe(true);
    expect(hasText(null)).toBe(false);
  });
});

describe("roadmap copy", () => {
  const texts = [
    copy.LIMITATION_NO_SOURCES,
    copy.EVIDENCE_FROM_SOURCES,
    copy.REASON_BOTTLENECK_TEMPLATE,
    copy.REASON_FOCUS_TEMPLATE,
    copy.FOUNDATION_THEME_WITH_SKILL,
    ...Object.values(copy.WEEK_THEMES),
  ];

  it("is complete in uz/ru/en and Uzbek never uses an ASCII apostrophe", () => {
    for (const text of texts) {
      for (const locale of SUPPORTED_LOCALES) expect(text[locale]?.length ?? 0).toBeGreaterThan(0);
      expect(text.uz).not.toMatch(/['`‘’]/);
    }
    expect(copy.LIMITATION_NO_SOURCES.en).toBe("Based on LEVEL's skill model and your answers; not an external study.");
  });
});
