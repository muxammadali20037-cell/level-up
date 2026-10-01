import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { professionContentSchema, type ParsedProfessionContent } from "./schema";

export interface ValidationIssue {
  readonly profession: string;
  readonly path: string;
  readonly message: string;
  readonly severity: "error" | "warning";
}

const PROFESSIONS_DIR = path.resolve(process.cwd(), "content/professions");

/** Discovers content/professions/<slug>/index.ts modules exporting `profession`. */
export async function loadProfessionModules(): Promise<{ dir: string; content: unknown }[]> {
  let dirs: string[] = [];
  try {
    dirs = (await readdir(PROFESSIONS_DIR, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return [];
  }
  const loaded: { dir: string; content: unknown }[] = [];
  for (const dir of dirs.sort()) {
    const mod = (await import(pathToFileURL(path.join(PROFESSIONS_DIR, dir, "index.ts")).href)) as {
      profession?: unknown;
    };
    loaded.push({ dir, content: mod.profession });
  }
  return loaded;
}

// Uzbek Latin must use U+02BB (oʻ, gʻ) and U+02BC (tutuq) — never ASCII or curly apostrophes.
const BAD_UZ_APOSTROPHE = /['‘’`]/;
const CYRILLIC = /[Ѐ-ӿ]/;

function walkI18n(value: unknown, at: string, visit: (locale: string, text: string, at: string) => void): void {
  if (Array.isArray(value)) {
    value.forEach((v, i) => walkI18n(v, `${at}[${i}]`, visit));
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  const isI18n = keys.length === 3 && ["uz", "ru", "en"].every((k) => typeof record[k] === "string");
  if (isI18n) {
    for (const k of keys) visit(k, record[k] as string, at);
    return;
  }
  for (const k of keys) walkI18n(record[k], at ? `${at}.${k}` : k, visit);
}

export function validateProfession(dir: string, raw: unknown): { parsed: ParsedProfessionContent | null; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const add = (p: string, message: string, severity: ValidationIssue["severity"] = "error"): void => {
    issues.push({ profession: dir, path: p, message, severity });
  };
  const result = professionContentSchema.safeParse(raw);
  if (!result.success) {
    for (const issue of result.error.issues) add(issue.path.join("."), issue.message);
    return { parsed: null, issues };
  }
  const c = result.data;
  if (c.slug !== dir) add("slug", `slug "${c.slug}" must equal folder name "${dir}"`);

  const skills = new Set(c.skills.map((s) => s.slug));
  const specs = new Set(c.specializations.map((s) => s.slug));
  const need = (set: Set<string>, slug: string | undefined, at: string, what: string): void => {
    if (slug !== undefined && !set.has(slug)) add(at, `unknown ${what} "${slug}"`);
  };
  const dupes = (values: string[], at: string): void => {
    const seen = new Set<string>();
    for (const v of values) {
      if (seen.has(v)) add(at, `duplicate "${v}"`);
      seen.add(v);
    }
  };
  dupes(c.skills.map((s) => s.slug), "skills");
  dupes(c.specializations.map((s) => s.slug), "specializations");
  dupes(c.questions.map((q) => q.key), "questions.key");
  dupes(c.actions.map((a) => a.slug), "actions.slug");
  dupes(c.doNotRules.map((r) => r.slug), "doNotRules.slug");

  const importance = c.skills.reduce((sum, s) => sum + s.importance, 0);
  if (Math.abs(importance - 1) > 0.05) add("skills.importance", `importances sum to ${importance.toFixed(3)}, expected ~1`);

  c.specializations.forEach((s, i) => Object.keys(s.skillWeights).forEach((k) => need(skills, k, `specializations[${i}].skillWeights`, "skill")));
  c.edges.forEach((e, i) => {
    need(skills, e.from, `edges[${i}].from`, "skill");
    need(skills, e.to, `edges[${i}].to`, "skill");
    if (e.from === e.to) add(`edges[${i}]`, "self edge");
  });
  for (const [lvl, reqs] of Object.entries(c.levelRequirements ?? {})) {
    if (!/^[1-9]$/.test(lvl)) add(`levelRequirements.${lvl}`, "level key must be 1..9");
    reqs.forEach((r, i) => {
      need(skills, r.skill, `levelRequirements.${lvl}[${i}].skill`, "skill");
      if (r.type === "skill_min" && !r.skill) add(`levelRequirements.${lvl}[${i}]`, "skill_min requires skill");
    });
  }
  c.contextQuestions.forEach((q, i) =>
    q.options.forEach((o, j) => {
      Object.keys(o.skillBoosts ?? {}).forEach((k) => need(skills, k, `contextQuestions[${i}].options[${j}].skillBoosts`, "skill"));
      need(specs, o.suggestsSpecialization, `contextQuestions[${i}].options[${j}]`, "specialization");
    }),
  );

  validateQuestions(c, skills, specs, add);
  validateActions(c, skills, add);
  c.doNotRules.forEach((r, i) => {
    need(skills, r.skill, `doNotRules[${i}].skill`, "skill");
    r.condition.weakSkills?.forEach((s) => need(skills, s, `doNotRules[${i}].condition.weakSkills`, "skill"));
  });
  c.verificationTasks.forEach((t, i) => t.skills.forEach((s) => need(skills, s, `verificationTasks[${i}].skills`, "skill")));

  walkI18n(c, "", (locale, text, at) => {
    if (locale === "uz" && BAD_UZ_APOSTROPHE.test(text)) add(at, `uz text has ASCII/curly apostrophe (use ʻ U+02BB or ʼ U+02BC): "${text.slice(0, 80)}"`);
    if (locale === "ru" && !CYRILLIC.test(text) && !/^[\d\s.,:;%+\-–—/()A-Za-z#]+$/.test(text)) add(at, "ru text has no Cyrillic", "warning");
    if ((locale === "en" || locale === "uz") && CYRILLIC.test(text)) add(at, `${locale} text contains Cyrillic`);
    if (/https?:\/\//i.test(text)) add(at, "URLs are not allowed in content text (use evidence/resources)");
  });
  return { parsed: c, issues };
}

type Add = (p: string, message: string, severity?: ValidationIssue["severity"]) => void;

function validateQuestions(c: ParsedProfessionContent, skills: Set<string>, specs: Set<string>, add: Add): void {
  const prefix = `${c.slug}.`;
  c.questions.forEach((q, i) => {
    const at = `questions[${i}] (${q.key})`;
    if (!skills.has(q.skill)) add(at, `unknown skill "${q.skill}"`);
    q.specializations.forEach((s) => {
      if (!specs.has(s)) add(at, `unknown specialization "${s}"`);
    });
    if (!q.key.startsWith(`${prefix}${q.skill}.`)) add(at, `key must start with "${prefix}${q.skill}."`);
    const keys = q.options.map((o) => o.key).join("");
    if (keys !== "abcde".slice(0, q.options.length)) add(at, `option keys must be a,b,c… in order (got ${keys})`);
    const best = q.options.filter((o) => o.score === 1).length;
    if (q.type === "self_report") {
      if (q.scoringRule !== "likert") add(at, "self_report must use scoringRule likert");
      const scores = q.options.map((o) => o.score);
      const ascending = scores.every((s, k) => k === 0 || s >= (scores[k - 1] ?? 0));
      if (!ascending) add(at, "likert option scores must be ascending (a = lowest)");
    } else {
      if (q.scoringRule === "likert") add(at, "likert is only for self_report");
      if (q.scoringRule === "single_best" && (best !== 1 || q.options.some((o) => o.score !== 0 && o.score !== 1))) {
        add(at, "single_best needs exactly one option with score 1 and the rest 0");
      }
      if (q.scoringRule === "partial_credit" && best !== 1) add(at, "partial_credit needs exactly one option with score 1");
      if (q.options.length < 3) add(at, "non-self-report questions need at least 3 options", "warning");
    }
  });

  const total = c.questions.length;
  if (total < 40) add("questions", `question bank has ${total} items; MVP target is >= 40`);
  const selfReport = c.questions.filter((q) => q.type === "self_report").length;
  if (selfReport > total * 0.25) add("questions", `too many self_report items (${selfReport}/${total})`);
  const scenarioLike = c.questions.filter((q) => ["judgment", "scenario", "decision"].includes(q.type)).length;
  if (scenarioLike < total * 0.3) add("questions", `scenario-like items ${scenarioLike}/${total} < 30%`);
  for (const skill of skills) {
    const items = c.questions.filter((q) => q.skill === skill && q.type !== "self_report");
    const levels = new Set(items.map((q) => q.targetLevel));
    if (items.length < 3) add(`questions[skill=${skill}]`, `skill has ${items.length} non-self-report items; need >= 3`);
    if (levels.size < 3) add(`questions[skill=${skill}]`, `skill items span ${levels.size} target levels; need >= 3`);
  }
  const prompts = new Set<string>();
  for (const q of c.questions) {
    const p = q.prompt.en.trim().toLowerCase();
    if (prompts.has(p)) add(`questions(${q.key})`, "duplicate English prompt");
    prompts.add(p);
  }
}

function validateActions(c: ParsedProfessionContent, skills: Set<string>, add: Add): void {
  c.actions.forEach((a, i) => {
    if (!skills.has(a.skill)) add(`actions[${i}]`, `unknown skill "${a.skill}"`);
    if (a.minLevel > a.maxLevel) add(`actions[${i}]`, "minLevel > maxLevel");
  });
  for (const skill of skills) {
    const acts = c.actions.filter((a) => a.skill === skill);
    if (acts.length < 3) add(`actions[skill=${skill}]`, `skill has ${acts.length} actions; need >= 3`);
    if (acts.filter((a) => a.durationMinutes <= 30).length < 2) add(`actions[skill=${skill}]`, "need >= 2 actions of <= 30 minutes");
  }
  for (const phase of ["foundation", "practice", "application", "verification"] as const) {
    if (c.actions.filter((a) => a.phase === phase).length < 3) add("actions", `phase "${phase}" has < 3 actions`);
  }
  if (c.doNotRules.length < 3) add("doNotRules", "need >= 3 do-not rules");
}
