import { ThreadRepository } from "../../domain/ThreadRepository";
import { Thread } from "../../domain/Thread";
import { ThreadId } from "../../domain/ThreadId";
import { ThreadNotFoundError } from "../../domain/ThreadNotFoundError";

export class ThreadFinder {
    constructor(
        private readonly repository: ThreadRepository,
    ) {}

    async execute(id: ThreadId): Promise<Thread> {
        const thread = await this.repository.find(id);
        if (!thread) {
            throw new ThreadNotFoundError(id.getValue());
        }
        return thread;
    }
}
