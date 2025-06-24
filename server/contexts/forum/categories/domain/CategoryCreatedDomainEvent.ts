import { CategoryDomainEvent } from "~~/server/contexts/forum/categories/domain/CategoryDomainEvent";
import { DomainEventAttributes } from "~~/server/contexts/shared/domain/event/DomainEvent";

export class CategoryCreatedDomainEvent extends CategoryDomainEvent {
    static eventName = "forum.categories.created";

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string | null | undefined,
        eventId: string,
        occurredOn?: Date,
    ) {
        super(CategoryCreatedDomainEvent.eventName, id, eventId, occurredOn);
    }

    static fromPrimitives(
        aggregateId: string,
        eventId: string,
        occurredOn: Date,
        attributes: DomainEventAttributes,
    ): CategoryCreatedDomainEvent {
        return new CategoryCreatedDomainEvent(
            aggregateId,
            attributes.name as string,
            attributes.description as string,
            eventId,
            occurredOn,
        );
    }

    toPrimitives(): DomainEventAttributes {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            eventId: this.eventId,
            occurredOn: this.occurredOn
        };
    }
}