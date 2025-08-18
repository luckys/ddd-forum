import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

const dbFile = process.env.DATABASE_FILE || 'forum.sqlite'

const sqlite = new Database(dbFile)
export const db = drizzle(sqlite)
