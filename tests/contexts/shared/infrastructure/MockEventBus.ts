import { vi } from "vitest";
import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";
import { DomainEvent } from "~~/server/contexts/shared/domain/event/DomainEvent";


export class MockEventBus implements EventBus {
    private readonly mockPublish = vi.fn();
    private readonly expectations: Array<Array<Pick<DomainEvent, 'eventName' | 'aggregateId'>>> = [];

    async publish(events: DomainEvent[]): Promise<void> {
        this.mockPublish(...events);
        const expected = this.expectations.shift();
        if (expected) {
            const ok = expected.every(exp => events.some(e => e.eventName === exp.eventName && e.aggregateId === exp.aggregateId));
            if (!ok) throw new Error('Expected events not published');
        }
        return Promise.resolve();
    }

    shouldPublish(events: DomainEvent[]): void {
        const compact = events.map(e => ({ eventName: e.eventName, aggregateId: e.aggregateId }));
        this.expectations.push(compact);
    }

    getCalls(): DomainEvent[][] {
        return this.mockPublish.mock.calls as unknown as DomainEvent[][];
    }
}