import { CategoryRepository } from "../../domain/CategoryRepository";
import { Category } from "~~/server/contexts/forum/categories/domain/Category";

export class CategorySearcher {
    constructor(
        private readonly repository: CategoryRepository,
    ) {}

    async execute(criteria: Criteria): Promise<Category[]> {
        return await this.repository.search(criteria);
    }
}