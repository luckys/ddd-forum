import { ContainerBuilder } from "diod";
import { EventBus } from "../../../shared/domain/event/EventBus";
import { InMemoryThreadRepository } from "./InMemoryThreadRepository";
import { ThreadStatusSetter } from "../application/status/ThreadStatusSetter";
import { ThreadVisibilitySetter } from "../application/visibility/ThreadVisibilitySetter";

export class ThreadServiceProvider {
  register(builder: ContainerBuilder): void {
    const repository = new InMemoryThreadRepository();

    builder.register(InMemoryThreadRepository).useFactory(() => repository);

    builder.register(ThreadStatusSetter).useFactory(ctx => {
      const eventBus = ctx.get(EventBus);
      return new ThreadStatusSetter(repository, eventBus);
    });

    builder.register(ThreadVisibilitySetter).useFactory(ctx => {
      const eventBus = ctx.get(EventBus);
      return new ThreadVisibilitySetter(repository, eventBus);
    });
  }
}
