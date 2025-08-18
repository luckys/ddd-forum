import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

const dbFile = process.env.DATABASE_FILE || 'forum.sqlite'
const sqlite = new Database(dbFile)
const db = drizzle(sqlite)

await migrate(db, { migrationsFolder: 'server/database/migrations' })

console.log('Migrations applied successfully')
