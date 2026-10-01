import { loadProfessionModules, validateProfession, type ValidationIssue } from "../../content/validate-lib";

/** Usage: npm run content:validate [-- <profession-slug> ...] */
async function main(): Promise<void> {
  const only = new Set(process.argv.slice(2));
  const modules = (await loadProfessionModules()).filter((m) => only.size === 0 || only.has(m.dir));
  const issues: ValidationIssue[] = [];
  for (const m of modules) {
    const { parsed, issues: found } = validateProfession(m.dir, m.content);
    issues.push(...found);
    if (parsed) {
      const types = parsed.questions.reduce<Record<string, number>>((acc, q) => ({ ...acc, [q.type]: (acc[q.type] ?? 0) + 1 }), {});
      console.log(`${m.dir}: ${parsed.skills.length} skills, ${parsed.questions.length} questions ${JSON.stringify(types)}, ${parsed.actions.length} actions, ${parsed.doNotRules.length} do-not rules`);
    }
  }
  for (const i of issues) console.log(`${i.severity.toUpperCase()} ${i.profession} ${i.path}: ${i.message}`);
  const errors = issues.filter((i) => i.severity === "error").length;
  console.log(`\n${modules.length} profession(s), ${errors} error(s), ${issues.length - errors} warning(s)`);
  if (errors > 0) process.exit(1);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
