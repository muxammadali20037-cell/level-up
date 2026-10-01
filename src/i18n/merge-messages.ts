export type MessageTree = { [key: string]: string | MessageTree };

/**
 * Deep-merges message catalogs; later layers win key by key. request.ts merges `uz ← en ← requested`, so a
 * draft locale may be partial and every missing key falls back to en, then uz (01-architecture §16).
 */
export function mergeMessages(...layers: ReadonlyArray<MessageTree | undefined>): MessageTree {
  const out: MessageTree = {};
  for (const layer of layers) {
    if (!layer) continue;
    for (const [key, value] of Object.entries(layer)) {
      const current = out[key];
      out[key] =
        typeof value === "object" && value !== null
          ? mergeMessages(typeof current === "object" ? current : undefined, value)
          : value;
    }
  }
  return out;
}
