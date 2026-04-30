// lib/db/index.ts
// One shared Postgres pool + Drizzle client for the whole app.
// Imported by every API route that needs database access.
//
// Why `prepare: false`:
//   Supabase's transaction pooler (port 6543) doesn't support prepared
//   statements — connections are reused across transactions. Leaving
//   prepare on causes intermittent "prepared statement 's_1' does not
//   exist" errors. Setting it to false disables that path.
//
// Why the globalThis trick:
//   Next.js dev hot-reload re-evaluates modules on every save. Without
//   stashing the client on globalThis we'd open a new pool per reload
//   and exhaust Supabase's connection limit within minutes of editing.

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const globalForDb = globalThis as unknown as {
  pgClient: ReturnType<typeof postgres> | undefined;
};

const pgClient =
  globalForDb.pgClient ??
  postgres(process.env.DATABASE_URL!, {
    prepare: false, // required for Supabase transaction pooler
    max: 10, // pool size
    idle_timeout: 20, // close idle connections after 20s
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgClient = pgClient;
}

export const db = drizzle(pgClient);
