import type { Thread } from "./Thread";
import type { ThreadId } from "./ThreadId";

export interface ThreadRepository {
    save(thread: Thread): Promise<void>;
    find(id: ThreadId): Promise<Thread | null>;
}
