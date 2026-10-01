import { describe, expect, it } from "vitest";
import { telegramColorScheme, telegramThemeVars } from "@/lib/telegram/theme";

function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    const ch = (v: number) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * ch((n >> 16) & 255) + 0.7152 * ch((n >> 8) & 255) + 0.0722 * ch(n & 255);
  };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Telegram default theme params (Android light, iOS light, iOS dark). */
const ANDROID_LIGHT = {
  bg_color: "#ffffff",
  text_color: "#222222",
  hint_color: "#a8a8a8",
  button_color: "#50a8eb",
  button_text_color: "#ffffff",
  secondary_bg_color: "#f0f0f0",
  section_bg_color: "#ffffff",
};
const IOS_LIGHT = { ...ANDROID_LIGHT, text_color: "#000000", hint_color: "#999999", button_color: "#2481cc", secondary_bg_color: "#efeff3" };
const IOS_DARK = {
  bg_color: "#000000",
  text_color: "#ffffff",
  hint_color: "#98989e",
  button_color: "#3e88f7",
  button_text_color: "#ffffff",
  secondary_bg_color: "#1c1c1d",
  section_bg_color: "#2c2c2e",
};

describe("telegramThemeVars", () => {
  it.each([
    ["android light", ANDROID_LIGHT],
    ["ios light", IOS_LIGHT],
    ["ios dark", IOS_DARK],
  ])("keeps every adopted text color ≥ 4.5:1 (%s)", (_name, params) => {
    const vars = telegramThemeVars(params);
    const surfaces = [vars["--background"], vars["--card"], vars["--muted"]].filter(Boolean) as string[];
    expect(surfaces.length).toBeGreaterThan(0);
    for (const surface of surfaces) {
      for (const token of ["--foreground", "--muted-foreground"] as const) {
        expect(contrast(vars[token] ?? "", surface), `${token} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
      if (vars["--primary"]) expect(contrast(vars["--primary"], surface)).toBeGreaterThanOrEqual(4.5);
    }
    if (vars["--primary"]) {
      expect(contrast(vars["--primary-foreground"] ?? "", vars["--primary"])).toBeGreaterThanOrEqual(4.5);
      expect(vars["--ring"]).toBe(vars["--primary"]);
    }
  });

  it("darkens a washed-out hint color instead of adopting it", () => {
    const vars = telegramThemeVars(ANDROID_LIGHT);
    expect(vars["--muted-foreground"]).not.toBe("#a8a8a8");
  });

  it("keeps LEVEL's primary when the Telegram button pair fails contrast", () => {
    for (const params of [ANDROID_LIGHT, IOS_LIGHT, IOS_DARK]) {
      const vars = telegramThemeVars(params);
      expect(vars["--primary"]).toBeUndefined();
      expect(vars["--ring"]).toBeUndefined();
    }
  });

  it("adopts a readable button pair", () => {
    const vars = telegramThemeVars({ bg_color: "#101014", text_color: "#f5f5f5", button_color: "#8ab4ff", button_text_color: "#0b0b0f" });
    expect(vars["--primary"]).toBe("#8ab4ff");
    expect(vars["--ring"]).toBe("#8ab4ff");
  });

  it("adopts nothing when bg/text are missing or unreadable", () => {
    expect(telegramThemeVars(undefined)).toEqual({});
    expect(telegramThemeVars({ bg_color: "#ffffff", text_color: "#eeeeee" })).toEqual({});
  });

  it("detects the color scheme like telegram-web-app.js", () => {
    expect(telegramColorScheme("#ffffff")).toBe("light");
    expect(telegramColorScheme("#000000")).toBe("dark");
    expect(telegramColorScheme(undefined)).toBeNull();
  });
});
