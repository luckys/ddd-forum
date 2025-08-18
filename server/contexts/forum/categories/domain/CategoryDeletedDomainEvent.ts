import { CategoryDomainEvent } from "./CategoryDomainEvent";

export class CategoryDeletedDomainEvent extends CategoryDomainEvent {
    static eventName = 'category.deleted';

    constructor(
        aggregateId: string,
        eventId: string,
        occurredOn?: Date,
    ) {
        super(CategoryDeletedDomainEvent.eventName, aggregateId, eventId, occurredOn);
    }
}
