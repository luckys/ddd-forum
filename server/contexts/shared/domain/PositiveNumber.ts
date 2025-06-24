export class PositiveNumber {
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

    public isEqual(other: PositiveNumber): boolean {
        return this.getValue() === other.getValue();
    }   

    public isBiggerOrEqual(other: PositiveNumber): boolean {
        return this.getValue() >= other.getValue();
    }

    public isSmallerOrEqual(other: PositiveNumber): boolean {
        return this.getValue() <= other.getValue();
    }

    public isBiggerThan(other: PositiveNumber): boolean {
        return this.getValue() > other.getValue();
    }

    public isSmallerThan(other: PositiveNumber): boolean {
        return this.getValue() < other.getValue();
    }

    public getValue(): number {
        return this.value;
    }
}
