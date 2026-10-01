import type { TelegramThemeParams } from "./types";

/** CSS variables the Telegram theme hook may set inline on <html>. Anything not returned is removed. */
export const TELEGRAM_THEME_VARS = [
  "--background",
  "--foreground",
  "--card",
  "--muted",
  "--muted-foreground",
  "--primary",
  "--primary-foreground",
  "--ring",
] as const;

export type TelegramThemeVars = Partial<Record<(typeof TELEGRAM_THEME_VARS)[number], string>>;

/**
 * Maps Telegram themeParams to LEVEL tokens, adopting only colors that stay readable (WCAG AA 4.5:1,
 * spec 02 §8.3 "theme colors that fail are overridden for text"):
 * - bg/text: both or neither (text must reach 4.5:1 on bg). Cards / muted surfaces likewise.
 * - hint_color → --muted-foreground, nudged toward text_color until it reaches 4.5:1 on every surface.
 * - button pair → --primary/--primary-foreground/--ring only if the label reads on the button AND the
 *   button color reads as text on every surface (text-primary is used for copy); else LEVEL indigo stays.
 *
 * MUST stay self-contained (no imports or outer references): it is serialized with toString() into the
 * pre-paint boot script (boot-script.ts).
 */
export function telegramThemeVars(params: TelegramThemeParams | null | undefined): TelegramThemeVars {
  type Rgb = [number, number, number];
  const AA = 4.5;
  const parse = (value: unknown): Rgb | null => {
    const match = typeof value === "string" ? /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim()) : null;
    if (!match?.[1]) return null;
    const hex = match[1].length === 3 ? match[1].replace(/./g, "$&$&") : match[1];
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const luminance = (c: Rgb) => 0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);
  const contrast = (a: Rgb, b: Rgb) => {
    const x = luminance(a);
    const y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const lerp = (x: number, y: number, t: number) => Math.round(x + (y - x) * t);
  const mix = (a: Rgb, b: Rgb, t: number): Rgb => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const toHex = (c: Rgb) => `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

  const vars: TelegramThemeVars = {};
  const p = params ?? {};
  const bg = parse(p.bg_color);
  const text = parse(p.text_color);
  if (!bg || !text || contrast(text, bg) < AA) return vars;
  vars["--background"] = toHex(bg);
  vars["--foreground"] = toHex(text);

  const surfaces: Rgb[] = [bg];
  const section = parse(p.section_bg_color);
  if (section && toHex(section) !== toHex(bg) && contrast(text, section) >= AA) {
    vars["--card"] = toHex(section);
    surfaces.push(section);
  }
  const secondary = parse(p.secondary_bg_color);
  if (secondary && contrast(text, secondary) >= AA) {
    vars["--muted"] = toHex(secondary);
    surfaces.push(secondary);
  }
  const readable = (c: Rgb) => surfaces.every((surface) => contrast(c, surface) >= AA);

  const hint = parse(p.hint_color) ?? mix(text, bg, 0.45);
  for (let step = 0; step <= 20; step += 1) {
    const candidate = mix(hint, text, step / 20);
    if (readable(candidate)) {
      vars["--muted-foreground"] = toHex(candidate);
      break;
    }
  }

  const button = parse(p.button_color);
  const buttonText = parse(p.button_text_color);
  if (button && buttonText && contrast(buttonText, button) >= AA && readable(button)) {
    vars["--primary"] = toHex(button);
    vars["--primary-foreground"] = toHex(buttonText);
    vars["--ring"] = toHex(button);
  }
  return vars;
}

/** Same rule as telegram-web-app.js: perceived brightness of bg_color below 120 means dark. */
export function telegramColorScheme(bgColor: string | undefined): "light" | "dark" | null {
  const match = typeof bgColor === "string" ? /^#?([0-9a-f]{6})$/i.exec(bgColor.trim()) : null;
  if (!match?.[1]) return null;
  const n = parseInt(match[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b) < 120 ? "dark" : "light";
}
