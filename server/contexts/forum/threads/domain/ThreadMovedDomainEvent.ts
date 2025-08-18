import { DomainEventAttributes } from "~~/server/contexts/shared/domain/event/DomainEvent";
import { ThreadDomainEvent } from "./ThreadDomainEvent";

export class ThreadMovedDomainEvent extends ThreadDomainEvent {
    static eventName = "forum.threads.moved";

    constructor(
        public readonly id: string,
        public readonly categoryId: string,
        eventId: string,
        occurredOn?: Date,
    ) {
        super(ThreadMovedDomainEvent.eventName, id, eventId, occurredOn);
    }

    static fromPrimitives(
        aggregateId: string,
        eventId: string,
        occurredOn: Date,
        attributes: DomainEventAttributes,
    ): ThreadMovedDomainEvent {
        return new ThreadMovedDomainEvent(
            aggregateId,
            attributes.categoryId as string,
            eventId,
            occurredOn,
        );
    }

    toPrimitives(): DomainEventAttributes {
        return {
            id: this.id,
            categoryId: this.categoryId,
            eventId: this.eventId,
            occurredOn: this.occurredOn,
        };
    }
}
