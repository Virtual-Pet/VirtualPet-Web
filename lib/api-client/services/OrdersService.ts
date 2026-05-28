/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPage } from '../models/CursorPage';
import type { Order } from '../models/Order';
import type { OrderCancellation } from '../models/OrderCancellation';
import type { OrderStatus } from '../models/OrderStatus';
import type { OrderSummary } from '../models/OrderSummary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrdersService {
    /**
     * Listar órdenes
     * CUSTOMER ve solo las propias; EMPLOYEE/ADMIN ven todas. Paginación por cursor.
     * @param status
     * @param user Filtro por usuario (employee/admin)
     * @param cursor Cursor opaco de la página previa
     * @param limit
     * @returns any Página de órdenes
     * @throws ApiError
     */
    public static getOrders(
        status?: OrderStatus,
        user?: string,
        cursor?: string,
        limit: number = 20,
    ): CancelablePromise<(CursorPage & {
        data?: Array<OrderSummary>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders',
            query: {
                'status': status,
                'user': user,
                'cursor': cursor,
                'limit': limit,
            },
            errors: {
                403: `No autorizado (rol o propiedad)`,
            },
        });
    }
    /**
     * Detalle de orden
     * Line items, totales, dirección y shipment embebidos.
     * @param id
     * @returns Order Orden
     * @throws ApiError
     */
    public static getOrders1(
        id: string,
    ): CancelablePromise<Order> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/orders/{id}',
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
     * Cancelar orden (único punto de cancelación)
     * Orquesta en una transacción: orden→CANCELLED, shipment→CANCELLED, restitución de stock e inicio de reembolso (Payment→REFUNDED por webhook async). Único camino de cancelación, también para el backoffice. Solo si el envío está en CONFIRMED o PREPARED.
     *
     * @param id
     * @param requestBody
     * @returns OrderCancellation Orden cancelada
     * @throws ApiError
     */
    public static postOrdersCancel(
        id: string,
        requestBody?: {
            reason?: string;
        },
    ): CancelablePromise<OrderCancellation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/{id}/cancel',
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
