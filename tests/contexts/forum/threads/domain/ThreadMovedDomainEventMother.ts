import { ThreadMovedDomainEvent } from "~~/server/contexts/forum/threads/domain/ThreadMovedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";

export class ThreadMovedDomainEventMother {
    static create(params: { aggregateId: string; categoryId: string }): ThreadMovedDomainEvent {
        return new ThreadMovedDomainEvent(
            params.aggregateId,
            params.categoryId,
            new UuidIdentifier().generate(),
            new Date(),
        );
    }
}
