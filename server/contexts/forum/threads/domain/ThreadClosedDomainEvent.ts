import { DomainEventAttributes } from "~~/server/contexts/shared/domain/event/DomainEvent";
import { ThreadDomainEvent } from "./ThreadDomainEvent";

export class ThreadClosedDomainEvent extends ThreadDomainEvent {
    static eventName = "forum.threads.closed";

    constructor(
        public readonly id: string,
        eventId: string,
        occurredOn?: Date,
    ) {
        super(ThreadClosedDomainEvent.eventName, id, eventId, occurredOn);
    }

    static fromPrimitives(
        aggregateId: string,
        eventId: string,
        occurredOn: Date,
        _attributes: DomainEventAttributes,
    ): ThreadClosedDomainEvent {
        return new ThreadClosedDomainEvent(
            aggregateId,
            eventId,
            occurredOn,
        );
    }

    toPrimitives(): DomainEventAttributes {
        return {
            id: this.id,
            eventId: this.eventId,
            occurredOn: this.occurredOn,
        };
    }
}
