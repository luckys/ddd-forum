import { CategoryId } from "~~/server/contexts/forum/categories/domain/CategoryId";
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria";
import { Category } from "./Category";

export interface CategoryRepository {
    save(category: Category): Promise<void>;
    find(id: CategoryId): Promise<Category | null>;
    search(criteria: Criteria): Promise<Category[]>;
    delete(id: CategoryId): Promise<void>;
}