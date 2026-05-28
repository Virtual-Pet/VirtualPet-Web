/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { CartItem } from './CartItem';
import type { Currency } from './Currency';
import type { OrderStatus } from './OrderStatus';
import type { ShipmentStatus } from './ShipmentStatus';
import type { Totals } from './Totals';
export type Order = {
    orderId?: string;
    customerId?: string;
    status?: OrderStatus;
    lineItems?: Array<CartItem>;
    totals?: Totals;
    currency?: Currency;
    shippingAddress?: Address;
    shipment?: {
        shipmentId?: string;
        status?: ShipmentStatus;
    };
    createdAt?: string;
};

