import { ThreadId } from "~~/server/contexts/forum/threads/domain/ThreadId";
import { UuidIdentifier } from "~~/server/contexts/shared/infrastructure/UuidIdentifier";

export class ThreadIdMother {
    static create(value?: string): ThreadId {
        return new ThreadId(value ?? new UuidIdentifier().generate());
    }
}
