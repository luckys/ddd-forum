import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { CategoryPaginator } from "~~/server/contexts/forum/categories/application/paginate/CategoryPaginator";
import { parseCriteriaFromEvent } from "~~/server/routes/shared/criteria";
import { H3Event, getQuery, getRequestURL } from 'h3';
import { buildLaravelPaginationResponse } from "~~/server/routes/shared/pagination";

export default defineEventHandler(async (event: H3Event) => {
  const criteria = parseCriteriaFromEvent(event);
  const paginator = container.get(CategoryPaginator);
  const { items, total } = await paginator.execute(criteria);
  const url = getRequestURL(event)
  const rawQuery = getQuery(event)
  const query: Record<string, string | string[] | undefined> = {}
  for (const [k, v] of Object.entries(rawQuery)) {
    if (typeof v === 'string') query[k] = v
    if (Array.isArray(v)) query[k] = v.filter((x): x is string => typeof x === 'string')
  }
  const page = criteria.pageNumber ?? 1
  const perPage = criteria.pageSize ?? items.length
  return buildLaravelPaginationResponse(items.map(c => c.toPrimitives()), total, page, perPage, url, query);
});
