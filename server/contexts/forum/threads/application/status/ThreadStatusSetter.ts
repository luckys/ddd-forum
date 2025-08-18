import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";
import { ThreadRepository } from "../../domain/ThreadRepository";
import { ThreadId } from "../../domain/ThreadId";
import { ThreadNotFoundError } from "../../domain/ThreadNotFoundError";

export class ThreadStatusSetter {
    constructor(
        private readonly repository: ThreadRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(id: string, status: string): Promise<void> {
        const thread = await this.repository.find(new ThreadId(id));
        if (!thread) throw new ThreadNotFoundError(id);

        thread.setStatus(status);
        await this.repository.save(thread);
        await this.eventBus.publish(thread.pullDomainEvents());
    }
}
