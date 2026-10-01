import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Sql } from "@/lib/db/client";

export const MIGRATIONS_DIR = path.resolve(process.cwd(), "supabase/migrations");
export const SHIM_FILE = path.resolve(process.cwd(), "scripts/db/supabase-local-shim.sql");

export interface AppliedMigration {
  name: string;
  checksum: string;
}

/**
 * Applies supabase/migrations/*.sql in lexical order, each in its own transaction, recording checksums in
 * level_meta.migrations. Production uses `supabase db push`; this runner is for local dev and tests.
 */
export async function applyMigrations(sql: Sql, log: (msg: string) => void = () => undefined): Promise<string[]> {
  await sql.unsafe(`
    create schema if not exists level_meta;
    create table if not exists level_meta.migrations (
      name text primary key,
      checksum text not null,
      applied_at timestamptz not null default now()
    );
  `);
  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith(".sql")).sort();
  const applied = new Map(
    (await sql<AppliedMigration[]>`select name, checksum from level_meta.migrations`).map((r) => [r.name, r.checksum]),
  );
  const newlyApplied: string[] = [];
  for (const file of files) {
    const body = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");
    const checksum = createHash("sha256").update(body).digest("hex");
    const previous = applied.get(file);
    if (previous) {
      if (previous !== checksum) throw new Error(`Migration ${file} changed after being applied`);
      continue;
    }
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`insert into level_meta.migrations (name, checksum) values (${file}, ${checksum})`;
    });
    newlyApplied.push(file);
    log(`applied ${file}`);
  }
  return newlyApplied;
}

export async function applyLocalShim(sql: Sql): Promise<void> {
  await sql.unsafe(await readFile(SHIM_FILE, "utf8"));
}
