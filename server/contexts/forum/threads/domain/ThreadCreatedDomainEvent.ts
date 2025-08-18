import { DomainEventAttributes } from "~~/server/contexts/shared/domain/event/DomainEvent";
import { ThreadDomainEvent } from "./ThreadDomainEvent";

export class ThreadCreatedDomainEvent extends ThreadDomainEvent {
    static eventName = "forum.threads.created";

    constructor(
        public readonly id: string,
        public readonly title: string,
        eventId: string,
        occurredOn?: Date,
    ) {
        super(ThreadCreatedDomainEvent.eventName, id, eventId, occurredOn);
    }

    static fromPrimitives(
        aggregateId: string,
        eventId: string,
        occurredOn: Date,
        attributes: DomainEventAttributes,
    ): ThreadCreatedDomainEvent {
        return new ThreadCreatedDomainEvent(
            aggregateId,
            attributes.title as string,
            eventId,
            occurredOn,
        );
    }

    toPrimitives(): DomainEventAttributes {
        return {
            id: this.id,
            title: this.title,
            eventId: this.eventId,
            occurredOn: this.occurredOn,
        };
    }
}
