import { getRouterParam, readBody } from 'h3';
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { ThreadVisibilitySetter } from "~~/server/contexts/forum/threads/application/visibility/ThreadVisibilitySetter";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<{ visibility: 'public' | 'members' | 'premium' }>(event);
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id is required' });
  if (!body?.visibility) throw createError({ statusCode: 400, statusMessage: 'visibility is required' });

  const setter = container.get(ThreadVisibilitySetter);

  await setter.execute(id, body.visibility);
  return { ok: true };
});
