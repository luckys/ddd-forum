import { vi, expect } from "vitest";
import { EventBus } from "~~/server/contexts/shared/domain/event/EventBus";
import { DomainEvent } from "~~/server/contexts/shared/domain/event/DomainEvent";


export class MockEventBus implements EventBus {
    private readonly mockPublish = vi.fn();

    async publish(events: DomainEvent[]): Promise<void> {
        const expected = expect.arrayContaining(
            events.map((event) => expect.objectContaining({
                ...event,
                occurredOn: expect.anything(),
                eventId: expect.anything(),
            }))
        );

        expect(this.mockPublish).toHaveBeenCalledWith(expected);
        return Promise.resolve();
    }

    shouldPublish(events: DomainEvent[]): void {
        this.mockPublish(events);
    }
}