import { DomainEventAttributes } from "~~/server/contexts/shared/domain/event/DomainEvent";
import { ThreadDomainEvent } from "./ThreadDomainEvent";

export class ThreadTaggedDomainEvent extends ThreadDomainEvent {
    static eventName = "forum.threads.tagged";

    constructor(
        public readonly id: string,
        public readonly tag: string,
        eventId: string,
        occurredOn?: Date,
    ) {
        super(ThreadTaggedDomainEvent.eventName, id, eventId, occurredOn);
    }

    static fromPrimitives(
        aggregateId: string,
        eventId: string,
        occurredOn: Date,
        attributes: DomainEventAttributes,
    ): ThreadTaggedDomainEvent {
        return new ThreadTaggedDomainEvent(
            aggregateId,
            attributes.tag as string,
            eventId,
            occurredOn,
        );
    }

    toPrimitives(): DomainEventAttributes {
        return {
            id: this.id,
            tag: this.tag,
            eventId: this.eventId,
            occurredOn: this.occurredOn,
        };
    }
}
