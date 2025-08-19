import { H3Event, getQuery } from 'h3'
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria"
import type { FiltersPrimitives } from "~~/server/contexts/shared/domain/criteria/Filter"

export function parseCriteriaFromEvent(event: H3Event): Criteria {
  const query = getQuery(event)

  const filters: FiltersPrimitives[] = []
  const rawFilters = query.filters

  if (typeof rawFilters === 'string') {
    try {
      const parsed = JSON.parse(rawFilters)
      if (Array.isArray(parsed)) {
        for (const f of parsed) {
          if (f && typeof f.field === 'string' && typeof f.operator === 'string' && typeof f.value === 'string') {
            filters.push({ field: f.field, operator: f.operator, value: f.value })
          }
        }
      }
    } catch {}
  }

  const singleField = typeof query.field === 'string' ? query.field : null
  const singleOperator = typeof query.operator === 'string' ? query.operator : null
  const singleValue = typeof query.value === 'string' ? query.value : null
  if (singleField && singleOperator && singleValue) {
    filters.push({ field: singleField, operator: singleOperator, value: singleValue })
  }

  const orderBy = typeof query.orderBy === 'string' ? query.orderBy : null
  const orderType = typeof query.orderType === 'string' ? query.orderType : null
  const pageSize = typeof query.pageSize === 'string' ? Number(query.pageSize) : null
  const pageNumber = typeof query.pageNumber === 'string' ? Number(query.pageNumber) : null

  return Criteria.fromPrimitives(filters, orderBy, orderType, pageSize, pageNumber)
}
