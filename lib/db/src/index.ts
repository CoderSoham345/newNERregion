import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema/index.js";

const { Pool } = pg;

// Singleton pool instance for serverless reuse across invocations
let pool: pg.Pool | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getPool(): pg.Pool | null {
  if (pool) return pool;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }

  try {
    const isLocal = databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: process.env.NODE_ENV === "production" ? 10 : 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on("error", (err) => {
      console.error("[Database Pool] Unexpected background error on idle client:", err.message);
    });

    return pool;
  } catch (err: any) {
    console.error("[Database Pool] Failed to create PostgreSQL pool:", err?.message || err);
    return null;
  }
}

export function getDb() {
  if (db) return db;
  const activePool = getPool();
  if (activePool) {
    try {
      db = drizzle(activePool, { schema });
      return db;
    } catch (err: any) {
      console.error("[Drizzle] Initialization error:", err?.message || err);
    }
  }
  return null;
}

// Initial attempt to initialize if DATABASE_URL is present
try {
  if (process.env.DATABASE_URL) {
    const p = getPool();
    if (p) {
      db = drizzle(p, { schema });
    }
  }
} catch (e: any) {
  console.warn("[Database] Deferred initial connection:", e?.message || e);
}

export { pool, db };
export * from "./schema/index.js";
