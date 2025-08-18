import { and, count, desc, eq, like } from 'drizzle-orm'
import { db } from "~~/server/contexts/shared/infrastructure/drizzle/sqlite"
import { categories } from "~~/server/database/schema"
import { CategoryRepository } from "../domain/CategoryRepository"
import { Category } from "../domain/Category"
import { CategoryId } from "../domain/CategoryId"
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria"
import { Operator } from "~~/server/contexts/shared/domain/criteria/FilterOperator"

function applyCriteria(q: any, criteria: Criteria) {
  const where: any[] = []
  if (criteria.hasFilters()) {
    for (const f of criteria.filters.toPrimitives()) {
      if (f.field === 'id' && f.operator === Operator.EQUAL) where.push(eq(categories.id, String(f.value)))
      if (f.field === 'name' && f.operator === Operator.CONTAINS) where.push(like(categories.name, `%${String(f.value)}%`))
      if (f.field === 'name' && f.operator === Operator.EQUAL) where.push(eq(categories.name, String(f.value)))
      if (f.field === 'description' && f.operator === Operator.CONTAINS) where.push(like(categories.description, `%${String(f.value)}%`))
    }
  }
  if (where.length) q = q.where(and(...where))
  if (criteria.hasOrder()) {
    const { orderBy, orderType } = criteria.toPrimitives()
    if (orderBy === 'createdAt') q = q.orderBy(orderType === 'desc' ? desc(categories.createdAt) : categories.createdAt)
    if (orderBy === 'name') q = q.orderBy(orderType === 'desc' ? desc(categories.name) : categories.name)
  }
  const { pageSize, pageNumber } = criteria
  if (pageSize && pageNumber !== null) q = q.limit(pageSize).offset(pageSize * (pageNumber - 1))
  return q
}

export class DrizzleCategoryRepository implements CategoryRepository {
  async save(category: Category): Promise<void> {
    const p = category.toPrimitives()
    await db.insert(categories).values({
      id: p.id,
      name: p.name,
      description: p.description ?? null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      deletedAt: p.deletedAt ?? null,
    }).onConflictDoUpdate({ target: categories.id, set: {
      name: p.name,
      description: p.description ?? null,
      updatedAt: p.updatedAt,
      deletedAt: p.deletedAt ?? null,
    }})
  }

  async find(id: CategoryId): Promise<Category | null> {
    const rows = await db.select().from(categories).where(eq(categories.id, id.getValue())).limit(1)
    const row = rows.at(0)
    if (!row) return null
    return Category.create(row.id, row.name, row.description ?? null)
  }

  async search(criteria: Criteria): Promise<Category[]> {
    let q = db.select().from(categories)
    q = applyCriteria(q, criteria)
    const rows = await q
    return rows.map(r => Category.create(r.id, r.name, r.description ?? null))
  }

  async count(criteria: Criteria): Promise<number> {
    let q = db.select({ value: count() }).from(categories)
    q = applyCriteria(q, new Criteria(criteria.filters, criteria.order, null, null))
    const rows = await q
    return rows.at(0)?.value ?? 0
  }

  async delete(id: CategoryId): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id.getValue()))
  }
}
