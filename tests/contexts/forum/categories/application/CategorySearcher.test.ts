import { describe, expect, test } from 'vitest';
import { CategorySearcher } from "~~/server/contexts/forum/categories/application/search/CategorySearcher";
import { CriteriaMother } from "~~/tests/contexts/shared/domain/criteria/CriteriaMother";
import { CategoryMother } from "../domain/CategoryMother";
import { CategoryRepositoryMock } from '../domain/CategoryRepositoryMock';

describe('CategorySearcher', () => {
    const repository = new CategoryRepositoryMock();
    const categorySearcher = new CategorySearcher(repository);

    test('should return empty array when category is not found', async () => {
        const criteriaForNoExistingCategory = CriteriaMother.create();
        repository.shouldSearchEmptyCategories(criteriaForNoExistingCategory);

        await expect(categorySearcher.execute(criteriaForNoExistingCategory)).resolves.toEqual([]);
    })

    test('should return array of categories', async () => {
        const existingCategories = [CategoryMother.create(), CategoryMother.create()];
        const criteriaForNoExistingCategory = CriteriaMother.create();
        repository.shouldSearch(criteriaForNoExistingCategory, existingCategories);

        await expect(categorySearcher.execute(criteriaForNoExistingCategory)).resolves.toEqual(existingCategories);
    })
})