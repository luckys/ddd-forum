import { getRouterParam } from 'h3';
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { CategoryFinder } from "~~/server/contexts/forum/categories/application/find/CategoryFinder";
import { CategoryId } from "~~/server/contexts/forum/categories/domain/CategoryId";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id is required' });

  const finder = container.get(CategoryFinder);
  const category = await finder.execute(new CategoryId(id));
  return category.toPrimitives();
});
