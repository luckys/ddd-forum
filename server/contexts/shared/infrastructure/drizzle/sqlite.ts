import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

const dbFile = process.env.DATABASE_FILE || 'forum.sqlite'
const resolvedPath = path.isAbsolute(dbFile) ? dbFile : path.resolve(process.cwd(), dbFile)
const dir = path.dirname(resolvedPath)
if (dir.startsWith(process.cwd())) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

let targetPath = resolvedPath
if (!fs.existsSync(path.dirname(targetPath))) {
  const fallbackDir = path.resolve(process.cwd(), 'data')
  if (!fs.existsSync(fallbackDir)) fs.mkdirSync(fallbackDir, { recursive: true })
  targetPath = path.join(fallbackDir, 'forum.sqlite')
}

const sqlite = new Database(targetPath)
export const db = drizzle(sqlite)
