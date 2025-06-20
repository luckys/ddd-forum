export class PostiveNumber {
    private readonly value: number;

    constructor(value: number = 0) {
        this.ensureIsPositive(value);
        this.value = value;
    }

    private ensureIsPositive(value: number): void {
        if (value < 0) {
            throw new Error('Value cannot be negative');
        }
    }

    public isEqual(other: PostiveNumber): boolean {
        return this.getValue() === other.getValue();
    }   

    public isBiggerOrEqual(other: PostiveNumber): boolean {
        return this.getValue() >= other.getValue();
    }

    public isSmallerOrEqual(other: PostiveNumber): boolean {
        return this.getValue() <= other.getValue();
    }

    public isBiggerThan(other: PostiveNumber): boolean {
        return this.getValue() > other.getValue();
    }

    public isSmallerThan(other: PostiveNumber): boolean {
        return this.getValue() < other.getValue();
    }

    public getValue(): number {
        return this.value;
    }
}
