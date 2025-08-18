import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";
import { ThreadRepository } from "../../domain/ThreadRepository";
import { ThreadId } from "../../domain/ThreadId";
import { ThreadNotFoundError } from "../../domain/ThreadNotFoundError";
import { ThreadTitle } from "../../domain/ThreadTitle";

export class ThreadUpdater {
    constructor(
        private readonly repository: ThreadRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(id: string, title: string): Promise<void> {
        const thread = await this.repository.find(new ThreadId(id));
        if (!thread) throw new ThreadNotFoundError(id);

        thread.updateTitle(new ThreadTitle(title).getValue());
        await this.repository.save(thread);
        await this.eventBus.publish(thread.pullDomainEvents());
    }
}
