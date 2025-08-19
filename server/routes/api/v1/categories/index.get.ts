import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { CategoryPaginator } from "~~/server/contexts/forum/categories/application/paginate/CategoryPaginator";
import { H3Event } from 'h3';
import { buildPaginatedResponse } from "~~/server/routes/shared/pagination/buildPaginatedResponse";

export default defineEventHandler(async (event: H3Event) => {
  const paginator = container.get(CategoryPaginator);
  return buildPaginatedResponse(event, paginator, c => c.toPrimitives())
});
