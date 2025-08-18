import { ThreadTaggedDomainEvent } from "~~/server/contexts/forum/threads/domain/ThreadTaggedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";

export class ThreadTaggedDomainEventMother {
    static create(params: { aggregateId: string; tag: string }): ThreadTaggedDomainEvent {
        return new ThreadTaggedDomainEvent(
            params.aggregateId,
            params.tag,
            new UuidIdentifier().generate(),
            new Date(),
        );
    }
}
