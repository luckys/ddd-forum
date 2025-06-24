import { describe, test } from 'vitest';
import { MockCategoryRepository } from '../domain/MockCategoryRepository';
import { MockEventBus } from "~~/tests/contexts/shared/infrastructure/MockEventBus";
import { CategoryCreator } from "~~/server/contexts/forum/categories/application/create/CategoryCreator";
import { CategoryMother } from "../domain/CategoryMother";
import { CategoryCreatedDomainEventMother } from "../domain/CategoryCreatedDomainEventMother";

describe('CategoryCreator', () => {
    const repository = new MockCategoryRepository();
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