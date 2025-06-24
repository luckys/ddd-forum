import { Category } from "~~/server/contexts/forum/categories/domain/Category";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";
import { RandomGenerator } from "~~/tests/contexts/shared/infrastructure/RandomGenerator";

export class CategoryMother {
    static create(id?: string, name?: string, description?: string | null | undefined): Category {
        return Category.create(
            id ?? (new UuidIdentifier()).generate(),
            name ?? RandomGenerator.generateString(8),
            description ?? RandomGenerator.generateString(20),
        );
    }
}