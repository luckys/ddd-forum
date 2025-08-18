import 'reflect-metadata';
import { ContainerBuilder } from "diod";
import { CategoryServiceProvider } from "~~/server/contexts/forum/categories/infrastructure/CategoryServiceProvider";
import { ThreadServiceProvider } from "~~/server/contexts/forum/threads/infrastructure/ThreadServiceProvider";
import { EventBus } from "../../domain/event/EventBus";
import { InMemoryEventBus } from "../domain-event/InMemoryEventBus";
const builder = new ContainerBuilder();

builder.register(EventBus).useFactory(() => new InMemoryEventBus());

new ThreadServiceProvider().register(builder);
new CategoryServiceProvider().register(builder);

export const container = builder.build();