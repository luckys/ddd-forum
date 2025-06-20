import type { DomainEvent } from "./DomainEvent";
import type { NonEmptyString } from "../NonEmptyString";

export type DomainEventClass<T extends DomainEvent = DomainEvent> = {
	new (...args: unknown[]): T;
	eventName: NonEmptyString;
};