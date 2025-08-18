import { DomainError } from "~~/server/contexts/shared/domain/DomainError";

export class ThreadNotFoundError extends DomainError {
    type = 'forum.thread.not_found';

    constructor(public readonly id: string) {
        super(`Thread with id <${id}> not found`);
    }
}
