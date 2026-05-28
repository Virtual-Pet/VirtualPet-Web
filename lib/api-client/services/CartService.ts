/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cart } from '../models/Cart';
import type { CartItemQuantity } from '../models/CartItemQuantity';
import type { CheckoutSession } from '../models/CheckoutSession';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CartService {
    /**
     * Obtener el carrito
     * Devuelve el carrito del usuario. Si aún no existe (lazy), responde carrito vacío con 200.
     * @returns Cart Carrito (vacío o con items)
     * @throws ApiError
     */
    public static getCart(): CancelablePromise<Cart> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cart',
            errors: {
                401: `No autenticado / credenciales inválidas`,
            },
        });
    }
    /**
     * Fijar cantidad de un SKU (upsert)
     * Fija la cantidad exacta. Dispara la creación lazy del carrito si no existe. Idempotente.
     * @param skuId
     * @param requestBody
     * @returns CartItemQuantity Item resultante
     * @throws ApiError
     */
    public static putCartItems(
        skuId: string,
        requestBody: {
            quantity: number;
        },
    ): CancelablePromise<CartItemQuantity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/cart/items/{skuId}',
            path: {
                'skuId': skuId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Recurso inexistente`,
                422: `Error de validación del payload`,
            },
        });
    }
    /**
     * Eliminar un SKU del carrito
     * Elimina el producto por completo. Idempotente (éxito aunque no estuviera).
     * @param skuId
     * @returns void
     * @throws ApiError
     */
    public static deleteCartItems(
        skuId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cart/items/{skuId}',
            path: {
                'skuId': skuId,
            },
            errors: {
                404: `Recurso inexistente`,
            },
        });
    }
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
}
