/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPage } from '../models/CursorPage';
import type { Shipment } from '../models/Shipment';
import type { ShipmentStatus } from '../models/ShipmentStatus';
import type { ShipmentSummary } from '../models/ShipmentSummary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ShipmentsService {
    /**
     * Listar envíos
     * CUSTOMER con ?user=me ve los propios; EMPLOYEE filtra por ?status. Paginación por cursor.
     * @param user me para el cliente
     * @param status
     * @param cursor Cursor opaco de la página previa
     * @param limit
     * @returns any Página de envíos
     * @throws ApiError
     */
    public static getShipments(
        user?: string,
        status?: ShipmentStatus,
        cursor?: string,
        limit: number = 20,
    ): CancelablePromise<(CursorPage & {
        data?: Array<ShipmentSummary>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/shipments',
            query: {
                'user': user,
                'status': status,
                'cursor': cursor,
                'limit': limit,
            },
            errors: {
                403: `No autorizado (rol o propiedad)`,
            },
        });
    }
    /**
     * Detalle de envío
     * Incluye historial de estados. El cliente solo ve el propio.
     * @param id
     * @returns Shipment Envío
     * @throws ApiError
     */
    public static getShipments1(
        id: string,
    ): CancelablePromise<Shipment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/shipments/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `No autorizado (rol o propiedad)`,
                404: `Recurso inexistente`,
            },
        });
    }
    /**
     * Avanzar estado del envío (EMPLOYEE)
     * Avanza por los estados de progreso (CONFIRMED→PREPARED→IN_TRANSIT→DELIVERED). No puede llevar a CANCELLED (eso va por /orders/{id}/cancel).
     *
     * @param id
     * @param requestBody
     * @returns Shipment Envío actualizado
     * @throws ApiError
     */
    public static patchShipments(
        id: string,
        requestBody: {
            status: 'PREPARED' | 'IN_TRANSIT' | 'DELIVERED';
        },
    ): CancelablePromise<Shipment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/shipments/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `No autorizado (rol o propiedad)`,
                404: `Recurso inexistente`,
                409: `Conflicto de estado (stock, estado de sesión/envío, duplicado, no cancelable)`,
            },
        });
    }
}
