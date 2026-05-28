/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from '../models/Address';
import type { CheckoutSession } from '../models/CheckoutSession';
import type { OrderConfirmation } from '../models/OrderConfirmation';
import type { PaymentIntent } from '../models/PaymentIntent';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CheckoutService {
    /**
     * Iniciar checkout
     * Re-cotiza precios contra el catálogo y re-valida stock, arma el snapshot inmutable y crea la sesión. Idempotente por reúso: devuelve la sesión activa si ya existe (200), crea una nueva si no (201).
     *
     * @returns CheckoutSession Sesión activa reutilizada
     * @throws ApiError
     */
    public static postCartCheckout(): CancelablePromise<CheckoutSession> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cart/checkout',
            errors: {
                400: `Solicitud inválida`,
                409: `Conflicto de estado (stock, estado de sesión/envío, duplicado, no cancelable)`,
            },
        });
    }
    /**
     * Consultar / reanudar sesión
     * @param id checkoutSessionId
     * @returns CheckoutSession Sesión
     * @throws ApiError
     */
    public static getCheckoutSessions(
        id: string,
    ): CancelablePromise<CheckoutSession> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checkout/sessions/{id}',
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
     * Fijar dirección de entrega
     * Dirección de destino del delivery. Obligatoria antes del payment intent. (Validación de área de cobertura diferida a v2.)
     * @param id checkoutSessionId
     * @param requestBody
     * @returns CheckoutSession Sesión actualizada
     * @throws ApiError
     */
    public static putCheckoutSessionsShippingAddress(
        id: string,
        requestBody: Address,
    ): CancelablePromise<CheckoutSession> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/checkout/sessions/{id}/shipping-address',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Recurso inexistente`,
                409: `Conflicto de estado (stock, estado de sesión/envío, duplicado, no cancelable)`,
                422: `Error de validación del payload`,
            },
        });
    }
    /**
     * Iniciar pago (payment intent)
     * Persiste un Payment (PENDING) atado a la sesión y devuelve la checkoutUrl hosteada. El backend nunca ve datos de tarjeta. Pasa la sesión a AWAITING_PAYMENT.
     *
     * @param id checkoutSessionId
     * @param idempotencyKey Clave de idempotencia para operaciones de pago
     * @returns PaymentIntent Payment intent creado
     * @throws ApiError
     */
    public static postCheckoutSessionsPaymentIntents(
        id: string,
        idempotencyKey: string,
    ): CancelablePromise<PaymentIntent> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checkout/sessions/{id}/payment-intents',
            path: {
                'id': id,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            errors: {
                409: `Conflicto de estado (stock, estado de sesión/envío, duplicado, no cancelable)`,
                502: `La pasarela de pago no respondió`,
            },
        });
    }
    /**
     * Confirmar (retorno del cliente)
     * Verifica el pago contra la pasarela; si está pagado, crea orden + shipment, descuenta stock y vacía el carrito (operación idempotente que converge con el webhook).
     *
     * @param id checkoutSessionId
     * @param idempotencyKey Clave de idempotencia para operaciones de pago
     * @returns OrderConfirmation Orden confirmada (idempotente)
     * @returns any Pago aún no acreditado, reintentar
     * @throws ApiError
     */
    public static postCheckoutSessionsConfirm(
        id: string,
        idempotencyKey: string,
    ): CancelablePromise<OrderConfirmation | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checkout/sessions/{id}/confirm',
            path: {
                'id': id,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            errors: {
                402: `Pago rechazado (sesión FAILED)`,
                404: `Recurso inexistente`,
                409: `Conflicto de estado (stock, estado de sesión/envío, duplicado, no cancelable)`,
            },
        });
    }
}
