import { DomainError } from "~~/server/contexts/shared/domain/DomainError";

export class CategoryNotFoundError extends DomainError {
    readonly type = "CategoryNotFoundError";
	readonly message = `The category ${this.value} does not exist`;

	constructor(public readonly value: string) {
		super();
	}
}