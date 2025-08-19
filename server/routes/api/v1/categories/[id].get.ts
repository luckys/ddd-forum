import { getRouterParam } from 'h3';
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { CategoryFinder } from "~~/server/contexts/forum/categories/application/find/CategoryFinder";
import { CategoryId } from "~~/server/contexts/forum/categories/domain/CategoryId";
import { CategoryNotFoundError } from "~~/server/contexts/forum/categories/domain/CategoryNotFoundError";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id is required' });

  const finder = container.get(CategoryFinder);
  try {
    const category = await finder.execute(new CategoryId(id));
    return category.toPrimitives();
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      throw createError({ statusCode: 404, statusMessage: error.message });
    }
    throw error;
  }
});
