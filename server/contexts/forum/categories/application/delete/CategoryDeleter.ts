import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";
import { CategoryId } from "../../domain/CategoryId";
import { CategoryNotFoundError } from "../../domain/CategoryNotFoundError";
import { CategoryRepository } from "../../domain/CategoryRepository";

export class CategoryDeleter {
    constructor(
        private readonly repository: CategoryRepository,
        private readonly eventBus: EventBus,
    ) { }

    async execute(id: string): Promise<void> {
        const categoryId = new CategoryId(id);
        const category = await this.repository.find(categoryId);

        if (!category) {
            throw new CategoryNotFoundError(id);
        }

        await this.repository.delete(categoryId);
        await this.eventBus.publish(category.pullDomainEvents());
    }
}
