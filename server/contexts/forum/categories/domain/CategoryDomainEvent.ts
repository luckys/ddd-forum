import {DomainEvent, DomainEventAttributes} from "~~/server/contexts/shared/domain/event/DomainEvent";

export class CategoryDomainEvent extends DomainEvent {
    static eventName = "forum.category.*";
    private attributes: unknown;

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
    ): CategoryDomainEvent {
        return new CategoryDomainEvent(
            CategoryDomainEvent.eventName,
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