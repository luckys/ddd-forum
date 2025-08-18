import { ThreadUpdatedDomainEvent } from "~~/server/contexts/forum/threads/domain/ThreadUpdatedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";

export class ThreadUpdatedDomainEventMother {
    static create(params: { aggregateId: string; title?: string; visibility?: 'public' | 'members' | 'premium'; status?: 'open' | 'closed' | 'archived' }): ThreadUpdatedDomainEvent {
        return new ThreadUpdatedDomainEvent(
            params.aggregateId,
            new UuidIdentifier().generate(),
            new Date(),
            params.title,
            params.visibility,
            params.status,
        );
    }
}
