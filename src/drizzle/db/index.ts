import { env } from "@/data/env/server"

import { drizzle } from "drizzle-orm/neon-http"
// import { Database } from 'bun:sqlite';
// import * as schema from '@/drizzle/schema'

// const sqlite = new Database(env.DB_FILE_NAME);

export const db = drizzle(env.DB_URL)
