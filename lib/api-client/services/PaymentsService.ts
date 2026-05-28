/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Payment } from '../models/Payment';
import type { PaymentIntent } from '../models/PaymentIntent';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentsService {
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
     * Estado de un pago (polling)
     * Estado normalizado del pago, agnóstico al proveedor. Complementa al webhook.
     * @param id
     * @returns Payment Pago
     * @throws ApiError
     */
    public static getPayments(
        id: string,
    ): CancelablePromise<Payment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/payments/{id}',
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
     * Webhook de la pasarela
     * Notificación asíncrona del proveedor (fake en v1; stripe/mercadopago en v2). Autenticado por firma del proveedor. Normaliza el payload a un evento interno e idempotente por providerPaymentId. Ante PAID crea la orden; ante FAILED deja la sesión FAILED.
     *
     * @param provider
     * @param requestBody Payload propio del proveedor (forma libre; el backend lo normaliza).
     * @returns any Recibido (durablemente persistido; procesamiento async)
     * @throws ApiError
     */
    public static postPaymentsWebhook(
        provider: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payments/webhook/{provider}',
            path: {
                'provider': provider,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Firma inválida`,
            },
        });
    }
    /**
     * [Solo v1 / no prod] Controlar el pago fake
     * Simula las acciones de la página hosteada de un proveedor real (approve→PAID, reject→FAILED, processing→PROCESSING). Tras un delay opcional dispara el webhook fake. Deshabilitado en el perfil de producción. Se elimina en v2.
     *
     * @param providerPaymentId
     * @param action
     * @returns any Acción aplicada
     * @throws ApiError
     */
    public static postFakeProviderPayments(
        providerPaymentId: string,
        action: 'approve' | 'reject' | 'processing',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/fake-provider/payments/{providerPaymentId}/{action}',
            path: {
                'providerPaymentId': providerPaymentId,
                'action': action,
            },
            errors: {
                403: `Deshabilitado en producción`,
                404: `Recurso inexistente`,
            },
        });
    }
}
