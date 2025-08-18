import { beforeEach, describe, expect, test } from 'vitest';
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { ThreadRepositoryMock } from "../domain/ThreadRepositoryMock";
import { ThreadMother } from "../domain/ThreadMother";
import { ThreadUpdatedDomainEventMother } from "../domain/ThreadUpdatedDomainEventMother";
import { ThreadVisibilitySetter } from "~~/server/contexts/forum/threads/application/visibility/ThreadVisibilitySetter";
import { ThreadId } from "~~/server/contexts/forum/threads/domain/ThreadId";
import { ThreadNotFoundError } from "~~/server/contexts/forum/threads/domain/ThreadNotFoundError";

describe('ThreadVisibilitySetter', () => {
    let repository: ThreadRepositoryMock;
    let eventBus: MockEventBus;
    let visibilitySetter: ThreadVisibilitySetter;

    beforeEach(() => {
        repository = new ThreadRepositoryMock();
        eventBus = new MockEventBus();
        visibilitySetter = new ThreadVisibilitySetter(repository, eventBus);
    });

    test('should change thread visibility', async () => {
        const thread = ThreadMother.create();
        const visibility = 'members';
        const expectedEvent = ThreadUpdatedDomainEventMother.create({ aggregateId: thread.idValue(), visibility });

        repository.shouldFind(thread);
        repository.shouldSave(thread);
        eventBus.shouldPublish([expectedEvent]);

        await expect(visibilitySetter.execute(thread.idValue(), visibility)).resolves.toBeUndefined();
    });

    test('should throw ThreadNotFoundError when thread does not exist', async () => {
        const id = new ThreadId('non-existent');
        repository.shouldFindAndReturnNull(id);

        await expect(visibilitySetter.execute(id.getValue(), 'public')).rejects.toThrow(ThreadNotFoundError);
    });
});
