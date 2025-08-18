import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";
import { Thread } from "../../domain/Thread";
import { ThreadRepository } from "../../domain/ThreadRepository";

export class ThreadCreator {
    constructor(
        private readonly repository: ThreadRepository,
        private readonly eventBus: EventBus,
    ) {}

    async execute(id: string, title: string): Promise<void> {
        const thread = Thread.create(id, title);
        await this.repository.save(thread);
        await this.eventBus.publish(thread.pullDomainEvents());
    }
}
