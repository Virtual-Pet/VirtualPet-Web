/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthTokens } from '../models/AuthTokens';
import type { User } from '../models/User';
import type { UserSummary } from '../models/UserSummary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Login
     * Autentica con email y contraseña y devuelve los tokens. Si la petición incluye la cookie CART_SESSION, el carrito anónimo se fusiona con el carrito del usuario (sumando cantidades de SKUs duplicados), se elimina el carrito anónimo y la cookie se borra (Set-Cookie con Max-Age=0). No crea carrito de usuario salvo que haya items que fusionar (creación lazy).
     *
     * @param requestBody
     * @param cartSession Id de sesión del carrito anónimo. La cookie lleva únicamente el id; el contenido del carrito vive en Redis (cart:anon:{id}), nunca en la cookie. Se emite en la primera mutación anónima y el navegador la reenvía automáticamente.
     *
     * @returns AuthTokens Autenticado
     * @throws ApiError
     */
    public static postAuthLogin(
        requestBody: {
            email: string;
            password: string;
        },
        cartSession?: string,
    ): CancelablePromise<AuthTokens> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            cookies: {
                'CART_SESSION': cartSession,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `No autenticado / credenciales inválidas`,
                422: `Error de validación del payload`,
                429: `Rate limit excedido`,
            },
        });
    }
    /**
     * Logout
     * Invalida el refreshToken (blacklist en Redis). El accessToken caduca solo.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static postAuthLogout(
        requestBody: {
            refreshToken: string;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `No autenticado / credenciales inválidas`,
            },
        });
    }
    /**
     * Refrescar access token
     * @param requestBody
     * @returns any Nuevo access token
     * @throws ApiError
     */
    public static postAuthRefresh(
        requestBody: {
            refreshToken: string;
        },
    ): CancelablePromise<{
        accessToken?: string;
        tokenType?: string;
        expiresIn?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `No autenticado / credenciales inválidas`,
            },
        });
    }
    /**
     * Registro de cliente
     * @param requestBody
     * @returns UserSummary Cliente creado
     * @throws ApiError
     */
    public static postAuthRegisterCustomer(
        requestBody: {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
        },
    ): CancelablePromise<UserSummary> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register/customer',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflicto de estado (stock, estado de sesión/envío, duplicado, no cancelable)`,
                422: `Error de validación del payload`,
                429: `Rate limit excedido`,
            },
        });
    }
    /**
     * Registro de operario (ADMIN)
     * Alta de operario de backoffice. Solo ADMIN.
     * @param requestBody
     * @returns UserSummary Operario creado
     * @throws ApiError
     */
    public static postAuthRegisterEmployee(
        requestBody: {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
        },
    ): CancelablePromise<UserSummary> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register/employee',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `No autorizado (rol o propiedad)`,
                409: `Conflicto de estado (stock, estado de sesión/envío, duplicado, no cancelable)`,
            },
        });
    }
    /**
     * Datos del usuario autenticado
     * @returns User Perfil
     * @throws ApiError
     */
    public static getAuthMe(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
            errors: {
                401: `No autenticado / credenciales inválidas`,
            },
        });
    }
    /**
     * Actualizar datos personales
     * @param requestBody
     * @returns User Usuario actualizado
     * @throws ApiError
     */
    public static patchAuthMe(
        requestBody: {
            firstName?: string;
            lastName?: string;
        },
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/auth/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `No autenticado / credenciales inválidas`,
                422: `Error de validación del payload`,
            },
        });
    }
    /**
     * Cambiar contraseña (autenticado)
     * Exige la contraseña actual; invalida el resto de las sesiones.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static postAuthPasswordChange(
        requestBody: {
            currentPassword: string;
            newPassword: string;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/password/change',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `No autenticado / credenciales inválidas`,
                422: `Error de validación del payload`,
            },
        });
    }
}
