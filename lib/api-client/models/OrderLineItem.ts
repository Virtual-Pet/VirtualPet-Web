/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money';
/**
 * Línea persistida en la orden (snapshot de precio al momento de confirmar).
 */
export type OrderLineItem = {
    skuId?: string;
    quantity?: number;
    unitPrice?: Money;
    subtotal?: Money;
};

