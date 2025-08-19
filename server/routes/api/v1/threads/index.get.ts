import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { ThreadPaginator } from "~~/server/contexts/forum/threads/application/paginate/ThreadPaginator";
import { H3Event } from 'h3';
import { buildPaginatedResponse } from "~~/server/routes/shared/pagination/buildPaginatedResponse";

export default defineEventHandler(async (event: H3Event) => {
  const paginator = container.get(ThreadPaginator);
  return buildPaginatedResponse(event, paginator, t => t.toPrimitives())
});
