import { ContainerBuilder } from "diod";
import { EventBus } from "../../../shared/domain/event/EventBus";
import { InMemoryCategoryRepository } from "./InMemoryCategoryRepository";
import { CategoryCreator } from "../application/create/CategoryCreator";
import { CategoryFinder } from "../application/find/CategoryFinder";
import { CategoryDeleter } from "../application/delete/CategoryDeleter";
import { CategorySearcher } from "../application/search/CategorySearcher";

export class CategoryServiceProvider {
  register(builder: ContainerBuilder): void {
    const repository = new InMemoryCategoryRepository();

    builder.register(InMemoryCategoryRepository).useFactory(() => repository);

    builder.register(CategoryCreator).useFactory(ctx => {
      const eventBus = ctx.get(EventBus);
      return new CategoryCreator(repository, eventBus);
    });

    builder.register(CategoryFinder).useFactory(() => {
      return new CategoryFinder(repository);
    });

    builder.register(CategoryDeleter).useFactory(ctx => {
      const eventBus = ctx.get(EventBus);
      return new CategoryDeleter(repository, eventBus);
    });

    builder.register(CategorySearcher).useFactory(() => {
      return new CategorySearcher(repository);
    });
  }
}
