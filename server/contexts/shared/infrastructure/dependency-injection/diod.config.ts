import { ContainerBuilder } from "diod";
import { EventBus } from "../../domain/event/EventBus";
import Identifier from "../../domain/Identifier";
import { InMemoryEventBus } from "../domain-event/InMemoryEventBus";
import { UuidIdentifier } from "../UuidIdentifier";

const builder = new ContainerBuilder();

builder.register(EventBus).use(InMemoryEventBus);
builder.register(Identifier).use(UuidIdentifier);

export const container = builder.build();