import type { DomainEvent } from "./DomainEvent";

export type DomainEventClass<T extends DomainEvent = DomainEvent> = {
	new (...args: unknown[]): T;
	eventName: string;
};