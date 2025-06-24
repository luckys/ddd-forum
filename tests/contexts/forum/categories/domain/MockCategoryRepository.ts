import { vi, expect } from 'vitest';
import type { CategoryRepository } from "~~/server/contexts/forum/categories/domain/CategoryRepository";
import type { Category } from "~~/server/contexts/forum/categories/domain/Category";

export class MockCategoryRepository implements CategoryRepository {
    private readonly mockSave = vi.fn();

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

    shouldSave(category: Category): void {
        this.mockSave(category.toPrimitives());
    }
}
