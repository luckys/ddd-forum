import { CategoryId } from '~~/server/contexts/forum/categories/domain/CategoryId';
import { UuidIdentifier } from '~~/server/contexts/shared/infrastructure/UuidIdentifier';

export class CategoryIdMother {
    static create(value?: string): CategoryId {
        return new CategoryId(value ?? (new UuidIdentifier()).generate());
    }
}