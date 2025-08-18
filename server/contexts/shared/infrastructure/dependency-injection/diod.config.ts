import { ContainerBuilder } from "diod";
import { EventBus } from "../../domain/event/EventBus";
import { InMemoryEventBus } from "../domain-event/InMemoryEventBus";
import { ThreadServiceProvider } from "~~/server/contexts/forum/threads/infrastructure/ThreadServiceProvider";
import { CategoryServiceProvider } from "~~/server/contexts/forum/categories/infrastructure/CategoryServiceProvider";

const builder = new ContainerBuilder();

builder.register(EventBus).use(InMemoryEventBus);

new ThreadServiceProvider().register(builder);
new CategoryServiceProvider().register(builder);

export const container = builder.build();