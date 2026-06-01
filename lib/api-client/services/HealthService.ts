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
     * Expuesto por Spring Boot Actuator fuera del prefijo `/api/v1`. Incluye health groups `liveness` y `readiness` (`/actuator/health/liveness`, `/actuator/health/readiness`).
     *
     * @returns any Servicio saludable
     * @throws ApiError
     */
    public static getActuatorHealth(): CancelablePromise<{
        status?: string;
        components?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/actuator/health',
            errors: {
                503: `Alguna dependencia caída`,
            },
        });
    }
}
