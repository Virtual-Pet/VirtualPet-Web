/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VariantBySkuResponse } from '../models/VariantBySkuResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VariantControllerService {
    /**
     * @param sku
     * @returns VariantBySkuResponse OK
     * @throws ApiError
     */
    public static getBySku(
        sku: string,
    ): CancelablePromise<VariantBySkuResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/variants/by-sku/{sku}',
            path: {
                'sku': sku,
            },
        });
    }
}
