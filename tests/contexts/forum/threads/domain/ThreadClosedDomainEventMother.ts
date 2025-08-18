import { ThreadClosedDomainEvent } from "~~/server/contexts/forum/threads/domain/ThreadClosedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";

export class ThreadClosedDomainEventMother {
    static create(params?: Partial<ThreadClosedDomainEvent>): ThreadClosedDomainEvent {
        return new ThreadClosedDomainEvent(
            params?.aggregateId ?? new UuidIdentifier().generate(),
            params?.eventId ?? new UuidIdentifier().generate(),
            params?.occurredOn ?? new Date(),
        );
    }
}
