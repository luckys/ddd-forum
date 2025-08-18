import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config";
import { CategorySearcher } from "~~/server/contexts/forum/categories/application/search/CategorySearcher";
import { parseCriteriaFromEvent } from "~~/server/routes/shared/criteria";
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const criteria = parseCriteriaFromEvent(event);
  const searcher = container.get(CategorySearcher);
  const categories = await searcher.execute(criteria);
  return categories.map((c) => c.toPrimitives());
});
