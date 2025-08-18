import { getRouterParam } from 'h3';
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { CategoryDeleter } from "~~/server/contexts/forum/categories/application/delete/CategoryDeleter";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id is required' });

  const deleter = container.get(CategoryDeleter);
  await deleter.execute(id);
  return { ok: true };
});
