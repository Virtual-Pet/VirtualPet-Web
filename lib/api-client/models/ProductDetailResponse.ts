/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { VariantResponse } from './VariantResponse';
export type ProductDetailResponse = {
    id?: string;
    slug?: string;
    name?: string;
    description?: string;
    basePrice?: number;
    category?: string;
    categorySlug?: string;
    petType?: string;
    brand?: string;
    variants?: Array<VariantResponse>;
};

