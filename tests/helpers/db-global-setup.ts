import postgres from "postgres";
import { createSql } from "@/lib/db/client";
import { applyLocalShim, applyMigrations } from "../../scripts/db/migrate-lib";
import { TEST_DATABASE_URL } from "./test-db-url";

/**
 * Integration tests run against a real local Postgres: the test database is recreated, the Supabase shim
 * (roles + auth.uid()) applied, then all migrations. Seed fixtures are loaded per test file as needed.
 */
export default async function setup(): Promise<void> {
  const target = new URL(TEST_DATABASE_URL);
  const dbName = target.pathname.replace(/^\//, "");
  if (!dbName.startsWith("level_test")) throw new Error(`Refusing to use non-test database ${dbName}`);
  const adminUrl = new URL(TEST_DATABASE_URL);
  adminUrl.pathname = "/postgres";
  const admin = postgres(adminUrl.toString(), { max: 1, onnotice: () => undefined });
  try {
    await admin.unsafe(`drop database if exists "${dbName}" with (force)`);
    await admin.unsafe(`create database "${dbName}"`);
  } finally {
    await admin.end();
  }
  const sql = createSql(TEST_DATABASE_URL, { max: 1 });
  try {
    await applyLocalShim(sql);
    await applyMigrations(sql);
    if (process.env.TEST_SEED !== "0") {
      const { seedTestDatabase } = await import("./seed-test-db");
      await seedTestDatabase(sql);
    }
  } finally {
    await sql.end();
  }
}
