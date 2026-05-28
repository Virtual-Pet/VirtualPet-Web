/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPage } from '../models/CursorPage';
import type { Product } from '../models/Product';
import type { ProductSummary } from '../models/ProductSummary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CatalogService {
    /**
     * Listar y buscar productos
     * Búsqueda por texto y filtros por atributos, con paginación por cursor. Cacheable (ETag).
     * @param q Búsqueda full-text
     * @param category
     * @param petType
     * @param minPrice
     * @param maxPrice
     * @param cursor Cursor opaco de la página previa
     * @param limit
     * @param ifNoneMatch ETag para revalidación de caché
     * @returns any Página de productos
     * @throws ApiError
     */
    public static getProducts(
        q?: string,
        category?: string,
        petType?: string,
        minPrice?: string,
        maxPrice?: string,
        cursor?: string,
        limit: number = 20,
        ifNoneMatch?: string,
    ): CancelablePromise<(CursorPage & {
        data?: Array<ProductSummary>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products',
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            query: {
                'q': q,
                'category': category,
                'petType': petType,
                'minPrice': minPrice,
                'maxPrice': maxPrice,
                'cursor': cursor,
                'limit': limit,
            },
            errors: {
                304: `No modificado (revalidación con If-None-Match)`,
                422: `Error de validación del payload`,
            },
        });
    }
    /**
     * Detalle de producto
     * Incluye todas las variantes (SKUs) embebidas. Cacheable (ETag).
     * @param id
     * @param ifNoneMatch ETag para revalidación de caché
     * @returns Product Producto
     * @throws ApiError
     */
    public static getProducts1(
        id: string,
        ifNoneMatch?: string,
    ): CancelablePromise<Product> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{id}',
            path: {
                'id': id,
            },
            headers: {
                'If-None-Match': ifNoneMatch,
            },
            errors: {
                304: `No modificado`,
                404: `Recurso inexistente`,
            },
        });
    }
}
