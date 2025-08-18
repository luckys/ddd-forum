import { AggregateRoot } from "~~/server/contexts/shared/domain/AggregateRoot";
import { CategoryId } from "./CategoryId";
import { CategoryName } from "./CategoryName";
import { CategoryDescription } from "./CategoryDescription";
import { CategoryCreatedDomainEvent } from "./CategoryCreatedDomainEvent";
import { CategoryDeletedDomainEvent } from "./CategoryDeletedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";

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
        const category = new Category(
            new CategoryId(id),
            new CategoryName(name),
            new CategoryDescription(description),
        );
        category.record(new CategoryCreatedDomainEvent(id, name, description ?? null, new UuidIdentifier().generate(), new Date()));
        return category;
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

    delete(): void {
        this.record(new CategoryDeletedDomainEvent(this.idValue(), new UuidIdentifier().generate(), new Date()));
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