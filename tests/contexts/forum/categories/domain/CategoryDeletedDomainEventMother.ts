import { CategoryDeletedDomainEvent } from "~~/server/contexts/forum/categories/domain/CategoryDeletedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";

export class CategoryDeletedDomainEventMother {
    static create(
        params?: Partial<CategoryDeletedDomainEvent>,
    ): CategoryDeletedDomainEvent {
        return new CategoryDeletedDomainEvent(
            params?.aggregateId ?? (new UuidIdentifier()).generate(),
            params?.eventId ?? (new UuidIdentifier()).generate(),
            params?.occurredOn ?? new Date(),
        );
    }
}