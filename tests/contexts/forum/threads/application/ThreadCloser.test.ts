import { beforeEach, describe, expect, test } from 'vitest';
import { ThreadCloser } from "~~/server/contexts/forum/threads/application/close/ThreadCloser";
import { ThreadNotFoundError } from "~~/server/contexts/forum/threads/domain/ThreadNotFoundError";
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { ThreadClosedDomainEventMother } from "../domain/ThreadClosedDomainEventMother";
import { ThreadMother } from "../domain/ThreadMother";
import { ThreadRepositoryMock } from "../domain/ThreadRepositoryMock";
import { ThreadId } from "~~/server/contexts/forum/threads/domain/ThreadId";

describe('ThreadCloser', () => {
    let repository: ThreadRepositoryMock;
    let eventBus: MockEventBus;
    let threadCloser: ThreadCloser;

    beforeEach(() => {
        repository = new ThreadRepositoryMock();
        eventBus = new MockEventBus();
        threadCloser = new ThreadCloser(repository, eventBus);
    });

    test('should close an existing open thread', async () => {
        const existingThread = ThreadMother.create();
        const closedDomainEvent = ThreadClosedDomainEventMother.create({ aggregateId: existingThread.idValue() });

        repository.shouldFind(existingThread);
        repository.shouldSave(existingThread);
        eventBus.shouldPublish([closedDomainEvent]);

        await expect(threadCloser.execute(existingThread.idValue())).resolves.toBeUndefined();
    });

    test('should throw ThreadNotFoundError when the thread does not exist', async () => {
        const nonExistentId = new ThreadId('invalid-id');
        repository.shouldFindAndReturnNull(nonExistentId);

        await expect(threadCloser.execute(nonExistentId.getValue())).rejects.toThrow(
            ThreadNotFoundError
        );
    });
});
