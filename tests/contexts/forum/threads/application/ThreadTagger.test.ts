import { beforeEach, describe, expect, test } from 'vitest';
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { ThreadRepositoryMock } from "../domain/ThreadRepositoryMock";
import { ThreadMother } from "../domain/ThreadMother";
import { ThreadTaggedDomainEventMother } from "../domain/ThreadTaggedDomainEventMother";
import { ThreadTagger } from "~~/server/contexts/forum/threads/application/tag/ThreadTagger";
import { ThreadId } from "~~/server/contexts/forum/threads/domain/ThreadId";
import { ThreadNotFoundError } from "~~/server/contexts/forum/threads/domain/ThreadNotFoundError";

describe('ThreadTagger', () => {
    let repository: ThreadRepositoryMock;
    let eventBus: MockEventBus;
    let threadTagger: ThreadTagger;

    beforeEach(() => {
        repository = new ThreadRepositoryMock();
        eventBus = new MockEventBus();
        threadTagger = new ThreadTagger(repository, eventBus);
    });

    test('should add a new tag to thread', async () => {
        const thread = ThreadMother.create();
        const tag = 'nuxt';
        const expectedEvent = ThreadTaggedDomainEventMother.create({ aggregateId: thread.idValue(), tag });

        repository.shouldFind(thread);
        repository.shouldSave(thread);
        eventBus.shouldPublish([expectedEvent]);

        await expect(threadTagger.execute(thread.idValue(), tag)).resolves.toBeUndefined();
    });

    test('should throw ThreadNotFoundError when thread does not exist', async () => {
        const id = new ThreadId('non-existent');
        repository.shouldFindAndReturnNull(id);

        await expect(threadTagger.execute(id.getValue(), 'nuxt')).rejects.toThrow(ThreadNotFoundError);
    });
});
