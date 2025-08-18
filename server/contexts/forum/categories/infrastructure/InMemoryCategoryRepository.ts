import { CategoryRepository } from "../domain/CategoryRepository";
import { Category } from "../domain/Category";
import { CategoryId } from "../domain/CategoryId";
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria";

export class InMemoryCategoryRepository implements CategoryRepository {
  private readonly data = new Map<string, Category>();

  async save(category: Category): Promise<void> {
    this.data.set(category.idValue(), category);
  }

  async find(id: CategoryId): Promise<Category | null> {
    return this.data.get(id.getValue()) ?? null;
  }

  async search(_criteria: Criteria): Promise<Category[]> {
    return Array.from(this.data.values());
  }

  async count(_criteria: Criteria): Promise<number> {
    return this.data.size;
  }

  async delete(id: CategoryId): Promise<void> {
    this.data.delete(id.getValue());
  }
}
