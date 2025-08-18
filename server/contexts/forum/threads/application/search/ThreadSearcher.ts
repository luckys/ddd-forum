import { Thread } from "../../domain/Thread";
import { ThreadRepository } from "../../domain/ThreadRepository";
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria";

export class ThreadSearcher {
  constructor(private readonly repository: ThreadRepository) {}

  async execute(criteria: Criteria): Promise<Thread[]> {
    return await this.repository.search(criteria);
  }
}
