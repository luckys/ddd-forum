import { Identifier } from "../../domain/Identifier";
import { v7 } from "uuid";
import { Service } from "diod";

@Service()
export class UuidIdentifier implements Identifier {
    generate(): string {
        return v7();
    }
}