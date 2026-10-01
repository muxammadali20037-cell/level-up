import postgres from "postgres";

/** Drops and recreates the database named in DATABASE_URL (local dev/test only). */
async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const target = new URL(url);
  const dbName = target.pathname.replace(/^\//, "");
  if (!/^level_[a-z0-9_]+$/.test(dbName)) throw new Error(`Refusing to reset non-local database "${dbName}"`);
  if (!["localhost", "127.0.0.1"].includes(target.hostname)) throw new Error("Refusing to reset a remote database");
  const admin = new URL(url);
  admin.pathname = "/postgres";
  const sql = postgres(admin.toString(), { max: 1, onnotice: () => undefined });
  try {
    await sql.unsafe(`drop database if exists "${dbName}" with (force)`);
    await sql.unsafe(`create database "${dbName}"`);
    console.log(`Recreated ${dbName}`);
  } finally {
    await sql.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
