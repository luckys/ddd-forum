import { ContainerBuilder } from "diod";
import { EventBus } from "../shared/domain/event/EventBus";
import { InMemoryThreadRepository } from "./threads/infrastructure/InMemoryThreadRepository";
import { ThreadStatusSetter } from "./threads/application/status/ThreadStatusSetter";
import { ThreadVisibilitySetter } from "./threads/application/visibility/ThreadVisibilitySetter";

export function registerForumServices(builder: ContainerBuilder): void {
  builder.register(ThreadStatusSetter).useFactory(ctx => {
    const repository = new InMemoryThreadRepository();
    const eventBus = ctx.get(EventBus);
    return new ThreadStatusSetter(repository, eventBus);
  });

  builder.register(ThreadVisibilitySetter).useFactory(ctx => {
    const repository = new InMemoryThreadRepository();
    const eventBus = ctx.get(EventBus);
    return new ThreadVisibilitySetter(repository, eventBus);
  });
}
