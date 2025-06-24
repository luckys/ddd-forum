import { CategoryRepository } from "../../domain/CategoryRepository";
import { Category } from "../../domain/Category";
import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";


export class CategoryCreator {
    constructor(
        private readonly repository: CategoryRepository,
        private readonly eventBus: EventBus
    ) {}

    async execute(id: string, name: string, description: string | null | undefined): Promise<void> {
        const category = Category.create(id, name, description);

        await this.repository.save(category);
        await this.eventBus.publish(category.pullDomainEvents());
    }
}