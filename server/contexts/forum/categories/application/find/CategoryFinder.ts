import { CategoryRepository } from "../../domain/CategoryRepository";
import { Category } from "../../domain/Category";
import { CategoryId } from "../../domain/CategoryId";
import { CategoryNotFoundError } from "../../domain/CategoryNotFoundError";

export class CategoryFinder {
    
    constructor(
        private readonly repository: CategoryRepository,
    ) {}

    async execute(id: CategoryId): Promise<Category> {
        const category = await this.repository.find(id);

        if (!category) {
            throw new CategoryNotFoundError(id.getValue());
        }

        return category;
    }
}