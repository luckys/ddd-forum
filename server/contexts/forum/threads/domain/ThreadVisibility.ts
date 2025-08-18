export type ThreadVisibilityValue = 'public' | 'members' | 'premium';

export class ThreadVisibility {
    static createNone(): ThreadVisibility {
        return new ThreadVisibility('public');
    }

    constructor(private readonly value: ThreadVisibilityValue) {
        this.#ensureIsValid(value);
    }

    getValue(): ThreadVisibilityValue {
        return this.value;
    }

    toString(): string {
        return this.value;
    }

    #ensureIsValid(value: string): void {
        const allowed: ThreadVisibilityValue[] = ['public', 'members', 'premium'];
        if (!allowed.includes(value as ThreadVisibilityValue)) throw new Error('Invalid visibility');
    }
}
