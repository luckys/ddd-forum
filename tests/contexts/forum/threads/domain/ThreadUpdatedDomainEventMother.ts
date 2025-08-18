import { ThreadUpdatedDomainEvent } from "~~/server/contexts/forum/threads/domain/ThreadUpdatedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";

export class ThreadUpdatedDomainEventMother {
    static create(params: { aggregateId: string; title: string }): ThreadUpdatedDomainEvent {
        return new ThreadUpdatedDomainEvent(
            params.aggregateId,
            params.title,
            new UuidIdentifier().generate(),
            new Date(),
        );
    }
}
