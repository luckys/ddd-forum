import { vi } from 'vitest';
import type { Thread } from "~~/server/contexts/forum/threads/domain/Thread";
import { ThreadId } from "~~/server/contexts/forum/threads/domain/ThreadId";
import type { ThreadRepository } from "~~/server/contexts/forum/threads/domain/ThreadRepository";

export class ThreadRepositoryMock implements ThreadRepository {
    private readonly mockSave = vi.fn();
    private readonly mockFind = vi.fn();

    async save(thread: Thread): Promise<void> {
        this.mockSave(thread);
    }

    async find(id: ThreadId): Promise<Thread | null> {
        return this.mockFind(id) as Promise<Thread | null>;
    }

    shouldSave(thread: Thread): void {
        this.mockSave(thread);
    }

    shouldFind(thread: Thread): void {
        this.mockFind.mockReturnValueOnce(thread);
    }

    shouldFindAndReturnNull(_id: ThreadId): void {
        this.mockFind.mockReturnValueOnce(null);
    }
}
