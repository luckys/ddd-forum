import { Identifier } from "~~/server/contexts/shared/domain/Identifier";
import { v7 } from "uuid";

export class UuidIdentifier implements Identifier {
    generate(): string {
        return v7();
    }
}