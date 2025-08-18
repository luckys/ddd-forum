import { getQuery } from 'h3';
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { CategorySearcher } from "~~/server/contexts/forum/categories/application/search/CategorySearcher";
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filters = Array.isArray(query.filters) ? [] : [];
  const orderBy = typeof query.orderBy === 'string' ? query.orderBy : null;
  const orderType = typeof query.orderType === 'string' ? query.orderType : null;
  const pageSize = typeof query.pageSize === 'string' ? Number(query.pageSize) : null;
  const pageNumber = typeof query.pageNumber === 'string' ? Number(query.pageNumber) : null;

  const criteria = Criteria.fromPrimitives(filters, orderBy, orderType, pageSize, pageNumber);
  const searcher = container.get(CategorySearcher);
  const categories = await searcher.execute(criteria);
  return categories.map((c) => c.toPrimitives());
});
