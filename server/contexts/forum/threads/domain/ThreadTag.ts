export class ThreadTag {
    static createNone(): ThreadTag {
        return new ThreadTag("");
    }

    constructor(private readonly value: string) {
        this.ensureNotEmpty(value);
    }

    getValue(): string {
        return this.value;
    }

    private ensureNotEmpty(value: string): void {
        if (typeof value !== 'string') throw new Error('Invalid tag');
        if (value.trim().length === 0) throw new Error('Empty tag');
    }
}
