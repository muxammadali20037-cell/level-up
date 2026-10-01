import { describe, expect, it } from "vitest";
import { interpolate, localize } from "./text";

describe("localize", () => {
  it("returns the requested locale when present", () => {
    expect(localize({ uz: "Salom", ru: "Привет", en: "Hello" }, "ru")).toBe("Привет");
  });
  it("falls back to en then uz", () => {
    expect(localize({ uz: "Salom", en: "Hello" }, "kk")).toBe("Hello");
    expect(localize({ uz: "Salom" }, "ru")).toBe("Salom");
  });
  it("returns empty string for missing text", () => {
    expect(localize(null, "uz")).toBe("");
  });
});

describe("interpolate", () => {
  it("replaces known placeholders and keeps unknown ones", () => {
    expect(interpolate("LEVEL {n} · {x}", { n: 4 })).toBe("LEVEL 4 · {x}");
  });
});
