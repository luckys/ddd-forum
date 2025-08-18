import { DomainEvent, DomainEventAttributes } from "~~/server/contexts/shared/domain/event/DomainEvent";

export class ThreadDomainEvent extends DomainEvent {
    static eventName = "forum.thread.*";

    constructor(
        eventName: string,
        aggregateId: string,
        eventId: string,
        occurredOn?: Date,
    ) {
        super(eventName, aggregateId, eventId, occurredOn);
    }

    static fromPrimitives(
        aggregateId: string,
        eventId: string,
        occurredOn: Date,
    ): ThreadDomainEvent {
        return new ThreadDomainEvent(
            ThreadDomainEvent.eventName,
            aggregateId,
            eventId,
            occurredOn,
        );
    }

    toPrimitives(): DomainEventAttributes {
        return {
            id: this.aggregateId,
            eventId: this.eventId,
            occurredOn: this.occurredOn,
        };
    }
}
