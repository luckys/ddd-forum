import { AggregateRoot } from "~~/server/contexts/shared/domain/AggregateRoot";
import { ThreadId } from "./ThreadId";
import { ThreadTitle } from "./ThreadTitle";
import { ThreadCreatedDomainEvent } from "./ThreadCreatedDomainEvent";
import { ThreadClosedDomainEvent } from "./ThreadClosedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";
import { ThreadUpdatedDomainEvent } from "./ThreadUpdatedDomainEvent";
import { ThreadMovedDomainEvent } from "./ThreadMovedDomainEvent";
import { ThreadTaggedDomainEvent } from "./ThreadTaggedDomainEvent";
import { CategoryId } from "~~/server/contexts/forum/categories/domain/CategoryId";
import { ThreadTag } from "./ThreadTag";

export class Thread extends AggregateRoot {
    private readonly createdAt: Date;
    private updatedAt: Date;
    private closedAt: Date | null;
    private categoryId: CategoryId | null;
    private readonly tags: ThreadTag[];

    private constructor(
        private readonly id: ThreadId,
        private title: ThreadTitle,
        createdAt?: Date,
        updatedAt?: Date,
        closedAt?: Date | null,
        categoryId?: CategoryId | null,
        tags?: ThreadTag[],
    ) {
        super();
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
        this.closedAt = closedAt ?? null;
        this.categoryId = categoryId ?? null;
        this.tags = tags ?? [];
    }

    static create(id: string, title: string): Thread {
        const thread = new Thread(new ThreadId(id), new ThreadTitle(title));
        thread.record(new ThreadCreatedDomainEvent(id, title, new UuidIdentifier().generate(), new Date()));
        return thread;
    }

    close(): void {
        if (this.closedAt) return;
        this.closedAt = new Date();
        this.updatedAt = new Date();
        this.record(new ThreadClosedDomainEvent(this.idValue(), new UuidIdentifier().generate(), new Date()));
    }

    updateTitle(title: string): void {
        const newTitle = new ThreadTitle(title);
        if (newTitle.getValue() === this.title.getValue()) return;
        this.title = newTitle;
        this.updatedAt = new Date();
        this.record(new ThreadUpdatedDomainEvent(this.idValue(), this.titleValue(), new UuidIdentifier().generate(), new Date()));
    }

    moveToCategory(categoryId: string): void {
        const newCategory = new CategoryId(categoryId);
        if (this.categoryId && this.categoryId.getValue() === newCategory.getValue()) return;
        this.categoryId = newCategory;
        this.updatedAt = new Date();
        this.record(new ThreadMovedDomainEvent(this.idValue(), newCategory.getValue(), new UuidIdentifier().generate(), new Date()));
    }

    addTag(tag: string): void {
        const newTag = new ThreadTag(tag);
        const exists = this.tags.some(t => t.getValue() === newTag.getValue());
        if (exists) return;
        this.tags.push(newTag);
        this.updatedAt = new Date();
        this.record(new ThreadTaggedDomainEvent(this.idValue(), newTag.getValue(), new UuidIdentifier().generate(), new Date()));
    }

    idValue(): string {
        return this.id.getValue();
    }

    titleValue(): string {
        return this.title.getValue();
    }

    toPrimitives() {
        return {
            id: this.idValue(),
            title: this.titleValue(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            closedAt: this.closedAt,
            categoryId: this.categoryId ? this.categoryId.getValue() : null,
            tags: this.tags.map(t => t.getValue()),
        };
    }
}
