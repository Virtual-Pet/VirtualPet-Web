/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemRequest } from './OrderItemRequest';
import type { ShippingAddress } from './ShippingAddress';
export type CreateOrderRequest = {
    contactName?: string;
    contactLastname?: string;
    contactEmail?: string;
    contactPhone?: string;
    shippingAddress?: ShippingAddress;
    items?: Array<OrderItemRequest>;
};

