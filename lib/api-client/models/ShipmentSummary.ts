/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money';
import type { ShipmentStatus } from './ShipmentStatus';
export type ShipmentSummary = {
    shipmentId?: string;
    orderId?: string;
    status?: ShipmentStatus;
    updatedAt?: string;
    contactName?: string | null;
    contactEmail?: string | null;
    total?: Money;
};

