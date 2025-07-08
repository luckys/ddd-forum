import { OrderTypes } from "~~/server/contexts/shared/domain/criteria/OrderType";
import { Order } from "~~/server/contexts/shared/domain/criteria/Order";

type OrderPrimitives = {
    orderBy: string | null;
    orderType: string | null;
};

export class OrderMother {
    static create(params?: Partial<OrderPrimitives>): Order {
        const randomOrderType =
            Object.values(OrderTypes)[Math.floor(Math.random() * Object.values(OrderTypes).length)];

        const primitives: OrderPrimitives = {
            orderBy: 'name',
            orderType: randomOrderType,
            ...params,
        };

        return Order.fromPrimitives(primitives.orderBy, primitives.orderType);
    }
}