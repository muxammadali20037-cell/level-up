import { describe, expect, it } from "vitest";
import { FULL_REPORT_DISPLAY_PRICE, formatMajorAmount } from "./display-price";

const { amountMinor, minorUnits } = FULL_REPORT_DISPLAY_PRICE;

describe("formatMajorAmount", () => {
  it("formats 1,000 UZS per locale", () => {
    expect(formatMajorAmount("en", amountMinor, minorUnits)).toBe("1,000");
    expect(formatMajorAmount("uz", amountMinor, minorUnits).replace(/\s/g, " ")).toBe("1 000");
    expect(formatMajorAmount("ru", amountMinor, minorUnits).replace(/\s/g, " ")).toBe("1 000");
  });
});
