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
     * Devuelve el carrito. Si la petición está autenticada (Bearer token) se resuelve por usuario; en caso contrario se identifica por la cookie CART_SESSION (que lleva solo el id de sesión; el contenido vive en Redis). Sin usuario ni cookie responde un carrito vacío. Creación lazy: responde 200 aunque el carrito no exista.
     *
     * @param cartSession Id de sesión del carrito anónimo. La cookie lleva únicamente el id; el contenido del carrito vive en Redis (cart:anon:{id}), nunca en la cookie. Se emite en la primera mutación anónima y el navegador la reenvía automáticamente.
     *
     * @returns Cart Carrito (vacío o con items)
     * @throws ApiError
     */
    public static getCart(
        cartSession?: string,
    ): CancelablePromise<Cart> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cart',
            cookies: {
                'CART_SESSION': cartSession,
            },
        });
    }
    /**
     * Fijar cantidad de un SKU (upsert)
     * Fija la cantidad exacta. Dispara la creación lazy del carrito si no existe. Idempotente. Si la petición es anónima y no trae la cookie CART_SESSION, se genera una sesión nueva y se devuelve en Set-Cookie (solo el id de sesión; el contenido vive en Redis); las peticiones siguientes la reenvían automáticamente.
     *
     * @param skuId
     * @param requestBody
     * @param cartSession Id de sesión del carrito anónimo. La cookie lleva únicamente el id; el contenido del carrito vive en Redis (cart:anon:{id}), nunca en la cookie. Se emite en la primera mutación anónima y el navegador la reenvía automáticamente.
     *
     * @returns CartItemQuantity Item resultante
     * @throws ApiError
     */
    public static putCartItems(
        skuId: string,
        requestBody: {
            quantity: number;
        },
        cartSession?: string,
    ): CancelablePromise<CartItemQuantity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/cart/items/{skuId}',
            path: {
                'skuId': skuId,
            },
            cookies: {
                'CART_SESSION': cartSession,
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
     * Elimina el producto por completo. Idempotente (éxito aunque no estuviera). Las peticiones anónimas se identifican por la cookie CART_SESSION (solo el id de sesión; el contenido vive en Redis).
     *
     * @param skuId
     * @param cartSession Id de sesión del carrito anónimo. La cookie lleva únicamente el id; el contenido del carrito vive en Redis (cart:anon:{id}), nunca en la cookie. Se emite en la primera mutación anónima y el navegador la reenvía automáticamente.
     *
     * @returns void
     * @throws ApiError
     */
    public static deleteCartItems(
        skuId: string,
        cartSession?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cart/items/{skuId}',
            path: {
                'skuId': skuId,
            },
            cookies: {
                'CART_SESSION': cartSession,
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
