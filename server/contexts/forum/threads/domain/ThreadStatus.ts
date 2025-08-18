export type ThreadStatusValue = 'open' | 'closed' | 'archived';

export class ThreadStatus {
    static createNone(): ThreadStatus {
        return new ThreadStatus('open');
    }

    constructor(private readonly value: ThreadStatusValue) {
        this.#ensureIsValid(value);
    }

    getValue(): ThreadStatusValue {
        return this.value;
    }

    toString(): string {
        return this.value;
    }

    #ensureIsValid(value: string): void {
        const allowed: ThreadStatusValue[] = ['open', 'closed', 'archived'];
        if (!allowed.includes(value as ThreadStatusValue)) throw new Error('Invalid status');
    }
}
