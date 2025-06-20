
import { NonEmptyString } from "../NonEmptyString";

export type DomainEventAttributes = { [key: string]: unknown };

export abstract class DomainEvent {
    public readonly eventId: NonEmptyString;
	public readonly occurredOn: Date;

    protected constructor(
		public readonly eventName: NonEmptyString,
		public readonly aggregateId: NonEmptyString,
		eventId: string,
		occurredOn?: Date,
	) {
		this.eventId = NonEmptyString.create(eventId);
		this.occurredOn = occurredOn ?? new Date();
	}

    abstract toPrimitives(): DomainEventAttributes;

    static fromPrimitives: (
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	) => DomainEvent;
}   