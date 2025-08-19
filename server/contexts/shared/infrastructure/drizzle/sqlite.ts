import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

const dbFile = process.env.DATABASE_FILE || 'forum.sqlite'
const dir = path.dirname(dbFile)
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const sqlite = new Database(dbFile)
export const db = drizzle(sqlite)
