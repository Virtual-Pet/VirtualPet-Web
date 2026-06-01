/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money';
export type Sku = {
    skuId?: string;
    sku?: string;
    attributes?: Record<string, string>;
    price?: Money;
    stock?: number;
    stockMin?: number;
    imageUrl?: string | null;
    active?: boolean;
    createdAt?: string;
    available?: boolean;
};

