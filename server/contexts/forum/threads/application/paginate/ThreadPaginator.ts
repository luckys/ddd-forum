import { ThreadRepository } from "../../domain/ThreadRepository"
import { Thread } from "../../domain/Thread"
import { Criteria } from "~~/server/contexts/shared/domain/criteria/Criteria"

export class ThreadPaginator {
  constructor(private readonly repository: ThreadRepository) {}

  async execute(criteria: Criteria): Promise<{ items: Thread[]; total: number }> {
    const [items, total] = await Promise.all([
      this.repository.search(criteria),
      this.repository.count(criteria),
    ])
    return { items, total }
  }
}
