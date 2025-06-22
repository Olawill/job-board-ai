import { env } from "@/data/env/server";
import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";
// import { Database } from 'bun:sqlite';
import * as schema from "@/drizzle/schema";

// const sqlite = new Database(env.DB_FILE_NAME);

const client = neon(env.DB_URL);
export const db = drizzle({ client, schema });
