# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased] — 2026-06-01

### Sincronización con la API de backend

Alineación del frontend con la última versión del contrato OpenAPI (`docs/api/virtualpet-openapi.yaml`).

- **Cliente tipado regenerado** desde el spec del repo (el script `api:generate` ahora apunta a `./docs/api/virtualpet-openapi.yaml`). Quedan disponibles nuevos modelos (`Category`, `CatalogFacets`, `CartItemQuantity`) y métodos: `getProductsFacets` (`GET /products/facets`), `getCategories` (`GET /categories`), `getOrdersTrack` (`GET /orders/{id}/track`) y `postCheckoutGuest` (`POST /checkout/guest`).
- **Modelos enriquecidos**: `Sku` (`sku`, `stock`, `stockMin`, `imageUrl`, `active`, `createdAt`), `Product` (`brand`, `active`, `createdAt`), `CartItem` (`sku`, `productId`, `productName`, `brand`, `attributes`, `imageUrl`, `available`) y `ShipmentSummary` (`contactName`, `contactEmail`, `total`).
- **Carrito anónimo migrado a cookie `CART_SESSION` (HttpOnly)** según el spec. Se usan los endpoints estándar `/cart` y `/cart/items/{skuId}` tanto para usuarios autenticados (token Bearer) como invitados (cookie), enviando credenciales (`credentials: "include"` / `OpenAPI.WITH_CREDENTIALS`). Se eliminó el header `X-Cart-Session`, las rutas no estándar `/cart/session/{id}` y el archivo `lib/cart-session.ts` (el id de sesión ahora lo gestiona el backend, ya no se genera un UUID en el cliente).
- **Login** (`lib/services/auth.ts`): usa `AuthService.postAuthLogin`; el backend fusiona el carrito anónimo automáticamente desde la cookie `CART_SESSION` (ya no se envía `cartSessionId`).
- **Guest checkout** (`lib/services/checkout.ts`): `createGuestCheckout` usa el método tipado `CheckoutService.postCheckoutGuest` en lugar de un `fetch` manual.
- **Seguimiento de pedido** (`/track/[orderId]`): usa el método tipado `OrdersService.getOrdersTrack`.
- **`ProductCard`**: se quitó el uso de `skuCount`, eliminado del modelo `ProductSummary` en el spec.
- **Componente `ApiClientInit`**: inicializa el cliente API en el navegador (`OpenAPI.BASE` y credenciales). Antes `setupApiClient()` solo corría en el servidor (desde `layout.tsx`), por lo que las llamadas del lado del cliente usaban la URL de producción por defecto del cliente generado.

---

## [Unreleased] — 2026-05-29

### Agregado

- **Guest checkout**: los usuarios sin cuenta pueden completar una compra ingresando nombre, apellido y email directamente en el formulario de checkout. Se llama al nuevo endpoint `POST /api/v1/checkout/guest` y se redirige a la página de confirmación con `orderId` y `trackingToken`.
- **Página de confirmación de compra** (`/checkout/success`): se muestra resumen del pedido tras finalizar el checkout (tanto para usuarios registrados como invitados).
- **Página de seguimiento de pedido** (`/track/[orderId]`): permite rastrear el estado de un pedido usando el `trackingToken` generado, sin necesidad de iniciar sesión.
- **Componente `SearchBar`**: barra de búsqueda reutilizable integrada en la home.
- **Componente `Badge`**: chip de estado reutilizable para mostrar el estado de pedidos y envíos.
- **Componente `ProductCardActions`**: acciones de producto extraídas en un componente separado.
- **Categorías rápidas en la home**: shortcuts a Perros, Gatos, Alimentos y Juguetes usando iconos de `lucide-react`.
- **Dependencia `lucide-react`**: librería de iconos usada en homepage y componentes nuevos.

### Modificado

- **Checkout** (`/checkout`): ya no redirige al login si el usuario no está autenticado; detecta el estado guest y muestra el formulario de datos personales. Usuarios registrados mantienen el flujo anterior.
- **Carrito** (`/cart`): rediseño completo de la UI. Se agregó `QuantityStepper` (+/−) para modificar cantidades inline, precio unitario por producto, desglose de subtotal + envío gratis, y botón "Finalizar compra →".
- **Homepage** (`/`): hero minimalista centrado con `SearchBar`, sección de categorías con íconos, sección "Más vendidos" (antes "Productos populares"). Se eliminó el hero con gradiente verde.
- **Sistema de diseño** (`globals.css`): paleta primaria más oscura (`#166534`), nuevas variables `--vp-primary-light`, `--vp-shadow-sm`, `--vp-shadow`, `--vp-shadow-lg`. Fuente cambiada a `Helvetica Neue` (sistema), eliminando dependencia de Google Fonts Geist.
- **Layout** (`layout.tsx`): se eliminaron las fuentes Geist importadas de `next/font/google`.
- **Login**: al iniciar sesión se despacha el evento `cart_updated` para sincronizar el contador del header.
- **Órdenes** (`/account/orders`, `/account/orders/[id]`): refactor de componentes y mejoras de UI con uso del nuevo `Badge`.
- **Servicios** (`lib/services/`): `checkout.ts` agrega `createGuestCheckout`; `cart.ts` e `orders.ts` refactorizados; `cart-session.ts` actualizado.
- **`SiteHeader`**, **`ProductCard`**, **`AddToCartButton`**: ajustes de UI alineados al nuevo sistema de diseño.

---

## Historial anterior

Ver commits en la rama `develop` para cambios previos al 2026-05-29.
