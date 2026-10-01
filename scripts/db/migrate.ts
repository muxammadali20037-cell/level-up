import { createSql } from "@/lib/db/client";
import { applyLocalShim, applyMigrations } from "./migrate-lib";

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = createSql(url, { max: 1 });
  try {
    if (process.env.LOCAL_SUPABASE_SHIM === "1") await applyLocalShim(sql);
    const applied = await applyMigrations(sql, (m) => console.log(m));
    console.log(applied.length ? `Applied ${applied.length} migration(s).` : "Database is up to date.");
  } finally {
    await sql.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
