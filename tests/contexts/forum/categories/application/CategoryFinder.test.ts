import { describe, test, expect } from 'vitest';
import { MockCategoryRepository } from '../domain/MockCategoryRepository';
import { CategoryIdMother } from '../domain/CategoryIdMother';
import { CategoryMother } from "../domain/CategoryMother";
import { CategoryFinder } from '~~/server/contexts/forum/categories/application/find/CategoryFinder';
import { CategoryNotFoundError } from '~~/server/contexts/forum/categories/domain/CategoryNotFoundError';

describe('CategoryFinder', () => {
    const repository = new MockCategoryRepository();
    const categoryFinder = new CategoryFinder(repository);

    test('should throw an error when category is not found', async () => {
        const noExistingCategoryId = CategoryIdMother.create();
        repository.shouldFindAndReturnNull(noExistingCategoryId);

        await expect(categoryFinder.execute(noExistingCategoryId)).rejects.toThrow(CategoryNotFoundError);
    })

    test('should return an existing category', async () => {
        const expectedCategory = CategoryMother.create();
        const categoryPrimitives = expectedCategory.toPrimitives();
        repository.shouldFind(categoryPrimitives);

        expect(await categoryFinder.execute(categoryPrimitives.id)).toEqual(categoryPrimitives);
    })
})