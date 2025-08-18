import type { ThreadRepository } from "../domain/ThreadRepository";
import type { Thread } from "../domain/Thread";
import type { ThreadId } from "../domain/ThreadId";

export class InMemoryThreadRepository implements ThreadRepository {
    private static storage: Map<string, Thread> = new Map();

    async save(thread: Thread): Promise<void> {
        InMemoryThreadRepository.storage.set(thread.idValue(), thread);
    }

    async find(id: ThreadId): Promise<Thread | null> {
        const found = InMemoryThreadRepository.storage.get(id.getValue());
        if (found) return found;
        return null;
    }
}
