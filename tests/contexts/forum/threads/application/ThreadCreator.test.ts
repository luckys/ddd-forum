import { describe, test, expect } from 'vitest';
import { ThreadCreator } from "~~/server/contexts/forum/threads/application/create/ThreadCreator";
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { ThreadCreatedDomainEventMother } from "../domain/ThreadCreatedDomainEventMother";
import { ThreadMother } from "../domain/ThreadMother";
import { ThreadRepositoryMock } from "../domain/ThreadRepositoryMock";

describe('ThreadCreator', () => {
    const repository = new ThreadRepositoryMock();
    const eventBus = new MockEventBus();
    const threadCreator = new ThreadCreator(repository, eventBus);

    test('should create a valid thread', async () => {
        const expectedThread = ThreadMother.create();
        const primitives = expectedThread.toPrimitives();
        const createdDomainEvent = ThreadCreatedDomainEventMother.create({ aggregateId: primitives.id, title: primitives.title });

        repository.shouldSave(expectedThread);
        eventBus.shouldPublish([createdDomainEvent]);

        await expect(threadCreator.execute(
            primitives.id,
            primitives.title,
        )).resolves.toBeUndefined();
    });
});
