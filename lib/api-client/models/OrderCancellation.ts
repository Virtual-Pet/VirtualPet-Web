/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentStatus } from './PaymentStatus';
export type OrderCancellation = {
    orderId?: string;
    status?: string;
    shipment?: {
        shipmentId?: string;
        status?: string;
    };
    refund?: {
        paymentId?: string;
        status?: PaymentStatus;
    };
};

