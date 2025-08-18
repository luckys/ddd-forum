import { beforeEach, describe, expect, test } from 'vitest';
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { ThreadRepositoryMock } from "../domain/ThreadRepositoryMock";
import { ThreadMother } from "../domain/ThreadMother";
import { ThreadUpdatedDomainEventMother } from "../domain/ThreadUpdatedDomainEventMother";
import { ThreadUpdater } from "~~/server/contexts/forum/threads/application/update/ThreadUpdater";
import { ThreadId } from "~~/server/contexts/forum/threads/domain/ThreadId";
import { ThreadNotFoundError } from "~~/server/contexts/forum/threads/domain/ThreadNotFoundError";

describe('ThreadUpdater', () => {
    let repository: ThreadRepositoryMock;
    let eventBus: MockEventBus;
    let threadUpdater: ThreadUpdater;

    beforeEach(() => {
        repository = new ThreadRepositoryMock();
        eventBus = new MockEventBus();
        threadUpdater = new ThreadUpdater(repository, eventBus);
    });

    test('should update thread title', async () => {
        const existing = ThreadMother.create();
        const newTitle = 'Updated Title';
        const expectedEvent = ThreadUpdatedDomainEventMother.create({ aggregateId: existing.idValue(), title: newTitle });

        repository.shouldFind(existing);
        repository.shouldSave(existing);
        eventBus.shouldPublish([expectedEvent]);

        await expect(threadUpdater.execute(existing.idValue(), newTitle)).resolves.toBeUndefined();
    });

    test('should throw ThreadNotFoundError when thread does not exist', async () => {
        const id = new ThreadId('non-existent');
        repository.shouldFindAndReturnNull(id);

        await expect(threadUpdater.execute(id.getValue(), 'whatever')).rejects.toThrow(ThreadNotFoundError);
    });
});
