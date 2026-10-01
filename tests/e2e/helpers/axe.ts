import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";

const AXE_SOURCE = readFileSync(join(process.cwd(), "node_modules/axe-core/axe.min.js"), "utf8");

export type AxeViolation = { id: string; impact: string | null; nodes: string[] };

/** Runs axe-core in the page and returns serious/critical violations (spec §8.3 acceptance gate). */
export async function seriousViolations(page: Page, rules?: string[]): Promise<AxeViolation[]> {
  await page.addScriptTag({ content: AXE_SOURCE });
  return page.evaluate(async (only) => {
    type AxeResult = { violations: Array<{ id: string; impact: string | null; nodes: Array<{ target: string[]; failureSummary?: string }> }> };
    const axe = (window as unknown as { axe: { run: (ctx: Document, opts: object) => Promise<AxeResult> } }).axe;
    const options = only ? { runOnly: { type: "rule", values: only } } : { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } };
    const result = await axe.run(document, options);
    return result.violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => `${n.target.join(" ")} — ${n.failureSummary ?? ""}`) }));
  }, rules ?? null);
}

/** Visible, non-decorative elements whose box sticks out of the viewport horizontally. */
export async function horizontalOverflow(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return Array.from(document.querySelectorAll("header *, main *, footer *"))
      .filter((el) => el.closest('[aria-hidden="true"]') === null)
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && (rect.right > width + 0.5 || rect.left < -0.5);
      })
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} "${(el.textContent ?? "").slice(0, 24)}"`);
  });
}
