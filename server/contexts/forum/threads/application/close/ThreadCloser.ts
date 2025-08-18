import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";
import { Thread } from "../../domain/Thread";
import { ThreadId } from "../../domain/ThreadId";
import { ThreadNotFoundError } from "../../domain/ThreadNotFoundError";
import { ThreadRepository } from "../../domain/ThreadRepository";

export class ThreadCloser {
    constructor(
        private readonly repository: ThreadRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(id: string): Promise<void> {
        const threadId = new ThreadId(id);
        const thread = await this.repository.find(threadId);
        if (!thread) {
            throw new ThreadNotFoundError(threadId.getValue());
        }
        thread.close();
        await this.repository.save(thread as Thread);
        await this.eventBus.publish(thread.pullDomainEvents());
    }
}
