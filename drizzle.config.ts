// drizzle.config.ts
// Configuration for `drizzle-kit` (the dev CLI tool).
// Used when introspecting the live Supabase schema and writing types.

import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

// Load .env.local so DATABASE_URL is available to drizzle-kit when it runs
// outside of Next.js (e.g. `npx drizzle-kit pull` from the terminal).
loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts", // canonical location for pulled types
  // `out` is required by drizzle-kit. We manage migrations manually in
  // docs/migrations/, so this folder is just where `drizzle-kit pull`
  // dumps its output. After a pull, move schema.ts + relations.ts up
  // to lib/db/ and delete this folder again.
  out: "./lib/db/migrations",
  dbCredentials: {
    // drizzle-kit needs the session pooler (5432), not the transaction pooler (6543).
    // Falls back to DATABASE_URL if the direct URL isn't set.
    url: process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL!,
  },
});
