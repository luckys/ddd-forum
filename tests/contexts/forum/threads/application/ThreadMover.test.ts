import { beforeEach, describe, expect, test } from 'vitest';
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { ThreadRepositoryMock } from "../domain/ThreadRepositoryMock";
import { ThreadMother } from "../domain/ThreadMother";
import { ThreadMovedDomainEventMother } from "../domain/ThreadMovedDomainEventMother";
import { ThreadMover } from "~~/server/contexts/forum/threads/application/move/ThreadMover";
import { ThreadId } from "~~/server/contexts/forum/threads/domain/ThreadId";
import { ThreadNotFoundError } from "~~/server/contexts/forum/threads/domain/ThreadNotFoundError";

describe('ThreadMover', () => {
    let repository: ThreadRepositoryMock;
    let eventBus: MockEventBus;
    let threadMover: ThreadMover;

    beforeEach(() => {
        repository = new ThreadRepositoryMock();
        eventBus = new MockEventBus();
        threadMover = new ThreadMover(repository, eventBus);
    });

    test('should move thread to another category', async () => {
        const thread = ThreadMother.create();
        const newCategoryId = 'category-123';
        const expectedEvent = ThreadMovedDomainEventMother.create({ aggregateId: thread.idValue(), categoryId: newCategoryId });

        repository.shouldFind(thread);
        repository.shouldSave(thread);
        eventBus.shouldPublish([expectedEvent]);

        await expect(threadMover.execute(thread.idValue(), newCategoryId)).resolves.toBeUndefined();
    });

    test('should throw ThreadNotFoundError when thread does not exist', async () => {
        const id = new ThreadId('non-existent');
        repository.shouldFindAndReturnNull(id);

        await expect(threadMover.execute(id.getValue(), 'category-123')).rejects.toThrow(ThreadNotFoundError);
    });
});
