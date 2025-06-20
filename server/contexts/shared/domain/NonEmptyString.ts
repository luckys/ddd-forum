export class NonEmptyString {
    private readonly value: string;

    private constructor(value: string) {
        this.ensureIsNotEmpty(value);
        this.value = value;
    }

    private ensureIsNotEmpty(value: string): void {
        if (value?.trim().length === 0) {
            throw new Error('Value cannot be empty');
        }
    }

    public isEqual(other: NonEmptyString): boolean {
        return this.getValue() === other.getValue();
    }

    public getValue(): string {
        return this.value;
    }

    public static create(value: string): NonEmptyString {
        return new NonEmptyString(value);
    }
}
