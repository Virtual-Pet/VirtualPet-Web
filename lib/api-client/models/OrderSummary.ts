/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Currency } from './Currency';
import type { Money } from './Money';
import type { OrderStatus } from './OrderStatus';
export type OrderSummary = {
    orderId?: string;
    status?: OrderStatus;
    total?: Money;
    currency?: Currency;
    createdAt?: string;
    shipmentId?: string;
};

