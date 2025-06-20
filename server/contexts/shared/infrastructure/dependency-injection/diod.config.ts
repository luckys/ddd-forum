import { ContainerBuilder } from "diod";
import { EventBus } from "../../domain/event/EventBus";
import { InMemoryEventBus } from "../domain-event/InMemoryEventBus";
import { Identifier } from "../../domain/Identifier";
import { UuidIdentifier } from "../UuidIdentifier";

const builder = new ContainerBuilder();

builder.register(EventBus).use(InMemoryEventBus);
builder.register(Identifier).use(UuidIdentifier);

export const container = builder.build();