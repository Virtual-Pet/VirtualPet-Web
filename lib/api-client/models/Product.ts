/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Sku } from './Sku';
export type Product = {
    id?: string;
    name?: string;
    description?: string | null;
    brand?: string | null;
    category?: string;
    petType?: string;
    active?: boolean;
    createdAt?: string;
    images?: Array<string>;
    skus?: Array<Sku>;
};

