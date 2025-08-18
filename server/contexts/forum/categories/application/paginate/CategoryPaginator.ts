import { CategoryRepository } from "../../domain/CategoryRepository"
import { Category } from "../../domain/Category"
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria"

export class CategoryPaginator {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(criteria: Criteria): Promise<{ items: Category[]; total: number }> {
    const [items, total] = await Promise.all([
      this.repository.search(criteria),
      this.repository.count(criteria),
    ])
    return { items, total }
  }
}
