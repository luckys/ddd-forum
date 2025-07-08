import {
    Filter,
    FiltersPrimitives,
} from "~~/server/contexts/shared/domain/criteria/Filter";
import { Operator } from "~~/server/contexts/shared/domain/criteria/FilterOperator";

export class FilterMother {
    static create(params?: Partial<FiltersPrimitives>): Filter {
        const randomOperator =
            Object.values(Operator)[Math.floor(Math.random() * Object.values(Operator).length)];

        const primitives: FiltersPrimitives = {
            field: 'name',
            operator: randomOperator,
            value: this.randomString(),
            ...params,
        };

        return Filter.fromPrimitives(primitives.field, primitives.operator, primitives.value);
    }

    private static randomString() {
        return Math.floor(Math.random() * Date.now()).toString(36);
    }
}