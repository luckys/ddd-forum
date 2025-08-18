import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { ThreadSearcher } from "~~/server/contexts/forum/threads/application/search/ThreadSearcher";
import { parseCriteriaFromEvent } from "~~/server/routes/shared/criteria";
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const criteria = parseCriteriaFromEvent(event);
  const searcher = container.get(ThreadSearcher);
  const threads = await searcher.execute(criteria);
  return threads.map(t => t.toPrimitives());
});
