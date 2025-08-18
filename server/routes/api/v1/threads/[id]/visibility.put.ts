import { getRouterParam, readBody } from 'h3';
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";
import { InMemoryThreadRepository } from "~~/server/contexts/forum/threads/infrastructure/InMemoryThreadRepository";
import { ThreadVisibilitySetter } from "~~/server/contexts/forum/threads/application/visibility/ThreadVisibilitySetter";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<{ visibility: 'public' | 'members' | 'premium' }>(event);
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id is required' });
  if (!body?.visibility) throw createError({ statusCode: 400, statusMessage: 'visibility is required' });

  const eventBus = container.get(EventBus);
  const repository = new InMemoryThreadRepository();
  const setter = new ThreadVisibilitySetter(repository, eventBus);

  await setter.execute(id, body.visibility);
  return { ok: true };
});
