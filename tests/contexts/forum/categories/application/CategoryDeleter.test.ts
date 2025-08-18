import { beforeEach, describe, expect, test } from 'vitest';
import { CategoryDeleter } from "~~/server/contexts/forum/categories/application/delete/CategoryDeleter";
import { CategoryId } from "~~/server/contexts/forum/categories/domain/CategoryId";
import { CategoryNotFoundError } from "~~/server/contexts/forum/categories/domain/CategoryNotFoundError";
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { CategoryDeletedDomainEventMother } from '../domain/CategoryDeletedDomainEventMother';
import { CategoryMother } from "../domain/CategoryMother";
import { CategoryRepositoryMock } from '../domain/CategoryRepositoryMock';

describe('CategoryDeleter', () => {
    let repository: CategoryRepositoryMock;
    let eventBus: MockEventBus;
    let categoryDeleter: CategoryDeleter;

    beforeEach(() => {
        repository = new CategoryRepositoryMock();
        eventBus = new MockEventBus();
        categoryDeleter = new CategoryDeleter(repository, eventBus);
    });

    test('should delete an existing category', async () => {
        const existingCategory = CategoryMother.create();
        const deletedDomainEvent = CategoryDeletedDomainEventMother.create({ aggregateId: existingCategory.idValue() });

        repository.shouldFind(existingCategory);
        repository.shouldDelete(new CategoryId(existingCategory.idValue()));
        eventBus.shouldPublish([deletedDomainEvent]);

        await categoryDeleter.execute(existingCategory.idValue());
    });

    test('should throw CategoryNotFoundError when the category does not exist', async () => {
        const nonExistentId = new CategoryId('invalid-id');
        repository.shouldFindAndReturnNull(nonExistentId);

        await expect(categoryDeleter.execute(nonExistentId.getValue())).rejects.toThrow(
            CategoryNotFoundError
        );
    });
})