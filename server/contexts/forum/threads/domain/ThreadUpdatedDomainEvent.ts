import { DomainEventAttributes } from "~~/server/contexts/shared/domain/event/DomainEvent";
import { ThreadDomainEvent } from "./ThreadDomainEvent";
import type { ThreadVisibilityValue } from "./ThreadVisibility";
import type { ThreadStatusValue } from "./ThreadStatus";

export class ThreadUpdatedDomainEvent extends ThreadDomainEvent {
    static eventName = "forum.threads.updated";

    constructor(
        public readonly id: string,
        eventId: string,
        occurredOn?: Date,
        public readonly title?: string,
        public readonly visibility?: ThreadVisibilityValue,
        public readonly status?: ThreadStatusValue,
    ) {
        super(ThreadUpdatedDomainEvent.eventName, id, eventId, occurredOn);
    }

    static fromPrimitives(
        aggregateId: string,
        eventId: string,
        occurredOn: Date,
        attributes: DomainEventAttributes,
    ): ThreadUpdatedDomainEvent {
        return new ThreadUpdatedDomainEvent(
            aggregateId,
            eventId,
            occurredOn,
            attributes.title as string | undefined,
            attributes.visibility as ThreadVisibilityValue | undefined,
            attributes.status as ThreadStatusValue | undefined,
        );
    }

    toPrimitives(): DomainEventAttributes {
        return {
            id: this.id,
            title: this.title,
            visibility: this.visibility,
            status: this.status,
            eventId: this.eventId,
            occurredOn: this.occurredOn,
        };
    }
}
