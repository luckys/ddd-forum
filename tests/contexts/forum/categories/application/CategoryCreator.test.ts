import { describe, test } from 'vitest';
import { CategoryCreator } from "~~/server/contexts/forum/categories/application/create/CategoryCreator";
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { CategoryCreatedDomainEventMother } from "../domain/CategoryCreatedDomainEventMother";
import { CategoryMother } from "../domain/CategoryMother";
import { CategoryRepositoryMock } from '../domain/CategoryRepositoryMock';

describe('CategoryCreator', () => {
    const repository = new CategoryRepositoryMock();
    const eventBus = new MockEventBus();
    const categoryCreator = new CategoryCreator(repository, eventBus);

    test('should create a valid category', async () => {
        const expectedCategory = CategoryMother.create();
        const categoryPrimitives = expectedCategory.toPrimitives();
        const createdDomainEvent = CategoryCreatedDomainEventMother.create(categoryPrimitives);

        repository.shouldSave(expectedCategory);
        eventBus.shouldPublish([createdDomainEvent]);

        await categoryCreator.execute(
            categoryPrimitives.id,
            categoryPrimitives.name,
            categoryPrimitives.description
        );
    })
})