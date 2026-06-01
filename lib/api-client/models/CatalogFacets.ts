/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from './Category';
/**
 * Facetas para los filtros del marketplace.
 */
export type CatalogFacets = {
    petTypes?: Array<{
        id?: string;
        name?: string;
    }>;
    categories?: Array<Category>;
    brands?: Array<{
        id?: string;
        name?: string;
    }>;
};

