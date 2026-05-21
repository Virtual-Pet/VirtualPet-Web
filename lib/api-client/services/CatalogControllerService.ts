/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogFacetsResponse } from '../models/CatalogFacetsResponse';
import type { CategoryResponse } from '../models/CategoryResponse';
import type { ProductDetailResponse } from '../models/ProductDetailResponse';
import type { ProductPageResponse } from '../models/ProductPageResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CatalogControllerService {
    /**
     * @param q
     * @param category
     * @param petType
     * @param brand
     * @param minPrice
     * @param maxPrice
     * @param sort
     * @param page
     * @param size
     * @returns ProductPageResponse OK
     * @throws ApiError
     */
    public static list(
        q?: string,
        category?: string,
        petType?: string,
        brand?: string,
        minPrice?: number,
        maxPrice?: number,
        sort?: string,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ProductPageResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/products',
            query: {
                'q': q,
                'category': category,
                'petType': petType,
                'brand': brand,
                'minPrice': minPrice,
                'maxPrice': maxPrice,
                'sort': sort,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param id
     * @returns ProductDetailResponse OK
     * @throws ApiError
     */
    public static get(
        id: string,
    ): CancelablePromise<ProductDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/products/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns CatalogFacetsResponse OK
     * @throws ApiError
     */
    public static facets(): CancelablePromise<CatalogFacetsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/products/facets',
        });
    }
    /**
     * @param slug
     * @returns ProductDetailResponse OK
     * @throws ApiError
     */
    public static getBySlug(
        slug: string,
    ): CancelablePromise<ProductDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/products/by-slug/{slug}',
            path: {
                'slug': slug,
            },
        });
    }
    /**
     * @returns CategoryResponse OK
     * @throws ApiError
     */
    public static categories(): CancelablePromise<Array<CategoryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/categories',
        });
    }
}
