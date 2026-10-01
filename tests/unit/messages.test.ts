import { describe, expect, it } from "vitest";
import en from "@/i18n/messages/en";
import ru from "@/i18n/messages/ru";
import uz from "@/i18n/messages/uz";
import { SUPPORTED_LOCALES } from "@/lib/i18n/text";

type Tree = { [key: string]: string | Tree };

const catalogs: Record<string, Tree> = { uz, ru, en };

function flatten(tree: Tree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out.set(path, value);
    else for (const [k, v] of flatten(value, path)) out.set(k, v);
  }
  return out;
}

/** `{name}` placeholders and plural/select arguments (`{count, plural, …}`). */
function placeholders(message: string): string[] {
  return [...message.matchAll(/\{\s*(\w+)\s*(?:,|\})/g)].map((m) => m[1] ?? "").sort();
}

const flat = Object.fromEntries(
  Object.entries(catalogs).map(([locale, tree]) => [locale, flatten(tree)]),
) as Record<string, Map<string, string>>;

describe("i18n message catalogs", () => {
  it("has a catalog for every supported locale", () => {
    expect(Object.keys(catalogs).sort()).toEqual([...SUPPORTED_LOCALES].sort());
  });

  it("uses identical key sets in uz, ru and en", () => {
    const reference = [...(flat.uz?.keys() ?? [])].sort();
    expect(reference.length).toBeGreaterThan(100);
    for (const locale of ["ru", "en"]) {
      expect([...(flat[locale]?.keys() ?? [])].sort(), `keys of ${locale}`).toEqual(reference);
    }
  });

  it("has no empty values", () => {
    for (const [locale, map] of Object.entries(flat)) {
      for (const [key, value] of map) {
        expect(value.trim().length, `${locale}:${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses the same placeholders in every locale", () => {
    for (const [key, value] of flat.uz ?? []) {
      const expected = placeholders(value);
      for (const locale of ["ru", "en"]) {
        const other = flat[locale]?.get(key) ?? "";
        expect([...new Set(placeholders(other))], `${locale}:${key}`).toEqual([...new Set(expected)]);
      }
    }
  });

  it("never uses ASCII or curly apostrophes in Uzbek copy (ʻ U+02BB and ʼ U+02BC only)", () => {
    const forbidden = /['‘’`]/;
    const offenders = [...(flat.uz ?? [])].filter(([, value]) => forbidden.test(value));
    expect(offenders).toEqual([]);
  });

  it("writes oʻ/gʻ with U+02BB in Uzbek copy", () => {
    const wrongModifier = /[OoGg]ʼ/;
    const offenders = [...(flat.uz ?? [])].filter(([, value]) => wrongModifier.test(value));
    expect(offenders).toEqual([]);
  });

  it("uses one agreed term for the main blocker (spec: Asosiy toʻsiq / Главное препятствие / Main blocker)", () => {
    for (const [locale, map] of Object.entries(flat)) {
      const offenders = [...map].filter(([, value]) => /bottleneck|узк(ое|ого) мест/i.test(value));
      expect(offenders, locale).toEqual([]);
    }
  });

  it("keeps the product-critical Uzbek copy verbatim", () => {
    const uzMap = flat.uz;
    expect(uzMap?.get("landing.hero.titleA")).toBe("Sen oʻz sohangda qaysi LEVELdasan?");
    expect(uzMap?.get("landing.cta")).toBe("LEVELIMNI ANIQLASH");
    expect(uzMap?.get("common.disclaimer.educational")).toBe(
      "Taʼlimiy baholash. Professional sertifikat emas.",
    );
    expect(uzMap?.get("teaser.cta")).toBe("{price}ga toʻliq natijani ochish");
    expect(uzMap?.get("share.defaultText")).toBe(
      "Men {profession} LEVEL testidan oʻtdim. Natijam: LEVEL {level}. Sizniki nechchi?",
    );
  });
});
