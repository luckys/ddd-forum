import { describe, expect, test } from 'vitest';
import { CategoryFinder } from '~~/server/contexts/forum/categories/application/find/CategoryFinder';
import { CategoryNotFoundError } from '~~/server/contexts/forum/categories/domain/CategoryNotFoundError';
import { CategoryIdMother } from '../domain/CategoryIdMother';
import { CategoryMother } from "../domain/CategoryMother";
import { CategoryRepositoryMock } from '../domain/CategoryRepositoryMock';

describe('CategoryFinder', () => {
    const repository = new CategoryRepositoryMock();
    const categoryFinder = new CategoryFinder(repository);

    test('should throw an error when category is not found', async () => {
        const noExistingCategoryId = CategoryIdMother.create();
        repository.shouldFindAndReturnNull(noExistingCategoryId);

        await expect(categoryFinder.execute(noExistingCategoryId)).rejects.toThrow(CategoryNotFoundError);
    })

    test('should return an existing category', async () => {
        const expectedCategory = CategoryMother.create();
        const categoryPrimitives = expectedCategory.toPrimitives();
        repository.shouldFind(expectedCategory);

        expect(await categoryFinder.execute(CategoryIdMother.create(categoryPrimitives.id))).toEqual(expectedCategory);
    })
})