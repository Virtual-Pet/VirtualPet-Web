/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { ShipmentStatus } from './ShipmentStatus';
export type Shipment = {
    shipmentId?: string;
    orderId?: string;
    status?: ShipmentStatus;
    shippingAddress?: Address;
    statusHistory?: Array<{
        status?: ShipmentStatus;
        at?: string;
    }>;
};

