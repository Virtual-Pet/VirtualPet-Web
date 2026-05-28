/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * Disponibilidad
     * @returns any Servicio saludable
     * @throws ApiError
     */
    public static getHealth(): CancelablePromise<{
        status?: string;
        dependencies?: Record<string, string>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            errors: {
                503: `Alguna dependencia caída`,
            },
        });
    }
}
