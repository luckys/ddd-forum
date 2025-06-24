import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";
import { CategoryCreatedDomainEvent } from "~~/server/contexts/forum/categories/domain/CategoryCreatedDomainEvent";
import { RandomGenerator } from "~~/tests/contexts/shared/infrastructure/RandomGenerator";

export class CategoryCreatedDomainEventMother {
    static create(
        params?: Partial<CategoryCreatedDomainEvent>,
    ): CategoryCreatedDomainEvent {
        return new CategoryCreatedDomainEvent(
            params?.id ?? (new UuidIdentifier()).generate(),
            params?.name ?? RandomGenerator.generateString(8),
            params?.description ?? RandomGenerator.generateString(20),
            params?.eventId ?? (new UuidIdentifier()).generate(),
            params?.occurredOn ?? new Date(),
        );
    }
}