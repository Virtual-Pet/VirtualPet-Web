/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Id de sesión del carrito anónimo. La cookie lleva únicamente el id; el contenido del carrito vive en Redis (cart:anon:{id}), nunca en la cookie. Se emite en la primera mutación anónima y el navegador la reenvía automáticamente.
 *
 */
export type CartSession = string;
