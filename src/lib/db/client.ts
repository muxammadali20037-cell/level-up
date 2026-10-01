import postgres from "postgres";

/**
 * Server-only Postgres access (postgres.js). Use tagged templates — values are always parameterized.
 * Column names are converted snake_case ⇄ camelCase. numeric → number, int8 → number (all our int8 values are
 * far below 2^53: money in minor units, counters, identity ids).
 *
 * `prepare: false` keeps us compatible with Supabase's transaction-mode pooler (Supavisor, port 6543).
 */
export type Sql = postgres.Sql<Record<string, unknown>>;
export type TransactionSql = postgres.TransactionSql<Record<string, unknown>>;
/** Either the root client or a transaction — repositories accept both. */
export type Db = Sql | TransactionSql;

const NUMERIC_OID = 1700;
const INT8_OID = 20;

export function createSql(url: string, options: { max?: number } = {}): Sql {
  return postgres(url, {
    max: options.max ?? 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    transform: { ...postgres.camel, undefined: null },
    types: {
      numeric: {
        to: NUMERIC_OID,
        from: [NUMERIC_OID],
        serialize: (value: unknown) => String(value),
        parse: (value: string) => Number.parseFloat(value),
      },
      int8: {
        to: INT8_OID,
        from: [INT8_OID],
        serialize: (value: unknown) => String(value),
        parse: (value: string) => Number(value),
      },
    },
    onnotice: () => undefined,
  }) as unknown as Sql;
}

const globalForDb = globalThis as unknown as { __levelSql?: Sql };

/** Process-wide singleton (survives Next.js dev hot reloads). */
export function getSql(): Sql {
  if (!globalForDb.__levelSql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    globalForDb.__levelSql = createSql(url, { max: Number(process.env.DATABASE_POOL_MAX ?? 5) });
  }
  return globalForDb.__levelSql;
}

/** Override the singleton (tests). */
export function setSql(sql: Sql): void {
  globalForDb.__levelSql = sql;
}

/** Run `fn` in a transaction. Nested calls with a TransactionSql reuse it (savepoint-free). */
export async function withTransaction<T>(db: Db, fn: (tx: TransactionSql) => Promise<T>): Promise<T> {
  if (isTransaction(db)) return fn(db);
  return (await (db as Sql).begin((tx) => fn(tx as unknown as TransactionSql))) as T;
}

function isTransaction(db: Db): db is TransactionSql {
  return typeof (db as Sql).begin !== "function";
}
