export class RandomGenerator {
    static generateString(length: number = 10): string {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    static generateNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generateBoolean(): boolean {
        return Math.random() >= 0.5;
    }      

    static generateDate(): Date {
        return new Date();
    }

    static generateEmail(): string {
        return this.generateString(10) + '@' + this.generateString(10) + '.' + this.generateString(5);
    }   
}