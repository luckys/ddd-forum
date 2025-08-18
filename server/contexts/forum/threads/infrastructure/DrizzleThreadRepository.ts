import { and, count, desc, eq, like } from 'drizzle-orm'
import { db } from "~~/server/contexts/shared/infrastructure/drizzle/sqlite"
import { threads } from "~~/server/database/schema"
import { ThreadRepository } from "../domain/ThreadRepository"
import { Thread } from "../domain/Thread"
import { ThreadId } from "../domain/ThreadId"
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria"
import { Operator } from "~~/server/contexts/shared/domain/criteria/FilterOperator"

function applyCriteria(q: any, criteria: Criteria) {
  const where: any[] = []
  if (criteria.hasFilters()) {
    for (const f of criteria.filters.toPrimitives()) {
      if (f.field === 'id' && f.operator === Operator.EQUAL) where.push(eq(threads.id, String(f.value)))
      if (f.field === 'title' && f.operator === Operator.CONTAINS) where.push(like(threads.title, `%${String(f.value)}%`))
      if (f.field === 'title' && f.operator === Operator.EQUAL) where.push(eq(threads.title, String(f.value)))
    }
  }
  if (where.length) q = q.where(and(...where))
  if (criteria.hasOrder()) {
    const { orderBy, orderType } = criteria.toPrimitives()
    if (orderBy === 'createdAt') q = q.orderBy(orderType === 'desc' ? desc(threads.createdAt) : threads.createdAt)
    if (orderBy === 'title') q = q.orderBy(orderType === 'desc' ? desc(threads.title) : threads.title)
  }
  const { pageSize, pageNumber } = criteria
  if (pageSize && pageNumber !== null) q = q.limit(pageSize).offset(pageSize * (pageNumber - 1))
  return q
}

export class DrizzleThreadRepository implements ThreadRepository {
  async save(thread: Thread): Promise<void> {
    const p = thread.toPrimitives()
    await db.insert(threads).values({
      id: p.id,
      title: p.title,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      closedAt: p.closedAt ?? null,
      categoryId: p.categoryId ?? null,
      visibility: p.visibility ?? null,
      status: p.status ?? null,
    }).onConflictDoUpdate({ target: threads.id, set: {
      title: p.title,
      updatedAt: p.updatedAt,
      closedAt: p.closedAt ?? null,
      categoryId: p.categoryId ?? null,
      visibility: p.visibility ?? null,
      status: p.status ?? null,
    }})
  }

  async find(id: ThreadId): Promise<Thread | null> {
    const rows = await db.select().from(threads).where(eq(threads.id, id.getValue())).limit(1)
    const row = rows.at(0)
    if (!row) return null
    return Thread.create(row.id, row.title)
  }

  async search(criteria: Criteria): Promise<Thread[]> {
    let q = db.select().from(threads)
    q = applyCriteria(q, criteria)
    const rows = await q
    return rows.map(r => Thread.create(r.id, r.title))
  }

  async count(criteria: Criteria): Promise<number> {
    let q = db.select({ value: count() }).from(threads)
    q = applyCriteria(q, new Criteria(criteria.filters, criteria.order, null, null))
    const rows = await q
    return rows.at(0)?.value ?? 0
  }
}
