import { vi } from 'vitest';
import type { Category } from "~~/server/contexts/forum/categories/domain/Category";
import { CategoryId } from "~~/server/contexts/forum/categories/domain/CategoryId";
import type { CategoryRepository } from "~~/server/contexts/forum/categories/domain/CategoryRepository";
import type { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria";

export class CategoryRepositoryMock implements CategoryRepository {
    private readonly mockSave = vi.fn();
    private readonly mockFind = vi.fn();
    private readonly mockSearch = vi.fn();
    private readonly mockDelete = vi.fn();

    async save(category: Category): Promise<void> {
        this.mockSave(category);
    }

    async find(id: CategoryId): Promise<Category | null> {
        return this.mockFind(id) as Promise<Category | null>;
    }

    async search(criteria: Criteria): Promise<Category[]> {
        return this.mockSearch(criteria) as Promise<Category[]>;
    }

    async delete(id: CategoryId): Promise<void> {
        this.mockDelete(id);
    }

    shouldSave(category: Category): void {
        this.mockSave(category);
    }

    shouldFindAndReturnNull(_id: CategoryId): void {
        this.mockFind.mockReturnValueOnce(null);
    }

    shouldFind(category: Category): void {
        this.mockFind.mockReturnValueOnce(category);
    }

    shouldFindAndReturnEmptyArray(_id: CategoryId): void {
        this.mockFind.mockReturnValueOnce([]);
    }

    shouldSearchEmptyCategories(_criteria: Criteria): void {
        this.mockSearch.mockReturnValueOnce([]);
    }

    shouldSearch(_criteria: Criteria, categories: Category[]): void {
        this.mockSearch.mockReturnValueOnce(categories);
    }

    shouldDelete(_id: CategoryId): void {
        this.mockDelete.mockImplementationOnce(() => undefined);
    }
}

