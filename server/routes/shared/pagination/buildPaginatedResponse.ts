import { H3Event, getQuery, getRequestURL } from 'h3'
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria"
import { parseCriteriaFromEvent } from "~~/server/routes/shared/HttpCriteriaParser"
import { normalizeQueryParams } from "~~/server/routes/shared/HttpQueryNormalizer"
import { HttpPaginationPresenter } from "~~/server/routes/shared/pagination/HttpPaginationPresenter"

interface PaginatorPort<T> {
  execute(criteria: Criteria): Promise<{ items: T[]; total: number }>
}

export async function buildPaginatedResponse<T, R>(
  event: H3Event,
  paginator: PaginatorPort<T>,
  mapItem: (item: T) => R
) {
  const criteria = parseCriteriaFromEvent(event)
  const { items, total } = await paginator.execute(criteria)
  const url = getRequestURL(event)
  const rawQuery = getQuery(event)
  const query = normalizeQueryParams(rawQuery as Record<string, unknown>)
  const page = criteria.pageNumber ?? 1
  const perPage = criteria.pageSize ?? items.length
  const presenter = new HttpPaginationPresenter()
  return presenter.build(items.map(mapItem), total, page, perPage, url, query)
}
