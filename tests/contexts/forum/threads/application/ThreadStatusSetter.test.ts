import { beforeEach, describe, expect, test } from 'vitest';
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { ThreadRepositoryMock } from "../domain/ThreadRepositoryMock";
import { ThreadMother } from "../domain/ThreadMother";
import { ThreadUpdatedDomainEventMother } from "../domain/ThreadUpdatedDomainEventMother";
import { ThreadStatusSetter } from "~~/server/contexts/forum/threads/application/status/ThreadStatusSetter";
import { ThreadId } from "~~/server/contexts/forum/threads/domain/ThreadId";
import { ThreadNotFoundError } from "~~/server/contexts/forum/threads/domain/ThreadNotFoundError";

describe('ThreadStatusSetter', () => {
    let repository: ThreadRepositoryMock;
    let eventBus: MockEventBus;
    let statusSetter: ThreadStatusSetter;

    beforeEach(() => {
        repository = new ThreadRepositoryMock();
        eventBus = new MockEventBus();
        statusSetter = new ThreadStatusSetter(repository, eventBus);
    });

    test('should change thread status', async () => {
        const thread = ThreadMother.create();
        const status = 'closed';
        const expectedEvent = ThreadUpdatedDomainEventMother.create({ aggregateId: thread.idValue(), status });

        repository.shouldFind(thread);
        repository.shouldSave(thread);
        eventBus.shouldPublish([expectedEvent]);

        await expect(statusSetter.execute(thread.idValue(), status)).resolves.toBeUndefined();
    });

    test('should throw ThreadNotFoundError when thread does not exist', async () => {
        const id = new ThreadId('non-existent');
        repository.shouldFindAndReturnNull(id);

        await expect(statusSetter.execute(id.getValue(), 'open')).rejects.toThrow(ThreadNotFoundError);
    });
});
