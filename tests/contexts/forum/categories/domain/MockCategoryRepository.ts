import { vi, expect } from 'vitest';
import type { CategoryRepository } from "~~/server/contexts/forum/categories/domain/CategoryRepository";
import type { Category } from "~~/server/contexts/forum/categories/domain/Category";
import type { CategoryId } from "~~/server/contexts/forum/categories/domain/CategoryId";

export class MockCategoryRepository implements CategoryRepository {
    private readonly mockSave = vi.fn();
    private readonly mockFind = vi.fn();

    async save(category: Category): Promise<void> {
        const primitives = category.toPrimitives();
        expect(this.mockSave).toHaveBeenCalledWith(
            expect.objectContaining({
                id: primitives.id,
                name: primitives.name,
                description: primitives.description
            })
        );

        return Promise.resolve();
    }

    async find(id: CategoryId): Promise<Category | null> {
        expect(this.mockFind).toHaveBeenCalledWith(id);
        return this.mockFind() as Promise<Category | null>;
    }

    shouldSave(category: Category): void {
        this.mockSave(category.toPrimitives());
    }

    shouldFindAndReturnNull(id: CategoryId): void {
		this.mockFind(id);
		this.mockFind.mockReturnValueOnce(null);
	}

    shouldFind(category: Category): void {
        this.mockFind(category.id);
        this.mockFind.mockReturnValueOnce(category);
    }
}
