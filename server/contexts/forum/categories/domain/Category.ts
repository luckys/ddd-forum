import { AggregateRoot } from "~~/server/contexts/shared/domain/AggregateRoot";
import { CategoryId } from "./CategoryId";
import { CategoryName } from "./CategoryName";
import { CategoryDescription } from "./CategoryDescription";

export class Category extends AggregateRoot {
    private readonly createdAt: Date;
    private readonly updatedAt: Date;
    private readonly deletedAt: Date | null;

    private constructor(
        private readonly id: CategoryId,
        private readonly name: CategoryName,
        private readonly description: CategoryDescription,
    ) {
        super();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.deletedAt = null;
    }

    static create(id: string, name: string, description?: string | null | undefined): Category {
        return new Category(
            new CategoryId(id),
            new CategoryName(name),
            new CategoryDescription(description),
        )
    }

    idValue(): string {
        return this.id.getValue();
    }

    nameValue(): string {
        return this.name.getValue();
    }

    descriptionValue(): string | null | undefined {
        return this.description.getValue();
    }

    toPrimitives() {
        return {
            id: this.idValue(),
            name: this.nameValue(),
            description: this.descriptionValue(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        }
    }
}