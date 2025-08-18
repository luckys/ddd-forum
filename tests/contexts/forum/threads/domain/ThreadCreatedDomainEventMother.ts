import { ThreadCreatedDomainEvent } from "~~/server/contexts/forum/threads/domain/ThreadCreatedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";

export class ThreadCreatedDomainEventMother {
    static create(params?: Partial<ThreadCreatedDomainEvent>): ThreadCreatedDomainEvent {
        return new ThreadCreatedDomainEvent(
            params?.aggregateId ?? new UuidIdentifier().generate(),
            params?.title ?? "Untitled",
            params?.eventId ?? new UuidIdentifier().generate(),
            params?.occurredOn ?? new Date(),
        );
    }
}
