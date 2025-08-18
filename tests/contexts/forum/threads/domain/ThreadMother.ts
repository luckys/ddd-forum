import { Thread } from "~~/server/contexts/forum/threads/domain/Thread";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";
import { RandomGenerator } from "~~/tests/contexts/shared/infrastructure/RandomGenerator";

export class ThreadMother {
    static create(id?: string, title?: string): Thread {
        const thread = Thread.create(
            id ?? new UuidIdentifier().generate(),
            title ?? RandomGenerator.generateString(12),
        );
        thread.pullDomainEvents();
        return thread;
    }
}
