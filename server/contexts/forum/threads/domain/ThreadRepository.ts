import type { Thread } from "./Thread";
import type { ThreadId } from "./ThreadId";
import type { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria";

export interface ThreadRepository {
    save(thread: Thread): Promise<void>;
    find(id: ThreadId): Promise<Thread | null>;
    search(criteria: Criteria): Promise<Thread[]>;
    count(criteria: Criteria): Promise<number>;
}
