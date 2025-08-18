import { AggregateRoot } from "~~/server/contexts/shared/domain/AggregateRoot";
import { ThreadId } from "./ThreadId";
import { ThreadTitle } from "./ThreadTitle";
import { ThreadCreatedDomainEvent } from "./ThreadCreatedDomainEvent";
import { ThreadClosedDomainEvent } from "./ThreadClosedDomainEvent";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";
import { ThreadUpdatedDomainEvent } from "./ThreadUpdatedDomainEvent";

export class Thread extends AggregateRoot {
    private readonly createdAt: Date;
    private updatedAt: Date;
    private closedAt: Date | null;

    private constructor(
        private readonly id: ThreadId,
        private title: ThreadTitle,
        createdAt?: Date,
        updatedAt?: Date,
        closedAt?: Date | null,
    ) {
        super();
        this.createdAt = createdAt ?? new Date();
        this.updatedAt = updatedAt ?? new Date();
        this.closedAt = closedAt ?? null;
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
        };
    }
}
