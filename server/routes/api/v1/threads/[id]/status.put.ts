import { getRouterParam, readBody } from 'h3';
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";
import { InMemoryThreadRepository } from "~~/server/contexts/forum/threads/infrastructure/InMemoryThreadRepository";
import { ThreadStatusSetter } from "~~/server/contexts/forum/threads/application/status/ThreadStatusSetter";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<{ status: 'open' | 'closed' | 'archived' }>(event);
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id is required' });
  if (!body?.status) throw createError({ statusCode: 400, statusMessage: 'status is required' });

  const eventBus = container.get(EventBus);
  const repository = new InMemoryThreadRepository();
  const setter = new ThreadStatusSetter(repository, eventBus);

  await setter.execute(id, body.status);
  return { ok: true };
});
