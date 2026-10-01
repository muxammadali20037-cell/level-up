import type { Sql } from "@/lib/db/client";

/**
 * Loads the content seed into the test database. Replaced by the real content seeder once it exists;
 * until then this is a no-op so schema-only integration tests can run.
 */
export async function seedTestDatabase(_sql: Sql): Promise<void> {
  // Intentionally empty until scripts/db/seed-lib.ts lands (Phase 2).
}
