import { readBody } from 'h3';
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { CategoryCreator } from "~~/server/contexts/forum/categories/application/create/CategoryCreator";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ id: string; name: string; description?: string | null }>(event);
  if (!body?.id) throw createError({ statusCode: 400, statusMessage: 'id is required' });
  if (!body?.name) throw createError({ statusCode: 400, statusMessage: 'name is required' });

  const creator = container.get(CategoryCreator);
  await creator.execute(body.id, body.name, body.description ?? null);
  return { ok: true };
});
