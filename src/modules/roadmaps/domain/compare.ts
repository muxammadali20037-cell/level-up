/**
 * Locale-independent string comparison (UTF-16 code units). Used for every deterministic tie-break on ids/slugs:
 * `localeCompare` depends on the runtime's ICU data and must not influence stored reports.
 */
export function compareStrings(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
