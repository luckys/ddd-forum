export class OptionalString {
    private readonly value?: string | undefined | null;

    constructor(value: string | undefined | null) {
        this.value = value;
    }

    public isEqual(other: OptionalString): boolean {
        return this.getValue() === other.getValue();
    }

    public getValue(): string | undefined | null {
        return this.value;
    }
}
