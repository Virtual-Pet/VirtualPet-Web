/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { Currency } from './Currency';
import type { OrderLineItem } from './OrderLineItem';
import type { OrderStatus } from './OrderStatus';
import type { OrderTotals } from './OrderTotals';
import type { ShipmentStatus } from './ShipmentStatus';
export type Order = {
    orderId?: string;
    customerId?: string;
    status?: OrderStatus;
    lineItems?: Array<OrderLineItem>;
    totals?: OrderTotals;
    currency?: Currency;
    shippingAddress?: Address;
    shipment?: {
        shipmentId?: string;
        status?: ShipmentStatus;
    };
    createdAt?: string;
};

