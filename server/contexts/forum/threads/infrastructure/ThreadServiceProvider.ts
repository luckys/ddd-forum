import { ContainerBuilder } from "diod";
import { EventBus } from "../../../shared/domain/event/EventBus";
import { DrizzleThreadRepository } from "./DrizzleThreadRepository";
import { ThreadStatusSetter } from "../application/status/ThreadStatusSetter";
import { ThreadVisibilitySetter } from "../application/visibility/ThreadVisibilitySetter";
import { ThreadSearcher } from "../application/search/ThreadSearcher";
import { ThreadPaginator } from "../application/paginate/ThreadPaginator";

export class ThreadServiceProvider {
  register(builder: ContainerBuilder): void {
    const repository = new DrizzleThreadRepository();

    builder.register(DrizzleThreadRepository).useFactory(() => repository);

    builder.register(ThreadStatusSetter).useFactory(ctx => {
      const eventBus = ctx.get(EventBus);
      return new ThreadStatusSetter(repository, eventBus);
    });

    builder.register(ThreadVisibilitySetter).useFactory(ctx => {
      const eventBus = ctx.get(EventBus);
      return new ThreadVisibilitySetter(repository, eventBus);
    });

    builder.register(ThreadSearcher).useFactory(() => {
      return new ThreadSearcher(repository);
    });

    builder.register(ThreadPaginator).useFactory(() => {
      return new ThreadPaginator(repository);
    });
  }
}

