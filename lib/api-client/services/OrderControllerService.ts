/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateOrderRequest } from '../models/CreateOrderRequest';
import type { OrderResponse } from '../models/OrderResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderControllerService {
    /**
     * @param requestBody
     * @returns OrderResponse OK
     * @throws ApiError
     */
    public static createOrder(
        requestBody: CreateOrderRequest,
    ): CancelablePromise<OrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/orders',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
