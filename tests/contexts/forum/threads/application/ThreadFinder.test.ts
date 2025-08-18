import { describe, expect, test } from 'vitest';
import { ThreadFinder } from '~~/server/contexts/forum/threads/application/find/ThreadFinder';
import { ThreadNotFoundError } from '~~/server/contexts/forum/threads/domain/ThreadNotFoundError';
import { ThreadIdMother } from '../domain/ThreadIdMother';
import { ThreadMother } from "../domain/ThreadMother";
import { ThreadRepositoryMock } from '../domain/ThreadRepositoryMock';

describe('ThreadFinder', () => {
    const repository = new ThreadRepositoryMock();
    const threadFinder = new ThreadFinder(repository);

    test('should throw an error when thread is not found', async () => {
        const nonExistingId = ThreadIdMother.create();
        repository.shouldFindAndReturnNull(nonExistingId);

        await expect(threadFinder.execute(nonExistingId)).rejects.toThrow(ThreadNotFoundError);
    });

    test('should return an existing thread', async () => {
        const expected = ThreadMother.create();
        const primitives = expected.toPrimitives();
        repository.shouldFind(expected);

        expect(await threadFinder.execute(ThreadIdMother.create(primitives.id))).toEqual(expected);
    });
});
